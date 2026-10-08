import { lessons, milestones } from './program';
import type { Action, CalendarEvent, Workspace } from './model';

export function download(
  content: string | Blob,
  filename: string,
  mime = 'text/plain;charset=utf-8',
) {
  const url = URL.createObjectURL(
    content instanceof Blob ? content : new Blob([content], { type: mime }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const icsEscape = (v: string) =>
  v.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
function fold(line: string) {
  const encoder = new TextEncoder();
  let result = '',
    count = 0;
  for (const c of line) {
    const bytes = encoder.encode(c).length;
    if (count + bytes > 75) {
      result += '\r\n ';
      count = 1;
    }
    result += c;
    count += bytes;
  }
  return result;
}
export function calendarICS(
  custom: CalendarEvent[],
  generatedAt = new Date(),
  actions: Action[] = [],
) {
  const events = [
    ...lessons,
    ...milestones,
    ...custom,
    ...actions
      .filter((a) => a.due && a.status !== 'Hecho')
      .map((a) => ({
        id: a.id,
        title: `Acción · ${a.title}`,
        date: a.due,
        time: '',
        duration: 0,
        location: a.area,
        deadline: true,
      })),
  ];
  const stamp = generatedAt
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ATICMA Handy//Workspace//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  for (const e of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@aticma-handy-workspace`,
      `DTSTAMP:${stamp}`,
      `SUMMARY:${icsEscape(e.title)}`,
      `LOCATION:${icsEscape(e.location)}`,
    );
    if (e.time) {
      const start = new Date(`${e.date}T${e.time}:00-03:00`);
      const end = new Date(start.getTime() + e.duration * 60000);
      const fmt = (d: Date) =>
        d
          .toISOString()
          .replace(/[-:]/g, '')
          .replace(/\.\d{3}/, '');
      lines.push(`DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`);
    } else {
      const end = new Date(`${e.date}T12:00:00Z`);
      end.setUTCDate(end.getUTCDate() + 1);
      lines.push(
        `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`,
        `DTEND;VALUE=DATE:${end.toISOString().slice(0, 10).replace(/-/g, '')}`,
        `DESCRIPTION:${'deadline' in e ? 'Fecha límite de una acción.' : 'Horario pendiente de confirmación.'}`,
      );
    }
    lines.push('END:VEVENT');
  }
  return [...lines.map(fold), 'END:VCALENDAR', ''].join('\r\n');
}
export function workspaceMarkdown(state: Workspace) {
  return [
    '# ATICMA × Handy · Cuaderno de trabajo',
    `Exportado: ${new Date().toLocaleString('es-AR')}`,
    ...lessons.map((l) => {
      const qs = [...l.questions, ...state.questions.filter((q) => q.lessonId === l.id)];
      return `## ${l.id} · ${l.title}\n${l.date} · ${l.speaker}\n\n${qs.map((q) => `### ${q.prompt}\n${state.answers[q.id] || '_Sin respuesta_'}\n`).join('\n')}`;
    }),
    '## Notas',
    ...state.notes.map((n) => `### ${n.title}\n${n.body}\n`),
    '## Estudios',
    ...state.studies.map(
      (s) =>
        `### ${s.title}\nEstado: ${s.status}\nHipótesis: ${s.hypothesis}\nMétodo: ${s.method}\nEvidencia: ${s.evidence}\nConclusión: ${s.conclusion}\nFuente: ${s.source}`,
    ),
    '## Acciones',
    ...state.actions.map(
      (a) =>
        `- [${a.status === 'Hecho' ? 'x' : ' '}] ${a.title} · ${a.due || 'Sin fecha'} · ${a.owner || 'Sin responsable'}\n  ${a.description}`,
    ),
  ].join('\n\n');
}
