import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

// Original procedural Three.js illustrations, generated from src/lib/craft.ts.
// Start Vite first: npm run dev. Then: node scripts/render-assets.mjs
const origin = process.env.ART_RENDER_ORIGIN || 'http://127.0.0.1:5173'
const output = path.resolve('public/images')
const temp = path.resolve('.impeccable/art-renders')
await mkdir(output, { recursive: true })
await mkdir(temp, { recursive: true })
const executablePath = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
const browser = await chromium.launch({ executablePath, headless: true, args: ['--enable-unsafe-swiftshader'] })
const entries = [
  { name: 'hero-bouquet', type: 'bouquet', width: 1100, height: 1100, camera: [0, 0.6, 9.4], target: [0, 0.3, 0], rotation: [0.035, -0.14, -0.13] },
  { name: 'bouquet', type: 'bouquet', width: 800, height: 900, camera: [0, 0.7, 10.2], target: [0, 0.35, 0], rotation: [0.03, -0.16, -0.10] },
  { name: 'daisies', type: 'daisies', width: 800, height: 900, camera: [0, 0.6, 9.7], target: [0, 0.1, 0], rotation: [0.01, 0.16, 0.09] },
  { name: 'bunny', type: 'bunny', width: 800, height: 900, camera: [0, 0.6, 8.5], target: [0, 0.28, 0], rotation: [0, -0.13, -0.04] },
  { name: 'tulips', type: 'tulips', width: 800, height: 900, camera: [0, 0.6, 9.5], target: [0, 0.12, 0], rotation: [0.06, -0.12, -0.14] },
  { name: 'flowerpot', type: 'flowerpot', width: 800, height: 900, camera: [0, 0.8, 8.8], target: [0, 0.23, 0], rotation: [0.015, -0.17, -0.045] },
  { name: 'magnet', type: 'magnet', width: 800, height: 900, camera: [0, 0.65, 8.4], target: [0, 0.11, 0], rotation: [0.015, -0.32, 0.08] },
  { name: 'keychain', type: 'keychain', width: 800, height: 900, camera: [0, 0.4, 7.9], target: [0, 0.2, 0], rotation: [0.025, -0.12, -0.18] },
  { name: 'story', type: 'bouquet', width: 1000, height: 1100, camera: [0.4, 1.1, 4.8], target: [0, 0.98, 0], rotation: [-0.07, 0.18, -0.21] },
  { name: 'workshop', type: 'workshop', width: 1100, height: 1000, camera: [0, 1.0, 10.6], target: [0, 0.1, 0], rotation: [0, 0, 0] },
]

for (const spec of entries.filter(entry => !process.argv[2] || entry.name === process.argv[2])) {
  const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height }, deviceScaleFactor: 1 })
  await page.route(`${origin}/art-render`, route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><style>html,body{margin:0;background:transparent;width:100%;height:100%;overflow:hidden}canvas{display:block;width:100%;height:100%}</style></head><body><canvas></canvas></body></html>' }))
  await page.goto(`${origin}/art-render`)
  await page.evaluate(async spec => {
    const { makeCreation, setupScene } = await import('/src/lib/craft.ts')
    const canvas = document.querySelector('canvas')
    const { renderer, scene, camera } = setupScene(canvas, spec.width, spec.height)
    renderer.setPixelRatio(1)
    renderer.setSize(spec.width, spec.height)
    camera.position.set(...spec.camera)
    camera.lookAt(...spec.target)
    if (spec.type === 'workshop') {
      const bunny = makeCreation('bunny')
      bunny.scale.setScalar(0.93)
      bunny.position.set(0.55, -0.6, 0.65)
      bunny.rotation.set(0, -0.2, -0.02)
      scene.add(bunny)
      const bouquet = makeCreation('bouquet')
      bouquet.scale.setScalar(0.73)
      bouquet.position.set(-1.35, 0.46, -0.25)
      bouquet.rotation.set(0.10, 0.25, 0.18)
      scene.add(bouquet)
      const tulips = makeCreation('tulips')
      tulips.scale.setScalar(0.64)
      tulips.position.set(1.8, 0.33, -0.3)
      tulips.rotation.set(0.03, -0.2, -0.19)
      scene.add(tulips)
    } else {
      const model = makeCreation(spec.type)
      model.rotation.set(...spec.rotation)
      scene.add(model)
    }
    // Keep rendering until the screenshot is captured, including shadow warmup.
    window.renderArtwork = () => { renderer.render(scene, camera); requestAnimationFrame(window.renderArtwork) }
    window.renderArtwork()
  }, spec)
  await page.waitForTimeout(500)
  const png = path.join(temp, `${spec.name}.png`)
  await page.screenshot({ path: png, omitBackground: true })
  execFileSync('python', ['-c', 'from PIL import Image; import sys; Image.open(sys.argv[1]).save(sys.argv[2], "WEBP", quality=94, method=6)', png, path.join(output, `${spec.name}.webp`)])
  await writeFile(path.join(output, `${spec.name}.provenance.json`), JSON.stringify({ origin: 'Original procedural Three.js illustration', source: 'src/lib/craft.ts', renderer: 'scripts/render-assets.mjs', subject: spec.type, note: 'Illustrative pipe-cleaner creation, not a photograph of real studio stock.', render: spec }, null, 2))
  console.log(`Rendered ${spec.name}.webp`)
  await page.close()
}
if (!process.argv[2] || process.argv[2] === 'social') {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  const flower = `<svg viewBox="0 0 80 80" width="44" height="44" fill="#ce4e73">${Array.from({ length: 6 }, (_, i) => `<ellipse cx="40" cy="23" rx="12" ry="21" transform="rotate(${i * 60} 40 40)"/>`).join('')}<circle cx="40" cy="40" r="10" fill="#f3d568"/></svg>`
  const html = `<!doctype html><html><head><style>
    @font-face{font-family:Brand;src:url('/node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-600-normal.woff2') format('woff2');font-weight:600}
    *{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#faf7ee;color:#402735;font-family:Brand,system-ui}
    .logo{position:absolute;left:66px;top:52px;display:flex;align-items:center;gap:10px;font-size:32px;letter-spacing:-1px}
    h1{position:absolute;left:66px;top:151px;margin:0;font-size:80px;line-height:1.06;font-weight:600;letter-spacing:-2.8px}h1 span{color:#ce4e73}
    p{position:absolute;left:70px;bottom:64px;margin:0;font-size:22px;line-height:1.4;max-width:440px;color:#735b65}
    .circle{position:absolute;right:50px;top:54px;width:485px;height:505px;background:#f2d6da;border-radius:46% 54% 52% 48%;transform:rotate(-12deg)}
    img{position:absolute;right:-30px;top:-30px;width:680px;height:680px;object-fit:contain}
    .foot{position:absolute;bottom:0;left:0;height:15px;width:100%;background:#ce4e73}
  </style></head><body><div class="logo">${flower}<span>twist & bloom.</span></div><h1>A little twist.<br />A lot of <span>joy.</span></h1><p>Handmade pipe-cleaner creations<br />& a little workshop magic.</p><div class="circle"></div><img src="/images/hero-bouquet.webp" alt=""/><div class="foot"></div></body></html>`
  await page.route(`${origin}/social-render`, route => route.fulfill({ contentType: 'text/html', body: html }))
  await page.goto(`${origin}/social-render`)
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())) })
  await page.screenshot({ path: path.join(output, 'social-cover.jpg'), type: 'jpeg', quality: 94 })
  await writeFile(path.join(output, 'social-cover.provenance.json'), JSON.stringify({ origin: 'Original branded composition of procedural Three.js illustration and self-hosted Bricolage Grotesque typography', source: 'src/lib/craft.ts', renderer: 'scripts/render-assets.mjs', dimensions: '1200x630', note: 'Illustrative pipe-cleaner creations, not photographs of real studio stock.' }, null, 2))
  console.log('Rendered social-cover.jpg')
  await page.close()
}
await browser.close()
