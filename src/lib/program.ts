export type LessonQuestion = { id: string; prompt: string; hint: string };
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
  speakerQuestions: LessonQuestion[];
  questions: LessonQuestion[];
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
    objective: 'Entender qué problema vale la pena resolver y cómo demostrarlo con evidencia.',
    deliverable:
      'Un problema definido, un segmento concreto y un experimento con criterio de éxito.',
    speakerQuestions: [
      {
        id: '01-speaker-1',
        prompt:
          'Si un emprendimiento recibe mucho interés, pero nadie paga todavía, ¿cómo distinguirías curiosidad de una necesidad real?',
        hint: 'Como repregunta: ¿qué comportamiento observable te daría más confianza que una opinión?',
      },
      {
        id: '01-speaker-2',
        prompt:
          'Si un equipo quisiera validar un problema antes de construir la solución, ¿qué experimento de bajo costo le recomendarías?',
        hint: 'Pedí un ejemplo, un plazo y un criterio para decidir si seguir o cambiar de dirección.',
      },
      {
        id: '01-speaker-3',
        prompt:
          'Si las primeras entrevistas fueran con conocidos, ¿cómo evitarías que la confianza o la cortesía distorsionen los resultados?',
        hint: 'Como repregunta: ¿cómo elegirías otras personas y formularías preguntas sin sugerir la respuesta?',
      },
      {
        id: '01-speaker-4',
        prompt:
          'Si distintas personas describieran el mismo problema, pero con urgencias diferentes, ¿cómo elegirías el primer segmento?',
        hint: 'Pedí criterios para comparar frecuencia, impacto y disposición a buscar una alternativa.',
      },
      {
        id: '01-speaker-5',
        prompt:
          'Si una prueba diera buenos resultados una sola vez, ¿qué evidencia adicional pedirías antes de considerarla validación?',
        hint: 'Como repregunta: ¿qué señales podrían contradecir esa primera conclusión?',
      },
      {
        id: '01-speaker-6',
        prompt:
          'Si un equipo ya estuviera muy enamorado de su idea, ¿cómo le recomendarías buscar evidencia que pueda refutarla?',
        hint: 'Pedí un ejemplo de una condición que justificaría abandonar o reformular una hipótesis.',
      },
    ],
    questions: [
      {
        id: '01-1',
        prompt: '¿Qué problema concreto resolvemos y para quién?',
        hint: 'Definí un segmento y una situación reciente. Separá el problema de la solución imaginada.',
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
        prompt: '¿Qué decisión cambia en nuestro proyecto a partir de esta lección?',
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
    objective: 'Conectar la propuesta de valor con un modelo de ingresos y costos sostenible.',
    deliverable: 'Un canvas de negocio y escenarios de margen por tipo de operación.',
    speakerQuestions: [
      {
        id: '02-speaker-1',
        prompt:
          'Si un emprendimiento pudiera cobrar por suscripción o por uso, ¿qué criterios usarías para elegir el modelo inicial?',
        hint: 'Como repregunta: ¿cómo compararías valor percibido, frecuencia de uso y previsibilidad de ingresos?',
      },
      {
        id: '02-speaker-2',
        prompt:
          'Si quien usa una solución no fuera quien la paga, ¿cómo validarías el valor para cada parte sin complicar demasiado el modelo?',
        hint: 'Pedí un ejemplo de cómo identificar a la persona que decide y la razón por la que pagaría.',
      },
      {
        id: '02-speaker-3',
        prompt:
          'Si un equipo todavía no conociera todos sus costos, ¿cómo podría probar un precio sin dar por hecho que el negocio es rentable?',
        hint: 'Como repregunta: ¿qué costos y supuestos pondrías a prueba primero?',
      },
      {
        id: '02-speaker-4',
        prompt:
          'Si una oferta generara ventas solo con descuentos, ¿cómo evaluarías si hay un modelo sostenible detrás?',
        hint: 'Pedí una forma de separar el efecto de la promoción del valor que el cliente está dispuesto a pagar.',
      },
      {
        id: '02-speaker-5',
        prompt:
          'Si un negocio vendiera más, pero tuviera cada vez menos efectivo disponible, ¿qué revisarías primero?',
        hint: 'Como repregunta: ¿cómo distinguirías margen, flujo de caja y plazos de cobro y pago?',
      },
      {
        id: '02-speaker-6',
        prompt:
          'Si un canvas pareciera coherente, pero hubiera poca evidencia, ¿cómo priorizarías la hipótesis del modelo que conviene probar primero?',
        hint: 'Pedí un criterio para ordenar los supuestos por riesgo y costo de validación.',
      },
    ],
    questions: [
      {
        id: '02-1',
        prompt: '¿Qué valor recibe cada segmento de clientes?',
        hint: 'Describí el resultado esperado y diferenciá quién usa, quién decide y quién paga.',
      },
      {
        id: '02-2',
        prompt: '¿Quién paga, por qué y en qué momento?',
        hint: 'Identificá la fuente de ingresos, el motivo de pago y las condiciones de cobro.',
      },
      {
        id: '02-3',
        prompt: '¿Qué costos cambian con cada operación?',
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
        hint: 'Compará segmentos y escenarios por separado; un promedio puede esconder diferencias.',
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
    objective: 'Diseñar la captación de clientes y medir resultados, además de alcance.',
    deliverable: 'Un embudo medible y un experimento de captación.',
    speakerQuestions: [
      {
        id: '03-speaker-1',
        prompt:
          'Si un emprendimiento tuviera poco presupuesto y ningún canal probado, ¿cómo elegirías dónde buscar sus primeros clientes?',
        hint: 'Pedí un ejemplo de experimento pequeño y una señal para continuar o descartar ese canal.',
      },
      {
        id: '03-speaker-2',
        prompt:
          'Si una campaña trajera muchos registros, pero pocas compras, ¿cómo detectarías en qué etapa se pierde el interés?',
        hint: 'Como repregunta: ¿qué eventos medirías antes de invertir más en adquisición?',
      },
      {
        id: '03-speaker-3',
        prompt:
          'Si los clientes llegaran por recomendación, ¿cómo convertirías ese comportamiento en un canal medible sin volverlo invasivo?',
        hint: 'Pedí criterios para atribuir resultados y evitar incentivos que produzcan registros sin valor.',
      },
      {
        id: '03-speaker-4',
        prompt:
          'Si un mensaje atrajera mucha atención, pero generara expectativas difíciles de cumplir, ¿cómo lo ajustarías?',
        hint: 'Como repregunta: ¿cómo probarías una promesa más precisa sin perder claridad ni interés?',
      },
      {
        id: '03-speaker-5',
        prompt:
          'Si un canal captara clientes baratos que nunca vuelven, ¿qué mirarías antes de decidir escalarlo?',
        hint: 'Pedí una forma de comparar adquisición, retención y valor por cohorte, aun con pocos datos.',
      },
      {
        id: '03-speaker-6',
        prompt:
          'Si dos acciones de growth ocurrieran al mismo tiempo, ¿cómo separarías sus efectos con una muestra pequeña?',
        hint: 'Como repregunta: ¿qué conclusiones evitarías sacar cuando no hay evidencia suficiente?',
      },
    ],
    questions: [
      {
        id: '03-1',
        prompt: '¿Dónde podemos conseguir los primeros clientes de cada segmento?',
        hint: 'Elegí un segmento, un contexto y un canal antes de ampliar el alcance.',
      },
      {
        id: '03-2',
        prompt: '¿Qué hechos definen cada etapa del embudo?',
        hint: 'Definí eventos observables desde el primer contacto hasta la compra y la repetición.',
      },
      {
        id: '03-3',
        prompt: '¿Qué promete el mensaje y qué podemos cumplir hoy?',
        hint: 'Revisá que el mensaje coincida con las capacidades y la disponibilidad reales.',
      },
      {
        id: '03-4',
        prompt: '¿Qué señal indica que alguien vuelve por valor?',
        hint: 'Medí repetición y compras; las impresiones por sí solas no validan el negocio.',
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
    speakerQuestions: [
      {
        id: '04-speaker-1',
        prompt:
          'Si una empresa pequeña quisiera empezar con IA, ¿cómo elegirías una primera tarea que justifique el esfuerzo y el costo?',
        hint: 'Pedí un criterio para comparar frecuencia, tiempo ahorrado, riesgo y facilidad de evaluación.',
      },
      {
        id: '04-speaker-2',
        prompt:
          'Si un asistente de IA respondiera bien casi siempre, pero a veces inventara datos, ¿cómo decidirías si está listo para usarse?',
        hint: 'Como repregunta: ¿qué casos de evaluación y límites de error definirías?',
      },
      {
        id: '04-speaker-3',
        prompt:
          'Si una tarea involucrara información sensible, ¿cómo diseñarías una prueba de IA sin exponer datos innecesarios?',
        hint: 'Pedí un ejemplo con datos sintéticos o anonimizados y criterios para elegir una herramienta.',
      },
      {
        id: '04-speaker-4',
        prompt:
          'Si una automatización afectara decisiones importantes, ¿en qué puntos mantendrías revisión humana y cómo manejarías una falla?',
        hint: 'Como repregunta: ¿qué señales deberían detener el proceso y quién debería intervenir?',
      },
      {
        id: '04-speaker-5',
        prompt:
          'Si un equipo pudiera comprar una herramienta de IA o construir una integración propia, ¿cómo compararías ambas opciones?',
        hint: 'Pedí criterios sobre calidad, mantenimiento, costo total y dependencia del proveedor.',
      },
      {
        id: '04-speaker-6',
        prompt:
          'Si una prueba de IA pareciera ahorrar tiempo, ¿cómo comprobarías que mejora el proceso completo y no traslada trabajo a otra persona?',
        hint: 'Como repregunta: ¿cómo medirías correcciones, supervisión y resultado final frente al proceso anterior?',
      },
    ],
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
    speakerQuestions: [
      {
        id: '05-speaker-1',
        prompt:
          'Si un emprendimiento todavía tuviera poca facturación, ¿qué evidencia te ayudaría a evaluar su potencial sin confundirlo con tracción?',
        hint: 'Pedí ejemplos de señales útiles y de afirmaciones que un inversor cuestionaría.',
      },
      {
        id: '05-speaker-2',
        prompt:
          'Si una proyección dependiera de varios supuestos sin validar, ¿cómo presentarías los números de manera creíble?',
        hint: 'Como repregunta: ¿qué escenarios y análisis de sensibilidad esperarías ver?',
      },
      {
        id: '05-speaker-3',
        prompt:
          'Si un negocio creciera en ventas, pero perdiera dinero en cada operación, ¿cómo evaluarías si ese crecimiento tiene sentido?',
        hint: 'Pedí qué costos incluirías en el margen y qué evidencia podría justificar una inversión temporal.',
      },
      {
        id: '05-speaker-4',
        prompt:
          'Si un equipo estuviera entre financiarse con ingresos propios o buscar inversión, ¿qué señales indicarían que conviene cada camino?',
        hint: 'Como repregunta: ¿cómo pesarías velocidad, control, necesidades de capital y momento del negocio?',
      },
      {
        id: '05-speaker-5',
        prompt:
          'Si un emprendimiento levantara capital por primera vez, ¿cómo debería conectar el monto solicitado con hitos concretos?',
        hint: 'Pedí un ejemplo que incluya uso de fondos, plazo y margen de seguridad ante un escenario adverso.',
      },
      {
        id: '05-speaker-6',
        prompt:
          'Si un equipo comparara dos propuestas de inversión, ¿qué condiciones revisarías además de la valuación?',
        hint: 'Como repregunta: ¿qué errores frecuentes ves al negociar control, derechos y futuras rondas?',
      },
    ],
    questions: [
      {
        id: '05-1',
        prompt: '¿Qué números son propios y cuáles son supuestos?',
        hint: 'Anotá fuente y fecha de cada cifra. No presentes señales exploratorias como tracción.',
      },
      {
        id: '05-2',
        prompt: '¿Cuánto margen deja cada operación y quién absorbe cada costo?',
        hint: 'Diferenciá volumen de ventas, ingreso propio y costos variables antes de calcular el margen.',
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
    objective: 'Presentar un proyecto con claridad, evidencia disponible y una solicitud concreta.',
    deliverable: 'Un pitch ensayado, preguntas del jurado y una versión breve.',
    speakerQuestions: [
      {
        id: '06-speaker-1',
        prompt:
          'Si una idea fuera difícil de explicar y hubiera solo un minuto, ¿qué estructura recomendarías para que se entienda?',
        hint: 'Pedí un ejemplo de apertura, idea central y cierre para una audiencia que no conoce el tema.',
      },
      {
        id: '06-speaker-2',
        prompt:
          'Si un proyecto estuviera en una etapa temprana, ¿cómo lo presentarías con convicción sin exagerar resultados?',
        hint: 'Como repregunta: ¿cómo distinguirías evidencia, aprendizajes y próximos pasos dentro del relato?',
      },
      {
        id: '06-speaker-3',
        prompt:
          'Si el jurado hiciera una pregunta cuya respuesta todavía no se conoce, ¿cómo recomendarías responder?',
        hint: 'Pedí una forma de reconocer lo pendiente y explicar cómo se investigará sin perder claridad.',
      },
      {
        id: '06-speaker-4',
        prompt:
          'Si alguien quisiera explicar su propuesta sin revelar detalles estratégicos, ¿qué información debería incluir y qué podría reservar?',
        hint: 'Como repregunta: ¿cómo mostrarías el valor con un ejemplo hipotético que siga siendo creíble?',
      },
      {
        id: '06-speaker-5',
        prompt:
          'Si los nervios aceleraran el discurso, ¿qué ejercicio práctico recomendarías para mejorar ritmo, pausas y presencia?',
        hint: 'Pedí una rutina de ensayo y una forma sencilla de evaluar la mejora.',
      },
      {
        id: '06-speaker-6',
        prompt:
          'Si el mismo pitch tuviera que presentarse a clientes y a inversores, ¿qué cambiarías según la audiencia?',
        hint: 'Como repregunta: ¿cómo adaptarías el ejemplo, la evidencia y la solicitud final?',
      },
    ],
    questions: [
      {
        id: '06-1',
        prompt: '¿Podemos explicar nuestro proyecto en una frase?',
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
        hint: 'Defendé un diferencial verificable y relevante para el público al que te dirigís.',
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
export const allQuestions = lessons.flatMap((l) => [...l.speakerQuestions, ...l.questions]);
