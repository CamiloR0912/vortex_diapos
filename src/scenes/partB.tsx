import type { CSSProperties, ReactNode } from 'react'
import { rv } from '../deck'
import type { SceneDef } from '../deck'
import { Arrow, Check, Cross, NonT, Term, TreeNode } from '../ui'

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
          {'$ ./vortexc ejemplos/demo.vx\nCompiled ejemplos/demo.vx -> ejemplos/demo (C code: ejemplos/demo.c)\n$ ./ejemplos/demo\nfact(5) = 120 | sum = 12'}
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
  { x: 1010, w: 226, name: 'Generación', file: 'codegen.c', color: 'var(--gen)', at: 3 },
  { x: 1256, w: 200, name: 'GCC', file: 'vx_runtime.h', color: 'var(--gen)', at: 3 },
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
            <text className="sl sm" x={1010} y={308}>Nunca mira el texto fuente.</text>
          </g>
        </svg>
        <div className={rv(step, 4)} style={abs(0, 366, 1456)}>
          <div className="plate out" style={{ fontSize: 24 }}>main.c:  yyparse()  →  semantic_check()  →  generate_c()  →  gcc</div>
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
const CASES: { call: string; cands: Cand[]; verdict: ReactNode; good: boolean }[] = [
  {
    call: 'describe(7)',
    cands: [['describe(int x)', '0 promociones', true], ['describe(float x)', '1 promoción', null], ['describe(string x)', 'no encaja', false]],
    verdict: 'Se elige describe(int x)', good: true,
  },
  {
    call: 'mix(1, 1)',
    cands: [['mix(int a, float b)', '1 promoción', null], ['mix(float a, int b)', '1 promoción', null]],
    verdict: '[Semantic error] line 5: ambiguous call mix(int, int)', good: false,
  },
  {
    call: 'describe(true)',
    cands: [['describe(int x)', 'no encaja', false], ['describe(float x)', 'no encaja', false], ['describe(string x)', 'no encaja', false]],
    verdict: "[Semantic error] line 5: no version of 'describe' matches the call describe(bool)", good: false,
  },
]

function Overload({ step }: { step: number }) {
  return (
    <>
      <h2>Sobrecarga: gana la versión con menos promociones</h2>
      <div className="body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 36 }}>
        {CASES.map((c, i) => (
          <div key={c.call} className={rv(step, i + 1)}>
            <div className="plate" style={{ marginBottom: 20 }}>{c.call}</div>
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
            <div className={c.good ? 'plate' : 'plate out'} style={{ marginTop: 16, fontSize: 24, whiteSpace: 'normal', lineHeight: 1.3 }}>{c.verdict}</div>
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
      <h2>Generación: recorrer el árbol y escribir C</h2>
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

/* ------------------------------------------------------ GCC: el driver */

const FLAGS = [
  ['-O0', 'Sin optimizar: los valores locales sobreviven cuando longjmp vuelve a un catch.'],
  ['-w', 'Sin advertencias: el código generado no es para leerlo a mano.'],
  ['-I…', 'Carpeta de vortexc: ahí busca vx_runtime.h.'],
  ['-o demo', 'Nombre del ejecutable: demo.vx produce demo.'],
] as const

const TOOLS = [
  { name: 'Preprocesador', prog: 'cc1 -E', out: 'C expandido' },
  { name: 'Compilador', prog: 'cc1', out: 'ensamblador .s' },
  { name: 'Ensamblador', prog: 'as', out: 'objeto .o' },
  { name: 'Enlazador', prog: 'ld', out: 'ejecutable' },
]

function Gcc({ step }: { step: number }) {
  return (
    <>
      <h2>GCC compila el C que escribe vortexc</h2>
      <div className="body">
        <div className="plate out" style={{ ...abs(0, 0, 1456), fontSize: 30, padding: '12px 24px' }}>
          {'$ gcc -O0 -w -I… -o demo demo.c'}
        </div>
        <div className={rv(step, 1)} style={{ ...abs(0, 92, 1456), display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 32 }}>
          {FLAGS.map(([f, t]) => (
            <div key={f}>
              <span className="tag">{f}</span>
              <p className="note" style={{ fontSize: 24, marginTop: 10, color: 'var(--ink)' }}>{t}</p>
            </div>
          ))}
        </div>

        <div className={rv(step, 2)} style={abs(0, 246, 1456)}>
          <p style={{ font: '800 28px var(--sans)', marginBottom: 14 }}>
            gcc es un driver: no traduce nada él mismo, ejecuta cuatro programas en orden.
          </p>
          <svg width="1456" height="130" viewBox="0 0 1456 130">
            {TOOLS.map((t, i) => {
              const x = i * 374
              return (
                <g key={t.name}>
                  {i > 0 && <path className="gtrack" stroke="var(--gen)" d={`M${x - 52} 64 H${x - 10}`} />}
                  <rect className="node" x={x} y={4} width={330} height={120} />
                  <text className="sl" x={x + 20} y={46}>{t.name}</text>
                  <rect x={x + 20} y={62} width={t.prog.length * 15 + 20} height={34} fill="var(--ink)" />
                  <text className="st sm inv" x={x + 30} y={87}>{t.prog}</text>
                  <text className="sl sm soft" x={x + 314} y={112} textAnchor="end">→ {t.out}</text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className={rv(step, 3)} style={{ ...abs(0, 444, 1456), display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 32, alignItems: 'center' }}>
          <p className="lead" style={{ fontSize: 26 }}>
            main.c lo lanza con fork + execvp y espera con waitpid. Si falla, es un error interno:
          </p>
          <div className="plate out" style={{ fontSize: 22, padding: '10px 18px' }}>Internal error: gcc could not compile demo.c</div>
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
const GTOOLS = ['cc1 -E', 'cc1', 'as', 'ld']

const ASM: [string, string][] = [
  ['if ((v_n_2 <= 1LL))', 'cmpq   $1, -40(%rbp)'],
  ['', 'jg     .L190'],
  ['f_fact_1((v_n_2 - 1LL))', 'movq   -40(%rbp), %rax'],
  ['', 'subq   $1, %rax'],
  ['', '…'],
  ['', 'call   f_fact_1.0'],
]

type Panel = { tag: string; title: string; text: string; out?: boolean; body: ReactNode }
const PANELS: Panel[] = [
  {
    tag: 'vortexc', title: 'El punto de partida',
    text: 'La generación dejó demo.c: 48 líneas de C que empiezan incluyendo el runtime.',
    body: (
      <>
        <div className="hl">#include "vx_runtime.h"</div>
        {'\nint main(void) {\n    auto long long f_fact_1(long long);\n    long long f_fact_1(long long v_n_2) {\n        if ((v_n_2 <= 1LL)) {'}
      </>
    ),
  },
  {
    tag: 'cc1 -E', title: 'Preprocesador',
    text: 'Pega el texto de cada #include y expande las macros: entran vx_runtime.h y 62 cabeceras del sistema.',
    body: (
      <>
        {'# 1 "vx_runtime.h" 1\n# 1 "/usr/include/setjmp.h" 1 3 4\n'}
        <span style={{ color: 'var(--ink-soft)' }}>{'      … 2858 líneas de declaraciones …\n'}</span>
        {'# 3 "demo.c" 2\n\n'}
        <span className="hl">int main(void) {'{'}</span>
      </>
    ),
  },
  {
    tag: 'cc1', title: 'Compilador',
    text: 'Traduce C a ensamblador x86-64: instrucciones de la máquina, todavía como texto. n vive en la pila, en -40(%rbp).',
    body: ASM.map(([c, a], i) => (
      <div key={i} style={{ display: 'grid', gridTemplateColumns: '360px 1fr' }}>
        <span style={{ color: 'var(--ink-soft)' }}>{c}</span>
        <span className={a.startsWith('call') || a.startsWith('cmpq') ? 'kw' : undefined}>{a}</span>
      </div>
    )),
  },
  {
    tag: 'as', title: 'Ensamblador',
    text: 'Codifica cada instrucción en bytes. Las direcciones que aún no conoce quedan en cero, pendientes.',
    out: true,
    body: (
      <>
        {'48 83 7d d8 01       cmpq  $0x1,-0x28(%rbp)\n7f 1d                jg    19bd\n8b 05 '}
        <span style={{ color: 'var(--gen)' }}>00 00 00 00</span>
        {'    mov   0x0(%rip),%eax\n\n17 símbolos sin resolver: printf, malloc, longjmp …\ndemo.o: ELF 64-bit LSB relocatable, x86-64'}
      </>
    ),
  },
  {
    tag: 'ld', title: 'Enlazador',
    text: 'Une demo.o con el arranque de C (crt*.o) y lo enlaza con libc. Cada pendiente encuentra su dueño.',
    out: true,
    body: (
      <>
        {'Scrt1.o crti.o crtbeginS.o '}<span style={{ color: 'var(--gen)' }}>demo.o</span>{' -lgcc -lc\ncrtendS.o crtn.o\n\nprintf   →  printf@GLIBC_2.2.5    (libc.so.6)\nlongjmp  →  longjmp@GLIBC_2.2.5\ndemo: ELF 64-bit LSB pie executable, x86-64'}
      </>
    ),
  },
  {
    tag: './demo', title: 'Ejecución',
    text: 'El cargador ld-linux trae libc.so.6 y el código de arranque llama a main.',
    out: true,
    body: '$ ./demo\nfact(5) = 120 | sum = 12\ncaught: index 3 out of range for vector<int> of length 3 (line 10)',
  },
]

function Flow({ step }: { step: number }) {
  const at = Math.min(step, 4)
  return (
    <>
      <h2>De demo.c a ejecutable, etapa por etapa</h2>
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

/* ----------------------------------------- B8: errores en ejecución */

function Runtime({ step }: { step: number }) {
  return (
    <>
      <h2>En ejecución: vx_runtime.h acompaña al programa</h2>
      <div className="body">
        <div className="plate" style={{ ...abs(0, 0, 540), fontSize: 24, lineHeight: '40px' }}>
          {['vector<int> v = [1, 2, 3];', 'try {', '    print(v[3]);', '} catch (e) {', '    print("caught:", e);', '}'].map((l, i) => (
            <div key={i} className={(i === 1 && step === 1) || (i === 2 && step === 2) || (i === 4 && step === 3) ? 'hl' : undefined}>{l}</div>
          ))}
        </div>
        <div className={rv(step, 1)} style={{ ...abs(590, 4, 866), display: 'flex', alignItems: 'center', gap: 8, fontSize: 20 }}>
          <span className="chip">try</span>
          <svg width="50" height="30"><path className="guide" d="M4 15 H38" /><Arrow x={42} y={15} /></svg>
          <span className="chip t">registra un manejador (setjmp)</span>
        </div>
        <div className={rv(step, 2)} style={{ ...abs(590, 78, 866), display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="chip">v[3]</span>
          <svg width="50" height="30"><path className="guide" d="M4 15 H38" /><Arrow x={42} y={15} /></svg>
          <span className="chip t">vx_get revisa el índice</span>
          <svg width="50" height="30"><path className="guide" d="M4 15 H38" /><Arrow x={42} y={15} /></svg>
          <span className="chip t">longjmp al catch</span>
        </div>
        <div className={rv(step, 3, 'plate out')} style={{ ...abs(590, 156, 866), fontSize: 24, lineHeight: '36px' }}>
          {'caught: index 3 out of range\nfor vector<int> of length 3 (line 3)'}
        </div>
        <div className={rv(step, 4)} style={abs(0, 330, 1456)}>
          <div className="rule" style={{ marginBottom: 22 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', columnGap: 60, alignItems: 'center' }}>
            <p className="lead" style={{ fontSize: 28 }}>Sin un try activo, el programa termina con la clase de error y la línea.</p>
            <div className="plate out" style={{ fontSize: 24 }}>{'[Runtime error] line 5: division by zero'}</div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------- B9: el recorrido completo */

const JOURNEY = [
  { x: 24, left: 0, w: 400, up: true, text: 'print("fact(5) =",\n      fact(5));' },
  { x: 308, left: 150, w: 430, up: false, text: 'PRINT ( STRING_LIT ,\nIDENTIFIER ( INT_LIT ) ) ;' },
  { x: 608, left: 440, w: 360, up: true, text: 'PRINT\n  STRING "fact(5) ="\n  CALL fact\n    INT 5' },
  { x: 908, left: 670, w: 420, up: false, text: 'CALL fact : int\n  símbolo: f_fact_1\n  INT 5 : int' },
  { x: 1178, left: 830, w: 626, up: true, text: 'long long vx_p_2 =\n  (vx_enter("fact", 9), f_fact_1(5LL));' },
  { x: 1432, left: 1226, w: 230, up: false, text: '$ ./demo\nfact(5) = 120', out: true },
]

function Journey({ step }: { step: number }) {
  return (
    <>
      <h2>El recorrido completo de una línea de demo.vx</h2>
      <div className="body">
        <svg width="1456" height="510" viewBox="0 0 1456 510" style={{ position: 'absolute', left: 0, top: 0 }}>
          {JOURNEY.map((j, i) => (
            <path key={i} className={rv(step, i, 'guide draw')} pathLength={1} d={`M${j.x} ${j.up ? 164 : 344} V504`} />
          ))}
        </svg>
        {JOURNEY.map((j, i) => (
          <div
            key={i} className={rv(step, i, j.out ? 'plate out' : 'plate')}
            style={{ ...abs(j.left, j.up ? 0 : 214, j.w), fontSize: 24, lineHeight: '34px', padding: '12px 16px', height: j.up ? 164 : 130 }}
          >
            {j.text}
          </div>
        ))}
        <div className={rv(step, 6)} style={{ ...abs(0, 420, 1140), display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 24, alignItems: 'center', background: 'var(--ground)', padding: '16px 0 14px' }}>
          <p className="lead" style={{ fontSize: 27 }}>Si el frontend encuentra errores, el recorrido termina ahí:</p>
          <div className="plate out" style={{ fontSize: 24, padding: '12px 16px' }}>3 error(s) found; program not compiled.</div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------ B10: cada error en su etapa */

const BY_STAGE = [
  ['Léxico', 'var(--lex)', "[Lexical error] line 7: invalid character '@'"],
  ['Sintáctico', 'var(--syn)', "[Invalid construct] line 4: variable 'y' must be initialized"],
  ['Semántico', 'var(--sem)', '[Semantic error] line 4: type mismatch: cannot assign float to int'],
  ['Ejecución', 'var(--gen)', '[Runtime error] line 5: division by zero'],
]

function Results({ step }: { step: number }) {
  return (
    <>
      <h2>Cada error se detecta en su etapa</h2>
      <div className="body">
        {BY_STAGE.map(([name, color, msg]) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '60px 250px 1fr', alignItems: 'center', marginBottom: 16 }}>
            <svg width="44" height="44" viewBox="0 0 44 44"><circle cx={22} cy={22} r={14} fill={color} stroke="var(--ink)" strokeWidth={5} /></svg>
            <span className="lead" style={{ fontSize: 30 }}>{name}</span>
            <div className="plate out" style={{ fontSize: 24, padding: '12px 18px' }}>{msg}</div>
          </div>
        ))}
        <p className={rv(step, 1, 'lead')} style={{ marginTop: 26, fontSize: 30 }}>
          Pruebas: 30&nbsp;de&nbsp;30 en el analizador del punto&nbsp;4 y 33&nbsp;de&nbsp;33 en el compilador, cada una con su salida esperada.
        </p>
        <p className={rv(step, 2, 'note')} style={{ marginTop: 16, fontSize: 26 }}>
          Decisiones: el destino es C y GCC produce el código máquina; las funciones anidadas dependen de GCC; la memoria de cadenas y arreglos no se libera.
        </p>
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
  { id: 'ast', part: 'extra', station: 2, steps: 3, render: (s) => <Ast step={s} /> },
  { id: 'ambitos', part: 'extra', station: 3, steps: 3, render: (s) => <Scopes step={s} /> },
  { id: 'tipos', part: 'extra', station: 3, steps: 4, render: (s) => <Types step={s} /> },
  { id: 'sobrecarga', part: 'extra', station: 3, steps: 3, render: (s) => <Overload step={s} /> },
  { id: 'generacion', part: 'extra', station: 4, steps: 6, render: (s) => <Codegen step={s} /> },
  { id: 'gcc', part: 'extra', station: 5, steps: 3, render: (s) => <Gcc step={s} /> },
  { id: 'flujo-gcc', part: 'extra', station: 5, steps: 5, render: (s) => <Flow step={s} /> },
  { id: 'ejecucion', part: 'extra', station: 5, steps: 4, render: (s) => <Runtime step={s} /> },
  { id: 'recorrido', part: 'extra', station: (s) => Math.min(s, 5), steps: 6, render: (s) => <Journey step={s} /> },
  { id: 'resultados', part: 'extra', station: 5, steps: 2, render: (s) => <Results step={s} /> },
  { id: 'cierre', part: 'extra', station: 5, steps: 0, render: () => <Closing /> },
]
