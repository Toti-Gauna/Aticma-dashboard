export type Lesson = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  speaker: string;
  role: string;
  location: string;
  color: string;
  theme: string;
  objective: string;
  deliverable: string;
  questions: { id: string; prompt: string; hint: string }[];
};
export const lessons: Lesson[] = [
  {
    id: '01',
    title: 'Validación de idea',
    date: '2026-10-01',
    time: '18:00',
    duration: 120,
    speaker: 'Camila Espinoza',
    role: 'Innovación · Venture Capital · Ecosistema emprendedor',
    location: 'Oficinas de ATICMA · Chaco 1670, Mar del Plata',
    color: '#64d3de',
    theme: 'Del supuesto a la evidencia',
    objective: 'Entender qué problema vale la pena resolver y cómo demostrarlo en Handy.',
    deliverable:
      'Un problema definido, un segmento concreto y un experimento con criterio de éxito.',
    questions: [
      {
        id: '01-1',
        prompt: '¿Qué problema concreto resolvemos y para quién?',
        hint: 'Separá al vecino del especialista. Describí una situación reciente, no una solución imaginada.',
      },
      {
        id: '01-2',
        prompt: '¿Qué aprendimos y qué sigue siendo una hipótesis?',
        hint: 'Las conversaciones exploratorias dan señales. Registrá método, muestra y evidencia antes de generalizar.',
      },
      {
        id: '01-3',
        prompt: '¿Cómo resuelve hoy esa persona el problema?',
        hint: 'Compará alternativas reales: contactos, recomendaciones, búsqueda y tiempos de respuesta.',
      },
      {
        id: '01-4',
        prompt: '¿Qué experimento podría refutar nuestra idea?',
        hint: 'Definí qué medir, en cuánto tiempo y qué resultado te haría cambiar de dirección.',
      },
      {
        id: '01-5',
        prompt: '¿Qué decisión cambia en Handy a partir de esta lección?',
        hint: 'Elegí una sola decisión y conectala con una acción o estudio.',
      },
    ],
  },
  {
    id: '02',
    title: 'Modelo de negocio',
    date: '2026-10-08',
    time: '18:00',
    duration: 120,
    speaker: 'Camila Espinoza',
    role: 'Contadora pública · Startup Scouter · Open Innovation',
    location: 'Oficinas de ATICMA · Chaco 1670, Mar del Plata',
    color: '#b5dc6b',
    theme: 'Diseñar un negocio sostenible',
    objective: 'Conectar el valor para ambos lados del marketplace con una economía que cierre.',
    deliverable: 'Un canvas de negocio y escenarios de margen por tipo de trabajo.',
    questions: [
      {
        id: '02-1',
        prompt: '¿Qué valor recibe el usuario y qué valor recibe el especialista?',
        hint: 'Describí el resultado esperado por cada lado. El especialista también es cliente.',
      },
      {
        id: '02-2',
        prompt: '¿Quién paga, por qué y en qué momento?',
        hint: 'Separá la tarifa de Handy del dinero que cobra el especialista en su cuenta.',
      },
      {
        id: '02-3',
        prompt: '¿Qué costos cambian con cada trabajo?',
        hint: 'Incluí pasarela, soporte, incentivos y devoluciones según el responsable. Evitá mezclar costos fijos.',
      },
      {
        id: '02-4',
        prompt: '¿Qué falta confirmar para calcular el margen?',
        hint: 'Usá escenarios y marcá supuestos mientras no exista una cotización o dato propio.',
      },
      {
        id: '02-5',
        prompt: '¿Cuál es el riesgo más grande del modelo?',
        hint: 'Probá urgencia y programado por separado; no uses un ticket promedio que esconda diferencias.',
      },
    ],
  },
  {
    id: '03',
    title: 'Clientes y growth',
    date: '2026-10-15',
    time: '18:00',
    duration: 120,
    speaker: 'Nicolás Francese · Lisandro Iserte',
    role: 'GTM Engineering · Marketing · Estrategia de marca',
    location: 'Oficinas de ATICMA · Chaco 1670, Mar del Plata',
    color: '#e7b765',
    theme: 'Crecer donde hay valor',
    objective: 'Diseñar la captación de ambos lados y medir resultados, además de alcance.',
    deliverable: 'Un embudo medible y un experimento de captación local.',
    questions: [
      {
        id: '03-1',
        prompt: '¿Dónde podemos conseguir los primeros clientes de cada lado?',
        hint: 'Elegí una zona, un segmento y un canal. La densidad local importa para la oferta.',
      },
      {
        id: '03-2',
        prompt: '¿Qué hechos definen cada etapa del embudo?',
        hint: 'Distinguí registro, compromiso, verificación, oferta, aceptación y cobro.',
      },
      {
        id: '03-3',
        prompt: '¿Qué promete el mensaje y qué podemos cumplir hoy?',
        hint: 'Revisá que el copy coincida con el producto y con la disponibilidad declarada por el especialista.',
      },
      {
        id: '03-4',
        prompt: '¿Qué señal indica que alguien vuelve por valor?',
        hint: 'Medí repetición y trabajos cobrados; las impresiones por sí solas no validan el negocio.',
      },
      {
        id: '03-5',
        prompt: '¿Cómo vamos a medir el experimento de growth?',
        hint: 'Canal, inversión, conversión, período y criterio para continuar o detenerlo.',
      },
    ],
  },
  {
    id: '04',
    title: 'IA en el negocio',
    date: '2026-10-22',
    time: '18:00',
    duration: 120,
    speaker: 'Ariana Penchaszadeh + Team IA de Accenture',
    role: 'Global IT Core HR and Employee Services · Accenture Argentina',
    location: 'Oficinas de ATICMA · Chaco 1670, Mar del Plata',
    color: '#d084bc',
    theme: 'Automatizar con criterio',
    objective: 'Elegir un uso de IA que reduzca trabajo real y tenga una evaluación clara.',
    deliverable: 'Una prueba de IA con límites, costo y revisión humana.',
    questions: [
      {
        id: '04-1',
        prompt: '¿Qué tarea repetitiva consume tiempo y puede mejorar con IA?',
        hint: 'Elegí un caso concreto. Compará tiempo actual, resultado esperado y costo.',
      },
      {
        id: '04-2',
        prompt: '¿Qué datos necesita y cuáles no debería recibir?',
        hint: 'Minimizá datos personales. Para el experimento, preferí casos sintéticos o anonimizados.',
      },
      {
        id: '04-3',
        prompt: '¿Cómo sabemos si la respuesta de la IA es correcta?',
        hint: 'Construí casos de evaluación y definí errores tolerables e intolerables.',
      },
      {
        id: '04-4',
        prompt: '¿Cuándo interviene una persona?',
        hint: 'Definí un responsable y el fallback. Precios, pagos y decisiones sensibles requieren límites explícitos.',
      },
      {
        id: '04-5',
        prompt: '¿Qué está implementado y qué sigue en roadmap?',
        hint: 'Separá el experimento de una capacidad disponible para clientes.',
      },
    ],
  },
  {
    id: '05',
    title: 'Finanzas e inversores',
    date: '2026-10-29',
    time: '18:00',
    duration: 120,
    speaker: 'Alejandro García Olivares',
    role: 'Corporate Venture Capital LATAM · Bluebox',
    location: 'Virtual desde México · enlace por confirmar',
    color: '#a894ed',
    theme: 'Números que cuentan una historia',
    objective: 'Convertir el modelo en escenarios y una propuesta de inversión defendible.',
    deliverable: 'Un escenario base, uno adverso y un uso de fondos vinculado a hitos.',
    questions: [
      {
        id: '05-1',
        prompt: '¿Qué números son propios y cuáles son supuestos?',
        hint: 'Anotá fuente y fecha de cada cifra. No presentes señales exploratorias como tracción.',
      },
      {
        id: '05-2',
        prompt: '¿Cuánto margen deja cada trabajo y quién absorbe cada costo?',
        hint: 'Calculá sobre la tarifa de la plataforma. GMV e ingreso de Handy son métricas distintas.',
      },
      {
        id: '05-3',
        prompt: '¿Qué pasa con el negocio en un escenario adverso?',
        hint: 'Probá menor conversión, más soporte y mayor costo de cobro.',
      },
      {
        id: '05-4',
        prompt: '¿Cuánto capital necesitamos y qué hito habilita?',
        hint: 'Conectá cada uso de fondos con una capacidad, evidencia y fecha estimada.',
      },
      {
        id: '05-5',
        prompt: '¿Qué pregunta incómoda haría un inversor?',
        hint: 'Prepará respuestas sobre margen, repetición, competencia, riesgo y capacidad del equipo.',
      },
    ],
  },
  {
    id: '06',
    title: 'Pitch y oratoria',
    date: '2026-10-31',
    time: '09:30',
    duration: 360,
    speaker: 'Luis Ortiz · Comisión Directiva de ATICMA',
    role: 'CARSS Solutions · Social Impulse Agency · Ecosistema ATICMA',
    location: 'Oficinas de GLOBANT · Av. Colón 1114, Mar del Plata',
    color: '#64d3de',
    theme: 'Hacer que la idea se entienda',
    objective: 'Presentar Handy con claridad, evidencia disponible y una solicitud concreta.',
    deliverable: 'Un pitch ensayado, preguntas del jurado y una versión breve.',
    questions: [
      {
        id: '06-1',
        prompt: '¿Podemos explicar Handy en una frase?',
        hint: 'Problema, cliente y valor. Probá si alguien lo puede repetir sin pedir aclaraciones.',
      },
      {
        id: '06-2',
        prompt: '¿Qué evidencia podemos mostrar sin prometer de más?',
        hint: 'Mostrá lo disponible al presentar. Identificá las demos y las funciones de roadmap.',
      },
      {
        id: '06-3',
        prompt: '¿Qué hace diferente nuestra propuesta?',
        hint: 'Defendé un diferencial verificable, local y relevante para ambos lados.',
      },
      {
        id: '06-4',
        prompt: '¿Qué pedimos y para qué lo vamos a usar?',
        hint: 'Una solicitud específica, ligada al siguiente hito y sus resultados esperados.',
      },
      {
        id: '06-5',
        prompt: '¿Qué vamos a mejorar después del ensayo?',
        hint: 'Registrá duración, dudas del público y cambios. Prepará semifinal y final con evidencia actualizada.',
      },
    ],
  },
];
export const milestones = [
  {
    id: 'semi',
    title: 'Semifinal ATICMA Emprende',
    date: '2026-11-05',
    time: '',
    duration: 0,
    location: 'Horario y sede por confirmar',
    color: '#d084bc',
  },
  {
    id: 'final',
    title: 'Gran Final · estilo Shark Tank',
    date: '2026-11-13',
    time: '',
    duration: 0,
    location: 'Centro Cultural Aldrey · horario por confirmar',
    color: '#a894ed',
  },
];
export const areas = ['Producto', 'Business', 'Growth', 'Operaciones', 'Tech', 'Funding'] as const;
export const canvasFields = [
  'Segmentos de clientes',
  'Propuesta de valor',
  'Canales',
  'Relación con clientes',
  'Fuentes de ingresos',
  'Recursos clave',
  'Actividades clave',
  'Socios clave',
  'Estructura de costos',
];
export const allQuestions = lessons.flatMap((l) => l.questions);
