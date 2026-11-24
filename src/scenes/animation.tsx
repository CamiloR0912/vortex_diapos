/* La animación «De demo.vx al ejecutable»: un dibujo por etapa aparece en el
   centro, se cuenta qué se hizo y baja a su hueco en la fila de abajo. Con las
   siete en su lugar aparece el ejecutable funcionando. */
import type { CSSProperties, ReactNode } from 'react'
import { STAGES } from './native'

const abs = (left: number, top: number, width?: number): CSSProperties => ({ position: 'absolute', left, top, width })

/* ---- Un dibujo por etapa, en un lienzo de 360 x 260 ---- */

const INK = 'var(--ink)'
const fileShape = 'M90 20 H230 L270 60 V240 H90 Z'

/** 1. Bytes y ELF: un archivo lleno de bytes */
function DrawBytes() {
  return (
    <g>
      <path d={fileShape} fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M230 20 V60 H270" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {['7F 45 4C 46', '48 FF CB', '0F 85 E8'].map((t, i) => (
        <text key={t} className="st" x={110} y={92 + i * 36} style={{ fontSize: 22 }}>{t}</text>
      ))}
      <rect x={110} y={190} width={70} height={34} fill="var(--gen)" stroke={INK} strokeWidth={4} />
      <text className="st" x={145} y={214} textAnchor="middle" style={{ fontSize: 20 }}>ELF</text>
    </g>
  )
}

/** 2. Enteros y print: una pila de valores y una pantalla que muestra el resultado */
function DrawStack() {
  return (
    <g>
      {['7', '2', '3'].map((n, i) => (
        <g key={n}>
          <rect x={40} y={178 - i * 48} width={120} height={42} fill={i === 2 ? 'var(--gen)' : '#fff'} stroke={INK} strokeWidth={5} />
          <text className="st" x={100} y={207 - i * 48} textAnchor="middle" style={{ fontSize: 26 }}>{n}</text>
        </g>
      ))}
      <text className="sl sm" x={100} y={250} textAnchor="middle">pila</text>
      <path d="M172 130 H198" stroke={INK} strokeWidth={5} />
      <path d="M192 120 L204 130 L192 140" fill="none" stroke={INK} strokeWidth={5} />
      <rect x={212} y={60} width={128} height={100} fill={INK} />
      <text className="st" x={276} y={124} textAnchor="middle" style={{ fontSize: 40, fill: 'var(--gen)' }}>13</text>
      <rect x={266} y={160} width={20} height={26} fill={INK} />
      <rect x={236} y={186} width={80} height={10} fill={INK} />
    </g>
  )
}

/** 3. Control de flujo: un diagrama con una pregunta y un ciclo */
function DrawFlow() {
  return (
    <g fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <path d="M180 30 L262 85 L180 140 L98 85 Z" fill="#fff" />
      <text className="st" x={180} y={93} textAnchor="middle" stroke="none" style={{ fontSize: 22 }}>¿i &lt; 3?</text>
      <path d="M180 140 V168" />
      <path d="M171 160 L180 170 L189 160" />
      <text className="sl sm" x={192} y={162} stroke="none">sí</text>
      <rect x={120} y={172} width={120} height={46} fill="var(--syn)" />
      <text className="st" x={180} y={203} textAnchor="middle" stroke="none" style={{ fontSize: 20, fill: '#fff' }}>print(i)</text>
      <path d="M120 195 H50 V85 H90" />
      <path d="M82 76 L92 85 L82 94" />
      <path d="M262 85 H320" />
      <path d="M312 76 L322 85 L312 94" />
      <text className="sl sm" x={276} y={74} stroke="none">no</text>
    </g>
  )
}

/** 4. Funciones: llamadas recursivas apiladas */
function DrawFunctions() {
  const frames = [['fact(3)', 150, 40], ['fact(4)', 110, 95], ['fact(5)', 70, 150]] as const
  return (
    <g>
      {frames.map(([label, x, y], i) => (
        <g key={label}>
          <rect x={x} y={y} width={170} height={62} fill={i === 2 ? 'var(--gen)' : '#fff'} stroke={INK} strokeWidth={5} />
          <text className="st" x={x + 85} y={y + 40} textAnchor="middle" style={{ fontSize: 24 }}>{label}</text>
        </g>
      ))}
      <path d="M332 70 Q352 140 252 190" fill="none" stroke={INK} strokeWidth={4} strokeDasharray="8 7" />
      <text className="st" x={70} y={246} style={{ fontSize: 24 }}>= 120</text>
    </g>
  )
}

/** 5. Cadenas y reales: letras en casillas y un número con decimales */
function DrawStrings() {
  return (
    <g>
      {['h', 'o', 'l', 'a', '0'].map((c, i) => (
        <g key={i}>
          <rect x={35 + i * 60} y={36} width={52} height={58} fill={c === '0' ? INK : '#fff'} stroke={INK} strokeWidth={5} />
          <text className="st" x={61 + i * 60} y={74} textAnchor="middle" style={{ fontSize: 26, fill: c === '0' ? '#fff' : INK }}>{c}</text>
        </g>
      ))}
      <text className="st" x={180} y={205} textAnchor="middle" style={{ fontSize: 84 }}>
        2<tspan style={{ fill: 'var(--lex)' }}>.</tspan>5
      </text>
    </g>
  )
}

/** 6. Excepciones: algo falla dentro del try y cae en la red del catch */
function DrawExceptions() {
  return (
    <g>
      <rect x={50} y={20} width={260} height={92} fill="#fff" stroke={INK} strokeWidth={5} />
      <text className="sl" x={68} y={52}>try</text>
      <text className="st" x={68} y={92} style={{ fontSize: 24 }}>10 / 0</text>
      <path d="M248 32 L222 72 H242 L228 104 L268 60 H246 L262 32 Z" fill="var(--lex)" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M180 116 V160" stroke={INK} strokeWidth={5} />
      <path d="M170 150 L180 162 L190 150" fill="none" stroke={INK} strokeWidth={5} />
      <path d="M70 170 Q180 250 290 170" fill="none" stroke="var(--sem)" strokeWidth={8} strokeLinecap="round" />
      {[110, 145, 180, 215, 250].map((x) => <path key={x} d={`M${x} ${x === 180 ? 210 : 195} V178`} stroke="var(--sem)" strokeWidth={4} />)}
      <text className="sl" x={180} y={252} textAnchor="middle">catch</text>
    </g>
  )
}

/** 7. Vectores y matrices: una matriz de 3 x 3 */
function DrawArrays() {
  return (
    <g>
      <path d="M86 30 H66 V230 H86 M274 30 H294 V230 H274" fill="none" stroke={INK} strokeWidth={6} />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <g key={`${r}${c}`}>
          <rect x={92 + c * 60} y={40 + r * 62} width={54} height={54} fill={r === 1 && c === 2 ? 'var(--gen)' : '#fff'} stroke={INK} strokeWidth={4} />
          <text className="st" x={119 + c * 60} y={76 + r * 62} textAnchor="middle" style={{ fontSize: 24 }}>{r * 3 + c + 1}</text>
        </g>
      )))}
    </g>
  )
}

/** Al final: la ventana del programa ya funcionando */
function DrawExecutable() {
  return (
    <g>
      <rect x={50} y={20} width={260} height={210} fill="#fff" stroke={INK} strokeWidth={6} />
      <rect x={50} y={20} width={260} height={40} fill={INK} />
      {[0, 1, 2].map((i) => <circle key={i} cx={76 + i * 24} cy={40} r={7} fill="var(--ground)" />)}
      <text className="st" x={180} y={130} textAnchor="middle" style={{ fontSize: 46 }}>demo</text>
      <circle cx={180} cy={185} r={26} fill="var(--sem)" />
      <path d="M167 185 L177 195 L195 175" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

const DRAWINGS = [DrawBytes, DrawStack, DrawFlow, DrawFunctions, DrawStrings, DrawExceptions, DrawArrays]

/** Lo que se cuenta mientras se ve cada dibujo */
const CAPTIONS = [
  'Escribir bytes y armar un archivo que Linux pueda ejecutar.',
  'Enteros y operaciones con una pila, y nuestro propio print.',
  'if, while y for convertidos en preguntas y saltos.',
  'Funciones y recursión: cada llamada con su propio espacio.',
  'Textos letra por letra y números con decimales.',
  'try y catch: si algo falla, el programa cae en el catch.',
  'Vectores y matrices guardados en memoria.',
]

const TERMINAL = ['$ ./vortexc demo.vx', 'Compiled demo.vx -> demo', '$ ./demo', 'fact(5) = 120 | sum = 12']

/* ---- Tiempos (segundos) y posiciones ---- */

const T0 = 0.5                                // espera antes de la primera etapa
const P = 1.6                                 // cuánto dura cada etapa
const BOX = { x: 548, y: 10, w: 360, h: 260 } // el escenario central
const SLOT_Y = 440                            // centro de la fila de abajo
const SLOT_SCALE = 0.34
const slotDx = (i: number) => (i - 3) * 182

function Canvas({ children }: { children: ReactNode }) {
  return <svg width={BOX.w} height={BOX.h} viewBox="0 0 360 260">{children}</svg>
}

export function BuildAnimation({ step }: { step: number }) {
  const go = step >= 1
  const at = (i: number) => T0 + i * P
  const done = at(7)
  const slotW = BOX.w * SLOT_SCALE, slotH = BOX.h * SLOT_SCALE
  const after = (extra: number) => (go ? `${done + extra}s` : '0s')
  return (
    <>
      <h2>De demo.vx al ejecutable</h2>
      <div className="body">
        {/* La fila de abajo: un hueco por etapa, que se llena cuando su dibujo llega */}
        {DRAWINGS.map((_, i) => {
          const cx = BOX.x + BOX.w / 2 + slotDx(i)
          return (
            <div key={i}>
              <div style={{
                ...abs(cx - slotW / 2 - 6, SLOT_Y - slotH / 2 - 6), width: slotW + 12, height: slotH + 12,
                border: '3px dashed color-mix(in srgb, var(--ink) 35%, transparent)', display: 'grid', placeItems: 'center',
                font: '800 26px var(--sans)', color: 'color-mix(in srgb, var(--ink) 35%, transparent)',
              }}>
                {/* El número se apaga cuando su dibujo llega al hueco */}
                <span style={{ opacity: go ? 0 : 1, transition: `opacity 0.2s ${go ? at(i) + P * 0.85 : 0}s` }}>{i + 1}</span>
              </div>
              <span style={{ ...abs(cx - 85, SLOT_Y + slotH / 2 + 10, 170), textAlign: 'center', font: '700 16px var(--sans)' }}>
                {i + 1}. {STAGES[i].title}
              </span>
            </div>
          )
        })}

        {/* Antes de arrancar */}
        <p className="lead" style={{ ...abs(0, 110, 1456), textAlign: 'center', fontSize: 32, opacity: go ? 0 : 1, transition: 'opacity 0.3s' }}>
          Siete etapas, una tras otra, hasta tener el ejecutable.
        </p>

        {/* Cada etapa: su dibujo aparece en el centro y luego baja a su hueco */}
        {go && DRAWINGS.map((D, i) => (
          <div key={i} style={{
            ...abs(BOX.x, BOX.y), width: BOX.w, height: BOX.h,
            '--dx': `${slotDx(i)}px`, '--dy': `${SLOT_Y - (BOX.y + BOX.h / 2)}px`, '--s': SLOT_SCALE,
            animation: `stage-fly ${P}s var(--ease) ${at(i)}s both`,
          } as CSSProperties}>
            <Canvas><D /></Canvas>
          </div>
        ))}
        {go && DRAWINGS.map((_, i) => (
          <div key={i} style={{ ...abs(0, 284, 1456), textAlign: 'center', animation: `caption ${P * 0.78}s ease ${at(i)}s both` }}>
            <p style={{ font: '800 30px var(--sans)' }}>
              <span style={{ color: 'var(--ink-soft)' }}>Etapa {i + 1} · </span>{STAGES[i].title}
            </p>
            <p className="lead" style={{ fontSize: 26, marginTop: 6 }}>{CAPTIONS[i]}</p>
          </div>
        ))}

        {/* Al final: el ejecutable */}
        <div className={go ? 'rv on' : 'rv'} style={{ ...abs(BOX.x, BOX.y), width: BOX.w, height: BOX.h, transitionDelay: after(0) }}>
          <Canvas><DrawExecutable /></Canvas>
        </div>
        <div className={go ? 'rv on' : 'rv'} style={{ ...abs(0, 70, 500), transitionDelay: after(0.3) }}>
          <p style={{ font: '800 36px var(--sans)' }}>¡Listo!</p>
          <p className="lead" style={{ fontSize: 26, marginTop: 10 }}>Un ejecutable de Linux hecho de principio a fin por vortexc.</p>
          <p className="lead" style={{ fontSize: 26, marginTop: 10, color: 'var(--sem)' }}>Sin GCC, sin bibliotecas.</p>
        </div>
        <div className={go ? 'rv on plate out' : 'rv plate out'} style={{ ...abs(950, 50, 506), fontSize: 22, lineHeight: '38px', padding: '14px 22px', transitionDelay: after(0.3) }}>
          {TERMINAL.map((l, i) => (
            <div key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.2s ${after(0.8 + i * 0.5)}` }}>{l}</div>
          ))}
        </div>
      </div>
    </>
  )
}
