import type { CSSProperties } from 'react'
import { rv } from '../deck'
import type { SceneDef } from '../deck'
import { Arrow, Check, Cross, Ends, NonT, Term, TreeNode } from '../ui'

const delay = (s: number): CSSProperties => ({ transitionDelay: `${s}s` })

/* ------------------------------------------------------------------ Portada */

function Cover() {
  return (
    <div className="cover">
      <h1 style={{ top: 30 }}>Vortex</h1>
      <p className="motto" style={{ top: 290 }}>De los caracteres<br />al <em>ejecutable</em>.</p>
      <p className="parts" style={{ top: 436 }}>
        Analizador léxico y sintáctico (punto 4)<br />y el compilador vortexc (punto extra)<br />
        Lenguajes Formales · UPTC · Taller final
      </p>
      <p className="hint">Flecha derecha para avanzar</p>

      {/* Carta sintáctica de una declaración: el dibujo es la gramática */}
      <svg className="chart" width="660" height="470" viewBox="0 0 600 428" style={{ top: 70, '--line': 'var(--syn)' } as CSSProperties}>
        <text className="st" x="20" y="28">var_decl</text>
        <path className="track" d="M20 90 H540 q30 0 30 30 v50 q0 30 -30 30 H60 q-30 0 -30 30 v50 q0 30 30 30 H580" />
        <Ends x1={20} x2={580} y={90} />
        <circle cx={20} cy={90} r={11} fill="var(--ink)" />
        <NonT x={150} y={90} w={110} label="type" />
        <Term x={390} y={90} w={200} label="IDENTIFIER" />
        <Term x={110} y={310} w={64} label="=" />
        <NonT x={290} y={310} w={120} label="expr" />
        <Term x={470} y={310} w={64} label=";" />
        <circle cx={580} cy={90} r={14} fill="var(--ground)" />
        <path className="track" d="M540 90 q30 0 30 30" />
        <circle cx={580} cy={310} r={11} fill="var(--ground)" stroke="var(--ink)" strokeWidth={6} />
        <text className="sl sm" x="20" y="396">Terminales en óvalo, no terminales en caja</text>
      </svg>
    </div>
  )
}

/* ------------------------------------------------- A1: el lenguaje Vortex */

const SAMPLE: { text: string; at?: number }[] = [
  { text: 'vector<float> datos = [2, 4, 4, 5];', at: 1 },
  { text: '' },
  { text: 'func float media(vector<float> xs) {', at: 2 },
  { text: '    assert(len(xs) > 0, "vector vacío");', at: 5 },
  { text: '    return sum(xs) / len(xs);', at: 3 },
  { text: '}' },
  { text: '' },
  { text: 'try {', at: 5 },
  { text: '    if (media(datos) > 3.0) { print("alto"); }', at: 4 },
  { text: '} catch (e) {', at: 5 },
  { text: '    print("error:", e);' },
  { text: '}' },
]
const FEATURES = [
  { at: 1, line: 0, text: 'Tipos explícitos: int, float, bool, string, vector<T>, matrix<T>' },
  { at: 2, line: 2, text: 'Funciones con recursión, anidamiento y sobrecarga' },
  { at: 3, line: 4, text: 'Reducciones: sum, prod, max, min' },
  { at: 4, line: 8, text: 'Control de flujo con llaves obligatorias' },
  { at: 5, line: 10, text: 'Excepciones: try, catch, throw, assert' },
]

function Language({ step }: { step: number }) {
  return (
    <>
      <h2>Vortex</h2>
      <div className="body">
        <div className="plate" style={{ position: 'absolute', left: 0, top: 0, width: 800, fontSize: 24, lineHeight: '36px', padding: '14px 24px' }}>
          {SAMPLE.map((l, i) => (
            <div key={i} className={l.at && step >= l.at ? 'hl' : undefined} style={{ minHeight: 36, transition: 'background 0.4s' }}>
              {l.text}
            </div>
          ))}
        </div>
        {FEATURES.map((f) => (
          <div
            key={f.at} className={rv(step, f.at, 'lead')}
            style={{ position: 'absolute', left: 836, top: 10 + f.line * 36, width: 620, fontSize: 28, display: 'flex', gap: 16, alignItems: 'baseline' }}
          >
            <span style={{ flex: '0 0 44px', height: 4, background: 'var(--ink)', transform: 'translateY(-9px)' }} />
            <span>{f.text}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* --------------------------------------------- A2: de caracteres a tokens */

const SRC = 'float y = x + 2 * 3;'
const TOKENS = [
  { from: 0, to: 4, name: 'T_FLOAT', at: 1, d: 0 },
  { from: 6, to: 6, name: 'IDENTIFIER', val: '"y"', at: 2, d: 0 },
  { from: 8, to: 8, name: "'='", at: 3, d: 0 },
  { from: 10, to: 10, name: 'IDENTIFIER', val: '"x"', at: 4, d: 0 },
  { from: 12, to: 12, name: "'+'", at: 4, d: 0.25 },
  { from: 14, to: 14, name: 'INT_LIT', val: '"2"', at: 4, d: 0.5 },
  { from: 16, to: 16, name: "'*'", at: 4, d: 0.75 },
  { from: 18, to: 18, name: 'INT_LIT', val: '"3"', at: 4, d: 1 },
  { from: 19, to: 19, name: "';'", at: 4, d: 1.25 },
]
const tileX = (i: number) => 128 + i * 60

function Tokens({ step }: { step: number }) {
  return (
    <>
      <h2>El léxico agrupa caracteres en tokens</h2>
      <div className="body">
        <svg width="1456" height="400" viewBox="0 0 1456 400">
          {SRC.split('').map((ch, i) => {
            const tok = TOKENS.find((t) => i >= t.from && i <= t.to)
            const lit = tok !== undefined && step >= tok.at
            return (
              <g key={i} className={lit ? 'lit' : undefined}>
                <rect className="t-term" style={delay(lit ? tok.d : 0)} x={tileX(i)} y={20} width={56} height={70} />
                <text className="st big" style={delay(lit ? tok.d : 0)} x={tileX(i) + 28} y={66} textAnchor="middle">{ch}</text>
              </g>
            )
          })}
          {TOKENS.map((t, i) => {
            const cx = (tileX(t.from) + tileX(t.to) + 56) / 2
            const y = i % 2 === 0 ? 176 : 262
            const w = t.name.length * 14.6 + 40
            return (
              <g key={i} className={rv(step, t.at)} style={delay(t.d)}>
                <path className="guide" d={`M${cx} 96 V${y - 26}`} />
                <rect className="t-term" x={cx - w / 2} y={y - 26} width={w} height={52} rx={26} />
                <text className="st" x={cx} y={y + 9} textAnchor="middle">{t.name}</text>
                {t.val && <text className="st sm" x={cx} y={y + 58} textAnchor="middle">yylval = {t.val}</text>}
              </g>
            )
          })}
        </svg>
        <p className={rv(step, 2, 'lead')} style={{ position: 'absolute', left: 0, top: 386, width: 700 }}>
          Los espacios y los comentarios se descartan: nunca llegan al sintáctico.
        </p>
        <p className="note mono" style={{ position: 'absolute', right: 0, top: 392, fontSize: 24 }}>
          lexer.l → Flex → lex.yy.c
        </p>
      </div>
    </>
  )
}

/* --------------------------------- A3: expresiones regulares y autómata */

const NUM = ['3', '.', '1', '4']
const ACTIVE = [0, 0, 1, 2, 3, 3] // estado activo en cada paso
const VERDICT = ['', '', 'INT_LIT', 'todavía no es un número', 'FLOAT_LIT', 'FLOAT_LIT']
const QX = [70, 270, 470, 670]

function Regex({ step }: { step: number }) {
  const act = ACTIVE[step]
  return (
    <>
      <h2>Cada token es una expresión regular</h2>
      <div className="body">
        <div className="plate" style={{ position: 'absolute', left: 0, top: 0, width: 640, lineHeight: '46px' }}>
          {'DIGITO    [0-9]\nLETRA     [a-zA-Z_]\nID        {LETRA}({LETRA}|{DIGITO})*\nENTERO    {DIGITO}+\nFLOTANTE  {DIGITO}+\\.{DIGITO}+'}
        </div>
        <p className="lead" style={{ position: 'absolute', left: 0, top: 300, width: 640 }}>
          Flex convierte cada expresión en un autómata finito y los une en uno solo.
        </p>

        <svg className={rv(step, 1)} style={{ position: 'absolute', left: 700, top: 0 }} width="756" height="500" viewBox="0 0 756 500">
          {/* Cinta de entrada */}
          {NUM.map((ch, i) => (
            <g key={i} className={step >= i + 2 ? 'lit' : undefined}>
              <rect className="t-term" x={250 + i * 64} y={0} width={60} height={70} />
              <text className="st big" x={280 + i * 64} y={46} textAnchor="middle">{ch}</text>
            </g>
          ))}
          <text className="sl sm" x={236} y={44} textAnchor="end">entrada</text>

          {/* Transiciones */}
          <path className="guide" d="M0 250 H22" /><Arrow x={24} y={250} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path className={`guide draw${step >= 1 ? ' on' : ''}`} pathLength={1} d={`M${QX[i] + 46} 250 H${QX[i + 1] - 50}`} />
              <Arrow x={QX[i + 1] - 48} y={250} />
              <text className="sl sm" x={(QX[i] + QX[i + 1]) / 2} y={228} textAnchor="middle">{i === 1 ? 'punto' : 'dígito'}</text>
            </g>
          ))}
          {[1, 3].map((i) => (
            <g key={i}>
              <path className={`guide draw${step >= 1 ? ' on' : ''}`} pathLength={1} d={`M${QX[i] - 22} 210 C${QX[i] - 50} 130 ${QX[i] + 50} 130 ${QX[i] + 22} 210`} />
              <Arrow x={QX[i] + 22} y={210} dir="d" />
              <text className="sl sm" x={QX[i]} y={138} textAnchor="middle">dígito</text>
            </g>
          ))}

          {/* Estados: doble círculo en los de aceptación */}
          {QX.map((x, i) => (
            <g key={i}>
              <circle className={`state${act === i && step >= 1 ? ' act' : ''}`} cx={x} cy={250} r={44} />
              {(i === 1 || i === 3) && <circle cx={x} cy={250} r={34} fill="none" stroke="var(--ink)" strokeWidth={4} />}
              <text className={`st${act === i ? ' inv' : ''}`} x={x} y={259} textAnchor="middle">q{i}</text>
            </g>
          ))}
          <text className="st sm" x={QX[1]} y={334} textAnchor="middle">INT_LIT</text>
          <text className="st sm" x={QX[3]} y={334} textAnchor="middle">FLOAT_LIT</text>

          <text className="sl" x={0} y={430}>{step >= 2 ? `Reconocido hasta aquí: ${VERDICT[step]}` : 'Autómata de los números'}</text>
          <text className="sl sm" x={0} y={470}>{step === 3 ? 'q2 no es de aceptación: «3.» no es un token válido.' : ' '}</text>
        </svg>
      </div>
    </>
  )
}

/* ------------------------------- A4: palabra reservada o identificador */

function Bars({ word, y, idLen, show, verdict, token }: { word: string; y: number; idLen: number; show: boolean; verdict: string; token: string }) {
  return (
    <g className={show ? 'rv on' : 'rv'}>
      {word.split('').map((ch, i) => (
        <g key={i}>
          <rect className="t-term" x={230 + i * 60} y={y} width={56} height={70} />
          <text className="st big" x={258 + i * 60} y={y + 46} textAnchor="middle">{ch}</text>
        </g>
      ))}
      <text className="st" x={200} y={y + 122} textAnchor="end">regla "int"</text>
      <path className="track" d={`M236 ${y + 114} H${230 + 3 * 60 - 10}`} />
      <text className="st" x={200} y={y + 162} textAnchor="end">regla {'{ID}'}</text>
      <path className="track ink" d={`M236 ${y + 154} H${230 + idLen * 60 - 10}`} />
      <text className="sl" x={760} y={y + 44}>{verdict}</text>
      <rect className="t-term" x={760} y={y + 76} width={token.length * 14.6 + 40} height={52} rx={26} />
      <text className="st" x={780} y={y + 111}>{token}</text>
    </g>
  )
}

function Reserved({ step }: { step: number }) {
  return (
    <>
      <h2>¿Palabra reservada o identificador?</h2>
      <div className="body">
        <svg width="1456" height="500" viewBox="0 0 1456 500">
          <Bars word="int" y={10} idLen={3} show={step >= 1} verdict="Empate en 3: gana la regla escrita primero" token="T_INT" />
          <Bars word="integer" y={260} idLen={7} show={step >= 2} verdict="7 contra 3: gana la coincidencia más larga" token="IDENTIFIER" />
        </svg>
        <p className={rv(step, 0, 'lead')} style={{ position: 'absolute', left: 0, top: 200, width: 1300, opacity: step === 0 ? 1 : 0 }}>
          Dos reglas pueden reconocer el mismo texto. Flex decide con dos criterios, en este orden.
        </p>
      </div>
    </>
  )
}

/* ------------------------------------------------- A5: errores léxicos */

const LEX_ERRORS = [
  ['int d = 3 @ 4;', "[Lexical error] line 7: invalid character '@'"],
  ['string bad = "missing quote;', '[Lexical error] line 3: unterminated string'],
  ['/* nunca se cierra', '[Lexical error] line 5: unterminated block comment'],
]

function FlowRow({ at, step, left, right }: { at: number; step: number; left: string; right: string }) {
  return (
    <div className={rv(step, at)} style={{ display: 'grid', gridTemplateColumns: '520px 70px 1fr', alignItems: 'center', marginBottom: 26 }}>
      <div className="plate">{left}</div>
      <svg width="70" height="30" viewBox="0 0 70 30"><path className="guide" d="M8 15 H56" /><Arrow x={60} y={15} /></svg>
      <div className="plate out small">{right}</div>
    </div>
  )
}

function LexErrors({ step }: { step: number }) {
  return (
    <>
      <h2>Un error léxico no detiene el análisis</h2>
      <div className="body">
        <p className="lead" style={{ marginBottom: 34, maxWidth: 1200 }}>
          El léxico reporta el error con su línea, descarta el texto y sigue leyendo.
        </p>
        {LEX_ERRORS.map(([l, r], i) => <FlowRow key={i} at={i + 1} step={step} left={l} right={r} />)}
      </div>
    </>
  )
}

/* ------------------------------------- A6: el sintáctico pide los tokens */

function Handshake({ step }: { step: number }) {
  return (
    <>
      <h2>El sintáctico pide los tokens uno a uno</h2>
      <div className="body">
        <svg width="1456" height="500" viewBox="0 0 1456 500">
          <rect className="node fill" x={0} y={20} width={440} height={280} />
          <text className="st big inv" x={36} y={84} style={{ fontSize: 44 }}>yyparse()</text>
          <text className="st inv" x={36} y={150}>parser.y → Bison</text>
          <text className="sl sm inv" x={36} y={192}>gramática libre de contexto</text>
          <text className="sl sm inv" x={36} y={234}>autómata de pila LALR(1)</text>

          <rect className="node" x={1016} y={20} width={440} height={280} />
          <text className="st big" x={1052} y={84} style={{ fontSize: 44 }}>yylex()</text>
          <text className="st" x={1052} y={150}>lexer.l → Flex</text>
          <text className="sl sm" x={1052} y={192}>expresiones regulares</text>
          <text className="sl sm" x={1052} y={234}>autómata finito</text>

          <g className={rv(step, 1)}>
            <path className="guide" strokeDasharray="12 10" d="M452 96 H996" /><Arrow x={1002} y={96} />
            <text className="sl" x={728} y={76} textAnchor="middle">«dame el siguiente token»</text>
          </g>
          <g className={rv(step, 2)}>
            <path className="track" d="M1004 226 H464" /><Arrow x={456} y={226} dir="l" />
            {([['token', 'su código', 566], ['yylval', 'el lexema', 728], ['yylloc', 'la línea', 890]] as const).map(([t, what, x]) => (
              <g key={t}>
                <rect className="t-term" x={x - 70} y={150} width={140} height={52} rx={26} />
                <text className="st" x={x} y={185} textAnchor="middle">{t}</text>
                <text className="sl sm" x={x} y={274} textAnchor="middle">{what}</text>
              </g>
            ))}
          </g>
        </svg>
        <div className={rv(step, 3, 'plate out')} style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center' }}>
          parser.y:  145 producciones  ·  279 estados LALR(1)  ·  0 conflictos
        </div>
      </div>
    </>
  )
}

/* ----------------------------------- A7: la gramática dibujada como vías */

const RAIL = [
  { kind: 'n', x: 200, w: 150, label: 'type', tok: 'float' },
  { kind: 't', x: 470, w: 200, label: 'IDENTIFIER', tok: 'y' },
  { kind: 't', x: 760, w: 80, label: '=', tok: '=' },
  { kind: 'n', x: 980, w: 130, label: 'expr', tok: 'x + 2 * 3' },
  { kind: 't', x: 1220, w: 80, label: ';', tok: ';' },
]

function Railroad({ step }: { step: number }) {
  // Pasos: 1 se dibuja la vía; 2 a 6 entra un token por paso; 7 el desvío de error
  const detour = step >= 7
  const DETOUR = 'M470 150 H610 q30 0 30 30 v70 q0 30 30 30 H1060'
  return (
    <>
      <h2>La gramática, dibujada como vías</h2>
      <div className="body">
        <svg width="1456" height="500" viewBox="0 0 1456 500">
          <text className="st" x={30} y={36}>var_decl</text>
          <path className={`track draw${step >= 1 ? ' on' : ''}`} pathLength={1} d="M40 150 H1400" />
          <path className={`track ink thin draw${detour ? ' on' : ''}`} pathLength={1} d="M610 150 q30 0 30 30 v70 q0 30 30 30 H1060" />
          <g className={rv(step, 7)}>
            <Term x={850} y={280} w={80} label=";" />
            <circle cx={1060} cy={280} r={11} fill="var(--ground)" stroke="var(--ink)" strokeWidth={6} />
            <Cross x={1108} y={280} />
            <text className="sl sm" x={1140} y={288}>desvío: regla de error</text>
          </g>
          <g className={rv(step, 1)}>
            <Ends x1={40} x2={1400} y={150} />
            {RAIL.map((p, i) => {
              const lit = step >= i + 2
              const Piece = p.kind === 'n' ? NonT : Term
              return (
                <g key={i}>
                  <Piece x={p.x} y={150} w={p.w} label={p.label} lit={lit} />
                  {/* El token rueda desde el inicio de la vía hasta la pieza que lo consume */}
                  <text
                    className="st tok" x={p.x} y={96} textAnchor="middle"
                    style={{ transform: `translateX(${lit ? 0 : 40 - p.x}px)`, opacity: lit ? 1 : 0 }}
                  >
                    {p.tok}
                  </text>
                </g>
              )
            })}
          </g>
          <g className={rv(step, 6)}><Check x={1448} y={150} s={1.3} /></g>
          {/* El tren de «int y;» toma el desvío y termina en la regla de error */}
          <circle
            className="carrier" r={14} fill="var(--ink)"
            style={{ offsetPath: `path('${DETOUR}')`, offsetDistance: detour ? '100%' : '0%', opacity: detour ? 1 : 0 }}
          />

          <rect className="t-term" x={0} y={372} width={74} height={40} rx={20} />
          <text className="sl sm" x={90} y={400}>terminal: un token</text>
          <rect className="t-nont" x={0} y={424} width={74} height={40} />
          <text className="sl sm" x={90} y={452}>no terminal: otra regla</text>
        </svg>
        <div className={rv(step, 7)} style={{ position: 'absolute', left: 380, right: 0, top: 386, display: 'grid', gridTemplateColumns: '150px 1fr', columnGap: 14 }}>
          <div className="plate small" style={{ padding: '14px 18px' }}>int y;</div>
          <div className="plate out small" style={{ padding: '14px 18px' }}>[Invalid construct] line 4: variable 'y' must be initialized</div>
        </div>
      </div>
    </>
  )
}

/* -------------------------------- A8: la precedencia vive en la gramática */

const LEVELS = [
  ['or_expr', '||'], ['and_expr', '&&'], ['eq_expr', '==  !='], ['rel_expr', '<  >  <=  >='],
  ['add_expr', '+  -'], ['mul_expr', '*  /  %'], ['unary', '-  !'], ['postfix', '[ ]'], ['primary', 'literales  ( )'],
]

function Precedence({ step }: { step: number }) {
  return (
    <>
      <h2>La precedencia vive en la gramática</h2>
      <div className="body">
        <svg width="1456" height="500" viewBox="0 0 1456 500">
          <path className="track" d="M30 22 V478" />
          {LEVELS.map(([name, ops], i) => {
            const y = 24 + i * 56
            const hot = step >= 2 && (i === 4 || i === 5)
            return (
              <g key={name}>
                <circle cx={30} cy={y} r={13} fill={hot ? 'var(--ink)' : 'var(--ground)'} stroke="var(--ink)" strokeWidth={5} />
                <text className="st" x={66} y={y + 9} style={{ fontWeight: hot ? 800 : 600 }}>{name}</text>
                <text className="st" x={270} y={y + 9}>{ops}</text>
              </g>
            )
          })}
          <text className="sl sm" x={640} y={34} textAnchor="end">liga menos</text>
          <text className="sl sm" x={640} y={482} textAnchor="end">liga más</text>

          <g className={rv(step, 1)}>
            <text className="st big" x={1090} y={34} textAnchor="middle">x + 2 * 3</text>
            <path className="guide draw" pathLength={1} d="M1090 118 L930 212 M1090 118 L1250 212 M1250 240 L1150 332 M1250 240 L1350 332" />
            <TreeNode x={1090} y={100} w={90} label="+" fill />
            <TreeNode x={930} y={230} w={90} label="x" />
            <TreeNode x={1250} y={230} w={90} label="*" fill />
            <TreeNode x={1150} y={350} w={90} label="2" />
            <TreeNode x={1350} y={350} w={90} label="3" />
          </g>
        </svg>
        <p className={rv(step, 2, 'lead')} style={{ position: 'absolute', left: 700, top: 402, width: 756, fontSize: 28 }}>
          Un no terminal por nivel: el * queda más abajo en el árbol y se calcula primero.
        </p>
        <p className={rv(step, 3, 'note')} style={{ position: 'absolute', left: 700, top: 478, width: 756, fontSize: 24 }}>
          Recursión por la izquierda: <span className="mono">a - b - c</span> es <span className="mono">(a - b) - c</span>.
        </p>
      </div>
    </>
  )
}

/* ------------------------------- A9: el conflicto desplazar / reducir */

function Conflict({ step }: { step: number }) {
  const solved = step >= 2
  return (
    <>
      <h2>Un conflicto desplazar/reducir, y cómo se resolvió</h2>
      <div className="body">
        <svg width="1456" height="340" viewBox="0 0 1456 340">
          <path className="track" d="M40 190 H760" />
          <circle cx={40} cy={190} r={11} fill="var(--ink)" />
          <Term x={130} y={190} w={80} label="if" lit />
          <NonT x={310} y={190} w={190} label="condition" lit />
          <NonT x={520} y={190} w={120} label="block" lit />
          <Term x={700} y={190} w={110} label="else" />
          <text className="sl sm" x={700} y={142} textAnchor="middle">siguiente token</text>

          <g className={rv(step, 1)}>
            <path className="track draw" pathLength={1} d="M760 190 q30 0 30 -30 v-50 q0 -30 30 -30 H960" />
            <circle cx={960} cy={80} r={11} fill="var(--ground)" stroke="var(--ink)" strokeWidth={6} />
            <text className="sl" x={990} y={72}>Desplazar</text>
            <text className="sl sm" x={990} y={104}>el else pertenece a este if</text>
            {solved && <Check x={1420} y={80} s={1.4} />}

            <path className="track ink draw" pathLength={1} style={{ opacity: solved ? 0.3 : 1 }} d="M760 190 q30 0 30 30 v50 q0 30 30 30 H960" />
            <circle cx={960} cy={300} r={11} fill="var(--ground)" stroke="var(--ink)" strokeWidth={6} />
            <text className={`sl${solved ? ' soft' : ''}`} x={990} y={292}>Reducir</text>
            <text className={`sl sm${solved ? ' soft' : ''}`} x={990} y={324}>el if termina y el else queda huérfano</text>
            {solved && <Cross x={1420} y={300} s={1.3} />}
          </g>
        </svg>
        <div className={rv(step, 2, 'plate small')} style={{ position: 'absolute', left: 0, top: 346, width: 700 }}>
          {'%nonassoc NO_ELSE\n%nonassoc ELSE\nif_stmt: IF condition block  %prec NO_ELSE'}
        </div>
        <p className={rv(step, 3, 'lead')} style={{ position: 'absolute', left: 750, top: 352, width: 706, fontSize: 30 }}>
          El mismo arreglo resuelve try y catch. Bison procesa la gramática sin conflictos.
        </p>
      </div>
    </>
  )
}

/* ------------------------------------------- A10: tres clases de error */

const ERROR_KINDS = [
  ['[Lexical error]', 'lexer.l', "line 7: invalid character '@'"],
  ['[Invalid construct]', 'una regla de error específica', "line 7: assignment '=' used as a condition; use '==' to compare"],
  ['[Syntax error]', 'la recuperación genérica', "line 19: syntax error, unexpected ';'"],
]

function ErrorKinds({ step }: { step: number }) {
  return (
    <>
      <h2>Tres clases de error, cada una con su línea</h2>
      <div className="body">
        {ERROR_KINDS.map(([tag, who, msg], i) => (
          <div key={tag} className={rv(step, i + 1)} style={{ display: 'grid', gridTemplateColumns: '300px 290px 1fr', columnGap: 20, alignItems: 'center', marginBottom: 22 }}>
            <span className="tag" style={{ justifySelf: 'start' }}>{tag}</span>
            <span className="lead" style={{ fontSize: 25 }}>{who}</span>
            <div className="plate out" style={{ fontSize: 24, lineHeight: 1.3, padding: '14px 18px', whiteSpace: 'normal' }}>{msg}</div>
          </div>
        ))}
        <div className={rv(step, 4)} style={{ position: 'absolute', left: 0, right: 0, top: 344 }}>
          <div className="rule" style={{ marginBottom: 22 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="chip t">Bison detecta el error</span>
            <svg width="56" height="30"><path className="guide" d="M4 15 H44" /><Arrow x={48} y={15} /></svg>
            <span className="chip t">yyerror() guarda el mensaje</span>
            <svg width="56" height="30"><path className="guide" d="M4 15 H44" /><Arrow x={48} y={15} /></svg>
            <span className="chip t">la regla que recupera decide la clase</span>
          </div>
          <p className="note" style={{ marginTop: 16, fontSize: 26 }}>
            Tras cada error el análisis continúa: una sola ejecución lista todos los errores del programa.
          </p>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------- A11: cierre del punto 4 */

function Point4End({ step }: { step: number }) {
  return (
    <>
      <h2>El punto 4 valida, pero no ejecuta</h2>
      <div className="body">
        <div className="plate out" style={{ position: 'absolute', left: 0, top: 0, width: 690, fontSize: 24 }}>
          {'$ ./vortex tests/09_functions.vx\nSyntactically valid program.\n\n$ bash tests/run_tests.sh\n30 passed, 0 failed.'}
        </div>
        <div className={rv(step, 1)} style={{ position: 'absolute', left: 750, top: 0, width: 706 }}>
          <div className="plate" style={{ marginBottom: 12 }}>print(10 / 0);</div>
          <div className="plate out">Syntactically valid program.</div>
          <p className="lead" style={{ marginTop: 24, fontSize: 30 }}>
            La sintaxis es correcta. Lo que pasa al dividir entre cero solo se sabe ejecutando.
          </p>
        </div>
        <p className={rv(step, 2)} style={{ position: 'absolute', left: 0, top: 380, fontSize: 58, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, width: 1300 }}>
          Para ejecutarlo hace falta un compilador.
        </p>
      </div>
    </>
  )
}

export const PART_A: SceneDef[] = [
  { id: 'portada', part: 'p4', station: 0, steps: 0, render: () => <Cover /> },
  { id: 'lenguaje', part: 'p4', station: 0, steps: 5, render: (s) => <Language step={s} /> },
  { id: 'tokens', part: 'p4', station: 1, steps: 4, render: (s) => <Tokens step={s} /> },
  { id: 'regex', part: 'p4', station: 1, steps: 5, render: (s) => <Regex step={s} /> },
  { id: 'reservadas', part: 'p4', station: 1, steps: 2, render: (s) => <Reserved step={s} /> },
  { id: 'errores-lexicos', part: 'p4', station: 1, steps: 3, render: (s) => <LexErrors step={s} /> },
  { id: 'yylex', part: 'p4', station: 2, steps: 3, render: (s) => <Handshake step={s} /> },
  { id: 'vias', part: 'p4', station: 2, steps: 7, render: (s) => <Railroad step={s} /> },
  { id: 'precedencia', part: 'p4', station: 2, steps: 3, render: (s) => <Precedence step={s} /> },
  { id: 'conflicto', part: 'p4', station: 2, steps: 3, render: (s) => <Conflict step={s} /> },
  { id: 'clases-error', part: 'p4', station: 2, steps: 4, render: (s) => <ErrorKinds step={s} /> },
  { id: 'cierre-p4', part: 'p4', station: 2, steps: 2, render: (s) => <Point4End step={s} /> },
]
