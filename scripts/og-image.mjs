// Gera public/og.png (1200x630) e public/icon-512.png com o Chrome em modo headless.
// Uso: npm run og   (requer Google Chrome instalado)
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const shot = (html, out, size) =>
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${size}`, `--screenshot=${resolve(out)}`, `file://${resolve(html)}`], { stdio: 'ignore' })

shot('scripts/og.html', 'public/og.png', '1200,630')
shot('scripts/icon.html', 'public/icon-512.png', '512,512')
console.log('og.png e icon-512.png gerados em /public')
