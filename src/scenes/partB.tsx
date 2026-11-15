import type { CSSProperties, ReactNode } from 'react'
import { rv } from '../deck'
import type { SceneDef } from '../deck'
import { Arrow, Check, Cross, TreeNode } from '../ui'

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
function ExampleTree({ built, typed }: { built: number; typed: number }) {
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
        <TreeNode x={378} y={40} w={330} label="VARDECL y : float" fill />
      </g>
      <g className={built >= 3 ? 'rv on' : 'rv'}>
        <path className="guide draw" pathLength={1} d="M378 198 L218 272 M378 198 L538 272" />
        <TreeNode x={378} y={170} w={90} label="+" fill />
      </g>
      <g className={built >= 2 ? 'rv on' : 'rv'}>
        <path className="guide draw" pathLength={1} d="M538 328 L438 402 M538 328 L638 402" />
        <TreeNode x={538} y={300} w={90} label="*" fill />
      </g>
      <g className={built >= 1 ? 'rv on' : 'rv'}>
        <TreeNode x={218} y={300} w={90} label="x" />
        <TreeNode x={438} y={430} w={90} label="2" />
        <TreeNode x={638} y={430} w={90} label="3" />
      </g>
      {tag(250, 300, 'int', 1)}{tag(470, 430, 'int', 1)}{tag(670, 430, 'int', 1)}
      {tag(570, 300, 'int', 2)}{tag(410, 170, 'int', 2)}
      {tag(546, 40, 'int → float', 3)}
    </svg>
  )
}

function Ast({ step }: { step: number }) {
  return (
    <>
      <h2>El parser ahora construye un árbol</h2>
      <div className="body">
        <div className="plate" style={abs(0, 0, 600)}>float y = x + 2 * 3;</div>
        <p className="lead" style={{ ...abs(0, 110, 600), fontSize: 29 }}>
          Es la misma gramática del punto&nbsp;4. La diferencia: cada regla, al reducirse, crea un nodo.
        </p>
        <div className="plate small" style={{ ...abs(0, 244, 600), fontSize: 24, lineHeight: '36px', padding: '14px 20px' }}>
          {'add_expr: add_expr \'+\' mul_expr\n  { $$ = binary(OP_ADD, $1, $3,\n                @2.first_line); }'}
        </div>
        <p className={rv(step, 4, 'note')} style={{ ...abs(0, 412, 600), fontSize: 25 }}>
          Los paréntesis y el punto y coma no generan nodo: la forma del árbol ya dice el orden.
        </p>
        <div style={abs(696, 0)}><ExampleTree built={step} typed={0} /></div>
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
  ['int · float', 'long long · double', 1],
  ['vector<T> · matrix<T>', 'VxArr', 1],
  ['variable x', 'v_x_N  (N único)', 1],
  ['función f', 'f_f_N  (anidada en main)', 1],
  ['a / b', 'vx_idiv(a, b, línea)', 2],
  ['v[i]', 'vx_get(v, i, línea)', 2],
  ['f(x)', '(vx_enter("f", línea), f_f_N(x))', 2],
  ['try / catch', 'setjmp / longjmp', 2],
] as const

function Codegen({ step }: { step: number }) {
  return (
    <>
      <h2>Generación: el árbol anotado se escribe en C</h2>
      <div className="body">
        <div style={abs(0, 0, 830)}>
          <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr', columnGap: 24, marginBottom: 10 }}>
            <span className="lead" style={{ fontSize: 26 }}>Vortex</span><span className="lead" style={{ fontSize: 26 }}>C generado</span>
          </div>
          <div className="rule" style={{ marginBottom: 12 }} />
          {MAPPING.map(([vx, c, at]) => (
            <div key={vx} className={rv(step, at)} style={{ display: 'grid', gridTemplateColumns: '330px 1fr', columnGap: 24, height: 46, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 24, fontWeight: 600 }}>{vx}</span>
              <span className="mono" style={{ fontSize: 24 }}>{c}</span>
            </div>
          ))}
        </div>
        <div className={rv(step, 3)} style={abs(866, 0, 590)}>
          <div className="plate small">float y = x + 2 * 3;</div>
          <svg width="590" height="64" viewBox="0 0 590 64"><path className="track" d="M40 6 V44" /><Arrow x={40} y={56} dir="d" /></svg>
          <div className="plate small">{'double v_y_2 =\n  ((double)((v_x_1 + (2LL * 3LL))));'}</div>
          <p className="note" style={{ marginTop: 20, fontSize: 25 }}>
            La conversión a double sale de la anotación «int → float»; los nombres, de la tabla de símbolos.
          </p>
        </div>
        <p className="lead" style={{ ...abs(866, 0, 590), fontSize: 30, opacity: step < 3 ? 1 : 0, transition: 'opacity 0.3s' }}>
          codegen.c no reporta errores: recibe un árbol que ya se sabe correcto.
        </p>
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
  { id: 'ast', part: 'extra', station: 2, steps: 4, render: (s) => <Ast step={s} /> },
  { id: 'ambitos', part: 'extra', station: 3, steps: 3, render: (s) => <Scopes step={s} /> },
  { id: 'tipos', part: 'extra', station: 3, steps: 4, render: (s) => <Types step={s} /> },
  { id: 'sobrecarga', part: 'extra', station: 3, steps: 3, render: (s) => <Overload step={s} /> },
  { id: 'generacion', part: 'extra', station: 4, steps: 3, render: (s) => <Codegen step={s} /> },
  { id: 'ejecucion', part: 'extra', station: 5, steps: 4, render: (s) => <Runtime step={s} /> },
  { id: 'recorrido', part: 'extra', station: (s) => Math.min(s, 5), steps: 6, render: (s) => <Journey step={s} /> },
  { id: 'resultados', part: 'extra', station: 5, steps: 2, render: (s) => <Results step={s} /> },
  { id: 'cierre', part: 'extra', station: 5, steps: 0, render: () => <Closing /> },
]
