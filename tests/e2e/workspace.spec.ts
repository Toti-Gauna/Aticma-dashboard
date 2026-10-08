import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { freshWorkspace } from '../../src/lib/model';
import { STORAGE_KEY } from '../../src/lib/storage';
import { lessons } from '../../src/lib/program';

test('respuestas, preguntas propias y progreso persisten al recargar', async ({ page }) => {
  await page.goto('./#sessions/01');
  await page.getByRole('button', { name: /Para reflexionar/ }).click();
  const answer = page.getByLabel('Respuesta a ¿Qué problema concreto resolvemos y para quién?');
  await answer.fill('El especialista pierde tiempo coordinando por canales separados.');
  await page.getByRole('button', { name: 'Marcar completada' }).click();
  await page.getByRole('button', { name: 'Agregar mi propia pregunta' }).click();
  await page
    .getByLabel('Pregunta', { exact: true })
    .fill('¿Qué evidencia me haría cambiar de dirección?');
  await page.getByRole('button', { name: 'Agregar pregunta', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!).completedLessons.length,
        STORAGE_KEY,
      ),
    )
    .toBe(1);
  await page.reload();
  await page.getByRole('button', { name: /Para reflexionar/ }).click();
  await expect(answer).toHaveValue(
    'El especialista pierde tiempo coordinando por canales separados.',
  );
  await expect(page.getByRole('button', { name: 'Completada', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '¿Qué evidencia me haría cambiar de dirección?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Convertir en acción' }).first().click();
  await expect(page.getByLabel('Resultado esperado')).toHaveValue(
    'El especialista pierde tiempo coordinando por canales separados.',
  );
});

test('preguntas hipotéticas del speaker, respuestas y preguntas propias se conservan y exportan', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./#sessions/02');
  await expect(page.getByRole('button', { name: /Para el speaker/ })).toBeVisible();
  const prompt = lessons[1].speakerQuestions[0].prompt;
  const answer = page.getByLabel(`Respuesta a ${prompt}`);
  await answer.fill('Comparar frecuencia de uso y valor antes de elegir el modelo.');
  await expect(page.getByRole('button', { name: /Para el speaker/ })).toHaveText(
    'Para el speaker1/6',
  );
  await page.getByRole('button', { name: `Copiar pregunta: ${prompt}`, exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(prompt);
  await page.getByRole('button', { name: 'Agregar mi propia pregunta' }).click();
  await expect(page.getByLabel('Tipo de pregunta', { exact: true })).toHaveValue('speaker');
  await page
    .getByLabel('Pregunta', { exact: true })
    .fill('Si el precio cambiara, ¿cómo lo probarías?');
  await page.getByRole('button', { name: 'Agregar pregunta', exact: true }).click();
  await page
    .getByLabel('Respuesta a Si el precio cambiara, ¿cómo lo probarías?')
    .fill('Con una prueba acotada.');
  await page.getByRole('button', { name: /Para reflexionar/ }).click();
  await expect(page.getByRole('heading', { name: prompt })).toHaveCount(0);
  await page
    .getByLabel('Respuesta a ¿Qué valor recibe cada segmento de clientes?')
    .fill('Una reflexión separada.');
  await page.reload();
  await expect(answer).toHaveValue('Comparar frecuencia de uso y valor antes de elegir el modelo.');
  await expect(
    page.getByLabel('Respuesta a Si el precio cambiara, ¿cómo lo probarías?'),
  ).toHaveValue('Con una prueba acotada.');
  await page.getByRole('button', { name: 'Convertir en acción' }).first().click();
  await expect(page.getByLabel('Resultado esperado')).toHaveValue(
    'Comparar frecuencia de uso y valor antes de elegir el modelo.',
  );
  await page.getByRole('dialog').getByRole('button', { name: 'Cancelar' }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar cuaderno' }).click();
  const file = await downloaded;
  const markdown = await readFile((await file.path())!, 'utf8');
  expect(markdown).toContain('### Para el speaker · casos hipotéticos');
  expect(markdown).toContain('Comparar frecuencia de uso y valor antes de elegir el modelo.');
  expect(markdown).toContain('Con una prueba acotada.');
  expect(markdown).toContain('Una reflexión separada.');
});

test('la pantalla de carga aparece al abrir y refrescar, espera a la página y no se repite al navegar', async ({
  page,
}) => {
  let releaseLesson!: () => void;
  const lessonGate = new Promise<void>((resolve) => {
    releaseLesson = resolve;
  });
  await page.route('**/src/pages/Sessions.tsx*', async (route) => {
    await lessonGate;
    await route.continue();
  });
  await page.goto('./#sessions/01', { waitUntil: 'domcontentloaded' });
  const loader = page.getByRole('status', { name: 'Cargando workspace' });
  await expect(loader).toBeVisible();
  await expect(page.locator('.workspace-shell')).toHaveAttribute('inert', '');
  const mountedAt = await page.evaluate(() => performance.now());
  await expect.poll(() => page.evaluate(() => performance.now())).toBeGreaterThan(mountedAt + 1300);
  await expect(loader).toBeVisible();
  releaseLesson();
  await expect(loader).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Tus masterclasses' })).toBeVisible();
  await expect(page.locator('.workspace-shell')).not.toHaveAttribute('inert', '');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(loader).toBeVisible();
  await expect(loader).toHaveCount(0);
  await page.evaluate(() => {
    location.hash = 'notes';
  });
  await expect(page.getByRole('heading', { name: 'Tu cuaderno' })).toBeVisible();
  await expect(loader).toHaveCount(0);
});

test('notas y pizarra guardan trazos; deshacer, rehacer y exportar funcionan', async ({ page }) => {
  await page.goto('./#notes');
  await page.getByRole('button', { name: 'Crear mi primera nota' }).click();
  await page.getByLabel('Título de la nota').fill('Mapa del aprendizaje');
  await page
    .getByLabel('Contenido de la nota')
    .fill('Aprendizaje para convertir en un experimento.');
  await page.getByRole('tab', { name: 'Pizarra' }).click();
  await page.getByRole('button', { name: 'Rectángulo', exact: true }).click();
  const canvas = page.getByRole('application');
  await canvas.scrollIntoViewIfNeeded();
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.25);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.6, { steps: 12 });
  await page.mouse.up();
  await expect(canvas.locator('[data-shape]')).toHaveCount(1);
  const beforePan = (await canvas.locator('[data-shape]').boundingBox())!;
  await page.getByRole('button', { name: 'Mover lienzo' }).click();
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.7);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.65 + 20, box.y + box.height * 0.7 + 20, { steps: 5 });
  await page.mouse.up();
  const afterPan = (await canvas.locator('[data-shape]').boundingBox())!;
  expect(afterPan.x - beforePan.x).toBeCloseTo(20, 0);
  expect(afterPan.y - beforePan.y).toBeCloseTo(20, 0);
  await page.getByRole('button', { name: 'Restablecer vista' }).click();
  await page.getByRole('button', { name: 'Deshacer', exact: true }).click();
  await expect(canvas.locator('[data-shape]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Rehacer', exact: true }).click();
  await expect(canvas.locator('[data-shape]')).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!).notes[0].shapes.length,
        STORAGE_KEY,
      ),
    )
    .toBe(1);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar diagrama SVG' }).click();
  const file = await downloadPromise;
  expect(await readFile((await file.path())!, 'utf8')).toContain('data-shape');
  await page.reload();
  await expect(page.getByLabel('Título de la nota')).toHaveValue('Mapa del aprendizaje');
  await page.getByRole('tab', { name: /Pizarra/ }).click();
  await expect(page.getByRole('application').locator('[data-shape]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Eliminar nota', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByLabel('Título de la nota')).toHaveValue('Mapa del aprendizaje');
});

test('crear, editar, completar y filtrar una acción', async ({ page }) => {
  await page.goto('./#actions');
  await page.getByRole('button', { name: 'Nueva acción', exact: true }).click();
  await page.getByLabel('¿Qué vas a hacer?').fill('Diseñar un experimento de captación');
  await page.getByLabel('Área', { exact: true }).selectOption('Growth');
  await page.getByLabel('Responsable').fill('Producto');
  await page.getByLabel('Fecha límite').fill('2026-10-15');
  await page.getByRole('button', { name: 'Guardar acción' }).click();
  await page.getByLabel('Estado de Diseñar un experimento de captación').selectOption('En curso');
  await page.getByRole('button', { name: 'Growth', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Diseñar un experimento de captación' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Definir qué evidencia valida el problema' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Editar Diseñar un experimento de captación' }).click();
  await page
    .getByLabel('Resultado esperado')
    .fill('Un criterio de éxito y un método antes de probar.');
  await page.getByRole('button', { name: 'Guardar acción' }).click();
  await expect(page.getByText('Un criterio de éxito y un método antes de probar.')).toBeVisible();
  await page.getByLabel('Estado de Diseñar un experimento de captación').selectOption('Hecho');
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key)!).actions.find(
            (a: { title: string }) => a.title === 'Diseñar un experimento de captación',
          )?.status,
        STORAGE_KEY,
      ),
    )
    .toBe('Hecho');
});

test('agenda personal y exportación incluyen hora de Argentina y el programa', async ({ page }) => {
  await page.goto('./#calendar');
  await page.getByRole('button', { name: 'Agregar evento' }).click();
  await page.getByLabel('Título', { exact: true }).fill('Bloque de investigación');
  await page.getByLabel('Fecha', { exact: true }).fill('2026-10-12');
  await page.getByLabel('Hora de Argentina').fill('10:00');
  await page.getByLabel('Duración en minutos').fill('90');
  await page.getByLabel('Lugar o enlace').fill('Cuaderno Handy');
  await page.getByRole('button', { name: 'Guardar evento' }).click();
  await expect(
    page.getByRole('heading', { name: 'Bloque de investigación' }).first(),
  ).toBeVisible();
  const promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar .ics' }).click();
  const file = await promise;
  const ics = await readFile((await file.path())!, 'utf8');
  expect(ics).toContain('DTSTART:20261012T130000Z');
  expect(ics).toContain('DTEND:20261012T143000Z');
  expect(ics).toContain('DTSTART;VALUE=DATE:20261113');
  expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(12);
});

test('los estudios conservan observaciones y no ejecutan texto o URLs inseguras', async ({
  page,
}) => {
  await page.goto('./#studies');
  await page.getByRole('button', { name: 'Nuevo registro' }).click();
  await page.getByLabel('Título', { exact: true }).fill('Experiencia de validación <script>');
  await page.getByLabel('Tipo', { exact: true }).selectOption('Experiencia');
  await page.getByLabel('Estado', { exact: true }).selectOption('Con evidencia');
  await page
    .getByLabel('Método y contexto')
    .fill('Observación de la masterclass, con fecha y contexto.');
  await page.getByLabel('Evidencia y observaciones').fill('Tres preguntas nuevas para investigar.');
  await page.getByLabel('Fuente o enlace').fill('javascript:alert(1)');
  await page.getByRole('button', { name: 'Guardar registro' }).click();
  await page.getByRole('button', { name: 'Abrir Experiencia de validación <script>' }).click();
  await expect(
    page.getByRole('dialog').getByText('Tres preguntas nuevas para investigar.'),
  ).toBeVisible();
  await expect(page.getByRole('dialog').locator('a')).toHaveCount(0);
  await expect(page.getByRole('dialog').locator('script')).toHaveCount(0);
});

test('importación revisable restaura datos y rechaza archivos inválidos', async ({ page }) => {
  await page.goto('./#settings');
  const state = freshWorkspace();
  state.answers['02-1'] = 'Respuesta desde otro navegador';
  state.notes.push({
    id: 'imported',
    title: 'Nota importada',
    body: 'Contenido',
    lessonId: '02',
    pinned: false,
    shapes: [],
    updatedAt: '2026-10-08T12:00:00.000Z',
  });
  await page.locator('input[type=file]').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(state)),
  });
  await expect(page.getByRole('dialog', { name: 'Revisar el respaldo' })).toBeVisible();
  await page.getByRole('button', { name: 'Reemplazar con este respaldo' }).click();
  await expect
    .poll(() =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).notes[0]?.title, STORAGE_KEY),
    )
    .toBe('Nota importada');
  await page.locator('input[type=file]').setInputFiles({
    name: 'wrong.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":77}'),
  });
  await expect(page.getByRole('alert')).toContainText('No pudimos importar');
  await page.goto('./#sessions/02');
  await page.getByRole('button', { name: /Para reflexionar/ }).click();
  await expect(
    page.getByLabel('Respuesta a ¿Qué valor recibe cada segmento de clientes?'),
  ).toHaveValue('Respuesta desde otro navegador');
});

test('un archivo corrupto permanece intacto para recuperación', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, '{original-corrupto'), STORAGE_KEY);
  await page.goto('./#settings');
  await expect(page.getByRole('alert')).toContainText('Conservamos el original');
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))
    .toBe('{original-corrupto');
  const promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar archivo original' }).click();
  const file = await promise;
  expect(await readFile((await file.path())!, 'utf8')).toBe('{original-corrupto');
});

test('navegación, diálogos por teclado y vistas responsivas sin desborde', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./');
  await expect(page.locator('.workspace-shell')).not.toHaveAttribute('inert', '');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('textbox', { name: 'Buscar en el workspace' }).fill('Finanzas');
  await page.getByRole('button', { name: /Finanzas e inversores Masterclass/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Finanzas e inversores', exact: true }).last(),
  ).toBeVisible();
  await page.keyboard.press('Control+k');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const width = testInfo.project.name === 'mobile' ? 320 : 1024;
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    'dashboard',
    'sessions/04',
    'calendar',
    'actions',
    'studies',
    'tools',
    'settings',
  ]) {
    await page.goto(`./#${route}`);
    await expect(page.locator('.workspace-shell')).not.toHaveAttribute('inert', '');
    await page.locator('.page-content').waitFor();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  }
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await page.getByRole('navigation').getByRole('button', { name: 'Cuaderno' }).click();
    await expect(page.getByRole('heading', { name: 'Tu cuaderno' })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('widgets configurables y herramientas conservan el trabajo', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Personalizar' }).click();
  await page.getByLabel('Estudios y evidencia', { exact: true }).uncheck();
  await page.getByRole('button', { name: 'Subir Acciones para Handy' }).click();
  await page.getByRole('button', { name: 'Listo', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Construí con evidencia' })).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).widgetOrder[0], STORAGE_KEY),
    )
    .toBe('actions');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Construí con evidencia' })).toHaveCount(0);
  await page.goto('./#tools');
  await expect(page.locator('.workspace-shell')).not.toHaveAttribute('inert', '');
  await page
    .getByLabel('Propuesta de valor', { exact: true })
    .fill('Coordinación clara para ambos lados.');
  await expect
    .poll(() =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!).canvas['Propuesta de valor'],
        STORAGE_KEY,
      ),
    )
    .toBe('Coordinación clara para ambos lados.');
  await page.reload();
  await expect(page.getByLabel('Propuesta de valor', { exact: true })).toHaveValue(
    'Coordinación clara para ambos lados.',
  );
  await page.getByRole('button', { name: /Economía unitaria Sesiones/ }).click();
  await page.getByLabel('Ingreso total de la plataforma (%)', { exact: true }).fill('0');
  await expect(page.getByText('Sin equilibrio', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Ensayo de pitch Sesión/ }).click();
  await page.clock.install();
  await page.getByRole('button', { name: '1 min', exact: true }).click();
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.clock.fastForward(61000);
  await expect(page.getByRole('timer')).toContainText('0:00');
  await expect(page.getByText('TIEMPO CUMPLIDO')).toBeVisible();
});

test('dos pestañas no sobrescriben en silencio el trabajo en memoria', async ({
  page,
  context,
}) => {
  await page.goto('./#sessions/01');
  await page.getByRole('button', { name: /Para reflexionar/ }).click();
  const answer = page.getByLabel('Respuesta a ¿Qué problema concreto resolvemos y para quién?');
  await answer.fill('Versión A');
  await expect
    .poll(() =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).answers['01-1'], STORAGE_KEY),
    )
    .toBe('Versión A');
  const other = await context.newPage();
  await other.goto('http://127.0.0.1:5173/Aticma-dashboard/#sessions/01');
  await other.getByRole('button', { name: /Para reflexionar/ }).click();
  await other
    .getByLabel('Respuesta a ¿Qué problema concreto resolvemos y para quién?')
    .fill('Versión B');
  await expect(page.getByRole('alert')).toContainText('Otra pestaña cambió el respaldo');
  await expect(answer).toHaveValue('Versión A');
  await expect
    .poll(() =>
      other.evaluate((key) => JSON.parse(localStorage.getItem(key)!).answers['01-1'], STORAGE_KEY),
    )
    .toBe('Versión B');
  await other.close();
});
