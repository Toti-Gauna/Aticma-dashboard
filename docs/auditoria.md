# Auditoría aplicada a ATICMA × Handy

Fecha de revisión: **08/10/2026**. Inspección de código y documentación; no se ejercitaron APIs de producción ni se auditó infraestructura desplegada. El objetivo fue identificar qué preguntas, registros y herramientas necesita el workspace para aplicar las sesiones a Handy.

## Repositorios revisados

| Repositorio           | Revisión  | Superficie encontrada                                                                                                                                   | Implicación para el dashboard                                                              |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Aticma-dashboard      | `d0e7084` | Licencia, sin aplicación ni workflows. Pages configurado con fuente Actions.                                                                            | Crear el espacio de trabajo y las comprobaciones desde cero.                               |
| Handy-landing-page-fe | `33ea12a` | Vite + TypeScript, GSAP, contenido JSON, pre-registro y demo de ambos roles. La demo utiliza datos ficticios.                                           | Separar demo, evidencia y capacidad operativa; formular preguntas de captación y embudo.   |
| handy-internal-portal | `209f513` | Vite + TypeScript, módulos de especialistas/pre-registros, contratos y documentación. Vista de referencia con datos sintéticos; operaciones bloqueadas. | El dashboard de aprendizaje no puede asumir permisos o una API administrativa ya aprobada. |
| handy-customer-fe     | `b0bdf71` | Estructura React Native bare; pantalla inicial del template, sin los flujos de negocio.                                                                 | Las experiencias de demo no prueban que esos flujos estén implementados en la app nativa.  |
| Handy-landing-page-be | `37be87a` | README y licencia; sin código del backend en la rama revisada.                                                                                          | Un contrato documentado en frontend no demuestra que el servidor exista.                   |

Fuentes de código: [landing](https://github.com/Toti-Gauna/Handy-landing-page-fe/tree/33ea12ab5b7c4a8cdd7f2f8676e90210a31b6778), [portal](https://github.com/Toti-Gauna/handy-internal-portal/tree/209f513c6e2e4ee751e46e3031ca39090125a29e), `handy-customer-fe/App.tsx`, `Handy-landing-page-be/README.md`. Los dos últimos repos son privados; sus contenidos no se reproducen aquí.

## Documentación de Notion revisada

Handy, Contexto Handy, Roadmap, Business, Funding, Product, Marketing, Operations, Tech, Fase 5 · Métricas, One-liner, Portal interno Handy, Alcance v1 y rubros y Embudo del especialista / definición de la meta. Se inspeccionaron las páginas específicas además de los resúmenes, porque algunas secciones generales no reflejan todavía decisiones cerradas en otras páginas.

Las páginas recuperadas no tenían verificación nativa de Notion. La fecha de edición ayuda a ubicar una fuente, pero no prueba autoridad. Las recomendaciones siguientes son resultados de la lectura y del contraste con código; no alteran decisiones de Handy. No se exportaron bases completas, transcripciones ni datos de clientes.

## Hallazgos y recomendaciones

| Hallazgo                                                   | Evidencia y alcance                                                                                                                                                                                         | Recomendación                                                                                                     | Aplicación en este PR                                                                                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha de lanzamiento inconsistente                         | La landing anuncia 28/10. El roadmap revisado tiene un objetivo posterior, condicionado al test y revisión de tiendas.                                                                                      | Consolidar la fuente de fechas y mantener una diferencia explícita entre objetivo y publicación aprobada.         | El calendario usa solo encuentros confirmados de ATICMA y eventos personales; no inventa un lanzamiento confirmado.                         |
| Contexto general y decisiones específicas divergen         | PROD-01/02 y OPS-01/MET-01 tienen cierres específicos que algunos resúmenes siguen mostrando pendientes. El alcance contiene recomendaciones anteriores debajo de una decisión explícita que las reemplaza. | Actualizar Contexto y resúmenes desde los cierres; conservar el historial con estado y fuente.                    | Preguntas sobre hechos del embudo, criterio de cobro, estado del producto y evidencia disponible.                                           |
| Señales exploratorias no equivalen a validación            | Notion distingue conversaciones exploratorias de un estudio con metodología.                                                                                                                                | Registrar hipótesis, instrumento, contexto, evidencia y criterio de éxito.                                        | Biblioteca de estudios y experiencias; “Con evidencia” requiere método y observaciones. No se cargan testimonios ni validaciones ficticias. |
| Economía unitaria depende de supuestos abiertos            | Business y Tech mantienen cruces sobre costos, condiciones de la pasarela y responsabilidades.                                                                                                              | Comparar escenarios por tipo de trabajo, separar volumen de ingreso y documentar quién absorbe cada costo.        | Calculadora explícitamente hipotética y preguntas en Modelo y Finanzas; sus resultados no cierran decisiones financieras.                   |
| Demo y operaciones reales tienen límites distintos         | La landing es una demo; el portal bloquea operaciones; la app y el backend revisados no implementan esos contratos.                                                                                         | Reconciliar contratos, permisos y alcance antes de conectar cuentas reales.                                       | Workspace autónomo; no agrega endpoints supuestos, pagos, permisos administrativos o conectores aparentes.                                  |
| El pitch debe reflejar el estado disponible al presentarlo | Funding empaqueta evidencia de otras áreas; el calendario de revisión de tiendas condiciona lo que puede mostrarse.                                                                                         | Preparar versiones de pitch con evidencia, demo y roadmap identificados; revisar cifras antes de semifinal/final. | Guion editable, cronómetro y preguntas del jurado.                                                                                          |

## Cómo se aplica cada lección

1. **Validación:** problema por segmento, alternativas, aprendizaje y experimento refutable.
2. **Modelo:** propuesta para ambos lados, ingreso, costos y dependencia de la pasarela.
3. **Growth:** oferta local, etapas por hechos, canales, repetición y resultados.
4. **IA:** tarea concreta, evaluación, minimización de datos, revisión humana y roadmap.
5. **Finanzas:** fuentes de cifras, margen, escenario adverso, uso de fondos y preguntas de inversores.
6. **Pitch:** explicación breve, diferencial demostrable, evidencia actual, solicitud y ensayo.

Las preguntas son propuestas editoriales, no respuestas oficiales de ATICMA ni decisiones aprobadas de Handy. El workspace permite agregar preguntas propias y conectar respuestas con acciones, notas y estudios.

## Próximos cruces para Handy

Reconciliar las fechas y resúmenes en Notion; verificar el contrato y la implementación del backend de pre-registro; cerrar permisos del portal; confirmar condiciones de pago antes de proyectar margen; instrumentar las métricas a partir de hechos reales. Estos cambios pertenecen a sus repos y áreas; este PR deja herramientas para registrarlos y estudiarlos.
