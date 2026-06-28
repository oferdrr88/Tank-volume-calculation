import sharp from 'sharp'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const src = resolve(root, 'public/icon-512.svg')

const sizes = [
  { size: 48,  name: 'icon-48.png'  },
  { size: 72,  name: 'icon-72.png'  },
  { size: 96,  name: 'icon-96.png'  },
  { size: 144, name: 'icon-144.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
]

const mipmaps = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',  size: 96  },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi',size: 192 },
]

for (const { size, name } of sizes) {
  const out = resolve(root, 'assets', name)
  await sharp(src).resize(size, size).png().toFile(out)
  console.log(`assets/${name}`)
}

for (const { dir, size } of mipmaps) {
  const srcPng = resolve(root, 'assets', `icon-${size}.png`)
  const mipmapDir = resolve(root, 'android/app/src/main/res', dir)
  if (!existsSync(mipmapDir)) mkdirSync(mipmapDir, { recursive: true })
  copyFileSync(srcPng, resolve(mipmapDir, 'ic_launcher.png'))
  copyFileSync(srcPng, resolve(mipmapDir, 'ic_launcher_round.png'))
  console.log(`${dir}/ic_launcher.png (${size}px)`)
}

console.log('\nDone.')
