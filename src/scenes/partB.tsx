import type { CSSProperties, ReactNode } from 'react'
import { rv } from '../deck'
import type { SceneDef } from '../deck'
import { Arrow, Check, Cross, NonT, Term, TreeNode } from '../ui'
import { Change, NativeResults, Stages } from './native'
import { FileAst, FileElf, FileEnc, FileGen, FileMain, FileRuntime, FileRuntimeArrays, FileSemantic, Handoff } from './files'

const abs = (left: number, top: number, width?: number): CSSProperties => ({ position: 'absolute', left, top, width })

/* ------------------------------------------- B1: qué es un compilador */

function Compiler({ step }: { step: number }) {
  return (
    <>
      <h2>El punto extra: que Vortex se ejecute</h2>
      <div className="body">
        <svg width="1456" height="200" viewBox="0 0 1456 200">
          <rect className="node" x={0} y={30} width={330} height={120} />
          <text className="st big" x={165} y={102} textAnchor="middle">programa.vx</text>
          <path className="track" d="M342 90 H520" /><Arrow x={534} y={90} />
          <rect className="node fill" x={548} y={10} width={360} height={160} />
          <text className="st inv" x={728} y={84} textAnchor="middle" style={{ fontSize: 46 }}>vortexc</text>
          <text className="sl sm inv" x={728} y={130} textAnchor="middle">el compilador</text>
          <path className="track" d="M920 90 H1098" /><Arrow x={1112} y={90} />
          <rect className="node" x={1126} y={30} width={330} height={120} />
          <text className="st big" x={1291} y={102} textAnchor="middle">ejecutable</text>
        </svg>
        <div className={rv(step, 1)} style={{ ...abs(0, 204, 1456), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 48 }}>
          <p className="lead" style={{ fontSize: 30 }}><span className="b">Analizador (punto 4):</span> responde si el programa es válido.</p>
          <p className="lead" style={{ fontSize: 30 }}><span className="b">Compilador (punto extra):</span> traduce el programa a otro que la máquina puede correr.</p>
        </div>
        <div className={rv(step, 2, 'plate out')} style={{ ...abs(0, 316, 1456), fontSize: 24, lineHeight: '36px', padding: '16px 24px' }}>
          {'$ ./vortexc demo.vx\nCompiled demo.vx -> demo\n$ ./demo\nfact(5) = 120 | sum = 12'}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------ B2: frontend y backend */

const STAGES = [
  { x: 0, w: 226, name: 'Léxico', file: 'lexer.l', color: 'var(--lex)', at: 1 },
  { x: 246, w: 226, name: 'Sintáctico', file: 'parser.y', color: 'var(--syn)', at: 1 },
  { x: 492, w: 226, name: 'Semántico', file: 'semantic.c', color: 'var(--sem)', at: 1 },
  { x: 1010, w: 216, name: 'Generación', file: 'x86gen.c', color: 'var(--gen)', at: 3 },
  { x: 1246, w: 210, name: 'Ejecutable', file: 'elf.c', color: 'var(--gen)', at: 3 },
]

function FrontBack({ step }: { step: number }) {
  return (
    <>
      <h2>Frontend, backend y lo que viaja entre los dos</h2>
      <div className="body">
        <svg width="1456" height="330" viewBox="0 0 1456 330">
          {STAGES.map((s) => (
            <g key={s.name} className={rv(step, s.at)}>
              <path d={`M${s.x + 7} 96 H${s.x + s.w - 7}`} stroke={s.color} strokeWidth={14} strokeLinecap="round" />
              <rect className="node" x={s.x} y={112} width={s.w} height={120} />
              <text className="sl" x={s.x + 18} y={160}>{s.name}</text>
              <text className="st sm" x={s.x + 18} y={204}>{s.file}</text>
            </g>
          ))}
          <g className={rv(step, 1)}>
            <path className="guide" d="M0 62 V44 H718 V62" />
            <text className="sl" x={0} y={28}>FRONTEND</text>
            <text className="sl sm" x={0} y={276}>Entiende Vortex. Aquí se reportan</text>
            <text className="sl sm" x={0} y={308}>todos los errores de compilación.</text>
          </g>
          <g className={rv(step, 2)}>
            <path className="track ink thin" d="M730 172 H760 M970 172 H998" />
            <rect className="node fill" x={764} y={92} width={202} height={160} />
            <text className="st inv" x={865} y={160} textAnchor="middle" style={{ fontSize: 30 }}>AST</text>
            <text className="st inv" x={865} y={200} textAnchor="middle" style={{ fontSize: 30 }}>anotado</text>
            <text className="sl sm" x={865} y={290} textAnchor="middle">la frontera</text>
          </g>
          <g className={rv(step, 3)}>
            <path className="guide" d="M1010 62 V44 H1456 V62" />
            <text className="sl" x={1010} y={28}>BACKEND</text>
            <text className="sl sm" x={1010} y={276}>Produce el ejecutable.</text>
            <text className="sl sm" x={1010} y={308}>Lo construimos dos veces.</text>
          </g>
        </svg>
        <div className={rv(step, 4)} style={abs(0, 366, 1456)}>
          <div className="plate out" style={{ fontSize: 24 }}>main.c:  yyparse()  →  semantic_check()  →  generate_native()</div>
          <p className="note" style={{ marginTop: 16, fontSize: 26 }}>
            <span className="mono">vortex.h</span> define Node, Type y Symbol: las estructuras que comparten todas las etapas.
          </p>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------- Árbol del ejemplo (B3 y B5) */

/** Árbol de `float y = x + 2 * 3;`. `built` controla cuánto se ha construido; `typed`, cuánto se ha anotado. */
function ExampleTree({ built, typed, hot = 0 }: { built: number; typed: number; hot?: number }) {
  const tag = (x: number, y: number, text: string, at: number) => (
    <g className={typed >= at ? 'rv on' : 'rv'}>
      <rect x={x} y={y - 48} width={text.length * 14.6 + 20} height={38} fill="var(--line)" />
      <text className="st sm" x={x + 10} y={y - 22} style={{ fill: '#fff' }}>{text}</text>
    </g>
  )
  return (
    <svg width="760" height="500" viewBox="0 0 760 500">
      <g className={built >= 4 ? 'rv on' : 'rv'}>
        <path className="guide draw" pathLength={1} d="M378 68 V142" />
        <TreeNode x={378} y={40} w={330} label="VARDECL y : float" fill hot={hot === 4} />
      </g>
      <g className={built >= 3 ? 'rv on' : 'rv'}>
        <path className="guide draw" pathLength={1} d="M378 198 L218 272 M378 198 L538 272" />
        <TreeNode x={378} y={170} w={90} label="+" fill hot={hot === 3} />
      </g>
      <g className={built >= 2 ? 'rv on' : 'rv'}>
        <path className="guide draw" pathLength={1} d="M538 328 L438 402 M538 328 L638 402" />
        <TreeNode x={538} y={300} w={90} label="*" fill hot={hot === 2} />
      </g>
      <g className={built >= 1 ? 'rv on' : 'rv'}>
        <TreeNode x={218} y={300} w={90} label="x" hot={hot === 1} />
        <TreeNode x={438} y={430} w={90} label="2" hot={hot === 1} />
        <TreeNode x={638} y={430} w={90} label="3" hot={hot === 1} />
      </g>
      {tag(250, 300, 'int', 1)}{tag(470, 430, 'int', 1)}{tag(670, 430, 'int', 1)}
      {tag(570, 300, 'int', 2)}{tag(410, 170, 'int', 2)}
      {tag(546, 40, 'int → float', 3)}
    </svg>
  )
}

/** Árbol de derivación real de `x + 2 * 3` con las reglas de parser.y.
 *  role: 'bin' = la regla que llama a binary(); 'chain' = regla de un solo hijo; 'tok' = token. */
type PNode = { id: string; x: number; l: number; label: string; w: number; role: 'bin' | 'chain' | 'tok'; up?: string }
const PARSE: PNode[] = [
  { id: 'r', x: 430, l: 0, label: 'add_expr', w: 136, role: 'bin' },
  { id: 'a1', x: 130, l: 1, label: 'add_expr', w: 136, role: 'chain', up: 'r' },
  { id: 'plus', x: 330, l: 1, label: '+', w: 56, role: 'tok', up: 'r' },
  { id: 'm1', x: 640, l: 1, label: 'mul_expr', w: 136, role: 'bin', up: 'r' },
  { id: 'm2', x: 130, l: 2, label: 'mul_expr', w: 136, role: 'chain', up: 'a1' },
  { id: 'm3', x: 500, l: 2, label: 'mul_expr', w: 136, role: 'chain', up: 'm1' },
  { id: 'star', x: 650, l: 2, label: '*', w: 56, role: 'tok', up: 'm1' },
  { id: 'u3', x: 790, l: 2, label: 'unary', w: 104, role: 'chain', up: 'm1' },
  { id: 'u1', x: 130, l: 3, label: 'unary', w: 104, role: 'chain', up: 'm2' },
  { id: 'u2', x: 500, l: 3, label: 'unary', w: 104, role: 'chain', up: 'm3' },
  { id: 'f3', x: 790, l: 3, label: 'postfix', w: 120, role: 'chain', up: 'u3' },
  { id: 'f1', x: 130, l: 4, label: 'postfix', w: 120, role: 'chain', up: 'u1' },
  { id: 'f2', x: 500, l: 4, label: 'postfix', w: 120, role: 'chain', up: 'u2' },
  { id: 'p3', x: 790, l: 4, label: 'primary', w: 120, role: 'chain', up: 'f3' },
  { id: 'p1', x: 130, l: 5, label: 'primary', w: 120, role: 'chain', up: 'f1' },
  { id: 'p2', x: 500, l: 5, label: 'primary', w: 120, role: 'chain', up: 'f2' },
  { id: 'n3', x: 790, l: 5, label: '3', w: 56, role: 'tok', up: 'p3' },
  { id: 'nx', x: 130, l: 6, label: 'x', w: 56, role: 'tok', up: 'p1' },
  { id: 'n2', x: 500, l: 6, label: '2', w: 56, role: 'tok', up: 'p2' },
]
const ly = (l: number) => 24 + l * 66

function ParseTree({ thin }: { thin: boolean }) {
  const byId = Object.fromEntries(PARSE.map((n) => [n.id, n]))
  return (
    <svg width="880" height="450" viewBox="0 0 880 450">
      {PARSE.filter((n) => n.up).map((n) => {
        const p = byId[n.up!]
        return <path key={n.id} className={`guide fade${thin && n.role === 'chain' ? ' off' : ''}`} d={`M${p.x} ${ly(p.l) + 22} L${n.x} ${ly(n.l) - 22}`} />
      })}
      {PARSE.map((n) => (
        <g key={n.id} className={`fade${thin && n.role === 'chain' ? ' off' : ''}`}>
          {n.role === 'tok'
            ? <Term x={n.x} y={ly(n.l)} w={n.w} h={44} label={n.label} lit={thin} />
            : <NonT x={n.x} y={ly(n.l)} w={n.w} h={44} label={n.label} lit={thin && n.role === 'bin'} />}
        </g>
      ))}
    </svg>
  )
}

const NODE_STRUCT: [string, string][] = [
  ['typedef struct Node {', ''],
  ['    NodeKind kind;', 'N_BINARY'],
  ['    int line;', '1'],
  ['    int op;', 'OP_ADD'],
  ['    Type type;', 'lo llena semantic.c'],
  ['    char *text;', ''],
  ['    struct Node *a, *b, *c, *d;', 'a: x   b: *'],
  ['    struct Node *next;', ''],
  ['    struct Symbol *sym;', 'lo llena semantic.c'],
  ['} Node;', ''],
]

function Ast({ step }: { step: number }) {
  const only = (n: number, extra = '') => `rv${step === n ? ' on' : ''}${extra ? ' ' + extra : ''}`
  return (
    <>
      <h2>El AST: el programa sin la gramática</h2>
      <div className="body">
        <div className={step < 3 ? 'rv on' : 'rv'} style={abs(0, 0)}>
          <p style={{ font: '800 26px var(--sans)', marginBottom: 6 }}>Árbol de derivación de x + 2 * 3</p>
          <ParseTree thin={step >= 1} />
        </div>
        <div className={rv(step, 3)} style={abs(0, 0, 860)}>
          <div className="plate" style={{ fontSize: 22, lineHeight: '32px', padding: '12px 20px' }}>
            {"add_expr: add_expr '+' mul_expr\n    { $$ = binary(OP_ADD, $1, $3, @2.first_line); }"}
          </div>
          <div className="plate" style={{ marginTop: 18, fontSize: 22, lineHeight: '32px', padding: '12px 20px' }}>
            {NODE_STRUCT.map(([code, val], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '450px 1fr' }}>
                <span>{code}</span>
                <span style={{ color: 'var(--syn)', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={abs(920, 0, 536)}>
          <div className={rv(step, 2)}>
            <p style={{ font: '800 26px var(--sans)', marginBottom: 6 }}>AST</p>
            <svg width="536" height="330" viewBox="0 0 536 330">
              <path className="guide" d="M268 68 L110 142 M268 68 L400 142 M400 198 L320 272 M400 198 L480 272" />
              <TreeNode x={268} y={40} w={90} label="+" fill />
              <TreeNode x={110} y={170} w={90} label="x" />
              <TreeNode x={400} y={170} w={90} label="*" fill />
              <TreeNode x={320} y={300} w={90} label="2" />
              <TreeNode x={480} y={300} w={90} label="3" />
            </svg>
          </div>
          <p className={only(0, 'lead')} style={{ ...abs(0, 40, 536), fontSize: 30 }}>
            Así reconoce el parser la expresión: una regla por nodo, 19&nbsp;nodos en total.
          </p>
          <p className={only(1, 'lead')} style={{ ...abs(0, 40, 536), fontSize: 30 }}>
            Las cadenas unary, postfix y primary solo existen para fijar la precedencia. No dicen nada del programa.
          </p>
          <p className={rv(step, 2, 'lead')} style={{ ...abs(0, 384, 536), fontSize: 27 }}>
            {step < 3
              ? 'Quedan operadores y operandos: 5 nodos. La forma ya dice que * va primero.'
              : 'Cada nodo es un struct Node de vortex.h. Lo crea la acción de la regla al reducirse.'}
          </p>
        </div>
      </div>
    </>
  )
}

/* -------------------------------------------------- B5: tipos */

function Types({ step }: { step: number }) {
  return (
    <>
      <h2>Los tipos se anotan de las hojas hacia la raíz</h2>
      <div className="body">
        <div style={abs(0, 0)}><ExampleTree built={4} typed={step} /></div>
        <div style={abs(800, 0, 656)}>
          <p className="lead" style={{ fontSize: 28 }}>
            semantic.c recorre el árbol una vez y guarda en cada nodo su tipo y su símbolo.
          </p>
          <p className={rv(step, 3, 'note')} style={{ marginTop: 18, fontSize: 26 }}>
            Guardar un int en un float es una promoción permitida. El generador sabrá que debe convertir.
          </p>
          <div className={rv(step, 4)} style={{ marginTop: 26 }}>
            <div className="plate small" style={{ marginBottom: 10 }}>float y = x + true;</div>
            <div className="plate out" style={{ fontSize: 24, lineHeight: '36px' }}>{"[Semantic error] line 1: operator '+'\ncannot be applied to int and bool"}</div>
            <p className="lead" style={{ marginTop: 16, fontSize: 27 }}>Con un error semántico no se genera código.</p>
          </div>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------------- B6: sobrecarga */

type Cand = [sig: string, cost: string, ok: boolean | null]
const CASES: { call: string; why: string; cands: Cand[]; verdict: ReactNode; good: boolean }[] = [
  {
    call: 'describe(7)', why: '7 es int: la versión de int le sirve tal cual.',
    cands: [['describe(int x)', 'sirve tal cual', true], ['describe(float x)', 'sirve convirtiendo 7 → 7.0', null], ['describe(string x)', 'no sirve', false]],
    verdict: 'Gana describe(int x): no necesita convertir nada.', good: true,
  },
  {
    call: 'mix(1, 1)', why: 'Las dos versiones necesitan convertir un int: empate.',
    cands: [['mix(int a, float b)', '1 conversión', null], ['mix(float a, int b)', '1 conversión', null]],
    verdict: 'Error: ambiguous call mix(int, int)', good: false,
  },
  {
    call: 'describe(true)', why: 'Ninguna versión recibe un bool.',
    cands: [['describe(int x)', 'no sirve', false], ['describe(float x)', 'no sirve', false], ['describe(string x)', 'no sirve', false]],
    verdict: "Error: no version of 'describe' matches the call describe(bool)", good: false,
  },
]

function Overload({ step }: { step: number }) {
  return (
    <>
      <h2>Sobrecarga: varias funciones con el mismo nombre</h2>
      {/* Paso 0: qué es la sobrecarga y qué es una conversión */}
      <div className={step === 0 ? 'body rv on' : 'body rv'}>
        <div className="plate" style={{ ...abs(0, 0, 700), fontSize: 24, lineHeight: '40px' }}>
          {'func string describe(int x)    {…}\nfunc string describe(float x)  {…}\nfunc string describe(string x) {…}\n\nprint(describe(7));'}
        </div>
        <div style={abs(760, 0, 696)}>
          <p className="lead" style={{ fontSize: 28 }}>
            Las tres se llaman <span className="mono">describe</span>. Se diferencian por el tipo de lo que reciben.
          </p>
          <p className="lead" style={{ fontSize: 28, marginTop: 22 }}>
            En cada llamada, semantic.c mira el tipo de los argumentos y elige una.
          </p>
          <div style={{ borderTop: '4px solid var(--ink)', marginTop: 28, paddingTop: 16 }}>
            <p className="lead" style={{ fontSize: 26 }}>
              <span className="b">Regla:</span> se puede convertir un int en float (7 → 7.0), pero cada conversión cuenta. Gana la versión que necesite menos.
            </p>
          </div>
        </div>
      </div>
      <div className="body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 36 }}>
        {CASES.map((c, i) => (
          <div key={c.call} className={rv(step, i + 1)}>
            <div className="plate" style={{ marginBottom: 12 }}>{c.call}</div>
            <p className="lead" style={{ fontSize: 24, marginBottom: 16, minHeight: 60 }}>{c.why}</p>
            {c.cands.map(([sig, cost, ok]) => (
              <div key={sig} style={{ display: 'grid', gridTemplateColumns: '46px 1fr', alignItems: 'center', marginBottom: 12 }}>
                <svg width="30" height="30" viewBox="-15 -15 30 30">
                  {ok === true && <Check x={0} y={0} />}
                  {ok === false && <Cross x={0} y={0} s={0.9} />}
                  {ok === null && <circle r={7} fill="var(--ink)" />}
                </svg>
                <div>
                  <div className="mono" style={{ fontSize: 24, fontWeight: 600 }}>{sig}</div>
                  <div className="note" style={{ fontSize: 24 }}>{cost}</div>
                </div>
              </div>
            ))}
            <div className={c.good ? 'plate' : 'plate out'} style={{ marginTop: 10, fontSize: 22, whiteSpace: 'normal', lineHeight: 1.3, padding: '12px 18px' }}>{c.verdict}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------------------------------------------------- Cierre */

function Closing() {
  return (
    <div className="cover">
      <h1 style={{ top: 30, fontSize: 220 }}>Preguntas</h1>
      <p className="motto" style={{ top: 250 }}>Vortex: de los caracteres<br />al <em>ejecutable</em>.</p>
      <div className="plate out" style={{ position: 'absolute', left: 6, top: 386, width: 900, fontSize: 24, lineHeight: '34px', padding: '14px 24px' }}>
        {'$ ./vortexc tests/26_scientific.vx --run\ndata     = [2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]\nmean     = 5.0\nvariance = 4.0\nstd dev  = 2.0\n(siguen 11 líneas)'}
      </div>
    </div>
  )
}

export const PART_B: SceneDef[] = [
  { id: 'compilador', part: 'extra', station: 0, steps: 2, render: (s) => <Compiler step={s} /> },
  { id: 'frontend-backend', part: 'extra', station: 0, steps: 4, render: (s) => <FrontBack step={s} /> },
  /* Qué hace cada archivo del compilador */
  { id: 'archivo-traspaso', part: 'extra', station: 2, steps: 4, render: (s) => <Handoff step={s} /> },
  { id: 'archivo-semantic', part: 'extra', station: 3, steps: 5, render: (s) => <FileSemantic step={s} /> },
  { id: 'archivo-ast', part: 'extra', station: 3, steps: 2, render: (s) => <FileAst step={s} /> },
  { id: 'archivo-x86gen', part: 'extra', station: 4, steps: 3, render: (s) => <FileGen step={s} /> },
  { id: 'archivo-x86enc', part: 'extra', station: 5, steps: 2, render: (s) => <FileEnc step={s} /> },
  { id: 'archivo-elf', part: 'extra', station: 5, steps: 4, render: (s) => <FileElf step={s} /> },
  { id: 'archivo-main', part: 'extra', station: 0, steps: 5, render: (s) => <FileMain step={s} /> },
  { id: 'archivo-runtime', part: 'extra', station: 4, steps: 2, render: (s) => <FileRuntime step={s} /> },
  { id: 'archivo-runtime-arrays', part: 'extra', station: 4, steps: 2, render: (s) => <FileRuntimeArrays step={s} /> },
  { id: 'ast', part: 'extra', station: 2, steps: 3, render: (s) => <Ast step={s} /> },
  { id: 'tipos', part: 'extra', station: 3, steps: 4, render: (s) => <Types step={s} /> },
  { id: 'sobrecarga', part: 'extra', station: 3, steps: 3, render: (s) => <Overload step={s} /> },
  /* El cambio: del primer enfoque (C y GCC) al backend propio */
  { id: 'cambio', part: 'extra', route: (s) => (s >= 2 ? 'native' : 'c'), station: 4, steps: 3, render: (s) => <Change step={s} /> },
  /* Las siete etapas del backend propio */
  { id: 'etapas', part: 'extra', station: 5, steps: 8, render: (s) => <Stages step={s} /> },
  { id: 'resultados', part: 'extra', station: 5, steps: 1, render: (s) => <NativeResults step={s} /> },
  { id: 'cierre', part: 'extra', station: 5, steps: 0, render: () => <Closing /> },
]
