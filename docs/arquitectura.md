# Arquitectura y contrato del workspace

Aplicación estática React 19 + TypeScript + Vite. Motion anima las transiciones y el gráfico SVG. Iconos Lucide y tipografías autohospedadas de Fontsource. No requiere APIs, fuentes remotas ni un backend. Las rutas usan hash para permitir enlaces directos en GitHub Pages. Cada pantalla se carga bajo demanda.

## Módulos

`src/lib/program.ts` contiene el calendario editorial y las preguntas. `model.ts` define el esquema versionado de Zod y los tipos derivados. `storage.ts` encapsula lectura, escritura y validación de respaldos. `workspace.tsx` maneja navegación, datos, notificaciones y guardado. Las pantallas están en `src/pages`; componentes comunes, modal, formularios y pizarra en `src/components`.

`StartupScreen.tsx` muestra una apertura SVG animada en cada carga del documento, también al refrescar o abrir un enlace a una sección. `App.tsx` espera tanto un mínimo de 1,1 segundos como el montaje de la primera página dentro de `Suspense`; el contenido se prepara detrás de la apertura y queda inerte hasta terminar la transición. No se guarda una bandera de apertura en el navegador ni se muestran porcentajes de carga ficticios. La navegación entre secciones no reinicia esta pantalla. Se limpia el temporizador y se restaura el scroll; la preferencia de movimiento reducido desactiva el giro y el dibujo animado.

## Modelo de datos v1

| Registro      | Campos principales                                             | Relación                    |
| ------------- | -------------------------------------------------------------- | --------------------------- |
| Nota          | título, cuerpo, fecha, fijada, formas SVG                      | sesión opcional             |
| Acción        | título, resultado, área, estado, prioridad, fecha, responsable | sesión opcional             |
| Estudio       | tipo, hipótesis, método, evidencia, conclusión, fuente, estado | sesión opcional             |
| Evento        | título, fecha, hora Argentina, duración, lugar                 | calendario personal         |
| Respuesta     | ID de pregunta → texto                                         | pregunta editorial o propia |
| Configuración | widgets ordenados/ocultos, canvas y guion                      | workspace                   |

Los ID de entidades nuevas usan `crypto.randomUUID()`. El progreso de sesiones es explícito: una fecha pasada no completa una lección. Los indicadores se calculan de los registros del usuario. Las acciones iniciales son sugerencias y no representan tareas operativas de Handy.

## Persistencia y recuperación

Clave de localStorage: `aticma-handy-workspace-v1`. Guardado con espera de 300 ms tras cambios y escritura al salir de la página. Durante una sesión el estado vive en memoria; un fallo de escritura muestra una alerta con acceso a exportar. Un archivo corrupto o de versión no compatible bloquea las escrituras, conserva el original y habilita su descarga. Cambios desde otra pestaña pausan el guardado para proteger la versión en memoria.

La importación acepta hasta 8 MB, valida tipos, fechas, horas, referencias de sesiones, IDs duplicados, tamaños y estado de evidencia. Muestra el número de registros y exige una acción explícita para reemplazar el workspace. El límite de aceptación de un respaldo no garantiza que el navegador tenga espacio para guardarlo: los fallos de cuota se informan y permiten exportar.

No hay sincronización, autenticación ni autorización de datos remotos. Este espacio no es una consola administrativa. No contiene registros operativos de Handy. Borrar el almacenamiento del navegador borra el trabajo local; exportar JSON permite conservarlo. Los respaldos y archivos exportados quedan bajo control del usuario.

## Pizarra

SVG con Pointer Events, captura de puntero y conversión de coordenadas por matriz de pantalla. Herramientas de trazo, rectángulo, flecha, texto, selección y paneo; zoom de 50% a 300%. Cada nota guarda hasta 250 formas; cada trazo hasta 5.000 puntos. El historial mantiene 40 estados mientras la pizarra permanece montada; no se incluye en el respaldo. El selector de elementos permite selección sin puntero, Delete/Backspace eliminan, flechas mueven, Shift acelera y Ctrl/⌘ Z deshace. El texto se puede insertar al centro mediante un botón.

SVG conserva los elementos y se exporta como vector; el encuadre incluye dibujos fuera de la vista inicial. Markdown no incluye los diagramas; JSON y SVG sí.

## Exportaciones y seguridad de contenido

Los textos se renderizan con el escape de React; no se usa `dangerouslySetInnerHTML`. Markdown se guarda y exporta como texto, sin interpretar HTML. Los enlaces de fuentes solo se abren si usan HTTP o HTTPS. El calendario convierte hora de Argentina a UTC; los hitos sin hora se exportan como eventos de día completo. ICS escapa separadores y saltos de línea y pliega líneas por bytes UTF-8.

Los modales manejan foco, Escape y retorno al control anterior. Las eliminaciones tienen confirmación, y los movimientos de acciones también funcionan con controles select. Las animaciones respetan `prefers-reduced-motion`. No se declara cumplimiento formal de un estándar de accesibilidad sin una auditoría específica.

## Publicación

CI instala desde el lockfile, comprueba código y flujos de navegador, y entrega `dist/`. El workflow de Pages es manual y solo corre en `main`; no cambia configuración ni audiencia de Pages. Para sincronizar en el futuro, hace falta un contrato de backend, permisos y migración versionada de los datos locales.
