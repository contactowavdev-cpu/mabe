import sharp from 'sharp'
import { existsSync, readdirSync, rmSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const imageDir = fileURLToPath(new URL('../public/images/', import.meta.url))
const socialSource = process.env.SOCIAL_SOURCE
const responsiveNames = new Set([
  'proj-casaalta',
  'proj-growsales',
  'proj-luxora',
  'proj-mardeluz',
  'proj-nexora',
  'proj-talento360',
  'svc-apps',
  'svc-outsourcing',
  'svc-sistemas',
  'svc-web',
])

for (const file of readdirSync(imageDir).filter((name) => extname(name) === '.webp')) {
  const name = basename(file, '.webp')
  if (!responsiveNames.has(name)) continue
  const input = join(imageDir, file)

  for (const width of [640, 1200]) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(join(imageDir, `${name}-${width}.webp`))

    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 52, effort: 6 })
      .toFile(join(imageDir, `${name}-${width}.avif`))
  }
}

if (socialSource && existsSync(socialSource)) {
  await sharp(socialSource)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toFile(join(imageDir, 'wavdev-social.png'))
}

for (const file of readdirSync(imageDir).filter((name) => extname(name) === '.png' && name !== 'wavdev-social.png')) {
  rmSync(join(imageDir, file))
}

console.log('Responsive WebP/AVIF assets generated and unused PNG files removed.')
