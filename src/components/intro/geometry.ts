import { DOOR_APERTURE, INTRO, REVEAL_EXPAND, REVEAL_OPEN, type Door } from '../../data/journey'
import { FRAME_RATIO } from '../../lib/media'

export type Box = { width: number; height: number }

/** Moldura inicial da abertura, em px dentro da tela, mais o tamanho da tela. */
export type Slot = Box & { left: number; top: number; right: number; bottom: number }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3
const easeIn = (t: number) => t * t * t
const phase = (p: number, [a, b]: [number, number]) => clamp01((p - a) / (b - a))

/** Telas em retrato mostram o quadro inteiro (contain); as largas preenchem (cover). Igual ao CSS. */
export const fitsContain = (box: Box) => box.width / box.height < 1

/** Converte um ponto normalizado da imagem para px na tela, respeitando o object-fit. */
export function mapPoint([nx, ny]: [number, number], box: Box): [number, number] {
  const wide = box.width / box.height > FRAME_RATIO
  const cover = !fitsContain(box)
  const w = cover === wide ? box.width : box.height * FRAME_RATIO
  const h = cover === wide ? box.width / FRAME_RATIO : box.height
  return [(box.width - w) / 2 + nx * w, (box.height - h) / 2 + ny * h]
}

function apertureOnScreen(box: Box) {
  const points = DOOR_APERTURE.map((p) => mapPoint(p, box))
  const cx = points.reduce((s, p) => s + p[0], 0) / points.length
  const cy = points.reduce((s, p) => s + p[1], 0) / points.length
  return { points, cx, cy }
}

/**
 * Aproximação entre dois quadros: os dois escalam e se deslocam juntos para que a porta ocupe
 * o mesmo lugar e o mesmo tamanho nos dois durante toda a troca, como um único movimento de câmera.
 * O zoom do par é a razão entre as alturas da porta; a escala anda em progressão geométrica.
 */
export function dollyPair(box: Box, from: Door, to: Door, t: number) {
  const z = to[2] / from[2]
  const e = easeInOut(clamp01(t))
  const [ax, ay] = mapPoint([from[0], from[1]], box)
  const [bx, by] = mapPoint([to[0], to[1]], box)
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

export function frameClip(slot: Slot, p: number) {
  const k = 1 - openness(p)
  if (k <= 0) return 'none'
  return `inset(${slot.top * k}px ${(slot.width - slot.right) * k}px ${(slot.height - slot.bottom) * k}px ${slot.left * k}px round ${16 * k}px)`
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
 * Recorte da camada de fotos: um retângulo com o vão da porta vazado (evenodd).
 * O vão nasce no centro da passagem, ocupa a abertura e depois se expande além da tela.
 */
export function revealClip(box: Box, p: number) {
  if (p < REVEAL_OPEN[0]) return 'none'
  const { points, cx, cy } = apertureOnScreen(box)
  const k =
    p < REVEAL_OPEN[1] ? easeOut(phase(p, REVEAL_OPEN)) : dollyScale(p) * (1 + 14 * easeIn(phase(p, REVEAL_EXPAND)))
  const hole = points.map(([x, y]) => `${cx + (x - cx) * k}px ${cy + (y - cy) * k}px`)
  const { width: w, height: h } = box
  return `polygon(evenodd, 0px 0px, ${w}px 0px, ${w}px ${h}px, 0px ${h}px, 0px 0px, ${hole.join(', ')}, ${hole[0]})`
}

export function measureSlot(overlay: HTMLElement, copy: HTMLElement): Slot {
  const width = overlay.clientWidth
  const height = overlay.clientHeight
  const style = getComputedStyle(copy)
  const contentLeft = copy.offsetLeft + parseFloat(style.paddingLeft)
  const contentRight = copy.offsetLeft + copy.offsetWidth - parseFloat(style.paddingRight)
  const top = Math.max(96, height * 0.13)
  return {
    width,
    height,
    left: contentLeft + (contentRight - contentLeft) * 0.46,
    right: contentRight,
    top,
    bottom: height - Math.max(88, height * 0.12),
  }
}
