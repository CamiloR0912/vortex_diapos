# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Un estudiante de octavo semestre que expone su proyecto final de Lenguajes Formales (UPTC) frente al profesor y al curso. Presenta de pie, con proyector, y controla el avance con el teclado mientras habla. La audiencia conoce autómatas, expresiones regulares, gramáticas, Flex y Bison; no conoce este proyecto.

## Product Purpose

Una presentación de unos 20 minutos, en diapositivas navegadas con teclado, que explica el proyecto Vortex en dos partes:

1. El punto 4 del taller: el analizador léxico (Flex) y el analizador sintáctico (Bison) del lenguaje Vortex, y todo lo que los compone.
2. El punto extra: el compilador `vortexc`. Qué es un compilador, qué pertenece al frontend y qué al backend, cómo se conectan las etapas y cuál es el flujo completo de un programa.

Tiene éxito si la audiencia entiende cómo funciona cada etapa y cómo se conecta con la siguiente, y si el expositor puede apoyarse en cada escena para explicar sin leer texto.

## Positioning

No es una lista de viñetas sobre compiladores: muestra el compilador real del estudiante procesando código Vortex real, etapa por etapa, con los nombres de archivos, tokens, reglas y mensajes de error que existen en el proyecto.

## Operating Context

- Se ejecuta localmente con `npm run dev` y se proyecta a pantalla completa.
- El expositor avanza paso a paso con las flechas; cada paso revela o anima una parte de la explicación.
- Puede haber preguntas del profesor que obliguen a volver a una escena anterior.
- El proyecto real está en `../vortex_formales/` (lexer y parser) y `../punto_extra/` (compilador).

## Capabilities and Constraints

- Navegación por teclado, una escena a la vez; alrededor de 22 escenas.
- Dibujos, diagramas y animaciones que explican cada parte; el movimiento lo dispara el expositor, no un temporizador.
- Texto en español. Los mensajes del compilador y las palabras reservadas de Vortex van en inglés, como en el proyecto.
- Debe leerse desde el fondo de un salón: tipografía grande, alto contraste, pocos elementos por escena.
- Stack existente: React 19, TypeScript y Vite. Sin conexión a internet garantizada durante la exposición.
- Todo el contenido técnico debe corresponder al proyecto: no se inventan etapas, archivos ni resultados.

## Evidence on Hand

- `../vortex_formales/lexer.l`, `../vortex_formales/parser.y`, `../vortex_formales/ARQUITECTURA.md`, `../vortex_formales/parser.output` (279 estados LALR(1), 145 producciones, 0 conflictos).
- `../vortex_formales/automatas/*.jff` y `../vortex_formales/diagramas/*.png` (autómatas léxicos, fragmentos LALR de if-else y try-catch).
- `../punto_extra/` (`lexer.l`, `parser.y`, `ast.c`, `semantic.c`, `codegen.c`, `vx_runtime.h`, `main.c`, `ARQUITECTURA.md`).
- `../punto_extra/tests/` (33 pruebas con su salida esperada) y `../punto_extra/ejemplos/demo.vx` con su C generado.
- No hay métricas de rendimiento ni comparaciones con otros compiladores; no deben inventarse.

## Product Principles

1. Mostrar el mecanismo, no describirlo: cada etapa se ve trabajando sobre código real.
2. Una idea por escena; el expositor aporta el resto con la voz.
3. Un mismo ejemplo recorre todas las etapas para que se vea la conexión.
4. Fidelidad al proyecto: lo que aparece en pantalla existe en el código.

## Accessibility & Inclusion

Legible proyectado: contraste alto y tamaños grandes. Todo el avance funciona solo con teclado. Las animaciones respetan `prefers-reduced-motion`.
