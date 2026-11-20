import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/** Una escena de la presentación. `steps` es cuántas veces se avanza dentro de ella. */
export type SceneDef = {
  id: string
  part: 'p4' | 'extra'
  /** Backend que muestra la línea: 'c' = primer enfoque (C y GCC), 'native' = el backend propio. */
  route?: 'c' | 'native' | ((step: number) => 'c' | 'native')
  /** Estación de la línea donde está el tren; puede depender del paso. */
  station: number | ((step: number) => number)
  steps: number
  render: (step: number) => ReactNode
}

const W = 1600
const H = 900

/** Clase de revelado: visible cuando el paso actual alcanza `at`. */
export const rv = (step: number, at: number, extra = '') => `rv${step >= at ? ' on' : ''}${extra ? ' ' + extra : ''}`

const STOPS = [
  { x: 96, name: '', art: 'programa.vx', color: 'var(--lex)' },
  { x: 380, name: 'Léxico', art: 'tokens', color: 'var(--lex)' },
  { x: 680, name: 'Sintáctico', art: 'AST', color: 'var(--syn)' },
  { x: 980, name: 'Semántico', art: 'AST anotado', color: 'var(--sem)' },
  { x: 1250, name: 'Generación', art: 'instrucciones', color: 'var(--gen)' },
  { x: 1504, name: 'Ensamblado', art: 'ELF', color: 'var(--gen)' },
]
export const LINE_COLORS = STOPS.map((s) => s.color)

/** En el primer enfoque las dos últimas estaciones eran otras: se escribía C y GCC hacía el resto. */
const C_ROUTE: Record<number, { name: string; art: string }> = {
  4: { name: 'Generación', art: 'programa.c' },
  5: { name: 'GCC', art: 'ejecutable' },
}

type RailProps = { station: number; part: 'p4' | 'extra'; route: 'c' | 'native'; index: number; total: number; onJump: (station: number) => void }

/** La línea con sus estaciones. Va a la misma altura en todas las escenas. */
function Rail({ station, part, route, index, total, onJump }: RailProps) {
  const y = 96
  // La banda dice qué parte se está explicando; el compilador cubre toda la línea
  const band = part === 'p4'
    ? { w: 460, label: 'PUNTO 4: EL ANALIZADOR' }
    : { w: 1228, label: 'PUNTO EXTRA: EL COMPILADOR' }
  return (
    <svg className="rail" viewBox="0 0 1600 190" role="navigation" aria-label="Etapas del compilador">
      <rect className="band" x="300" y="14" height="30" fill="var(--ink)" style={{ width: band.w }} />
      <text className="part" x="316" y="35">{band.label}</text>
      <text className="count" x="96" y="36">
        {String(index + 1).padStart(2, '0')} / {total}
      </text>

      {STOPS.slice(1).map((s, i) => (
        <path key={s.x} className="seg" d={`M${STOPS[i].x} ${y} H${s.x}`} stroke={s.color} />
      ))}

      {STOPS.map((stop, i) => {
        const s = route === 'c' && C_ROUTE[i] ? { ...stop, ...C_ROUTE[i] } : stop
        return (
        <g key={s.x}>
          <circle className={`stop${i < station ? ' done' : ''}`} cx={s.x} cy={y} r={15} />
          <text key={s.name} className="name swap" x={s.x} y={y + 50} textAnchor={i === 0 ? 'start' : i === 5 ? 'end' : 'middle'} dx={i === 0 ? -20 : i === 5 ? 20 : 0}>
            {s.name}
          </text>
          <text key={s.art} className="art swap" x={s.x} y={y + (s.name ? 78 : 50)} textAnchor={i === 0 ? 'start' : i === 5 ? 'end' : 'middle'} dx={i === 0 ? -20 : i === 5 ? 20 : 0}>
            {i === 2 && part === 'p4' ? 'válido o errores' : s.art}
          </text>
          <rect
            className="hit" x={s.x - 70} y={y - 34} width={140} height={120} tabIndex={-1}
            onClick={() => onJump(i)}
          >
            <title>Ir a {s.name || 'el inicio'}</title>
          </rect>
        </g>
        )
      })}

      {/* El tren: marca dónde va la explicación */}
      <g className="train" style={{ transform: `translateX(${STOPS[station].x}px)` }}>
        <circle cx={0} cy={y} r={26} fill="var(--ink)" />
        <circle cx={0} cy={y} r={10} fill="var(--ground)" />
      </g>
    </svg>
  )
}

function readHash(max: number): [number, number] {
  const m = /^#(\d+)(?:\.(\d+))?$/.exec(window.location.hash)
  if (!m) return [0, 0]
  return [Math.min(Number(m[1]) - 1, max), Number(m[2] ?? 0)]
}

export function Deck({ scenes }: { scenes: SceneDef[] }) {
  const [pos, setPos] = useState<[number, number]>(() => readHash(scenes.length - 1))
  const [scale, setScale] = useState(1)
  const [index, rawStep] = pos
  const scene = scenes[index]
  const step = Math.min(rawStep, scene.steps)

  // El lienzo mide siempre 1600 x 900 y se escala a la ventana o al proyector
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const next = () =>
      setPos(([i, s]) => {
        if (s < scenes[i].steps) return [i, s + 1]
        return i < scenes.length - 1 ? [i + 1, 0] : [i, s]
      })
    const prev = () =>
      setPos(([i, s]) => {
        if (s > 0) return [i, s - 1]
        return i > 0 ? [i - 1, scenes[i - 1].steps] : [i, s]
      })
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': case 'Enter': next(); break
        case 'ArrowLeft': case 'PageUp': case 'Backspace': prev(); break
        case 'ArrowDown': setPos(([i]) => [Math.min(i + 1, scenes.length - 1), 0]); break
        case 'ArrowUp': setPos(([i]) => [Math.max(i - 1, 0), 0]); break
        case 'Home': setPos([0, 0]); break
        case 'End': setPos([scenes.length - 1, 0]); break
        case 'f': case 'F':
          if (document.fullscreenElement) void document.exitFullscreen()
          else void document.documentElement.requestFullscreen()
          break
        default: return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scenes])

  // La posición queda en la dirección: recargar no pierde el punto de la exposición
  useEffect(() => {
    window.history.replaceState(null, '', `#${index + 1}${step ? '.' + step : ''}`)
  }, [index, step])

  const station = typeof scene.station === 'function' ? scene.station(step) : scene.station
  const route = typeof scene.route === 'function' ? scene.route(step) : scene.route ?? 'native'
  const jump = (target: number) => {
    const found = scenes.findIndex((s) => (typeof s.station === 'function' ? s.station(0) : s.station) === target)
    if (found >= 0) setPos([found, 0])
  }
  const style = {
    transform: `translate(-50%, -50%) scale(${scale})`,
    '--line': LINE_COLORS[Math.max(station, 1)],
  } as CSSProperties

  return (
    <main className="stage" style={style}>
      <div key={scene.id} className="scene">
        {scene.render(step)}
      </div>
      <Rail station={station} part={scene.part} route={route} index={index} total={scenes.length} onJump={jump} />
    </main>
  )
}
