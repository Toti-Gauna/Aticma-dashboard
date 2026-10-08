import { z } from 'zod';

const text = z.string().max(50000);
const id = z.string().min(1).max(120);
const lessonId = z
  .string()
  .refine((v) => ['01', '02', '03', '04', '05', '06'].includes(v), 'Sesión no válida');
const optionalLessonId = z.union([lessonId, z.literal('')]);
export const dateSchema = z.iso.date();
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const shapeSchema = z.object({
  id,
  type: z.enum(['pen', 'rect', 'arrow', 'text']),
  color: z.string().regex(/^#[\da-fA-F]{6}$/),
  x: z.number().finite(),
  y: z.number().finite(),
  w: z.number().finite(),
  h: z.number().finite(),
  text: z.string().max(200),
  points: z.array(z.tuple([z.number().finite(), z.number().finite()])).max(5000),
});
export const noteSchema = z.object({
  id,
  title: z.string().min(1).max(160),
  body: text,
  lessonId: optionalLessonId,
  updatedAt: z.iso.datetime(),
  pinned: z.boolean(),
  shapes: z.array(shapeSchema).max(250),
});
export const actionSchema = z.object({
  id,
  title: z.string().min(1).max(200),
  description: text,
  lessonId: optionalLessonId,
  area: z.enum(['Producto', 'Business', 'Growth', 'Operaciones', 'Tech', 'Funding']),
  status: z.enum(['Pendiente', 'En curso', 'Hecho']),
  priority: z.enum(['Alta', 'Media', 'Baja']),
  due: z.union([dateSchema, z.literal('')]),
  owner: z.string().max(100),
});
export const studySchema = z.object({
  id,
  title: z.string().min(1).max(200),
  kind: z.enum(['Experimento', 'Experiencia', 'Investigación']),
  hypothesis: text,
  method: text,
  evidence: text,
  conclusion: text,
  lessonId: optionalLessonId,
  status: z.enum(['Hipótesis', 'En estudio', 'Con evidencia']),
  source: z.string().max(2000),
  updatedAt: z.iso.datetime(),
});
export const eventSchema = z.object({
  id,
  title: z.string().min(1).max(200),
  date: dateSchema,
  time: timeSchema,
  duration: z.number().int().min(15).max(1440),
  location: z.string().max(300),
});
export const widgets = ['sessions', 'actions', 'notes', 'studies'] as const;
export const workspaceSchema = z
  .object({
    version: z.literal(1),
    notes: z.array(noteSchema).max(300),
    actions: z.array(actionSchema).max(1000),
    studies: z.array(studySchema).max(500),
    events: z.array(eventSchema).max(500),
    answers: z.record(z.string().max(120), text),
    completedLessons: z
      .array(lessonId)
      .max(6)
      .refine((v) => new Set(v).size === v.length),
    questions: z
      .array(
        z.object({
          id,
          lessonId,
          prompt: z.string().min(1).max(500),
          audience: z.enum(['speaker', 'reflection']).optional(),
        }),
      )
      .max(300),
    widgetOrder: z
      .array(z.enum(widgets))
      .length(4)
      .refine((v) => new Set(v).size === 4),
    hiddenWidgets: z.array(z.enum(widgets)).max(4),
    canvas: z.record(z.string().max(120), text),
  })
  .superRefine((state, ctx) => {
    for (const field of ['notes', 'actions', 'studies', 'events', 'questions'] as const) {
      if (new Set(state[field].map((item) => item.id)).size !== state[field].length)
        ctx.addIssue({ code: 'custom', path: [field], message: 'IDs duplicados' });
    }
    for (const [index, study] of state.studies.entries()) {
      if (study.status === 'Con evidencia' && (!study.method.trim() || !study.evidence.trim()))
        ctx.addIssue({
          code: 'custom',
          path: ['studies', index],
          message: 'La evidencia necesita observaciones y método',
        });
    }
  });
export type Workspace = z.infer<typeof workspaceSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Action = z.infer<typeof actionSchema>;
export type Study = z.infer<typeof studySchema>;
export type CalendarEvent = z.infer<typeof eventSchema>;
export type Shape = z.infer<typeof shapeSchema>;
export type Page =
  'dashboard' | 'sessions' | 'calendar' | 'notes' | 'actions' | 'studies' | 'tools' | 'settings';
export const uid = () => crypto.randomUUID();
export const nowISO = () => new Date().toISOString();

export function freshWorkspace(): Workspace {
  return {
    version: 1,
    notes: [],
    studies: [],
    events: [],
    answers: {},
    completedLessons: [],
    questions: [],
    actions: [
      {
        id: 'starter-1',
        title: 'Definir qué evidencia valida el problema',
        description:
          'Plantilla sugerida: diseñá entrevistas y un criterio de éxito antes de salir a investigar.',
        lessonId: '01',
        area: 'Producto',
        status: 'Pendiente',
        priority: 'Alta',
        due: '2026-10-15',
        owner: '',
      },
      {
        id: 'starter-2',
        title: 'Comparar escenarios de economía unitaria',
        description:
          'Plantilla sugerida: separá ingreso, costo de pago y costo variable. Marcá los supuestos.',
        lessonId: '02',
        area: 'Business',
        status: 'Pendiente',
        priority: 'Alta',
        due: '2026-10-29',
        owner: '',
      },
      {
        id: 'starter-3',
        title: 'Preparar un pitch con evidencia disponible',
        description:
          'Plantilla sugerida: diferenciá producto operativo, demo y roadmap. Revisá las fechas antes de presentar.',
        lessonId: '06',
        area: 'Funding',
        status: 'Pendiente',
        priority: 'Media',
        due: '2026-11-05',
        owner: '',
      },
    ],
    widgetOrder: [...widgets],
    hiddenWidgets: [],
    canvas: {},
  };
}
