const BASE = import.meta.env.BASE_URL

export type Width = 640 | 960 | 1920

export const mediaUrl = (path: string) => `${BASE}media/${path}`
export const frameSrc = (file: string, width: Width = 1920) => mediaUrl(`${file}-${width}.webp`)
export const frameSrcSet = (file: string) =>
  `${frameSrc(file, 640)} 640w, ${frameSrc(file, 960)} 960w, ${frameSrc(file, 1920)} 1920w`

/** Proporção nativa dos quadros (1672 × 941). */
export const FRAME_RATIO = 1672 / 941
