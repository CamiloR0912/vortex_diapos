/* Recorrido por los archivos del compilador: qué hace cada uno, en palabras
   sencillas. Va después de «Frontend, backend y lo que viaja entre los dos».
   Los nombres de funciones y los mensajes son los reales de vortex_compiler. */
import type { CSSProperties, ReactNode } from 'react'
import { rv } from '../deck'
import { Arrow, TreeNode } from '../ui'

const abs = (left: number, top: number, width?: number): CSSProperties => ({ position: 'absolute', left, top, width })
const during = (step: number, from: number, to: number, extra = '') =>
  `rv${step >= from && step <= to ? ' on' : ''}${extra ? ' ' + extra : ''}`

/** Número en un círculo, para las listas de pasos */
const Num = ({ n }: { n: number }) => (
  <span style={{
    flex: '0 0 44px', height: 44, borderRadius: 22, background: 'var(--ink)', color: 'var(--ground)',
    font: '800 24px var(--sans)', display: 'grid', placeItems: 'center',
  }}>{n}</span>
)

/** «Recibe → Entrega»: la franja de arriba de cada archivo */
function InOut({ gets, gives }: { gets: ReactNode; gives: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', alignItems: 'center', columnGap: 10 }}>
      <div style={{ border: '4px solid var(--ink)', background: '#fff', padding: '10px 18px' }}>
        <span className="note" style={{ fontSize: 20 }}>Recibe</span>
        <p className="lead" style={{ fontSize: 22 }}>{gets}</p>
      </div>
      <svg width="60" height="30" viewBox="0 0 60 30"><path className="guide" d="M6 15 H46" /><Arrow x={50} y={15} /></svg>
      <div style={{ border: '4px solid var(--ink)', background: 'var(--ink)', color: 'var(--ground)', padding: '10px 18px' }}>
        <span style={{ fontSize: 20, opacity: 0.8 }}>Entrega</span>
        <p className="lead" style={{ fontSize: 22 }}>{gives}</p>
      </div>
    </div>
  )
}

/* ------------------------------------- Del parser al semántico: el AST */

const HANDOFF: { title: ReactNode; code: string; note?: string }[] = [
  {
    title: 'Cada vez que el parser reduce una regla, ejecuta su código: arma un nodo con los nodos de sus partes.',
    code: "add_expr '+' mul_expr  { $$ = binary(OP_ADD, $1, $3, …); }",
    note: '$1 y $3 son los subárboles de las partes; $$ es el nodo nuevo.',
  },
  {
    title: 'La última regla que se reduce es la del programa completo. Guarda la raíz del árbol en una variable global:',
    code: 'program: stmt_list  { program_root = $1; }',
  },
  {
    title: 'Cuando yyparse() termina, main.c le pasa esa raíz al semántico:',
    code: 'yyparse();\nsemantic_check(program_root);',
  },
]

export function Handoff({ step }: { step: number }) {
  return (
    <>
      <h2>¿Cómo llega el árbol al semántico?</h2>
      <div className="body">
        <p className={during(step, 0, 0, 'lead')} style={{ ...abs(0, 0, 820), fontSize: 32 }}>
          El parser no le «manda» nada al semántico. Deja el árbol en un lugar que los dos conocen, y main.c hace la entrega.
        </p>
        <div style={abs(0, 0, 840)}>
          {HANDOFF.map((h, i) => (
            <div key={i} className={rv(step, i + 1)} style={{ display: 'flex', gap: 18, marginBottom: 20 }}>
              <Num n={i + 1} />
              <div style={{ flex: 1 }}>
                <p className="lead" style={{ fontSize: 24 }}>{h.title}</p>
                <div className="plate" style={{ fontSize: 20, lineHeight: '28px', padding: '8px 16px', marginTop: 8 }}>{h.code}</div>
                {h.note && <p className="note" style={{ fontSize: 21, marginTop: 4 }}>{h.note}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Derecha: el recorrido del árbol */}
        <svg width="560" height="500" viewBox="0 0 560 500" style={{ position: 'absolute', left: 896, top: 0 }}>
          <g className={rv(step, 1)}>
            <rect className="node fill" x={0} y={0} width={560} height={80} />
            <text className="st inv" x={24} y={36}>parser.y</text>
            <text className="sl sm inv" x={24} y={66}>arma el árbol mientras lee</text>
          </g>
          <g className={rv(step, 2)}>
            <path className="track thin" style={{ stroke: 'var(--syn)' }} d="M280 86 V122" /><Arrow x={280} y={130} dir="d" />
            <rect className="node" x={0} y={136} width={560} height={210} />
            <text className="st" x={24} y={176}>program_root</text>
            <text className="sl sm soft" x={24} y={206}>la raíz: desde ella</text>
            <text className="sl sm soft" x={24} y={234}>se llega a todo</text>
            <text className="sl sm soft" x={24} y={262}>el árbol</text>
            <path className="guide" d="M420 200 L350 230 M420 200 L490 230" />
            <TreeNode x={420} y={172} w={64} label="+" fill />
            <TreeNode x={350} y={258} w={56} label="x" />
            <TreeNode x={490} y={258} w={56} label="*" fill />
            <text className="st sm" x={490} y={322} textAnchor="middle">…</text>
          </g>
          <g className={rv(step, 3)}>
            <path className="track thin" style={{ stroke: 'var(--sem)' }} d="M280 352 V392" /><Arrow x={280} y={400} dir="d" />
            <text className="sl sm" x={300} y={384}>main.c lo entrega</text>
            <rect className="node fill" x={0} y={406} width={560} height={80} />
            <text className="st inv" x={24} y={442}>semantic.c</text>
            <text className="sl sm inv" x={24} y={472}>lo revisa y lo anota</text>
          </g>
        </svg>
        <p className={rv(step, 4, 'lead')} style={{ ...abs(0, 462, 840), fontSize: 25 }}>
          Si hubo errores de sintaxis, el semántico ni se llama.
        </p>
      </div>
    </>
  )
}

/* ---------------------------------------------------------- semantic.c */

const CHECKS: [string, string][] = [
  ['Que cada variable y función exista y se vea desde donde se usa.', "print(y);\n→ undefined variable 'y'"],
  ['Que los tipos encajen en cada operación, asignación y condición.', "int z = 3 + true;\n→ operator '+' cannot be applied to int and bool"],
  ['Cuál versión de una función sobrecargada se está llamando.', 'mix(1, 1)\n→ ambiguous call mix(int, int)'],
  ['Que break y continue estén dentro de un ciclo, y return dentro de una función.', "break;\n→ 'break' outside of a loop"],
]

export function FileSemantic({ step }: { step: number }) {
  return (
    <>
      <h2>semantic.c: revisa que el programa tenga sentido</h2>
      <div className="body">
        <InOut gets="El árbol que dejó el parser" gives="El mismo árbol, con el tipo de cada nodo y su variable" />
        <p className="lead" style={{ ...abs(0, 104), fontSize: 25 }}>Revisa lo que la gramática no puede ver:</p>
        {CHECKS.map(([what, ex], i) => (
          <div key={i} className={rv(step, i + 1)} style={{ ...abs(0, 150 + i * 80, 1456), display: 'grid', gridTemplateColumns: '44px 640px 1fr', columnGap: 18, alignItems: 'center' }}>
            <Num n={i + 1} />
            <span className="lead" style={{ fontSize: 24 }}>{what}</span>
            <div className="plate out" style={{ fontSize: 19, lineHeight: '26px', padding: '6px 14px' }}>{ex}</div>
          </div>
        ))}
        <p className={rv(step, 5, 'note')} style={{ ...abs(0, 474, 1456), fontSize: 23 }}>
          Si encuentra errores, los imprime todos con su línea y no se genera el ejecutable.
        </p>
      </div>
    </>
  )
}

/* --------------------------------------------------------------- ast.c */

const AST_FNS: [string, string, string][] = [
  ['mk(…)', 'Crea un nodo nuevo del árbol.', 'parser.y'],
  ['list_append(…)', 'Encadena las sentencias de un bloque, una tras otra.', 'parser.y'],
  ['type_name(t)', 'Escribe un tipo como texto para los mensajes: "vector<float>".', 'semantic.c'],
  ['assign_cost(de, a)', '¿Se puede guardar un valor de un tipo en otro? 0: sí, es igual. 1: sí, convirtiendo int → float. −1: no. Con esto se decide la sobrecarga.', 'semantic.c'],
  ['unify(a, b)', 'El tipo común de dos valores: int y float → float.', 'semantic.c'],
]

export function FileAst({ step }: { step: number }) {
  return (
    <>
      <h2>ast.c: la caja de herramientas del árbol</h2>
      <div className="body">
        <p className="lead" style={{ fontSize: 28 }}>
          No es una etapa: son funciones pequeñas que usan parser.y para construir el árbol y semantic.c para razonar sobre los tipos.
        </p>
        <div style={{ ...abs(0, 96, 1456), display: 'grid', gridTemplateColumns: '290px 1fr 170px', columnGap: 24, paddingBottom: 6 }}>
          <span className="note" style={{ fontSize: 21 }}>función</span>
          <span className="note" style={{ fontSize: 21 }}>qué hace</span>
          <span className="note" style={{ fontSize: 21 }}>la usa</span>
        </div>
        {AST_FNS.map(([fn, what, who], i) => (
          <div key={fn} className={rv(step, i < 2 ? 1 : 2)} style={{ ...abs(0, 128 + i * 72, 1456), display: 'grid', gridTemplateColumns: '290px 1fr 170px', columnGap: 24, alignItems: 'center', borderTop: '4px solid var(--ink)', minHeight: 72, padding: '6px 0' }}>
            <span className="mono" style={{ fontSize: 23, fontWeight: 600, color: 'var(--syn)' }}>{fn}</span>
            <span className="lead" style={{ fontSize: i === 3 ? 21 : 24 }}>{what}</span>
            <span className="tag" style={{ justifySelf: 'start' }}>{who}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------ x86gen.c */

const GEN_STEPS = [
  'Le asigna a cada variable una casilla en la memoria: a → [rbp-8], b → [rbp-16].',
  'Recorre el árbol: primero los hijos, después el nodo. Cada nodo produce sus instrucciones.',
  'Al final agrega las rutinas de runtime.c (imprimir, memoria, errores) y le pide a elf.c que escriba el archivo.',
]

export function FileGen({ step }: { step: number }) {
  return (
    <>
      <h2>x86gen.c: elige las instrucciones del procesador</h2>
      <div className="body">
        <InOut gets="El árbol anotado por semantic.c" gives="Las instrucciones del programa, ya en bytes" />
        <div style={abs(0, 126, 720)}>
          {GEN_STEPS.map((s, i) => (
            <div key={i} className={rv(step, i + 1)} style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
              <Num n={i + 1} />
              <p className="lead" style={{ fontSize: 24 }}>{s}</p>
            </div>
          ))}
        </div>
        {/* Qué son rax y rcx, para leer el ejemplo de la derecha */}
        <div className={rv(step, 2)} style={{ ...abs(0, 384, 720), borderTop: '4px solid var(--ink)', paddingTop: 10 }}>
          <p className="lead" style={{ fontSize: 22 }}>
            <span className="mono" style={{ color: 'var(--syn)' }}>rax</span> y <span className="mono" style={{ color: 'var(--syn)' }}>rcx</span> son registros: casillas dentro del procesador.
          </p>
          <p className="lead" style={{ fontSize: 22, marginTop: 4 }}>
            <span className="mono" style={{ color: 'var(--syn)' }}>rax</span>: guarda el resultado de cada cálculo.
          </p>
          <p className="lead" style={{ fontSize: 22 }}>
            <span className="mono" style={{ color: 'var(--syn)' }}>rcx</span>: ayudante, guarda el segundo valor de una operación.
          </p>
        </div>
        <div className={rv(step, 2)} style={abs(780, 126, 676)}>
          <p style={{ font: '800 24px var(--sans)', marginBottom: 8 }}>print(a + b);</p>
          <div className="plate" style={{ fontSize: 21, lineHeight: '30px', padding: '10px 18px' }}>
            {[
              ['mov  rax, [rbp-8]', 'trae a'],
              ['push rax', 'la guarda'],
              ['mov  rax, [rbp-16]', 'trae b'],
              ['mov  rcx, rax', ''],
              ['pop  rax', 'recupera a'],
              ['add  rax, rcx', 'suma'],
              ['call print_int', 'imprime'],
            ].map(([code, what]) => (
              <div key={code + what} style={{ display: 'grid', gridTemplateColumns: '290px 1fr' }}>
                <span>{code}</span>
                <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, color: 'var(--syn)' }}>{what}</span>
              </div>
            ))}
          </div>
          <p className="note" style={{ fontSize: 21, marginTop: 10 }}>
            No escribe texto: por cada instrucción llama a una función de x86enc.c (x_push, x_add_rr…).
          </p>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------ x86enc.c */

const ENC: [string, string, string][] = [
  ['push rax', '50', 'guarda rax en la pila'],
  ['pop rax', '58', 'lo saca de la pila'],
  ['add rax, rcx', '48 01 C8', 'suma rcx a rax'],
  ['dec rbx', '48 FF CB', 'le resta 1 a rbx'],
  ['ret', 'C3', 'vuelve de una rutina'],
]

export function FileEnc({ step }: { step: number }) {
  return (
    <>
      <h2>x86enc.c: convierte cada instrucción en bytes</h2>
      <div className="body">
        <InOut gets="Una instrucción: «push rax»" gives="Su código en bytes: 50" />
        <p className="lead" style={{ ...abs(0, 118, 1456), fontSize: 26 }}>
          El procesador no lee texto: lee números. Cada instrucción tiene un código fijo, definido por Intel.
        </p>
        <div className={rv(step, 1)} style={abs(0, 178, 860)}>
          {ENC.map(([ins, bytes, what]) => (
            <div key={ins} style={{ display: 'grid', gridTemplateColumns: '230px 190px 1fr', alignItems: 'center', height: 54, borderTop: '3px solid var(--ink)' }}>
              <span className="mono" style={{ fontSize: 24, fontWeight: 600 }}>{ins}</span>
              <span className="mono" style={{ fontSize: 24, color: 'var(--gen)', fontWeight: 600, background: 'var(--ink)', padding: '4px 10px', justifySelf: 'start' }}>{bytes}</span>
              <span className="lead" style={{ fontSize: 23 }}>{what}</span>
            </div>
          ))}
        </div>
        <div className={rv(step, 2)} style={abs(920, 178, 536)}>
          <p className="lead" style={{ fontSize: 25 }}>Va escribiendo los bytes uno tras otro en dos listas:</p>
          <p className="lead" style={{ fontSize: 25, marginTop: 10 }}><span className="b">código</span> (las instrucciones) y <span className="b">datos</span> (textos y números fijos).</p>
          <p className="lead" style={{ fontSize: 25, marginTop: 22 }}>
            Si una instrucción salta a un lugar que todavía no se ha escrito, deja un hueco y lo llena después.
          </p>
        </div>
      </div>
    </>
  )
}

/* --------------------------------------------------------------- elf.c */

const ELF_STEPS = [
  'Escribe la cabecera: «soy un ejecutable de Linux, de 64 bits, para procesadores x86-64; empieza aquí».',
  'Escribe 3 instrucciones de carga: qué parte del archivo copiar a la memoria, dónde y con qué permisos.',
  'Copia los bytes del código y de los datos.',
  'Marca el archivo como ejecutable (chmod 755), para poder correrlo con ./demo.',
]
const ELF_PARTS: [string, string, number][] = [
  ['cabecera', '64 bytes', 54], ['instrucciones de carga', '3 × 56 bytes', 54], ['código', 'las instrucciones', 110], ['datos', 'textos y números fijos', 74],
]

export function FileElf({ step }: { step: number }) {
  return (
    <>
      <h2>elf.c: empaca los bytes en un archivo ejecutable</h2>
      <div className="body">
        <InOut gets="Las dos listas de bytes: código y datos" gives="El archivo demo, listo para correr" />
        <div style={abs(0, 126, 840)}>
          {ELF_STEPS.map((s, i) => (
            <div key={i} className={rv(step, i + 1)} style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
              <Num n={i + 1} />
              <p className="lead" style={{ fontSize: 24 }}>{s}</p>
            </div>
          ))}
        </div>
        <div style={abs(920, 126, 536)}>
          <p style={{ font: '800 24px var(--sans)', marginBottom: 8 }}>demo</p>
          {ELF_PARTS.map(([name, what, h], i) => (
            <div key={name} className={rv(step, i === 0 ? 1 : i === 1 ? 2 : 3)} style={{
              height: h, border: '4px solid var(--ink)', marginTop: -4, padding: '8px 16px',
              background: i < 2 ? 'var(--ink)' : '#fff', color: i < 2 ? 'var(--ground)' : 'var(--ink)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 800, fontSize: 23 }}>{name}</span>
              <span style={{ fontSize: 20, fontWeight: 600, opacity: 0.8 }}>{what}</span>
            </div>
          ))}
          <p className="note" style={{ fontSize: 21, marginTop: 10 }}>ELF es el formato de los ejecutables en Linux, como .exe en Windows.</p>
        </div>
      </div>
    </>
  )
}

/* -------------------------------------------------------------- main.c */

const MAIN_FLOW: [string, string][] = [
  ['Lee la línea de comandos', 'el archivo .vx y las opciones -o y --run'],
  ['yyparse()', 'léxico y sintáctico: arma el árbol'],
  ['semantic_check(program_root)', 'revisa y anota el árbol'],
  ['generate_native(program_root, …)', 'x86gen + x86enc + runtime + elf: el ejecutable'],
  ['Con --run', 'lo ejecuta y después lo borra'],
]

export function FileMain({ step }: { step: number }) {
  return (
    <>
      <h2>main.c: el director de orquesta</h2>
      <div className="body">
        <p className="lead" style={{ ...abs(0, 0, 840), fontSize: 26 }}>No analiza ni genera nada: llama a cada etapa en orden y decide si se sigue.</p>
        <div style={abs(0, 84, 840)}>
          {MAIN_FLOW.map(([call, what], i) => (
            <div key={call} className={rv(step, i + 1)}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Num n={i + 1} />
                <div>
                  <span className={i === 0 ? undefined : 'mono'} style={{ fontSize: 23, fontWeight: i === 0 ? 800 : 600 }}>{call}</span>
                  <p className="note" style={{ fontSize: 21, color: 'var(--ink)' }}>{what}</p>
                </div>
              </div>
              {(i === 1 || i === 2) && (
                <p className="note" style={{ fontSize: 20, margin: '2px 0 2px 60px', color: 'var(--lex)', fontWeight: 600 }}>
                  ¿hubo errores? → «N error(s) found; program not compiled.» y se detiene
                </p>
              )}
              <div style={{ height: 12 }} />
            </div>
          ))}
        </div>
        <div className={rv(step, 4)} style={abs(900, 70, 556)}>
          <div className="plate out" style={{ fontSize: 21, lineHeight: '32px', padding: '12px 18px' }}>
            {'$ ./vortexc demo.vx\nCompiled demo.vx -> demo\n\n$ ./vortexc demo.vx -o prog\nCompiled demo.vx -> prog\n\n$ ./vortexc malo.vx\n[Semantic error] line 1: …\n1 error(s) found; program not compiled.'}
          </div>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------------------------- runtime.c */

const RT: [string, string][] = [
  ['print_int · print_float · print_str', 'escriben números y textos en la pantalla'],
  ['str_int · str_float', 'convierten un número en texto: "x = " + 5'],
  ['concat · strcmp', 'unen y comparan cadenas'],
  ['alloc', 'da memoria para cadenas y arreglos nuevos'],
  ['raise', 'lanza una excepción o un error de ejecución'],
  ['exit', 'imprime lo pendiente y termina el programa'],
]

export function FileRuntime({ step }: { step: number }) {
  return (
    <>
      <h2>runtime.c: lo que el programa necesita mientras corre</h2>
      <div className="body">
        <p className="lead" style={{ ...abs(0, 0, 1456), fontSize: 27 }}>
          Sin la biblioteca de C no hay printf ni malloc. vortexc mete en cada ejecutable sus propias rutinas, ya en código máquina.
        </p>
        <div className={rv(step, 1)} style={abs(0, 100, 1456)}>
          {RT.map(([name, what]) => (
            <div key={name} style={{ display: 'grid', gridTemplateColumns: '560px 1fr', alignItems: 'center', height: 52, borderTop: '3px solid var(--ink)' }}>
              <span className="mono" style={{ fontSize: 23, fontWeight: 600, color: 'var(--syn)' }}>{name}</span>
              <span className="lead" style={{ fontSize: 24 }}>{what}</span>
            </div>
          ))}
        </div>
        <div className={rv(step, 2)} style={{ ...abs(0, 436, 1456), display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="lead" style={{ fontSize: 25 }}>Con Linux solo hablan por 3 llamadas:</span>
          <span className="chip">write · escribir</span>
          <span className="chip">mmap · pedir memoria</span>
          <span className="chip">exit · terminar</span>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------- runtime_arrays.c */

const RTA: [string, string, string][] = [
  ['[1, 2, 3]', 'arr_new', 'crea el bloque en memoria'],
  ['v[i]', 'vec_get', 'lee el elemento, revisando que i esté en rango'],
  ['v + w', 'arr_arr', 'suma elemento por elemento'],
  ['v * 2', 'arr_scalar', 'multiplica cada elemento'],
  ['sum(v) · max(v)', 'reduce', 'recorre y acumula'],
  ['v == w', 'arr_eq', 'compara los dos arreglos'],
  ['w = v', 'arr_copy', 'copia: cada variable tiene su propio arreglo'],
  ['print(m)', 'print_arr', 'imprime [[1, 2], [3, 4]]'],
]

export function FileRuntimeArrays({ step }: { step: number }) {
  return (
    <>
      <h2>runtime_arrays.c: rutinas para vectores y matrices</h2>
      <div className="body">
        <p className="lead" style={{ ...abs(0, 0, 1456), fontSize: 26 }}>
          Lo mismo que runtime.c, pero para arreglos. Cuando el programa usa un vector, x86gen.c escribe una llamada a la rutina que toca.
        </p>
        <div style={{ ...abs(0, 82, 1456), display: 'grid', gridTemplateColumns: '300px 230px 1fr', paddingBottom: 4 }}>
          <span className="note" style={{ fontSize: 21 }}>en Vortex</span>
          <span className="note" style={{ fontSize: 21 }}>rutina</span>
          <span className="note" style={{ fontSize: 21 }}>qué hace</span>
        </div>
        {RTA.map(([vx, r, what], i) => (
          <div key={r} className={rv(step, i < 4 ? 1 : 2)} style={{ ...abs(0, 114 + i * 49, 1456), display: 'grid', gridTemplateColumns: '300px 230px 1fr', alignItems: 'center', height: 49, borderTop: '3px solid var(--ink)' }}>
            <span className="mono" style={{ fontSize: 23, fontWeight: 600 }}>{vx}</span>
            <span className="mono" style={{ fontSize: 22, color: 'var(--syn)', fontWeight: 600 }}>{r}</span>
            <span className="lead" style={{ fontSize: 23 }}>{what}</span>
          </div>
        ))}
      </div>
    </>
  )
}
