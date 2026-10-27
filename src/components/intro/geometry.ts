import { DOOR_APERTURE, DOOR_FOCUS, INTRO, REVEAL_EXPAND, REVEAL_OPEN, type Door } from '../../data/journey'
import { FRAME_RATIO } from '../../lib/media'

/**
 * Área das fotos (width/height, posição left/top dentro da abertura) e tamanho da abertura inteira.
 * No desktop as fotos ocupam a tela; no celular em pé, uma faixa abaixo do cabeçalho.
 */
export type Box = { width: number; height: number; left: number; top: number; outerWidth: number; outerHeight: number }

/** Moldura inicial da abertura (só em telas largas), em px dentro da área das fotos. */
export type Slot = { left: number; top: number; right: number; bottom: number }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3
const easeIn = (t: number) => t * t * t
const phase = (p: number, [a, b]: [number, number]) => clamp01((p - a) / (b - a))

/**
 * Converte um ponto normalizado da imagem para px na área das fotos, com object-fit: cover.
 * Quando a área é mais estreita que a foto, o recorte horizontal segue o foco do quadro
 * (o mesmo valor usado em object-position).
 */
export function mapPoint([nx, ny]: [number, number], box: Box, focus = 0.5): [number, number] {
  const wide = box.width / box.height > FRAME_RATIO
  const w = wide ? box.width : box.height * FRAME_RATIO
  const h = wide ? box.width / FRAME_RATIO : box.height
  return [(box.width - w) * focus + nx * w, (box.height - h) / 2 + ny * h]
}

function apertureOnScreen(box: Box) {
  const points = DOOR_APERTURE.map((p) => mapPoint(p, box, DOOR_FOCUS))
  const cx = points.reduce((s, p) => s + p[0], 0) / points.length
  const cy = points.reduce((s, p) => s + p[1], 0) / points.length
  return { points, cx, cy }
}

export type Anchor = { door: Door; focus: number }

/**
 * Aproximação entre dois quadros: os dois escalam e se deslocam juntos para que a porta ocupe
 * o mesmo lugar e o mesmo tamanho nos dois durante toda a troca, como um único movimento de câmera.
 * O zoom do par é a razão entre as alturas da porta; a escala anda em progressão geométrica.
 */
export function dollyPair(box: Box, from: Anchor, to: Anchor, t: number) {
  const z = to.door[2] / from.door[2]
  const e = easeInOut(clamp01(t))
  const [ax, ay] = mapPoint([from.door[0], from.door[1]], box, from.focus)
  const [bx, by] = mapPoint([to.door[0], to.door[1]], box, to.focus)
  const dx = mix(ax, bx, e)
  const dy = mix(ay, by, e)
  const sOut = z ** e
  const sIn = z ** (e - 1)
  return {
    out: `translate(${dx - sOut * ax}px, ${dy - sOut * ay}px) scale(${sOut})`,
    in: `translate(${dx - sIn * bx}px, ${dy - sIn * by}px) scale(${sIn})`,
  }
}

/** Atravessar a porta: a câmera avança em direção ao vão enquanto ele se abre para o site. */
const dollyScale = (p: number) => 1 + 0.4 * easeInOut(phase(p, REVEAL_EXPAND))

// Centro aproximado da área construída no quadro, em fração da imagem.
const HOUSE = { x: 0.6, y: 0.62 }

export const openness = (p: number) => easeInOut(phase(p, INTRO))

export function frameClip(slot: Slot, box: Box, p: number) {
  const k = 1 - openness(p)
  if (k <= 0) return 'none'
  return `inset(${slot.top * k}px ${(box.width - slot.right) * k}px ${(box.height - slot.bottom) * k}px ${slot.left * k}px round ${16 * k}px)`
}

export function cameraAt(slot: Slot | null, box: Box, p: number) {
  if (slot && p < INTRO[1]) {
    const { width: W, height: H } = box
    const frameW = slot.right - slot.left
    const frameH = slot.bottom - slot.top
    const scale = Math.max(frameW / W, frameH / H) * 1.1
    const x = Math.min(slot.left, Math.max(slot.right - scale * W, (slot.left + slot.right) / 2 - scale * HOUSE.x * W))
    const y = Math.min(slot.top, Math.max(slot.bottom - scale * H, (slot.top + slot.bottom) / 2 - scale * HOUSE.y * H))
    const t = openness(p)
    // Recorte atual da moldura (o mesmo de frameClip): a foto precisa cobri-lo em todo instante,
    // senão aparecem faixas vazias enquanto a moldura abre.
    const k = 1 - t
    const left = slot.left * k
    const top = slot.top * k
    const right = W - (W - slot.right) * k
    const bottom = H - (H - slot.bottom) * k
    const s = Math.max(mix(scale, 1, t), (right - left) / W, (bottom - top) / H)
    const tx = Math.min(left, Math.max(right - s * W, mix(x, 0, t)))
    const ty = Math.min(top, Math.max(bottom - s * H, mix(y, 0, t)))
    return `translate(${tx}px, ${ty}px) scale(${s})`
  }
  if (p < REVEAL_EXPAND[0]) return 'none'
  const { cx, cy } = apertureOnScreen(box)
  const s = dollyScale(p)
  return `translate(${cx * (1 - s)}px, ${cy * (1 - s)}px) scale(${s})`
}

/**
 * Recorte da abertura inteira: um retângulo com o vão da porta vazado (evenodd).
 * O vão nasce no centro da passagem, ocupa a abertura e depois se expande além da tela.
 */
export function revealClip(box: Box, p: number) {
  if (p < REVEAL_OPEN[0]) return 'none'
  const { points, cx, cy } = apertureOnScreen(box)
  const k =
    p < REVEAL_OPEN[1] ? easeOut(phase(p, REVEAL_OPEN)) : dollyScale(p) * (1 + 14 * easeIn(phase(p, REVEAL_EXPAND)))
  const hole = points.map(([x, y]) => `${box.left + cx + (x - cx) * k}px ${box.top + cy + (y - cy) * k}px`)
  const { outerWidth: w, outerHeight: h } = box
  return `polygon(evenodd, 0px 0px, ${w}px 0px, ${w}px ${h}px, 0px ${h}px, 0px 0px, ${hole.join(', ')}, ${hole[0]})`
}

export function measureBox(overlay: HTMLElement, visual: HTMLElement): Box {
  return {
    width: visual.clientWidth,
    height: visual.clientHeight,
    left: visual.offsetLeft,
    top: visual.offsetTop,
    outerWidth: overlay.clientWidth,
    outerHeight: overlay.clientHeight,
  }
}

/** Moldura medida a partir da grade: começa após a coluna de texto. Só em telas largas. */
export function measureSlot(box: Box, copy: HTMLElement): Slot | null {
  if (box.width / box.height < 1.2) return null
  const style = getComputedStyle(copy)
  const contentLeft = copy.offsetLeft + parseFloat(style.paddingLeft)
  const contentRight = copy.offsetLeft + copy.offsetWidth - parseFloat(style.paddingRight)
  const top = Math.max(96, box.height * 0.13)
  return {
    left: contentLeft + (contentRight - contentLeft) * 0.46,
    right: contentRight,
    top,
    bottom: box.height - Math.max(88, box.height * 0.12),
  }
}
