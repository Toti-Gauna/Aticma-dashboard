import { describe, expect, it } from 'vitest';
import { freshWorkspace, workspaceSchema } from '../src/lib/model';
import { calendarICS, workspaceMarkdown } from '../src/lib/export';
import { endTime, monthCells } from '../src/lib/dates';
import { lessons, allQuestions } from '../src/lib/program';
import { readWorkspace, writeWorkspace, parseBackup, STORAGE_KEY } from '../src/lib/storage';
import { economics } from '../src/pages/Tools';

describe('Respaldo y persistencia', () => {
  it('conserva respuestas, diagramas y Unicode al exportar e importar', () => {
    const state = freshWorkspace();
    state.answers['01-1'] = 'Una hipótesis, no una afirmación.';
    state.notes.push({
      id: 'note',
      title: 'Experiencia áticma',
      body: 'Aprendizaje',
      lessonId: '01',
      pinned: true,
      updatedAt: '2026-10-08T12:00:00.000Z',
      shapes: [
        {
          id: 'shape',
          type: 'pen',
          color: '#64d3de',
          x: 20,
          y: 30,
          w: 0,
          h: 0,
          text: '',
          points: [
            [0, 0],
            [10, 12],
          ],
        },
      ],
    });
    expect(parseBackup(JSON.stringify(state))).toEqual(state);
  });
  it('no reemplaza un archivo corrupto ni una versión desconocida', () => {
    for (const raw of ['{corrupto', JSON.stringify({ ...freshWorkspace(), version: 2 })]) {
      const writes: string[] = [];
      const storage = {
        getItem: () => raw,
        setItem: (_key: string, value: string) => writes.push(value),
      };
      expect(readWorkspace(storage).blocked).toBe(true);
      expect(writes).toHaveLength(0);
    }
  });
  it('maneja almacenamiento inaccesible o lleno sin perder el estado en memoria', () => {
    expect(
      readWorkspace({
        getItem: () => {
          throw new Error('denied');
        },
      }).blocked,
    ).toBe(true);
    const state = freshWorkspace();
    expect(
      writeWorkspace(
        {
          setItem: () => {
            throw new Error('quota');
          },
        },
        state,
      ),
    ).toContain('No se pudo guardar');
    expect(state.actions).toHaveLength(3);
  });
  it('rechaza fechas inválidas, IDs duplicados, referencias inválidas y evidencia vacía', () => {
    const state = freshWorkspace();
    state.events.push({
      id: 'e',
      title: 'Evento',
      date: '2026-02-30',
      time: '25:00',
      duration: 60,
      location: '',
    });
    expect(workspaceSchema.safeParse(state).success).toBe(false);
    const duplicate = freshWorkspace();
    duplicate.actions.push(duplicate.actions[0]);
    expect(workspaceSchema.safeParse(duplicate).success).toBe(false);
    expect(
      workspaceSchema.safeParse({ ...freshWorkspace(), completedLessons: ['99'] }).success,
    ).toBe(false);
    const evidence = freshWorkspace();
    evidence.studies.push({
      id: 's',
      title: 'Sin evidencia',
      kind: 'Experimento',
      hypothesis: '',
      method: '',
      evidence: '',
      conclusion: '',
      lessonId: '01',
      status: 'Con evidencia',
      source: '',
      updatedAt: '2026-10-08T12:00:00.000Z',
    });
    expect(workspaceSchema.safeParse(evidence).success).toBe(false);
  });
  it('guarda bajo una clave estable', () => {
    let key = '';
    writeWorkspace(
      {
        setItem: (k) => {
          key = k;
        },
      },
      freshWorkspace(),
    );
    expect(key).toBe(STORAGE_KEY);
  });
});
describe('Calendario oficial y exportación', () => {
  it('mantiene las seis fechas y la jornada especial del sábado', () => {
    expect(lessons.map((l) => l.date)).toEqual([
      '2026-10-01',
      '2026-10-08',
      '2026-10-15',
      '2026-10-22',
      '2026-10-29',
      '2026-10-31',
    ]);
    expect(endTime('09:30', 360)).toBe('15:30');
    expect(endTime('23:30', 90)).toBe('01:00');
  });
  it('exporta UTC−3 sin depender del huso del dispositivo y conserva hitos sin hora como día completo', () => {
    const ics = calendarICS([], new Date('2026-10-08T12:00:00Z'));
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(8);
    expect(ics).toContain('DTSTART:20261001T210000Z');
    expect(ics).toContain('DTEND:20261031T183000Z');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261105');
    expect(ics).toContain('DTEND;VALUE=DATE:20261106');
    expect(ics).toContain('DTSTAMP:20261008T120000Z');
  });
  it('escapa contenido e impide que un título inyecte campos en ICS; pliega por bytes UTF-8', () => {
    const ics = calendarICS([
      {
        id: 'e',
        title: 'Á'.repeat(90) + '; título,\nBEGIN:VEVENT',
        date: '2026-10-10',
        time: '23:45',
        duration: 60,
        location: 'Lugar; uno',
      },
    ]);
    expect(ics).toContain('\\nBEGIN:VEVENT');
    expect(ics.match(/^BEGIN:VEVENT$/gm)).toHaveLength(9);
    for (const line of ics.split('\r\n'))
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    expect(ics).toContain('DTEND:20261011T034500Z');
  });
  it('alinea semanas al lunes y resuelve cambios de año', () => {
    const cells = monthCells(2026, 9);
    expect(cells[0].date).toBe('2026-09-28');
    expect(cells).toHaveLength(42);
    expect(monthCells(2027, 0)[0].date).toBe('2026-12-28');
  });
});
describe('Preguntas para el speaker y compatibilidad del cuaderno', () => {
  it('ofrece casos hipotéticos por lección sin nombrar el producto en las preguntas ni sus ayudas', () => {
    expect(lessons.every((lesson) => lesson.speakerQuestions.length === 6)).toBe(true);
    expect(allQuestions).toHaveLength(66);
    expect(new Set(allQuestions.map((q) => q.id)).size).toBe(allQuestions.length);
    for (const q of allQuestions) expect(`${q.prompt} ${q.hint}`).not.toMatch(/handy/i);
    for (const lesson of lessons)
      for (const q of lesson.speakerQuestions) expect(q.prompt).toMatch(/^Si /);
  });
  it('conserva respaldos anteriores y exporta las respuestas en el grupo correcto', () => {
    const previous = freshWorkspace();
    previous.answers['01-5'] = 'Una decisión anterior que debe conservarse.';
    previous.questions.push({ id: 'old-custom', lessonId: '01', prompt: 'Mi pregunta anterior' });
    previous.answers['old-custom'] = 'Mi reflexión anterior';
    const state = parseBackup(JSON.stringify(previous));
    expect(state.questions[0].audience).toBeUndefined();
    state.answers['01-speaker-1'] = 'Respuesta registrada del speaker';
    state.questions.push({
      id: 'new-custom',
      lessonId: '01',
      prompt: 'Si fuera un caso nuevo, ¿qué observarías?',
      audience: 'speaker',
    });
    state.answers['new-custom'] = 'Otra respuesta del speaker';
    expect(parseBackup(JSON.stringify(state))).toEqual(state);
    const lesson = workspaceMarkdown(state).split('## 02 ·')[0];
    const [speaker, reflection] = lesson.split('### Para reflexionar');
    expect(speaker).toContain('Respuesta registrada del speaker');
    expect(speaker).toContain('Otra respuesta del speaker');
    expect(speaker).not.toContain('Mi reflexión anterior');
    expect(reflection).toContain('Una decisión anterior que debe conservarse.');
    expect(reflection).toContain('Mi reflexión anterior');
    expect(reflection).not.toContain('Respuesta registrada del speaker');
  });
});
describe('Escenarios económicos', () => {
  it('separa volumen de ingreso y calcula margen y equilibrio', () => {
    expect(economics(10000, 15, 5, 200, 50000, true)).toEqual({
      revenue: 1500,
      payment: 500,
      contribution: 800,
      breakEven: 63,
    });
  });
  it('no asigna el costo de terceros a Handy y no inventa equilibrio con margen negativo', () => {
    expect(economics(10000, 15, 5, 200, 50000, false).contribution).toBe(1300);
    expect(economics(10000, 2, 5, 200, 50000, true).breakEven).toBeNull();
    expect(economics(0, 15, 5, 0, 50000, true).breakEven).toBeNull();
  });
});
