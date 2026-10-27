// Gera os derivados web dos quadros da jornada a partir dos PNGs master em media-src/.
// Masters: pacote "verdura-informativo-spec-imagens" (Codex, imagegen), ordem de sequencia.json.
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('../media-src/', import.meta.url))
const OUT = fileURLToPath(new URL('../public/media/', import.meta.url))
const WIDTHS = [640, 960, 1920]

await mkdir(OUT, { recursive: true })

for (const file of (await readdir(SRC)).filter((f) => f.endsWith('.png'))) {
  const name = file.replace(/\.png$/, '')
  for (const width of WIDTHS) {
    const info = await sharp(SRC + file)
      .resize({ width })
      .webp({ quality: width > 1000 ? 74 : 70 })
      .toFile(`${OUT}${name}-${width}.webp`)
    console.log(`${name}-${width}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`)
  }
}
