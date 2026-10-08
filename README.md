# ATICMA × Handy · Learning workspace

Espacio de trabajo para registrar experiencias y estudios de **ATICMA Emprende 2026** y convertirlos en decisiones para Handy.

- Dashboard con widgets configurables y progreso real de tu cuaderno.
- Seis masterclasses con agenda, speakers, 30 preguntas editoriales y respuestas debajo; permite agregar preguntas propias y convertir una respuesta en acción.
- Calendario navegable, eventos personales, vencimientos de acciones y exportación ICS en horario de Argentina.
- Notas vinculadas a sesiones y pizarra SVG: dibujo, rectángulos, flechas, texto, selección, movimiento, color, zoom, deshacer, rehacer y exportación vectorial.
- Acciones por área, prioridad, fecha, responsable y estado; tablero, lista y arrastre entre columnas.
- Estudios, investigaciones y experiencias con método, evidencia, fuente y conclusión.
- Canvas de negocio, calculadora de escenarios y cronómetro de pitch con guion exportable.
- Motion para transiciones y un gráfico SVG animado; respeta la preferencia de reducir movimiento. Componentes propios con controles HTML nativos, diseño responsive, navegación por teclado y buscador `Ctrl/⌘ K`.

## Desarrollo

Requiere Node.js 22.12 o superior.

```sh
npm ci
npm run dev
```

Abrí `http://localhost:5173/Aticma-dashboard/`. Para otra ruta de hosting, definí `VITE_BASE_PATH` al construir, por ejemplo `VITE_BASE_PATH=/ npm run build`.

```sh
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Las pruebas de dominio verifican respaldos, preservación de datos corruptos, límites de importación, fechas, ICS y economía unitaria. Las pruebas de navegador cubren edición, persistencia, pizarra, acciones, calendario, estudios, importación y navegación en escritorio y móvil.

## Datos y respaldo

Este corte funciona con **datos locales en el navegador**, sin servidor, cuenta ni sincronización con Notion. No trae métricas comerciales, contactos ni documentos internos de Handy. Las tres acciones iniciales están identificadas como plantillas sugeridas. Las respuestas y el progreso empiezan vacíos.

Exportá JSON desde **Respaldo y referencias** para conservar todo, incluidas las pizarras, y transferirlo entre dispositivos. El navegador puede borrar el almacenamiento al limpiar sus datos. Las exportaciones Markdown, SVG e ICS sirven para trabajar en otras herramientas. La importación valida el archivo y muestra un resumen antes de reemplazar los datos. Si el archivo guardado está corrupto, el original se conserva; si otra pestaña modifica el respaldo, el guardado se pausa para evitar sobrescrituras.

## GitHub Actions y publicación

Pages ya estaba configurado con fuente **GitHub Actions**, aunque la rama inicial no contenía workflows. Este PR agrega:

- **CI**: lint, TypeScript, pruebas de dominio, pruebas de navegador y build en cada PR y push a `main`. Conserva el build y las trazas de fallos como artifacts.
- **Publicar en GitHub Pages**: ejecución **manual**, solo desde `main`. No publica el PR ni publica al hacer merge automáticamente.

Después de revisar y fusionar el PR, abrí **Actions → Publicar en GitHub Pages → Run workflow → main**. El workflow construye y publica `dist/` en `https://toti-gauna.github.io/Aticma-dashboard/`. No requiere secrets adicionales. Para otro hosting estático, usá el artifact `aticma-dashboard-dist` de CI.

## Documentación

- [Auditoría de Handy y aplicación al programa](docs/auditoria.md)
- [Arquitectura, modelo y persistencia](docs/arquitectura.md)
- [Programa y fuentes](docs/programa.md)

La auditoría revisó cuatro repositorios y la documentación accesible de Notion. Este repo público contiene conclusiones de diseño; no copia documentos privados ni registros personales. La aplicación no modifica los repos de Handy ni Notion.
