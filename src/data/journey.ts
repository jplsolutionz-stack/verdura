/**
 * Jornada visual: 11 quadros de construção e 6 de aproximação até a porta (sequencia.json).
 * O progresso 0–1 é o mesmo no scrub do desktop e na reprodução por ação.
 *
 * 0–2% hold do terreno · 2–10% o texto da abertura sai e a moldura abre ·
 * 10–84% obra e aproximação · 84–88% o vão da porta passa a mostrar o site ·
 * 88–99% o vão se expande até a tela toda · fim: a introdução é concluída.
 */
export const INTRO: [number, number] = [0.02, 0.1]
export const JOURNEY: [number, number] = [0.1, 0.84]
export const REVEAL_OPEN: [number, number] = [0.84, 0.88]
export const REVEAL_EXPAND: [number, number] = [0.88, 0.99]

/** rise: sobe do chão (câmera fixa) · fade: muda no lugar · dolly: câmera avança · door: só a porta gira. */
export type Reveal = 'rise' | 'fade' | 'dolly' | 'door'

/** Folha da porta no quadro: centro x, centro y e altura, normalizados. Âncora da aproximação. */
export type Door = [number, number, number]

export type Frame = {
  file: string
  label: string
  note: string
  group: number
  reveal?: Reveal
  range?: [number, number]
  door?: Door
  /** Centro horizontal do recorte quando a tela é mais estreita que a foto (celular em pé). */
  focus: number
}

/** Na obra a câmera é fixa: todos os quadros recortam em torno da casa. */
const HOUSE_FOCUS = 0.62

export const GROUPS = [
  'Preparação e fundações',
  'Base e início das paredes',
  'Estrutura e pavimentos',
  'Cobertura',
  'Acabamentos',
  'Acesso, iluminação e paisagismo',
  'Entrada',
]

const SEQUENCE: Omit<Frame, 'range'>[] = [
  { file: '01-terreno', label: 'Terreno', note: 'Lote preparado, valas abertas e obra marcada.', group: 0, focus: HOUSE_FOCUS },
  { file: '02-fundacoes', label: 'Fundações', note: 'Sapatas e vigas baldrame com as armações.', group: 0, reveal: 'rise', focus: HOUSE_FOCUS },
  { file: '03-base', label: 'Base', note: 'Laje térrea formada dentro do mesmo perímetro.', group: 1, reveal: 'rise', focus: HOUSE_FOCUS },
  { file: '04-paredes-baixas', label: 'Primeiras fiadas', note: 'Paredes baixas; entrada e garagem seguem livres.', group: 1, reveal: 'rise', focus: HOUSE_FOCUS },
  { file: '05-terreo-laje', label: 'Térreo e laje', note: 'Paredes do térreo e laje intermediária apoiada.', group: 2, reveal: 'rise', focus: HOUSE_FOCUS },
  { file: '06-paredes-superiores', label: 'Paredes superiores', note: 'Primeiras fiadas do pavimento de cima.', group: 2, reveal: 'rise', focus: HOUSE_FOCUS },
  { file: '07-paredes-completas', label: 'Pavimento superior', note: 'Paredes completas, topo ainda aberto.', group: 2, reveal: 'rise', focus: HOUSE_FOCUS },
  { file: '08-telhado', label: 'Cobertura', note: 'Laje de cobertura formada sobre os apoios.', group: 3, reveal: 'rise', focus: HOUSE_FOCUS },
  { file: '09-acabamento-parcial', label: 'Acabamento parcial', note: 'Reboco, primeiras esquadrias e vidros.', group: 4, reveal: 'fade', focus: HOUSE_FOCUS },
  { file: '10-acabamento-avancado', label: 'Acabamento avançado', note: 'Pedra, madeira, portas e guarda-corpo.', group: 4, reveal: 'fade', focus: HOUSE_FOCUS },
  { file: '11-casa-pronta', label: 'Casa pronta', note: 'Calçamento, paisagismo e iluminação.', group: 5, reveal: 'fade', door: [0.6, 0.616, 0.176], focus: HOUSE_FOCUS },
  { file: '12-entrada-fachada', label: 'Chegada', note: 'A fachada cresce enquanto a câmera se aproxima.', group: 6, reveal: 'dolly', door: [0.502, 0.539, 0.239], focus: 0.502 },
  { file: '13-entrada-escada', label: 'Escada', note: 'O percurso iluminado conduz até a porta.', group: 6, reveal: 'dolly', door: [0.642, 0.468, 0.428], focus: 0.642 },
  { file: '14-entrada-degraus', label: 'Degraus', note: 'A porta passa a ocupar o centro do quadro.', group: 6, reveal: 'dolly', door: [0.534, 0.438, 0.622], focus: 0.534 },
  { file: '15-porta-fechada', label: 'Porta', note: 'Madeira, vidros laterais e luz de entrada.', group: 6, reveal: 'dolly', door: [0.502, 0.474, 0.856], focus: 0.52 },
  { file: '16-porta-entreaberta', label: 'Porta entreaberta', note: 'Só a folha gira; a câmera fica parada.', group: 6, reveal: 'door', focus: 0.52 },
  { file: '17-porta-aberta', label: 'Porta aberta', note: 'Entre para conhecer os detalhes.', group: 6, reveal: 'door', focus: 0.52 },
]

const step = (JOURNEY[1] - JOURNEY[0]) / (SEQUENCE.length - 1)
/** Parte de cada trecho em que o quadro muda; no resto a etapa fica parada para ser vista. */
const CHANGE = 0.7

export const FRAMES: Frame[] = SEQUENCE.map((frame, i) => {
  if (i === 0) return frame
  const start = JOURNEY[0] + step * (i - 1)
  return { ...frame, range: [start, start + step * CHANGE] as [number, number] }
})

/** Trecho do progresso de cada grupo, do primeiro ao último quadro dele. */
export const GROUP_RANGES: [number, number][] = GROUPS.map((_, g) => {
  const frames = FRAMES.filter((f) => f.group === g && f.range)
  const first = FRAMES.findIndex((f) => f.group === g)
  const start = first === 0 ? JOURNEY[0] : FRAMES[first].range![0]
  return [start, frames.length ? frames[frames.length - 1].range![1] : start]
})

/** Índice do quadro visível: conta quantos já passaram da metade do próprio trecho. */
export function frameAt(value: number) {
  let index = 0
  for (let i = 1; i < FRAMES.length; i++) {
    const [start, end] = FRAMES[i].range!
    if (value >= (start + end) / 2) index = i
  }
  return index
}

/**
 * Vão livre da porta aberta no quadro 17, em coordenadas normalizadas da imagem
 * (borda da folha à esquerda, caixilho do vidro lateral à direita, verga e soleira).
 */
export const DOOR_FOCUS = 0.52

export const DOOR_APERTURE: [number, number][] = [
  [0.431, 0.074],
  [0.612, 0.072],
  [0.612, 0.904],
  [0.431, 0.904],
]
