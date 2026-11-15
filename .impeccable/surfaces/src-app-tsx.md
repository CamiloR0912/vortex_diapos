---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Presentación Vortex (deck)

Scope: la presentación completa en `src/`, navegada con teclado. Visitor mode: Read.

Audiencia y trabajo: profesor y curso de Lenguajes Formales, con proyector; el expositor avanza paso a paso y explica con la voz. Contenido: punto 4 (léxico y sintáctico) y punto extra (compilador vortexc), siempre con código y mensajes reales del proyecto. Restricciones: legible desde el fondo del salón, sin internet, solo teclado.

Momento memorable: los tokens de una declaración recorren la carta sintáctica como un tren por su vía, y el desvío es la regla de error.

## Direction contract

THESIS: La gramática se dibuja como vías y el compilador como una línea con estaciones. Rechaza la presentación oscura con ventana de código y viñetas.

OWN-WORLD: Placa de señalética: fondo esmalte gris claro #F2F4F1, tinta azul noche #101B2D, y cuatro colores de línea que nombran etapas (léxico bermellón #E8502A, sintáctico azul #1463C8, semántico verde #0F9B6C, generación ámbar #F0A500). Trazos de vía gruesos con curvas de desvío, terminales en óvalo, no terminales en caja de tinta, estaciones como anillos. Overpass para todo el texto, Overpass Mono solo para código y tokens. La salida del compilador va en placas de tinta.

STORY: El curso entiende qué hace cada etapa, ve el mismo ejemplo pasar por todas y entiende dónde se detecta cada error.

FIRST VIEWPORT: Vortex a 260px arriba a la izquierda, lema debajo, carta sintáctica de var_decl a la derecha, y abajo la línea a altura fija con seis estaciones y el tren en la primera. El avance es la flecha derecha.

FORM: Carta sintáctica y mapa de línea, candidato 4 de 7. seed:5d70e98278afedb6. Interacción firma: el tren de tokens recorre la carta paso a paso. Gramática de movimiento: los trazos se dibujan, las piezas se encienden al ser consumidas, el tren se desliza entre estaciones.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
