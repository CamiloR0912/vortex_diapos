import type { ReactNode } from 'react'

type PieceProps = { x: number; y: number; w: number; label: string; lit?: boolean; h?: number }

/** Terminal de una carta sintáctica: un token, en óvalo. */
export function Term({ x, y, w, label, lit, h = 52 }: PieceProps) {
  return (
    <g className={lit ? 'lit' : undefined}>
      <rect className="t-term" x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} />
      <text className="st" x={x} y={y + 9} textAnchor="middle">{label}</text>
    </g>
  )
}

/** No terminal de una carta sintáctica: otra regla, en caja de tinta. */
export function NonT({ x, y, w, label, lit, h = 52 }: PieceProps) {
  return (
    <g className={lit ? 'lit' : undefined}>
      <rect className="t-nont" x={x - w / 2} y={y - h / 2} width={w} height={h} />
      <text className="st inv" x={x} y={y + 9} textAnchor="middle">{label}</text>
    </g>
  )
}

/** Extremos de una vía: inicio lleno, final en anillo. */
export function Ends({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <>
      <circle cx={x1} cy={y} r={11} fill="var(--ink)" />
      <circle cx={x2} cy={y} r={11} fill="var(--ground)" stroke="var(--ink)" strokeWidth={6} />
    </>
  )
}

/** Marca de aceptado, dibujada. */
export function Check({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d="M-12 1 L-3 10 L13 -9" transform={`translate(${x} ${y}) scale(${s})`}
      fill="none" stroke="var(--sem)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
    />
  )
}

/** Marca de descartado, dibujada. */
export function Cross({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d="M-10 -10 L10 10 M10 -10 L-10 10" transform={`translate(${x} ${y}) scale(${s})`}
      fill="none" stroke="var(--lex)" strokeWidth={6} strokeLinecap="round"
    />
  )
}

/** Punta de flecha en el extremo de una guía. */
export function Arrow({ x, y, dir = 'r' }: { x: number; y: number; dir?: 'r' | 'l' | 'd' | 'u' }) {
  const rot = { r: 0, d: 90, l: 180, u: 270 }[dir]
  return <path d="M-14 -9 L0 0 L-14 9" transform={`translate(${x} ${y}) rotate(${rot})`} fill="none" stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
}

/** Nodo de un árbol: caja con texto centrado. */
export function TreeNode({ x, y, w, label, fill, sub, hot }: { x: number; y: number; w: number; label: string; fill?: boolean; sub?: ReactNode; hot?: boolean }) {
  return (
    <g className={hot ? 'hot' : undefined}>
      <rect className={`node${fill ? ' fill' : ''}`} x={x - w / 2} y={y - 28} width={w} height={56} />
      <text className={`st big${fill ? ' inv' : ''}`} x={x} y={y + 11} textAnchor="middle">{label}</text>
      {sub}
    </g>
  )
}
