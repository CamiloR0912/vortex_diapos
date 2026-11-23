/* Escenas del backend propio: el cambio de enfoque y las siete etapas.
   Todo el código, el ensamblador, las direcciones y los mensajes salen de
   ejecutar vortexc (rama main de vortex_compiler) y desensamblar con objdump.
   Las explicaciones están en palabras sencillas: la exposición es para un
   público que no conoce el ensamblador. */
import type { CSSProperties, ReactNode } from 'react'
import { rv } from '../deck'
import { Arrow, Check, Cross, TreeNode } from '../ui'

const abs = (left: number, top: number, width?: number): CSSProperties => ({ position: 'absolute', left, top, width })
/** Visible solo en los pasos indicados: para escenas que cambian de vista. */
const during = (step: number, from: number, to: number, extra = '') =>
  `rv${step >= from && step <= to ? ' on' : ''}${extra ? ' ' + extra : ''}`

/* ------------------------------------------------------------ El cambio */

const TASKS = [
  { task: 'Elegir las instrucciones x86-64', gcc: 'cc1', ours: 'x86gen.c' },
  { task: 'Convertir cada instrucción en bytes', gcc: 'as', ours: 'x86enc.c' },
  { task: 'Escribir el archivo ejecutable', gcc: 'ld', ours: 'elf.c' },
  { task: 'print, memoria, excepciones…', gcc: 'libc', ours: 'runtime.c' },
]

const PLAN = ['Bytes y ELF', 'Pila y print', 'Saltos', 'Funciones', 'Cadenas y reales', 'Excepciones', 'Arreglos']

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
        {/* Las siete etapas, cada una en su rama de git */}
        <div className={rv(step, 3)} style={abs(0, 340, 1456)}>
          <svg width="1456" height="106" viewBox="0 0 1456 106">
            <path className="track" style={{ stroke: 'var(--gen)' }} d="M104 22 H1352" />
            {PLAN.map((p, i) => {
              const x = 104 + i * 208
              return (
                <g key={p}>
                  <circle cx={x} cy={22} r={15} fill="var(--ground)" stroke="var(--ink)" strokeWidth={6} />
                  <text className="st sm" x={x} y={70} textAnchor="middle">{i + 1}</text>
                  <text className="sl sm" x={x} y={100} textAnchor="middle">{p}</text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------- Vocabulario para leer el ensamblador */

type Word = [term: string, meaning: string]
const VOCAB: { title: string; sub: string; termW: number; words: Word[] }[] = [
  {
    title: 'Registros',
    sub: 'Casillas dentro del procesador, de 8 bytes cada una. Son lo más rápido que hay.',
    termW: 110,
    words: [
      ['rax', 'donde queda el resultado de cada cálculo'],
      ['eax', 'la mitad baja de rax'],
      ['rcx', 'ayudante: el segundo valor de una operación'],
      ['rsp', 'apunta al tope de la pila'],
      ['rbp', 'apunta a las variables de la función que corre'],
      ['xmm0', 'registro para números reales'],
    ],
  },
  {
    title: 'Memoria',
    sub: 'Una fila enorme de casillas numeradas. El número de una casilla es su dirección.',
    termW: 170,
    words: [
      ['[ x ]', 'lo que está guardado en la dirección x'],
      ['[rbp-0x8]', '8 bytes debajo de rbp: variable a'],
      ['[rbp-0x10]', '16 bytes debajo (0x10 es 16 en hexadecimal): variable b'],
      ['[rsp]', 'lo que está en el tope de la pila'],
      ['pila', 'valores apilados como platos: el último que entra es el primero que sale'],
    ],
  },
  {
    title: 'Instrucciones',
    sub: 'Órdenes que el procesador ejecuta una tras otra.',
    termW: 140,
    words: [
      ['mov a, b', 'copia b en a'],
      ['push · pop', 'mete en la pila / saca de la pila'],
      ['add · imul', 'suma / multiplica'],
      ['cmp', 'compara dos valores'],
      ['jmp', 'salta a otra parte, siempre'],
      ['je · jne', 'salta solo si la comparación dio igual / si no dio igual'],
      ['call · ret', 'va a una rutina / vuelve de ella'],
    ],
  },
]

export function Glossary({ step }: { step: number }) {
  return (
    <>
      <h2>Antes de seguir: cómo leer el ensamblador</h2>
      <div className="body" style={{ display: 'grid', gridTemplateColumns: '440px 500px 1fr', columnGap: 36 }}>
        {VOCAB.map((col, c) => (
          <div key={col.title} className={rv(step, c + 1)}>
            <p style={{ font: '800 30px var(--sans)' }}>{col.title}</p>
            <p className="note" style={{ fontSize: 21, lineHeight: 1.25, margin: '4px 0 12px', minHeight: 54 }}>{col.sub}</p>
            {col.words.map(([term, meaning]) => (
              <div key={term} style={{ display: 'grid', gridTemplateColumns: `${col.termW}px 1fr`, columnGap: 10, alignItems: 'baseline', borderTop: '3px solid var(--ink)', padding: '7px 0 8px' }}>
                <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--syn)' }}>{term}</span>
                <span style={{ fontSize: 21, lineHeight: 1.2, fontWeight: 600 }}>{meaning}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------- Etapa 1: los bytes */

/** Un byte en una caja grande; `pending` lo marca como hueco aún sin completar. */
function ByteRow({ x, y, bytes, labels, pending = [] }: { x: number; y: number; bytes: string[]; labels?: string[]; pending?: number[] }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {bytes.map((b, i) => (
        <g key={i} className={pending.includes(i) ? 'hot' : undefined}>
          <rect className="node" x={i * 114} y={0} width={104} height={96} />
          <text className="st" x={i * 114 + 52} y={63} textAnchor="middle" style={{ fontSize: 42 }}>{b}</text>
          {labels?.[i] && <text className="sl sm" x={i * 114 + 52} y={132} textAnchor="middle">{labels[i]}</text>}
        </g>
      ))}
    </g>
  )
}

const DEC_PARTS: [string, string][] = [
  ['48', 'trabaja con 64 bits'],
  ['FF', 'la operación: sumar o restar 1'],
  ['CB', 'cuál de las dos (restar) y sobre qué registro (rbx)'],
]

export function StageBytes({ step }: { step: number }) {
  const patched = step >= 3
  return (
    <>
      <h2>Etapa 1: el procesador solo entiende números</h2>
      <div className="body">
        {/* Izquierda: una instrucción y sus bytes */}
        <p className="lead" style={{ ...abs(0, 0, 690), fontSize: 27 }}>
          Cada instrucción tiene un código fijo en bytes, definido por Intel. x86enc.c sabe escribir esos códigos.
        </p>
        <div className="plate" style={{ ...abs(0, 96, 690), fontSize: 26, padding: '10px 20px' }}>
          dec rbx<span style={{ color: 'var(--ink-soft)' }}>{'      ; réstale 1 a rbx'}</span>
        </div>
        <svg width="690" height="100" viewBox="0 0 690 100" style={{ position: 'absolute', left: 0, top: 186 }}>
          <ByteRow x={0} y={0} bytes={['48', 'FF', 'CB']} />
          <text className="sl sm" x={360} y={58}>= lo que ve el procesador</text>
        </svg>
        <div className={rv(step, 1)} style={abs(0, 300, 690)}>
          {DEC_PARTS.map(([b, text]) => (
            <div key={b} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', alignItems: 'baseline', marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 26, fontWeight: 600 }}>{b}</span>
              <span className="lead" style={{ fontSize: 24 }}>{text}</span>
            </div>
          ))}
          <p className="note" style={{ fontSize: 22, marginTop: 6 }}>rbx es un registro: una casilla dentro del procesador.</p>
        </div>

        {/* Derecha: un salto hacia una etiqueta */}
        <div className={rv(step, 2)} style={abs(760, 0, 696)}>
          <p className="lead" style={{ fontSize: 27 }}>Un salto guarda cuántos bytes moverse. jne = «salta si no dio igual».</p>
          <div className="plate" style={{ fontSize: 24, lineHeight: '36px', marginTop: 14, padding: '10px 20px' }}>
            {'ciclo:          ← byte 181\n    …\n    jne ciclo   ← byte 199'}
          </div>
          <svg width="696" height="140" viewBox="0 0 696 140" style={{ marginTop: 18 }}>
            <ByteRow
              x={0} y={0}
              bytes={['0F', '85', ...(patched ? ['E8', 'FF', 'FF', 'FF'] : ['00', '00', '00', '00'])]}
              labels={['jne', '', patched ? '' : 'hueco', '', '', '']}
              pending={patched ? [] : [2, 3, 4, 5]}
            />
          </svg>
        </div>
        <p className={during(step, 2, 2, 'note')} style={{ ...abs(760, 420, 696), fontSize: 23 }}>
          Si el destino todavía no se ha escrito, no se sabe la distancia: se deja un hueco de 4 bytes.
        </p>
        <div className={rv(step, 3)} style={abs(760, 410, 696)}>
          <div className="plate out" style={{ fontSize: 22, lineHeight: '32px', padding: '10px 18px' }}>
            {'distancia = 181 − 205 = −24: retroceder 24\n205 es donde termina la instrucción jne'}
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------- Etapa 1: el ELF */

const FILE_PARTS = [
  { x: 0, w: 170, name: 'cabecera', size: 'quién soy' },
  { x: 180, w: 190, name: 'cómo cargar', size: '3 instrucciones' },
  { x: 380, w: 420, name: 'código', size: '7 875 bytes de instrucciones' },
  { x: 810, w: 150, name: 'relleno', size: '', dim: true },
  { x: 970, w: 300, name: 'datos', size: 'textos y constantes' },
]

const MEMORY = [
  { x: 380, w: 420, title: 'código', perm: 'se ejecuta, no se modifica', from: 590 },
  { x: 970, w: 300, title: 'datos', perm: 'se leen y se modifican', from: 1120 },
  { x: 1280, w: 176, title: 'bss', perm: 'en ceros', from: 0 },
]

export function StageElf({ step }: { step: number }) {
  return (
    <>
      <h2>Etapa 1: elf.c arma el archivo ejecutable</h2>
      <div className="body">
        <p style={{ ...abs(0, 0, 1456), font: '800 26px var(--sans)' }}>
          demo&nbsp;<span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>· 14 137 bytes · ELF es el formato de los ejecutables en Linux (como .exe en Windows)</span>
        </p>
        <svg width="1456" height="330" viewBox="0 0 1456 330" style={{ position: 'absolute', left: 0, top: 44 }}>
          {FILE_PARTS.map((p) => (
            <g key={p.name} style={p.dim ? { opacity: 0.4 } : undefined}>
              <rect className="node" x={p.x} y={0} width={p.w} height={100} />
              <text className="sl" x={p.x + 14} y={42}>{p.name}</text>
              <text className="sl sm soft" x={p.x + 14} y={78} style={{ fontSize: 20 }}>{p.size}</text>
            </g>
          ))}
          <g className={rv(step, 1)}>
            {MEMORY.map((m) => (
              <g key={m.title}>
                {m.from
                  ? <><path className="track thin" style={{ stroke: 'var(--gen)' }} d={`M${m.from} 104 V196`} /><Arrow x={m.from} y={208} dir="d" /></>
                  : <path className="guide" strokeDasharray="8 8" d={`M${m.x + m.w / 2} 150 V210`} />}
                <rect className="node fill" x={m.x} y={214} width={m.w} height={100} />
                <text className="sl inv" x={m.x + 16} y={256}>{m.title}</text>
                <text className="sl sm inv" x={m.x + 16} y={294}>{m.perm}</text>
              </g>
            ))}
            <text className="sl sm" x={1456} y={134} textAnchor="end">no ocupa espacio</text>
            <text className="sl sm" x={0} y={250}>Al ejecutar, Linux copia</text>
            <text className="sl sm" x={0} y={280}>cada parte a la memoria:</text>
          </g>
        </svg>
        <div className={rv(step, 2)} style={{ ...abs(0, 380, 1456), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40, alignItems: 'start' }}>
          <p className="lead" style={{ fontSize: 26 }}>
            Es <span className="b">estático</span>: no necesita ninguna biblioteca para correr. Todo lo que usa va adentro.
          </p>
          <p className="lead" style={{ fontSize: 26 }}>
            Solo le pide 3 cosas a Linux: <span className="mono">write</span> (escribir), <span className="mono">mmap</span> (pedir memoria) y <span className="mono">exit</span> (terminar).
          </p>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------ Etapa 2: la máquina de pila */

/** Código real de print(a + b * 3) con a en [rbp-8] y b en [rbp-16]. Cada línea dice en qué paso se ejecuta. */
const STACK_ASM: [string, number][] = [
  ['mov  rax, [rbp-0x8]  ; rax ← a', 1], ['push rax             ; guarda 7', 1],
  ['mov  rax, [rbp-0x10] ; rax ← b', 2], ['push rax             ; guarda 2', 2],
  ['mov  eax, 3          ; rax ← 3', 3],
  ['mov  rcx, rax        ; rcx ← 3', 4], ['pop  rax             ; saca el 2', 4], ['imul rax, rcx        ; 2 · 3', 4],
  ['mov  rcx, rax        ; rcx ← 6', 5], ['pop  rax             ; saca el 7', 5], ['add  rax, rcx        ; 7 + 6', 5],
  ['push rax', 6], ['mov  rax, [rsp]      ; rax ← 13', 6], ['call print_int       ; imprime', 6],
]

/** rax y la pila después de cada paso */
const MACHINE: { rax: string; stack: string[] }[] = [
  { rax: '', stack: [] },
  { rax: '7', stack: ['7'] },
  { rax: '2', stack: ['7', '2'] },
  { rax: '3', stack: ['7', '2'] },
  { rax: '6', stack: ['7'] },
  { rax: '13', stack: [] },
  { rax: '13', stack: ['13'] },
]

/** Qué está pasando en cada paso, en palabras */
const STACK_SAY = [
  'Cada expresión deja su valor en rax; los valores que esperan van a la pila.',
  'Trae a de su casilla y la guarda en la pila.',
  'Trae b y también la guarda.',
  'El 3 va directo a rax.',
  'Saca el 2 de la pila y lo multiplica por 3.',
  'Saca el 7 y le suma el 6.',
  'rax tiene 13: se lo pasa a print.',
]

export function StageStack({ step }: { step: number }) {
  const m = MACHINE[Math.min(step, 6)]
  const hot = [0, 1, 2, 3, 4, 5, 0][Math.min(step, 6)]   // nodo del árbol que se está generando
  return (
    <>
      <h2>Etapa 2: la máquina de pila</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 500), fontSize: 24, lineHeight: '36px', padding: '12px 20px' }}>
          {'int a = 7;  '}<span style={{ color: 'var(--ink-soft)' }}>{'// en [rbp-0x8]'}</span>
          {'\nint b = 2;  '}<span style={{ color: 'var(--ink-soft)' }}>{'// en [rbp-0x10]'}</span>
          {'\n'}<span className="hl">print(a + b * 3);</span>
        </div>
        <svg width="500" height="330" viewBox="0 0 500 330" style={{ position: 'absolute', left: 0, top: 176 }}>
          <path className="guide" d="M250 68 L110 142 M250 68 L380 142 M380 198 L300 272 M380 198 L460 272" />
          <TreeNode x={250} y={40} w={90} label="+" fill hot={hot === 5} />
          <TreeNode x={110} y={170} w={90} label="a" hot={hot === 1} />
          <TreeNode x={380} y={170} w={90} label="*" fill hot={hot === 4} />
          <TreeNode x={300} y={300} w={90} label="b" hot={hot === 2} />
          <TreeNode x={460} y={300} w={90} label="3" hot={hot === 3} />
        </svg>

        <div className="plate" style={{ ...abs(560, 0, 580), fontSize: 21, lineHeight: '29px', padding: '12px 18px' }}>
          {STACK_ASM.map(([line, at], i) => (
            <div key={i} className={step === at ? 'hl' : step > 0 && at > step ? 'dim' : undefined}>{line}</div>
          ))}
        </div>

        <div style={abs(1180, 0, 276)}>
          <p style={{ font: '800 26px var(--sans)' }}>rax</p>
          <div className="plate" style={{ fontSize: 34, padding: '8px 18px', marginTop: 8, height: 64 }}>{m.rax || ' '}</div>
          <p style={{ font: '800 26px var(--sans)', marginTop: 20 }}>pila</p>
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 8, marginTop: 8, height: 120, justifyContent: 'flex-start' }}>
            {m.stack.map((v, i) => (
              <div key={i} className="plate out" style={{ fontSize: 28, padding: '4px 18px' }}>{v}</div>
            ))}
          </div>
          <p key={step} className="lead" style={{ fontSize: 23, marginTop: 14, animation: 'scene-in 0.4s var(--ease) both' }}>
            {STACK_SAY[Math.min(step, 6)]}
          </p>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------- Etapa 3: etiquetas y saltos */

const LH = 34
const FLOW_ASM: { text: string; label?: boolean; dim?: boolean }[] = [
  { text: '    mov  [rbp-0x8], 0   ; i = 0' },
  { text: 'ciclo:', label: true },
  { text: '    (¿i < 3? deja 1 o 0)', dim: true },
  { text: '    je   fin            ; dio 0: salir' },
  { text: '    (¿i == 1? deja 1 o 0)', dim: true },
  { text: '    je   sigue          ; dio 0: saltar' },
  { text: '    jmp  paso           ; continue' },
  { text: 'sigue:', label: true },
  { text: '    call print_int      ; print(i)' },
  { text: 'paso:', label: true },
  { text: '    (i = i + 1)', dim: true },
  { text: '    jmp  ciclo' },
  { text: 'fin:', label: true },
]
const JUMPS = [
  { from: 3, to: 12, lane: 3, at: 1, text: 'Si «i < 3» es falso (dio 0), je salta a fin: el ciclo se acaba.' },
  { from: 5, to: 7, lane: 1, at: 2, text: 'Si «i == 1» es falso, je salta por encima del continue, a sigue.' },
  { from: 6, to: 9, lane: 2, at: 3, text: 'continue: jmp salta siempre, al paso «i = i + 1». Si fuera a la condición, i nunca avanzaría.' },
  { from: 11, to: 1, lane: 4, at: 4, text: 'Al final de cada vuelta, jmp regresa a ciclo.' },
]
const lineY = (i: number) => 12 + LH / 2 + i * LH

export function StageFlow({ step }: { step: number }) {
  const current = JUMPS.find((j) => j.at === step)
  return (
    <>
      <h2>Etapa 3: if, while y for se vuelven saltos</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 560), fontSize: 24, lineHeight: '38px' }}>
          {'for (int i = 0; i < 3; i = i + 1) {\n    if (i == 1) { continue; }\n    print(i);\n}'}
        </div>
        <div className={during(step, 0, 0)} style={abs(0, 210, 560)}>
          <p className="lead" style={{ fontSize: 26 }}>
            Una etiqueta (<span className="mono">ciclo:</span>, <span className="mono">fin:</span>) marca un lugar del código.
          </p>
          <p className="lead" style={{ fontSize: 26, marginTop: 14 }}>
            <span className="mono">jmp</span> salta siempre. <span className="mono">je</span> (<i>jump if equal</i>) salta solo si la comparación dio «igual»: aquí, si la condición dio 0, o sea, falsa.
          </p>
        </div>
        {JUMPS.map((j) => (
          <p key={j.at} className={during(step, j.at, j.at, 'lead')} style={{ ...abs(0, 210, 560), fontSize: 28 }}>{j.text}</p>
        ))}
        <div className={rv(step, 5)} style={abs(0, 210, 560)}>
          <div className="plate out" style={{ fontSize: 26, width: 160 }}>{'0\n2'}</div>
          <p className="note" style={{ fontSize: 24, marginTop: 14 }}>
            Al escribir un salto hacia adelante, el destino aún no existe: queda el hueco de la etapa 1 y se llena después.
          </p>
        </div>

        <div className="plate" style={{ ...abs(620, 0, 560), fontSize: 21, lineHeight: `${LH}px`, padding: '12px 18px' }}>
          {FLOW_ASM.map((l, i) => {
            const hl = current && (i === current.from || i === current.to)
            return (
              <div key={i} className={hl ? 'hl' : l.dim ? 'dim' : undefined} style={l.label ? { fontWeight: 600 } : undefined}>{l.text}</div>
            )
          })}
        </div>
        <svg width="276" height="470" viewBox="0 0 276 470" style={{ position: 'absolute', left: 1180, top: 0 }}>
          {JUMPS.map((j) => {
            const x = 30 + j.lane * 52
            const y1 = lineY(j.from), y2 = lineY(j.to)
            return (
              <g key={j.at} className={rv(step, j.at)}>
                <path className="track thin" style={{ stroke: step === j.at ? 'var(--gen)' : 'var(--ink)' }} d={`M4 ${y1} H${x - 14} q14 0 14 ${y2 > y1 ? 14 : -14} V${y2 + (y2 > y1 ? -14 : 14)} q0 ${y2 > y1 ? 14 : -14} -14 ${y2 > y1 ? 14 : -14} H22`} />
                <Arrow x={10} y={y2} dir="l" />
              </g>
            )
          })}
        </svg>
      </div>
    </>
  )
}

/* -------------------------------------- Etapa 4: marcos y enlace estático */

type Cell = { off: string; text: string }
const OUTER: Cell[] = [
  { off: '[rbp+24]', text: 'p = 40 (su parámetro)' },
  { off: '[rbp+16]', text: 'enlace estático' },
  { off: '[rbp+8]', text: 'a dónde volver' },
  { off: '[rbp]', text: 'rbp anterior (main)' },
]
const INNER: Cell[] = [
  { off: '[rbp+24]', text: 'r = 2 (su parámetro)' },
  { off: '[rbp+16]', text: 'enlace estático → outer' },
  { off: '[rbp+8]', text: 'a dónde volver' },
  { off: '[rbp]', text: 'rbp anterior (outer)' },
]
const CH = 50

function Frame({ y, title, cells, hot }: { y: number; title: string; cells: Cell[]; hot: number[] }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <text className="sl" x={150} y={-14}>{title}</text>
      {cells.map((c, i) => (
        <g key={i} className={hot.includes(i) ? 'hot' : undefined}>
          <text className="st sm" x={0} y={i * CH + 33}>{c.off}</text>
          <rect className="node" x={150} y={i * CH} width={420} height={CH} />
          <text className="st sm" x={168} y={i * CH + 33}>{c.text}</text>
        </g>
      ))}
    </g>
  )
}

/** Lo que se dice en cada paso, a la izquierda, debajo del código */
const FRAME_SAY: ReactNode[] = [
  <>inner usa <span className="mono">p</span>, pero <span className="mono">p</span> es de outer. ¿Cómo la encuentra?</>,
  <><span className="b">Marco:</span> el espacio que aparta una función en la pila cada vez que se llama: sus parámetros, sus variables y a dónde volver. <span className="mono">rbp</span> apunta a su marco.</>,
  <><span className="mono">[rbp+24]</span> = «24 bytes arriba de donde apunta rbp». inner tiene su propio marco y su propio rbp: desde ahí no ve <span className="mono">p</span>.</>,
  <><span className="b">Enlace estático:</span> una casilla que apunta al marco de la función que la contiene. inner está escrita dentro de outer, así que apunta al marco de outer.</>,
]

export function StageFunctions({ step }: { step: number }) {
  return (
    <>
      <h2>Etapa 4: funciones, marcos y enlace estático</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 640), fontSize: 24, lineHeight: '34px' }}>
          {'func int outer(int p) {\n    func int inner(int r) {\n'}
          <span className={step === 4 ? 'hl' : undefined}>{'        return p + r;'}</span>
          {'\n    }\n    return inner(2);\n}\nprint(outer(40));       // 42'}
        </div>
        {FRAME_SAY.map((text, i) => (
          <p key={i} className={during(step, i, i, 'lead')} style={{ ...abs(0, 300, 640), fontSize: 25 }}>{text}</p>
        ))}
        <div className={during(step, 4, 4)} style={abs(0, 300, 640)}>
          <div className="plate out" style={{ fontSize: 22, lineHeight: '32px', padding: '10px 18px' }}>
            {'mov rax, [rbp+0x10]  ; 1. sigue el enlace\nmov rax, [rax+0x18]  ; 2. ahí está p'}
          </div>
          <p className="note" style={{ fontSize: 23, marginTop: 10 }}>Primero llega al marco de outer y ahí, 24 bytes arriba (0x18 = 24), lee p.</p>
        </div>
        <div className={rv(step, 5)} style={abs(0, 300, 640)}>
          <p className="lead" style={{ fontSize: 24 }}>Si una función se llama a sí misma sin parar, la pila se llenaría. Un contador cuenta las llamadas en curso y a las 1000 se detiene:</p>
          <div className="plate out" style={{ fontSize: 21, lineHeight: '30px', padding: '10px 18px', marginTop: 12, whiteSpace: 'normal' }}>
            [Runtime error] line 3: maximum recursion depth (1000) exceeded in 'forever'
          </div>
        </div>

        <svg width="740" height="510" viewBox="0 0 740 510" style={{ position: 'absolute', left: 716, top: 0 }}>
          <g className={rv(step, 1)}><Frame y={34} title="marco de outer" cells={OUTER} hot={step === 4 ? [0] : []} /></g>
          <g className={rv(step, 2)}><Frame y={300} title="marco de inner" cells={INNER} hot={step >= 3 && step <= 4 ? [1] : []} /></g>
          <g className={rv(step, 3)}>
            <path className="track thin" style={{ stroke: 'var(--gen)' }} d={`M570 ${300 + CH * 1.5} H660 q20 0 20 -20 V${34 + CH * 3.5 + 20} q0 -20 -20 -20 H590`} />
            <Arrow x={584} y={34 + CH * 3.5} dir="l" />
          </g>
        </svg>
      </div>
    </>
  )
}

/* ------------------------------------------ Etapa 5: cadenas y reales */

/** El número impreso, con el último dígito resaltado */
const Digits = ({ text, mark }: { text: string; mark: 'ok' | 'bad' }) => (
  <span className="mono" style={{ fontSize: 30, fontWeight: 600 }}>
    {text.slice(0, -1)}
    <span style={{ background: mark === 'ok' ? 'var(--sem)' : 'var(--lex)', color: '#fff', padding: '0 4px' }}>{text.slice(-1)}</span>
  </span>
)

export function StageReals({ step }: { step: number }) {
  const row = (at: number, icon: ReactNode, label: string, value: ReactNode) => (
    <div className={rv(step, at)} style={{ display: 'grid', gridTemplateColumns: '44px 360px 1fr', alignItems: 'center', height: 50 }}>
      <svg width="30" height="30" viewBox="-15 -15 30 30">{icon}</svg>
      <span className="lead" style={{ fontSize: 25 }}>{label}</span>
      {value}
    </div>
  )
  return (
    <>
      <h2>Etapa 5: cadenas y números reales</h2>
      <div className="body">
        <div style={{ ...abs(0, 0, 1456), display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 40 }}>
          <div>
            <span className="chip">int 7</span>
            <div className="plate small" style={{ marginTop: 12, padding: '8px 14px' }}>rax = 7</div>
            <p className="note" style={{ fontSize: 22, marginTop: 6 }}>Un entero se guarda tal cual.</p>
          </div>
          <div>
            <span className="chip">float 2.5</span>
            <div className="plate small" style={{ marginTop: 12, padding: '8px 14px' }}>rax = 0x4004000000000000</div>
            <p className="note" style={{ fontSize: 22, marginTop: 6 }}>Un real se guarda codificado en 64 bits. Para calcular con reales el procesador usa otros registros (xmm0).</p>
          </div>
          <div className={rv(step, 1)}>
            <span className="chip">string "hola"</span>
            <svg width="420" height="60" viewBox="0 0 420 60" style={{ marginTop: 12 }}>
              {['h', 'o', 'l', 'a', '0'].map((c, i) => (
                <g key={i}>
                  <rect className={`node${c === '0' ? ' fill' : ''}`} x={i * 64} y={0} width={58} height={56} />
                  <text className={`st${c === '0' ? ' inv' : ''}`} x={i * 64 + 29} y={38} textAnchor="middle">{c}</text>
                </g>
              ))}
            </svg>
            <p className="note" style={{ fontSize: 22, marginTop: 2 }}>Letra tras letra y un 0 que marca el final. rax guarda dónde empieza.</p>
          </div>
        </div>

        <div className={rv(step, 2)} style={abs(0, 214, 1456)}>
          <div className="rule" style={{ marginBottom: 16 }} />
          <p className="lead" style={{ fontSize: 27 }}>
            El reto: sin printf, escribimos nuestra propia rutina para pasar un real a texto. Debía mostrar los mismos 15 dígitos de antes.
          </p>
        </div>
        <div style={abs(0, 316, 1456)}>
          {row(2, <circle r={7} fill="var(--ink)" />, 'print(-447 / 7.0) con printf', <Digits text="-63.8571428571429" mark="ok" />)}
          {row(3, <Cross x={0} y={0} s={0.9} />, 'nuestra primera versión', <Digits text="-63.8571428571428" mark="bad" />)}
          {row(4, <Check x={0} y={0} />, 'con doble precisión', <Digits text="-63.8571428571429" mark="ok" />)}
        </div>
        <p className={during(step, 3, 3, 'note')} style={{ ...abs(0, 476, 1456), fontSize: 23 }}>
          Al hacer la cuenta se perdía un pedacito del número, y el último dígito se redondeaba hacia abajo en vez de hacia arriba.
        </p>
        <p className={rv(step, 4, 'note')} style={{ ...abs(0, 476, 1456), fontSize: 23 }}>
          Solución: hacer esa cuenta con el doble de precisión, para no perder nada. Probada contra printf con más de 200 000 números.
        </p>
      </div>
    </>
  )
}

/* -------------------------------------------- Etapa 6: excepciones */

const HANDLER = [
  ['rsp', 'dónde estaba el tope de la pila'],
  ['rbp', 'qué función estaba corriendo'],
  ['catch', 'a dónde saltar si hay un error'],
  ['depth', 'cuántas llamadas había en curso'],
]

export function StageExceptions({ step }: { step: number }) {
  const lines = ['func int divide(int a, int b) {', '    return a / b;', '}', 'try {', '    print(divide(10, 0));', '} catch (e) {', '    print("caught:", e);', '}']
  const hl = (i: number) => (i === 3 && step === 1) || (i === 1 && step === 2) || (i === 6 && step === 3)
  return (
    <>
      <h2>Etapa 6: excepciones (try y catch)</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 600), fontSize: 24, lineHeight: '36px' }}>
          {lines.map((l, i) => <div key={i} className={hl(i) ? 'hl' : undefined}>{l}</div>)}
        </div>
        <div className={rv(step, 4)} style={abs(0, 344, 600)}>
          <p className="lead" style={{ fontSize: 26 }}>Sin un try activo, el programa se detiene:</p>
          <div className="plate out" style={{ fontSize: 22, marginTop: 10, padding: '10px 18px' }}>[Runtime error] line 2: division by zero</div>
        </div>

        {/* Paso 0: qué hacían setjmp y longjmp */}
        <div className={during(step, 0, 0)} style={abs(660, 0, 796)}>
          <p className="lead" style={{ fontSize: 27 }}>
            En el primer enfoque, try y catch usaban dos funciones de la biblioteca de C:
          </p>
          {([['setjmp', 'guarda el punto donde estamos, como un separador en un libro'], ['longjmp', 'vuelve de golpe a ese punto, desde donde sea']] as const).map(([fn, what]) => (
            <div key={fn} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'baseline', borderTop: '4px solid var(--ink)', padding: '12px 0', marginTop: 12 }}>
              <span className="mono" style={{ fontSize: 26, fontWeight: 600 }}>{fn}</span>
              <span className="lead" style={{ fontSize: 26 }}>{what}</span>
            </div>
          ))}
          <p className="lead" style={{ fontSize: 27, marginTop: 18 }}>Sin la biblioteca de C, tuvimos que hacer lo mismo nosotros.</p>
        </div>

        <div style={abs(660, 0, 796)}>
          <p className={rv(step, 1)} style={{ font: '800 26px var(--sans)', marginBottom: 10 }}>Al entrar al try se guarda una nota con 4 datos:</p>
          {HANDLER.map(([name, text], i) => (
            <div key={name} className={rv(step, 1)} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', height: 48, borderTop: '4px solid var(--ink)', borderBottom: i === 3 ? '4px solid var(--ink)' : undefined, transitionDelay: `${i * 0.1}s` }}>
              <span className="mono" style={{ fontSize: 24, fontWeight: 600 }}>{name}</span>
              <span className="note" style={{ fontSize: 24, color: 'var(--ink)' }}>{text}</span>
            </div>
          ))}
          <div className={rv(step, 2)} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
            <span className="chip">a / b con b = 0</span>
            <svg width="50" height="30"><path className="guide" d="M4 15 H38" /><Arrow x={42} y={15} /></svg>
            <span className="chip t">raise: «division by zero»</span>
          </div>
          <div className={rv(step, 3)} style={{ marginTop: 16 }}>
            <p className="lead" style={{ fontSize: 24 }}>
              raise lee la nota: deja rsp y rbp como estaban al entrar al try (olvida las funciones que quedaron a medias) y salta al catch con el mensaje.
            </p>
            <div className="plate out" style={{ fontSize: 22, marginTop: 10, padding: '8px 18px' }}>caught: division by zero (line 2)</div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------ Etapa 7: vectores y matrices */

function Block({ y, cells, hot }: { y: number; cells: string[]; hot?: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      {cells.map((c, i) => (
        <g key={i} className={hot === i ? 'hot' : undefined}>
          <text className="st sm" x={i * 176} y={0} style={{ fill: 'var(--ink-soft)' }}>byte {i * 8}</text>
          <rect className={`node${i < 2 ? ' fill' : ''}`} x={i * 176} y={14} width={166} height={72} />
          <text className={`st${i < 2 ? ' inv' : ''}`} x={i * 176 + 18} y={60}>{c}</text>
        </g>
      ))}
    </g>
  )
}

const ROUTINES: [string, string][] = [
  ['arr_arr', 'v + w'], ['arr_scalar', 'v * 2'], ['reduce', 'sum, max…'], ['arr_eq', 'v == w'], ['print_arr', 'print(m)'],
]

export function StageArrays({ step }: { step: number }) {
  return (
    <>
      <h2>Etapa 7: vectores y matrices en memoria</h2>
      <div className="body">
        <div className={during(step, 0, 1)} style={abs(0, 0, 1456)}>
          <div className="plate" style={{ width: 760, fontSize: 26 }}>matrix&lt;int&gt; m = [[1, 2, 3], [4, 5, 6]];</div>
          <svg width="1456" height="110" viewBox="0 0 1456 110" style={{ marginTop: 34 }}>
            <Block y={20} cells={['filas = 2', 'cols = 3', '1', '2', '3', '4', '5', '6']} hot={step === 1 ? 7 : undefined} />
          </svg>
          <p className="lead" style={{ fontSize: 24, marginTop: 10 }}>
            La matriz se guarda como una sola fila de casillas de 8 bytes: primero cuántas filas y columnas tiene, y después los números, fila por fila.
          </p>
          <div className={rv(step, 1)} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', columnGap: 24, alignItems: 'center', marginTop: 20 }}>
            <div className="plate" style={{ fontSize: 26 }}>m[1][2]</div>
            <div className="plate out" style={{ fontSize: 22, lineHeight: '32px', padding: '10px 18px' }}>
              {'saltar las 2 casillas del inicio, 1 fila de 3 y 2 más\n= casilla 2 + 3 + 2 = 7  →  byte 7 · 8 = 56  →  el 6'}
            </div>
          </div>
        </div>

        <div className={during(step, 2, 3)} style={abs(0, 0, 1456)}>
          <div className="plate" style={{ width: 600, fontSize: 26 }}>vector&lt;int&gt; v = [10, 20, 30];</div>
          <svg width="1456" height="110" viewBox="0 0 1456 110" style={{ marginTop: 34 }}>
            <Block y={20} cells={['n = 3', 'cols = -1', '10', '20', '30']} />
          </svg>
          <p className="lead" style={{ fontSize: 24, marginTop: 10 }}>Un vector usa el mismo bloque; cols = -1 indica que no es una matriz.</p>
          <div className={rv(step, 3)} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', columnGap: 24, alignItems: 'center', marginTop: 26 }}>
            <div className="plate" style={{ fontSize: 26 }}>v[3]</div>
            <div className="plate out" style={{ fontSize: 24 }}>index 3 out of range for vector&lt;int&gt; of length 3</div>
          </div>
          <p className={rv(step, 3, 'note')} style={{ fontSize: 23, marginTop: 12 }}>Antes de leer, se revisa que el índice esté entre 0 y n − 1.</p>
        </div>

        <div className={rv(step, 4)} style={abs(0, 0, 1456)}>
          <p className="lead" style={{ fontSize: 30, marginBottom: 22 }}>runtime_arrays.c: una rutina en código máquina por operación</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', columnGap: 20 }}>
            {ROUTINES.map(([r, ex]) => (
              <div key={r}>
                <span className="tag" style={{ background: 'var(--gen)', color: 'var(--ink)' }}>{r}</span>
                <p className="mono" style={{ fontSize: 24, marginTop: 12 }}>{ex}</p>
              </div>
            ))}
          </div>
          <p className="lead" style={{ fontSize: 27, marginTop: 40 }}>
            Asignar, pasar o retornar un arreglo lo copia con arr_copy: cada variable tiene su propia copia, igual que antes.
          </p>
          <p className="note" style={{ fontSize: 25, marginTop: 14 }}>Los mensajes de error dicen lo mismo que en el primer enfoque, letra por letra.</p>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------------------- Resultados */

const COMPARE: [string, ReactNode, ReactNode][] = [
  ['Programas externos al compilar', 'gcc: cc1, as y ld', 'ninguno'],
  ['Biblioteca dentro del programa', 'libc, enlazada al ejecutar', 'ninguna: write, mmap y exit'],
  ['Ejecutable de demo.vx', '22 248 bytes, dinámico', '14 137 bytes, estático'],
  ['Las 33 pruebas originales', '33 de 33', '33 de 33, misma salida byte a byte'],
]

export function NativeResults({ step }: { step: number }) {
  return (
    <>
      <h2>Resultado: el mismo Vortex, sin GCC</h2>
      <div className="body">
        <div style={{ display: 'grid', gridTemplateColumns: '470px 430px 1fr', columnGap: 28, marginBottom: 8 }}>
          <span />
          <span className="lead" style={{ fontSize: 26 }}>Primer enfoque</span>
          <span className="lead" style={{ fontSize: 26 }}>Backend propio</span>
        </div>
        <div className="rule" />
        {COMPARE.map(([what, before, now], i) => (
          <div key={what} className={rv(step, i === 0 ? 0 : 1)} style={{ display: 'grid', gridTemplateColumns: '470px 430px 1fr', columnGap: 28, alignItems: 'center', height: 64, borderBottom: '2px solid color-mix(in srgb, var(--ink) 25%, transparent)' }}>
            <span className="lead" style={{ fontSize: 26 }}>{what}</span>
            <span className="note" style={{ fontSize: 25 }}>{before}</span>
            <span className="lead" style={{ fontSize: 26 }}>{now}</span>
          </div>
        ))}
      </div>
    </>
  )
}
