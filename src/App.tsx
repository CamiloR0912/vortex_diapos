import { Deck } from './deck'
import { PART_A } from './scenes/partA'
import { PART_B } from './scenes/partB'

const SCENES = [...PART_A, ...PART_B]

export default function App() {
  return <Deck scenes={SCENES} />
}
