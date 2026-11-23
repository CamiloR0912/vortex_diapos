import type { CSSProperties, ReactNode } from 'react'
import { rv } from '../deck'
import type { SceneDef } from '../deck'
import { Arrow, Check, Cross, NonT, Term, TreeNode } from '../ui'
import { Change, Glossary, NativeResults, StageArrays, StageBytes, StageElf, StageExceptions, StageFlow, StageFunctions, StageReals, StageStack } from './native'
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

/* ------------------------------------------------ B4: ámbitos */

const SCOPE_CODE = ['int x = 1;', '{', '    int x = 2;', '    {', '        print(x);', '    }', '}', 'print(x);']

function Scopes({ step }: { step: number }) {
  const box = (extra: CSSProperties): CSSProperties => ({ border: '4px solid var(--ink)', padding: '14px 20px 20px', ...extra })
  const entry = (text: string, hot: boolean) => (
    <span className="chip" style={{ background: hot ? 'var(--line)' : '#fff', color: hot ? '#fff' : 'var(--ink)', transition: 'background 0.4s, color 0.4s' }}>{text}</span>
  )
  return (
    <>
      <h2>Cada bloque tiene su propia tabla de símbolos</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 470), lineHeight: '42px' }}>
          {SCOPE_CODE.map((l, i) => (
            <div key={i} className={(i === 4 && step === 2) || (i === 7 && step === 3) ? 'hl' : undefined}>{l}</div>
          ))}
        </div>
        <div className={rv(step, 1)} style={{ ...abs(540, 0, 916), ...box({ background: '#fff' }) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span className="lead" style={{ fontSize: 26 }}>ámbito global</span>{entry('x → v_x_1', step === 3)}
          </div>
          <div style={box({ background: 'var(--ground)' })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span className="lead" style={{ fontSize: 26 }}>bloque</span>{entry('x → v_x_2', step === 2)}
            </div>
            <div style={box({ background: '#fff' })}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="lead" style={{ fontSize: 26 }}>bloque interno</span>
                <span className="note" style={{ fontSize: 24 }}>sin símbolos propios</span>
              </div>
            </div>
          </div>
        </div>
        <p className={rv(step, 2, 'lead')} style={{ ...abs(540, 316, 916), fontSize: 28, opacity: step === 2 ? 1 : 0 }}>
          El print interno busca x en su ámbito, no la encuentra y sube. La primera que aparece es v_x_2: imprime 2.
        </p>
        <p className={rv(step, 3, 'lead')} style={{ ...abs(540, 316, 916), fontSize: 28 }}>
          El print externo solo ve el ámbito global y encuentra v_x_1: imprime 1. La x interna ocultó a la externa sin modificarla.
        </p>
        <p className="note" style={{ ...abs(0, 410, 470), fontSize: 24 }}>
          Cada variable recibe un número único; con ese nombre aparece luego en el código C.
        </p>
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

/* --------------------------------------------- B7: generación de código */

const MAPPING = [
  ['int · float', 'long long · double'],
  ['vector<T> · matrix<T>', 'VxArr'],
  ['función f', 'f_f_N  (anidada en main)'],
  ['a / b', 'vx_idiv(a, b, línea)'],
  ['v[i]', 'vx_get(v, i, línea, …)'],
  ['try / catch', 'setjmp / longjmp'],
] as const

/** Lo que escribe cada nodo, en el orden del recorrido (postorden). */
const EMITS = [
  { node: 'x  2  3', c: 'v_x_1    2LL    3LL' },
  { node: '*', c: '(2LL * 3LL)' },
  { node: '+', c: '(v_x_1 + (2LL * 3LL))' },
  { node: 'VARDECL', c: 'double v_y_2 =\n  ((double)((v_x_1 + (2LL * 3LL))));' },
]

/** Salida real de ./vortexc con int x = 1; float y = x + 2 * 3; print(y); */
const EJ_C = [
  '#include "vx_runtime.h"',
  '',
  'int main(void) {',
  '    long long v_x_1 = 1LL;',
  '    double v_y_2 = ((double)((v_x_1',
  '                   + (2LL * 3LL))));',
  '    {',
  '        double vx_p_1 = v_y_2;',
  '        vx_print_f(vx_p_1);',
  "        putchar('\\n');",
  '    }',
  '    return 0;',
  '}',
]

function Codegen({ step }: { step: number }) {
  const walking = step <= 4
  return (
    <>
      <h2>Primer enfoque: recorrer el árbol y escribir C</h2>
      <div className="body">
        {/* Izquierda: el árbol anotado que se recorre; al final, el patrón general */}
        <div className={step < 6 ? 'rv on' : 'rv'} style={abs(0, 0)}>
          <ExampleTree built={4} typed={3} hot={walking ? step : 0} />
        </div>
        <div className={rv(step, 6)} style={abs(0, 0, 760)}>
          <p style={{ font: '800 26px var(--sans)', marginBottom: 10 }}>El resto del lenguaje sigue el mismo patrón</p>
          <div className="rule" style={{ marginBottom: 8 }} />
          {MAPPING.map(([vx, c]) => (
            <div key={vx} style={{ display: 'grid', gridTemplateColumns: '350px 1fr', height: 50, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 24, fontWeight: 600 }}>{vx}</span>
              <span className="mono" style={{ fontSize: 24 }}>{c}</span>
            </div>
          ))}
          <p className="note" style={{ marginTop: 18, fontSize: 25 }}>
            codegen.c no reporta errores: recibe un árbol que ya se sabe correcto.
          </p>
        </div>

        {/* Derecha: lo que escribe cada nodo */}
        <div className={step < 5 ? 'rv on' : 'rv'} style={abs(800, 0, 656)}>
          <p className="lead" style={{ fontSize: 28, marginBottom: 20 }}>
            {step === 0
              ? 'codegen.c visita primero los hijos y después el nodo: cada nodo escribe su C con el C de sus hijos.'
              : 'C que escribe cada nodo'}
          </p>
          {EMITS.map((e, i) => (
            <div key={e.node} className={rv(step, i + 1)} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', alignItems: 'start', marginBottom: 14 }}>
              <span className="tag" style={{ justifySelf: 'start', marginTop: 8 }}>{e.node}</span>
              <div
                className="plate small"
                style={{ padding: '8px 14px', fontSize: 22, background: step === i + 1 ? 'color-mix(in srgb, var(--gen) 30%, #fff)' : '#fff', transition: 'background 0.4s' }}
              >
                {e.c}
              </div>
            </div>
          ))}
          <p className={rv(step, 4, 'note')} style={{ fontSize: 24 }}>
            double y el cast salen de la anotación int → float; v_x_1 y v_y_2, de la tabla de símbolos.
          </p>
        </div>

        {/* Derecha, al final: el archivo completo que produce vortexc */}
        <div className={rv(step, 5)} style={abs(800, 0, 656)}>
          <p style={{ font: '800 26px var(--sans)', marginBottom: 10 }}>
            ej.c&nbsp;<span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>· lo que escribe ./vortexc ej.vx</span>
          </p>
          <div className="plate" style={{ fontSize: 22, lineHeight: '31px', padding: '12px 20px' }}>
            {EJ_C.map((l, i) => (
              <div key={i} className={i === 4 || i === 5 ? 'hl' : undefined}>{l || ' '}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------- Flujo: de demo.c al ejecutable */

const GSTOPS = [
  { x: 70, file: 'demo.c', meta: '48 líneas', wagon: '.c' },
  { x: 400, file: 'demo.i', meta: '2923 líneas', wagon: '.i' },
  { x: 730, file: 'demo.s', meta: '2656 líneas', wagon: '.s' },
  { x: 1060, file: 'demo.o', meta: '17 256 bytes', wagon: '.o' },
  { x: 1386, file: 'demo', meta: '22 248 bytes', wagon: 'ELF' },
]
const GTOOLS = ['preprocesador', 'compilador', 'ensamblador', 'enlazador']

/** Una línea del ejemplo con su explicación al lado. */
const said = (rows: [string, string][]) => rows.map(([code, what], i) => (
  <div key={i} style={{ display: 'grid', gridTemplateColumns: '400px 1fr' }}>
    <span>{code}</span>
    <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, color: 'var(--gen)' }}>{what}</span>
  </div>
))

type Panel = { tag: string; title: string; text: string; out?: boolean; body: ReactNode }
const PANELS: Panel[] = [
  {
    tag: 'demo.c', title: 'El punto de partida',
    text: 'Nuestro compilador traducía Vortex a lenguaje C. El resto del camino lo hacía GCC, en cuatro pasos.',
    body: (
      <>
        <span style={{ color: 'var(--ink-soft)' }}>{'// Vortex:   print(n - 1);\n// C:\n'}</span>
        {'#include "vx_runtime.h"\nint main(void) {\n    …\n    vx_print_i(v_n_2 - 1LL);'}
      </>
    ),
  },
  {
    tag: 'preprocesador', title: '1. Copiar y pegar',
    text: 'Donde dice #include, pega el contenido de ese archivo. Las 48 líneas se vuelven casi 3000.',
    body: (
      <>
        <span className="hl">{'#include "vx_runtime.h"'}</span>
        {'\n      ↓  se reemplaza por\n'}
        <span style={{ color: 'var(--ink-soft)' }}>{'  … 2858 líneas de declaraciones\n    (printf, malloc, setjmp …)\n'}</span>
      </>
    ),
  },
  {
    tag: 'compilador', title: '2. De C a ensamblador',
    text: 'Traduce cada línea de C a instrucciones del procesador, todavía escritas como texto.',
    out: true,
    body: said([
      ['v_n_2 - 1LL', 'en C: n − 1'],
      ['  movq  -40(%rbp), %rax', 'trae n'],
      ['  subq  $1, %rax', 'réstale 1'],
      ['  call  vx_print_i', 'imprime'],
    ]),
  },
  {
    tag: 'ensamblador', title: '3. De texto a números',
    text: 'Cambia cada instrucción por su código en bytes. Lo que vive en otro archivo, como printf, queda como un hueco.',
    out: true,
    body: said([
      ['subq $1, %rax', '→  48 83 E8 01'],
      ['call printf', '→  E8 ?? ?? ?? ??'],
      ['', '¿dónde está printf? aún no se sabe'],
    ]),
  },
  {
    tag: 'enlazador', title: '4. Llenar los huecos',
    text: 'Junta nuestro código con la biblioteca de C (libc), donde están printf y compañía. Cada hueco recibe su dirección.',
    out: true,
    body: said([
      ['demo.o  +  libc', '→  demo'],
      ['printf', '→  lo trae libc'],
      ['', 'resultado: el ejecutable'],
    ]),
  },
  {
    tag: './demo', title: 'Ejecutar',
    text: 'Al correrlo, Linux carga también la biblioteca de C. Sin ella el programa no funciona.',
    out: true,
    body: '$ ./demo\nfact(5) = 120 | sum = 12',
  },
]

function Flow({ step }: { step: number }) {
  const at = Math.min(step, 4)
  return (
    <>
      <h2>Primer enfoque: GCC hacía todo lo demás</h2>
      <div className="body">
        <svg width="1456" height="220" viewBox="0 0 1456 220" style={{ position: 'absolute', left: 0, top: 0 }}>
          {/* La vía completa en guía fina; el tramo recorrido se pinta */}
          <path className="guide" d={`M${GSTOPS[0].x} 96 H${GSTOPS[4].x}`} />
          {GSTOPS.slice(1).map((s, i) => {
            const from = GSTOPS[i].x
            const mid = (from + s.x) / 2
            const tool = GTOOLS[i]
            return (
              <g key={s.file}>
                <path className={rv(step, i + 1, 'gtrack draw')} style={{ opacity: 1, transform: 'none' }} stroke="var(--gen)" pathLength={1} d={`M${from} 96 H${s.x}`} />
                <rect x={mid - (tool.length * 15 + 24) / 2} y={20} width={tool.length * 15 + 24} height={36} fill={step === i + 1 ? 'var(--gen)' : 'var(--ink)'} style={{ transition: 'fill 0.4s' }} />
                <text className="st sm" x={mid} y={46} textAnchor="middle" style={{ fill: step === i + 1 ? 'var(--ink)' : 'var(--ground)' }}>{tool}</text>
              </g>
            )
          })}
          {GSTOPS.map((s, i) => (
            <g key={s.file}>
              <circle className={`gstop${i < at ? ' done' : ''}`} cx={s.x} cy={96} r={15} />
              <text className="st big" x={s.x} y={168} textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'} dx={i === 0 ? -20 : i === 4 ? 20 : 0}>{s.file}</text>
              <text className={rv(step, i, 'sl sm soft')} x={s.x} y={202} textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'} dx={i === 0 ? -20 : i === 4 ? 20 : 0}>{s.meta}</text>
            </g>
          ))}
          {/* El vagón: el mismo programa, cambiando de forma en cada estación */}
          <g className="wagon" style={{ transform: `translateX(${GSTOPS[at].x}px)` }}>
            <rect x={-54} y={70} width={108} height={52} fill={step === 5 ? 'var(--sem)' : 'var(--ink)'} style={{ transition: 'fill 0.4s' }} />
            <text className="st inv" x={0} y={105} textAnchor="middle" style={{ fontSize: 28 }}>{GSTOPS[at].wagon}</text>
          </g>
        </svg>

        {PANELS.map((p, i) => (
          <div key={p.tag} className={`panel${step === i ? ' on' : ''}`}>
            <div>
              <span className="tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p className="lead" style={{ fontSize: 26 }}>{p.text}</p>
            </div>
            <div className={p.out ? 'plate out' : 'plate'} style={{ fontSize: 22, lineHeight: '32px', padding: '14px 20px', alignSelf: 'start', marginTop: 8 }}>
              {p.body}
            </div>
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
  { id: 'ambitos', part: 'extra', station: 3, steps: 3, render: (s) => <Scopes step={s} /> },
  { id: 'tipos', part: 'extra', station: 3, steps: 4, render: (s) => <Types step={s} /> },
  { id: 'sobrecarga', part: 'extra', station: 3, steps: 3, render: (s) => <Overload step={s} /> },  /* Primer enfoque: traducir a C y dejar el resto a GCC */
  { id: 'enfoque-c', part: 'extra', route: 'c', station: 4, steps: 6, render: (s) => <Codegen step={s} /> },
  { id: 'enfoque-gcc', part: 'extra', route: 'c', station: 5, steps: 5, render: (s) => <Flow step={s} /> },
  /* El cambio y las siete etapas del backend propio */
  { id: 'cambio', part: 'extra', route: (s) => (s >= 2 ? 'native' : 'c'), station: 4, steps: 3, render: (s) => <Change step={s} /> },
  { id: 'vocabulario', part: 'extra', station: 4, steps: 3, render: (s) => <Glossary step={s} /> },
  { id: 'etapa-1-bytes', part: 'extra', station: 5, steps: 3, render: (s) => <StageBytes step={s} /> },
  { id: 'etapa-1-elf', part: 'extra', station: 5, steps: 2, render: (s) => <StageElf step={s} /> },
  { id: 'etapa-2-pila', part: 'extra', station: 4, steps: 6, render: (s) => <StageStack step={s} /> },
  { id: 'etapa-3-saltos', part: 'extra', station: 4, steps: 5, render: (s) => <StageFlow step={s} /> },
  { id: 'etapa-4-funciones', part: 'extra', station: 4, steps: 5, render: (s) => <StageFunctions step={s} /> },
  { id: 'etapa-5-reales', part: 'extra', station: 4, steps: 4, render: (s) => <StageReals step={s} /> },
  { id: 'etapa-6-excepciones', part: 'extra', station: 4, steps: 4, render: (s) => <StageExceptions step={s} /> },
  { id: 'etapa-7-arreglos', part: 'extra', station: 4, steps: 4, render: (s) => <StageArrays step={s} /> },
  { id: 'resultados', part: 'extra', station: 5, steps: 1, render: (s) => <NativeResults step={s} /> },
  { id: 'cierre', part: 'extra', station: 5, steps: 0, render: () => <Closing /> },
]
