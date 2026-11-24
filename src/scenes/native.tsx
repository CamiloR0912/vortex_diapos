/* Escenas del backend propio: el cambio de enfoque, las siete etapas en
   resumen y el resultado. El detalle técnico está en las diapositivas de
   cada archivo (files.tsx). */
import type { CSSProperties } from 'react'
import { rv } from '../deck'

const abs = (left: number, top: number, width?: number): CSSProperties => ({ position: 'absolute', left, top, width })

/* ------------------------------------------------------------ El cambio */

const TASKS = [
  { task: 'Elegir las instrucciones x86-64', gcc: 'cc1', ours: 'x86gen.c' },
  { task: 'Convertir cada instrucción en bytes', gcc: 'as', ours: 'x86enc.c' },
  { task: 'Escribir el archivo ejecutable', gcc: 'ld', ours: 'elf.c' },
  { task: 'print, memoria, excepciones…', gcc: 'libc', ours: 'runtime.c' },
]

export function Change({ step }: { step: number }) {
  return (
    <>
      <h2>El cambio: vortexc escribe el ejecutable él mismo</h2>
      <div className="body">
        <div style={{ ...abs(0, 0, 1456), display: 'grid', gridTemplateColumns: '560px 330px 1fr', columnGap: 32 }}>
          <span className="sl" />
          <span className="lead" style={{ fontSize: 26 }}>Primer enfoque</span>
          <span className={rv(step, 2, 'lead')} style={{ fontSize: 26 }}>Backend propio</span>
        </div>
        <div className="rule" style={{ ...abs(0, 44, 1456) }} />
        {TASKS.map((t, i) => (
          <div key={t.task} style={{ ...abs(0, 62 + i * 62, 1456), display: 'grid', gridTemplateColumns: '560px 330px 1fr', columnGap: 32, alignItems: 'center' }}>
            <span className="lead" style={{ fontSize: 28 }}>{t.task}</span>
            <span className={`fade${step >= 1 ? ' off' : ''}`}><span className="tag">{t.gcc}</span></span>
            <span className={rv(step, 2)} style={{ transitionDelay: `${i * 0.12}s` }}>
              <span className="tag" style={{ background: 'var(--gen)', color: 'var(--ink)' }}>{t.ours}</span>
            </span>
          </div>
        ))}
        <p className={rv(step, 3, 'lead')} style={{ ...abs(0, 350, 1456), fontSize: 30 }}>
          No se hizo de una vez: se construyó en 7 etapas, y cada una funcionaba antes de pasar a la siguiente.
        </p>
      </div>
    </>
  )
}

/* ------------------------------------------- Las siete etapas, en resumen */

export const STAGES: { title: string; what: string; works: string }[] = [
  { title: 'Bytes y ELF', what: 'Escribir instrucciones en bytes y armar un archivo que Linux acepte como ejecutable.', works: 'programa vacío' },
  { title: 'Enteros y print', what: 'Variables enteras, operaciones + − * / y nuestra propia rutina para imprimir.', works: 'print(a + b*3)' },
  { title: 'Control de flujo', what: 'if, while, for, switch, break y continue, convertidos en saltos.', works: 'if, while, for' },
  { title: 'Funciones', what: 'Llamadas con parámetros, return, recursión y funciones dentro de funciones.', works: 'fact(5)' },
  { title: 'Cadenas y reales', what: 'Textos y números con decimales, y cómo imprimirlos igual que antes.', works: 'print("y", 2.5)' },
  { title: 'Excepciones', what: 'try, catch, throw, assert y los errores al ejecutar, como dividir entre cero.', works: 'try / catch' },
  { title: 'Vectores y matrices', what: 'Crearlos, leer con índice revisando el rango, operar con ellos y sum, max…', works: 'sum(v + w)' },
]

const CW = 334, CH = 228, GAP = 40, ROW2 = 272
const cardPos = (i: number) => ({ x: (i % 4) * (CW + GAP), y: i < 4 ? 0 : ROW2 })

export function Stages({ step }: { step: number }) {
  const lastX = 3 * (CW + GAP) + CW / 2
  return (
    <>
      <h2>El backend propio, etapa por etapa</h2>
      <div className="body">
        {/* La vía que une las etapas: fila de arriba, baja y sigue en la de abajo */}
        <svg width="1456" height="510" viewBox="0 0 1456 510" style={{ position: 'absolute', left: 0, top: 0 }}>
          <path className="guide" d={`M${CW / 2} ${CH / 2} H${lastX}`} />
          <path className="guide" d={`M${lastX} ${CH} V${ROW2 - 22} H${CW / 2} V${ROW2}`} />
          <path className="guide" d={`M${CW / 2} ${ROW2 + CH / 2} H${lastX}`} />
        </svg>
        {STAGES.map((s, i) => {
          const { x, y } = cardPos(i)
          const now = step === i + 1
          const seen = step >= i + 1
          return (
            <div key={s.title} style={{
              ...abs(x, y, CW), height: CH, padding: '14px 18px',
              border: `4px solid ${seen ? 'var(--ink)' : '#d4d8dd'}`,
              background: now ? 'color-mix(in srgb, var(--gen) 35%, #fff)' : seen ? '#fff' : 'var(--ground)',
              color: seen ? 'var(--ink)' : '#c2c7ce', transition: 'color 0.45s, background 0.45s, border-color 0.45s',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flex: '0 0 40px', height: 40, borderRadius: 20, background: seen ? 'var(--ink)' : '#d4d8dd', color: 'var(--ground)', font: '800 22px var(--sans)', display: 'grid', placeItems: 'center', transition: 'background 0.45s' }}>{i + 1}</span>
                <span style={{ font: '800 25px var(--sans)', lineHeight: 1.1 }}>{s.title}</span>
              </div>
              <p className="lead" style={{ fontSize: 20, lineHeight: 1.3, marginTop: 10 }}>{s.what}</p>
              <p style={{ marginTop: 'auto', fontSize: 18, fontWeight: 600, opacity: 0.75 }}>
                ya funciona: <span className="mono" style={{ fontSize: 19 }}>{s.works}</span>
              </p>
            </div>
          )
        })}
        {/* Al final: la meta */}
        <div style={{
          ...abs(cardPos(7).x, ROW2, CW), height: CH, padding: '18px 20px',
          background: step >= 8 ? 'var(--ink)' : '#d4d8dd', color: step >= 8 ? 'var(--ground)' : '#eef0f2',
          transition: 'background 0.45s, color 0.45s',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <p style={{ font: '800 28px var(--sans)', lineHeight: 1.15 }}>Todo Vortex, sin GCC</p>
          <p style={{ fontSize: 20, lineHeight: 1.3, marginTop: 10, fontWeight: 600 }}>Las pruebas dan la misma salida que el primer enfoque.</p>
        </div>
      </div>
    </>
  )
}


