/* Escenas del backend propio: el cambio de enfoque y las siete etapas.
   Todo el código, el ensamblador, las direcciones y los mensajes salen de
   ejecutar vortexc (rama main de vortex_compiler) y desensamblar con objdump. */
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
        <div className={rv(step, 1, 'plate out')} style={{ ...abs(0, 308, 1456), fontSize: 26, whiteSpace: 'normal', padding: '14px 24px' }}>
          El docente: sin GCC, sin as y sin ld. vortexc produce el ejecutable.
        </div>

        {/* Las siete etapas, cada una en su rama de git */}
        <div className={rv(step, 3)} style={abs(0, 386, 1456)}>
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

/* ------------------------------------------------- Etapa 1: los bytes */

/** Un byte en una caja grande; `pending` lo marca como campo aún sin completar. */
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

const DEC_PARTS: [string, string, string][] = [
  ['48', '0100 1000', 'REX: W = 1, operandos de 64 bits'],
  ['FF', '1111 1111', 'opcode del grupo inc / dec'],
  ['CB', '11 001 011', 'mod 11 registro · reg 001 dec · rm 011 rbx'],
]

export function StageBytes({ step }: { step: number }) {
  const patched = step >= 3
  return (
    <>
      <h2>Etapa 1: de una instrucción a sus bytes</h2>
      <div className="body">
        {/* Izquierda: dec rbx */}
        <div className="plate" style={{ ...abs(0, 0, 300), fontSize: 30 }}>dec rbx</div>
        <svg width="680" height="140" viewBox="0 0 680 140" style={{ position: 'absolute', left: 0, top: 96 }}>
          <ByteRow x={0} y={0} bytes={['48', 'FF', 'CB']} labels={['REX', 'opcode', 'ModR/M']} />
        </svg>
        <div className={rv(step, 1)} style={abs(0, 250, 690)}>
          {DEC_PARTS.map(([b, bits, text]) => (
            <div key={b} style={{ display: 'grid', gridTemplateColumns: '58px 190px 1fr', alignItems: 'baseline', marginBottom: 12 }}>
              <span className="mono" style={{ fontSize: 26, fontWeight: 600 }}>{b}</span>
              <span className="mono" style={{ fontSize: 24 }}>{bits}</span>
              <span className="note" style={{ fontSize: 24, color: 'var(--ink)' }}>{text}</span>
            </div>
          ))}
          <p className="note" style={{ fontSize: 24, marginTop: 8 }}>
            x86enc.c arma estos bytes campo por campo, sin as ni nasm.
          </p>
        </div>

        {/* Derecha: un salto hacia una etiqueta */}
        <div className={rv(step, 2)} style={abs(760, 0, 696)}>
          <div className="plate" style={{ fontSize: 24, lineHeight: '36px' }}>
            {'ciclo:            ; en 0xB5\n    …\n    jne ciclo      ; en 0xC7'}
          </div>
          <svg width="696" height="140" viewBox="0 0 696 140" style={{ marginTop: 22 }}>
            <ByteRow
              x={0} y={0}
              bytes={['0F', '85', ...(patched ? ['E8', 'FF', 'FF', 'FF'] : ['00', '00', '00', '00'])]}
              labels={['jne', '', patched ? '' : 'pendiente', '', '', '']}
              pending={patched ? [] : [2, 3, 4, 5]}
            />
          </svg>
        </div>
        <div className={rv(step, 3)} style={abs(760, 318, 696)}>
          <div className="plate out" style={{ fontSize: 24, lineHeight: '34px', padding: '10px 18px' }}>
            {'rel32 = destino − (campo + 4)\n      = 0xB5 − (0xC9 + 4) = −24'}
          </div>
          <p className="note" style={{ fontSize: 24, marginTop: 10 }}>Relleno posterior: el salto se completa cuando la etiqueta ya tiene posición.</p>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------- Etapa 1: el ELF */

const FILE_PARTS = [
  { x: 0, w: 150, name: 'cabecera', size: '64 B', off: '0' },
  { x: 160, w: 210, name: '3 cabeceras', size: 'de programa', off: '64' },
  { x: 380, w: 420, name: 'código', size: '7 875 bytes', off: '232' },
  { x: 810, w: 150, name: 'relleno', size: '', off: '', dim: true },
  { x: 970, w: 300, name: 'datos', size: '5 945 bytes', off: '8192' },
]

const MEMORY = [
  { x: 380, w: 420, addr: '0x400000', perm: 'lectura y ejecución', from: 590 },
  { x: 970, w: 300, addr: '0x10000000', perm: 'lectura y escritura', from: 1120 },
  { x: 1280, w: 176, addr: '0x20000000', perm: 'bss', from: 0 },
]

export function StageElf({ step }: { step: number }) {
  return (
    <>
      <h2>Etapa 1: elf.c escribe el archivo ejecutable</h2>
      <div className="body">
        <p style={{ ...abs(0, 0), font: '800 26px var(--sans)' }}>
          demo&nbsp;<span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>· 14 137 bytes en el archivo</span>
        </p>
        <svg width="1456" height="330" viewBox="0 0 1456 330" style={{ position: 'absolute', left: 0, top: 44 }}>
          {FILE_PARTS.map((p) => (
            <g key={p.name} style={p.dim ? { opacity: 0.4 } : undefined}>
              <rect className="node" x={p.x} y={0} width={p.w} height={100} />
              <text className="sl" x={p.x + 16} y={42}>{p.name}</text>
              <text className="sl sm soft" x={p.x + 16} y={78}>{p.size}</text>
              {p.off && <text className="st sm" x={p.x} y={134}>{p.off}</text>}
            </g>
          ))}
          <g className={rv(step, 1)}>
            {MEMORY.map((m) => (
              <g key={m.addr}>
                {m.from
                  ? <><path className="track thin" style={{ stroke: 'var(--gen)' }} d={`M${m.from} 104 V196`} /><Arrow x={m.from} y={208} dir="d" /></>
                  : <path className="guide" strokeDasharray="8 8" d={`M${m.x + m.w / 2} 176 V210`} />}
                <rect className="node fill" x={m.x} y={214} width={m.w} height={100} />
                <text className="st inv" x={m.x + 16} y={256}>{m.addr}</text>
                <text className="sl sm inv" x={m.x + 16} y={294}>{m.perm}</text>
              </g>
            ))}
            <text className="sl sm" x={1456} y={160} textAnchor="end">0 bytes en el archivo</text>
            <text className="sl sm" x={0} y={256}>en memoria</text>
            <text className="sl sm soft" x={0} y={290}>entrada: 0x4000E8</text>
          </g>
        </svg>
        <div className={rv(step, 2)} style={{ ...abs(0, 380, 1456), display: 'grid', gridTemplateColumns: '1fr 430px', columnGap: 32, alignItems: 'center' }}>
          <div className="plate out" style={{ fontSize: 22, lineHeight: '30px', padding: '10px 18px' }}>
            {'$ file demo\ndemo: ELF 64-bit LSB executable, x86-64, statically linked\n$ ldd demo:  not a dynamic executable'}
          </div>
          <p className="lead" style={{ fontSize: 27 }}>Solo pide al núcleo tres cosas: write, mmap y exit.</p>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------ Etapa 2: la máquina de pila */

/** Código real de print(a + b * 3) con a en [rbp-8] y b en [rbp-16]. Cada línea dice en qué paso se ejecuta. */
const STACK_ASM: [string, number][] = [
  ['mov  rax, [rbp-0x8]    ; a', 1], ['push rax', 1],
  ['mov  rax, [rbp-0x10]   ; b', 2], ['push rax', 2],
  ['mov  eax, 3', 3],
  ['mov  rcx, rax', 4], ['pop  rax', 4], ['imul rax, rcx          ; b * 3', 4],
  ['mov  rcx, rax', 5], ['pop  rax', 5], ['add  rax, rcx          ; a + …', 5],
  ['push rax', 6], ['mov  rax, [rsp]', 6], ['call print_int', 6],
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

export function StageStack({ step }: { step: number }) {
  const m = MACHINE[Math.min(step, 6)]
  const hot = [0, 1, 2, 3, 4, 5, 0][Math.min(step, 6)]   // nodo del árbol que se está generando
  return (
    <>
      <h2>Etapa 2: la máquina de pila</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 500), fontSize: 26, lineHeight: '38px' }}>
          {'int a = 7;\nint b = 2;\n'}<span className="hl">print(a + b * 3);</span>
        </div>
        <svg width="500" height="330" viewBox="0 0 500 330" style={{ position: 'absolute', left: 0, top: 176 }}>
          <path className="guide" d="M250 68 L110 142 M250 68 L380 142 M380 198 L300 272 M380 198 L460 272" />
          <TreeNode x={250} y={40} w={90} label="+" fill hot={hot === 5} />
          <TreeNode x={110} y={170} w={90} label="a" hot={hot === 1} />
          <TreeNode x={380} y={170} w={90} label="*" fill hot={hot === 4} />
          <TreeNode x={300} y={300} w={90} label="b" hot={hot === 2} />
          <TreeNode x={460} y={300} w={90} label="3" hot={hot === 3} />
        </svg>

        <div className="plate" style={{ ...abs(560, 0, 560), fontSize: 22, lineHeight: '30px', padding: '12px 18px' }}>
          {STACK_ASM.map(([line, at], i) => (
            <div key={i} className={step === at ? 'hl' : step > 0 && at > step ? 'dim' : undefined}>{line}</div>
          ))}
        </div>

        <div style={abs(1170, 0, 286)}>
          <p className="sl" style={{ font: '800 26px var(--sans)' }}>rax</p>
          <div className="plate" style={{ fontSize: 34, padding: '8px 18px', marginTop: 8, height: 64 }}>{m.rax || ' '}</div>
          <p style={{ font: '800 26px var(--sans)', marginTop: 24 }}>pila</p>
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 8, marginTop: 8, height: 140, justifyContent: 'flex-start' }}>
            {m.stack.map((v, i) => (
              <div key={i} className="plate out" style={{ fontSize: 30, padding: '6px 18px' }}>{v}</div>
            ))}
          </div>
          <p className={rv(step, 6, 'note')} style={{ fontSize: 23, marginTop: 14 }}>
            print_int divide entre 10: los restos 3 y 1 son los dígitos, de derecha a izquierda.
          </p>
        </div>
        <p className={only0(step, 'note')} style={{ ...abs(1170, 360, 286), fontSize: 24 }}>
          Cada expresión deja su valor en rax; los intermedios esperan en la pila.
        </p>
      </div>
    </>
  )
}

function only0(step: number, extra: string) {
  return `rv${step === 0 ? ' on' : ''} ${extra}`
}

/* ------------------------------------- Etapa 3: etiquetas y saltos */

const LH = 34
const FLOW_ASM: { text: string; label?: boolean; dim?: boolean }[] = [
  { text: '    mov  [rbp-0x8], 0     ; i = 0' },
  { text: 'ciclo:', label: true },
  { text: '    (i < 3: cmp, setl, test)', dim: true },
  { text: '    je   fin' },
  { text: '    (i == 1: cmp, sete, test)', dim: true },
  { text: '    je   sigue' },
  { text: '    jmp  paso              ; continue' },
  { text: 'sigue:', label: true },
  { text: '    call print_int         ; print(i)' },
  { text: 'paso:', label: true },
  { text: '    (i = i + 1)', dim: true },
  { text: '    jmp  ciclo' },
  { text: 'fin:', label: true },
]
const JUMPS = [
  { from: 3, to: 12, lane: 3, at: 1, text: 'Condición falsa: je salta al final del ciclo.' },
  { from: 5, to: 7, lane: 1, at: 2, text: 'if falso: je salta por encima de su bloque.' },
  { from: 6, to: 9, lane: 2, at: 3, text: 'continue en un for va al paso, no a la condición: si no, i nunca avanzaría.' },
  { from: 11, to: 1, lane: 4, at: 4, text: 'Al final de cada vuelta, un salto hacia atrás.' },
]
const lineY = (i: number) => 12 + LH / 2 + i * LH

export function StageFlow({ step }: { step: number }) {
  const current = JUMPS.find((j) => j.at === step)
  return (
    <>
      <h2>Etapa 3: control de flujo con etiquetas y saltos</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 560), fontSize: 24, lineHeight: '38px' }}>
          {'for (int i = 0; i < 3; i = i + 1) {\n    if (i == 1) { continue; }\n    print(i);\n}'}
        </div>
        <p className={only0(step, 'lead')} style={{ ...abs(0, 210, 560), fontSize: 28 }}>
          if, while, for y switch se traducen a comparaciones y saltos hacia etiquetas.
        </p>
        {JUMPS.map((j) => (
          <p key={j.at} className={during(step, j.at, j.at, 'lead')} style={{ ...abs(0, 210, 560), fontSize: 28 }}>{j.text}</p>
        ))}
        <div className={rv(step, 5)} style={abs(0, 210, 560)}>
          <div className="plate out" style={{ fontSize: 26, width: 160 }}>{'0\n2'}</div>
          <p className="note" style={{ fontSize: 24, marginTop: 14 }}>
            Las etiquetas existen antes que su posición: el relleno posterior de la etapa 1 completa cada salto.
          </p>
        </div>

        <div className="plate" style={{ ...abs(620, 0, 560), fontSize: 22, lineHeight: `${LH}px`, padding: '12px 18px' }}>
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
  { off: '[rbp+24]', text: 'p = 40' },
  { off: '[rbp+16]', text: 'enlace: marco de main' },
  { off: '[rbp+8]', text: 'dirección de retorno' },
  { off: '[rbp]', text: 'rbp de main' },
]
const INNER: Cell[] = [
  { off: '[rbp+24]', text: 'r = 2' },
  { off: '[rbp+16]', text: 'enlace: marco de outer' },
  { off: '[rbp+8]', text: 'dirección de retorno' },
  { off: '[rbp]', text: 'rbp de outer' },
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

export function StageFunctions({ step }: { step: number }) {
  return (
    <>
      <h2>Etapa 4: marcos de pila y enlace estático</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 640), fontSize: 24, lineHeight: '34px' }}>
          {'func int outer(int p) {\n    func int inner(int r) {\n'}
          <span className={step === 4 ? 'hl' : undefined}>{'        return p + r;'}</span>
          {'\n    }\n    return inner(2);\n}\nprint(outer(40));       // 42'}
        </div>
        <div className={during(step, 4, 4)} style={abs(0, 300, 640)}>
          <div className="plate out" style={{ fontSize: 22, lineHeight: '32px', padding: '10px 18px' }}>
            {'inner:\n    mov rax, [rbp+0x10]   ; marco de outer\n    mov rax, [rax+0x18]   ; p'}
          </div>
          <p className="note" style={{ fontSize: 24, marginTop: 10 }}>Antes lo resolvía la extensión de GCC para funciones anidadas.</p>
        </div>
        <div className={during(step, 0, 0)} style={abs(0, 300, 640)}>
          <p className="lead" style={{ fontSize: 28 }}>inner usa p, que vive en el marco de outer. ¿Cómo la encuentra?</p>
        </div>
        <div className={rv(step, 5)} style={abs(0, 300, 640)}>
          <p className="lead" style={{ fontSize: 26 }}>Un contador en la bss cuenta las llamadas en curso:</p>
          <div className="plate out" style={{ fontSize: 22, lineHeight: '32px', padding: '10px 18px', marginTop: 12, whiteSpace: 'normal' }}>
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

export function StageReals({ step }: { step: number }) {
  const nx = (v: number) => 420 + (v - 0.375) * (370 / 0.125)   // posición en la recta de …428.375 a …428.625
  return (
    <>
      <h2>Etapa 5: cadenas, reales y el doble redondeo</h2>
      <div className="body">
        <div style={{ ...abs(0, 0, 1456), display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 40 }}>
          <div>
            <span className="chip">int 7</span>
            <div className="plate small" style={{ marginTop: 12, padding: '8px 14px' }}>rax = 0x0000000000000007</div>
          </div>
          <div>
            <span className="chip">float 2.5</span>
            <div className="plate small" style={{ marginTop: 12, padding: '8px 14px' }}>rax = 0x4004000000000000</div>
            <p className="note" style={{ fontSize: 22, marginTop: 6 }}>sus bits IEEE 754; se opera en xmm0</p>
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
            <p className="note" style={{ fontSize: 22, marginTop: 2 }}>rax = la dirección; las nuevas, en un heap pedido con mmap</p>
          </div>
        </div>

        <div className={rv(step, 2)} style={abs(0, 196, 1456)}>
          <div className="rule" style={{ marginBottom: 16 }} />
          <p className="lead" style={{ fontSize: 28 }}>
            print(-447 / 7.0): <span className="mono" style={{ fontSize: 26 }}>printf("%.15g")</span> escribe <span className="mono" style={{ fontSize: 26 }}>-63.8571428571429</span>. Para los 15 dígitos se calcula x · 10<sup>13</sup>:
          </p>
          <svg width="1456" height="124" viewBox="0 0 1456 124" style={{ marginTop: 6 }}>
            <path className="guide" d="M330 70 H1250" />
            {[0.375, 0.5, 0.625].map((v) => (
              <g key={v}>
                <path className="guide" d={`M${nx(v)} 56 V84`} />
                <text className="st sm" x={nx(v)} y={116} textAnchor="middle">…428.{String(v).slice(2)}</text>
              </g>
            ))}
            <text className="sl sm soft" x={0} y={62}>un double ahí</text>
            <text className="sl sm soft" x={0} y={92}>avanza de a 0.125</text>
            <g className={rv(step, 3)}>
              <circle cx={nx(0.54098)} cy={70} r={12} fill="var(--gen)" stroke="var(--ink)" strokeWidth={4} />
              <text className="sl sm" x={nx(0.54098)} y={30} textAnchor="start">valor exacto …428.541</text>
              <circle cx={nx(0.5)} cy={70} r={12} fill="var(--ink)" />
              <text className="sl sm" x={nx(0.5) - 16} y={30} textAnchor="end">el double: …428.5, un empate</text>
            </g>
          </svg>
        </div>
        <div className={rv(step, 3)} style={{ ...abs(0, 388, 1456), display: 'flex', gap: 14, alignItems: 'center' }}>
          <svg width="30" height="30" viewBox="-15 -15 30 30"><Cross x={0} y={0} s={0.9} /></svg>
          <p className="lead" style={{ fontSize: 25 }}>cvtsd2si redondea el empate al par: …428, un dígito distinto de printf.</p>
        </div>
        <div className={rv(step, 4)} style={{ ...abs(0, 428, 1456), display: 'flex', gap: 14, alignItems: 'center' }}>
          <svg width="30" height="30" viewBox="-15 -15 30 30"><Check x={0} y={0} /></svg>
          <p className="lead" style={{ fontSize: 25 }}>double-double y TwoProduct recuperan el +0.041 que se perdió: …429, igual que printf.</p>
        </div>
        <p className={rv(step, 4, 'note')} style={{ ...abs(44, 470, 1412), fontSize: 23 }}>
          Validado contra printf con 219 870 valores: una sola diferencia, en un número subnormal.
        </p>
      </div>
    </>
  )
}

/* -------------------------------------------- Etapa 6: excepciones */

const HANDLER = [
  ['+0', 'rsp', 'la pila al entrar al try'],
  ['+8', 'rbp', 'el marco que contiene el try'],
  ['+16', 'catch', 'su dirección, con lea'],
  ['+24', 'depth', 'llamadas en curso'],
]

export function StageExceptions({ step }: { step: number }) {
  const lines = ['func int divide(int a, int b) {', '    return a / b;', '}', 'try {', '    print(divide(10, 0));', '} catch (e) {', '    print("caught:", e);', '}']
  const hl = (i: number) => (i === 3 && step === 1) || (i === 1 && step === 2) || (i === 6 && step === 3)
  return (
    <>
      <h2>Etapa 6: excepciones sin setjmp ni longjmp</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 600), fontSize: 24, lineHeight: '36px' }}>
          {lines.map((l, i) => <div key={i} className={hl(i) ? 'hl' : undefined}>{l}</div>)}
        </div>
        <div className={rv(step, 4)} style={abs(0, 344, 600)}>
          <p className="lead" style={{ fontSize: 26 }}>Sin un try activo:</p>
          <div className="plate out" style={{ fontSize: 22, marginTop: 10, padding: '10px 18px' }}>[Runtime error] line 2: division by zero</div>
        </div>

        <div style={abs(660, 0, 796)}>
          <p className={rv(step, 1)} style={{ font: '800 26px var(--sans)', marginBottom: 10 }}>try registra un manejador</p>
          {HANDLER.map(([off, name, text], i) => (
            <div key={name} className={rv(step, 1)} style={{ display: 'grid', gridTemplateColumns: '70px 120px 1fr', alignItems: 'center', height: 50, borderTop: '4px solid var(--ink)', borderBottom: i === 3 ? '4px solid var(--ink)' : undefined, transitionDelay: `${i * 0.1}s` }}>
              <span className="mono" style={{ fontSize: 22, color: 'var(--ink-soft)' }}>{off}</span>
              <span className="mono" style={{ fontSize: 24, fontWeight: 600 }}>{name}</span>
              <span className="note" style={{ fontSize: 24, color: 'var(--ink)' }}>{text}</span>
            </div>
          ))}
          <div className={rv(step, 2)} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 22 }}>
            <span className="chip">a / b con b = 0</span>
            <svg width="50" height="30"><path className="guide" d="M4 15 H38" /><Arrow x={42} y={15} /></svg>
            <span className="chip t">raise: "division by zero", línea 2</span>
          </div>
          <div className={rv(step, 3)} style={{ marginTop: 18 }}>
            <p className="lead" style={{ fontSize: 26 }}>raise restaura rsp y rbp y salta al catch con el texto en rax:</p>
            <div className="plate out" style={{ fontSize: 24, marginTop: 10 }}>caught: division by zero (line 2)</div>
          </div>
          <p className={rv(step, 4, 'note')} style={{ fontSize: 24, marginTop: 16 }}>
            break, continue y return dentro de un try retiran sus manejadores.
          </p>
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
          <text className="st sm" x={i * 176} y={0} style={{ fill: 'var(--ink-soft)' }}>+{i * 8}</text>
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
            <Block y={20} cells={['n = 2', 'cols = 3', '1', '2', '3', '4', '5', '6']} hot={step === 1 ? 7 : undefined} />
          </svg>
          <p className="note" style={{ fontSize: 24, marginTop: 10 }}>Un bloque del heap: n, columnas y las filas una tras otra, 8 bytes por elemento.</p>
          <div className={rv(step, 1)} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', columnGap: 24, alignItems: 'center', marginTop: 26 }}>
            <div className="plate" style={{ fontSize: 26 }}>m[1][2]</div>
            <div className="plate out" style={{ fontSize: 26 }}>16 + (1 · 3 + 2) · 8 = +56</div>
          </div>
        </div>

        <div className={during(step, 2, 3)} style={abs(0, 0, 1456)}>
          <div className="plate" style={{ width: 600, fontSize: 26 }}>vector&lt;int&gt; v = [10, 20, 30];</div>
          <svg width="1456" height="110" viewBox="0 0 1456 110" style={{ marginTop: 34 }}>
            <Block y={20} cells={['n = 3', 'cols = -1', '10', '20', '30']} />
          </svg>
          <p className="note" style={{ fontSize: 24, marginTop: 10 }}>Un vector es el mismo bloque con cols = -1.</p>
          <div className={rv(step, 3)} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', columnGap: 24, alignItems: 'center', marginTop: 26 }}>
            <div className="plate" style={{ fontSize: 26 }}>v[3]</div>
            <div className="plate out" style={{ fontSize: 24 }}>index 3 out of range for vector&lt;int&gt; of length 3</div>
          </div>
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
            Asignar, pasar o retornar un arreglo lo copia con arr_copy: se guardan por valor, igual que antes.
          </p>
          <p className="note" style={{ fontSize: 25, marginTop: 14 }}>Los mensajes de error se arman al ejecutar y dicen lo mismo, letra por letra.</p>
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
        <p className={rv(step, 2, 'lead')} style={{ marginTop: 28, fontSize: 28 }}>
          49 pruebas: 40 programas Vortex y 9 del backend. El analizador del punto 4, 30 de 30.
        </p>
        <p className={rv(step, 3, 'note')} style={{ marginTop: 14, fontSize: 25 }}>
          Decisión: los operandos se evalúan siempre de izquierda a derecha. Con GCC el orden dependía de cómo se traducía cada operación.
        </p>
      </div>
    </>
  )
}
