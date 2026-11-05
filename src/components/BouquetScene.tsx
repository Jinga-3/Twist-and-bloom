import { useEffect, useRef } from 'react'
import { RotateCcw } from 'lucide-react'
import { disposeModel, makeCreation, recolorPinkFibres, setupScene, type BouquetPalette } from '../lib/craft'

export default function BouquetScene({ paused, color }: { paused: boolean; color: BouquetPalette }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ paused, color })
  stateRef.current = { paused, color }

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const host = canvas.parentElement!
    let setup: ReturnType<typeof setupScene>
    try { setup = setupScene(canvas, host.clientWidth, host.clientHeight) }
    catch { host.dataset.fallback = 'true'; return }
    const { renderer, camera, scene } = setup
    const bouquet = makeCreation('bouquet')
    scene.add(bouquet)
    bouquet.rotation.set(0.035, -0.14, -0.13)
    let mx = 0, my = 0, frame = 0, visible = true, dragging = false, dragX = 0, offset = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 0.7
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3
      if (dragging) { offset += (e.clientX - dragX) * 0.008; dragX = e.clientX }
    }
    const down = (e: PointerEvent) => { dragging = true; dragX = e.clientX; canvas.setPointerCapture(e.pointerId) }
    const up = () => { dragging = false }
    const leave = () => { mx = 0; my = 0; dragging = false }
    const keydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); offset += e.key === 'ArrowLeft' ? -0.25 : 0.25 }
      if (e.key === 'Home') { e.preventDefault(); offset = 0 }
    }
    const resize = new ResizeObserver(() => {
      renderer.setSize(host.clientWidth, host.clientHeight, false)
      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()
    })
    resize.observe(host)
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting }, { rootMargin: '80px' })
    observer.observe(host)
    canvas.addEventListener('pointermove', pointer)
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('keydown', keydown)
    const contextLost = (e: Event) => { e.preventDefault(); host.dataset.fallback = 'true' }
    canvas.addEventListener('webglcontextlost', contextLost)
    let last = 0, elapsed = 0, lastColor = ''
    function render(now: number) {
      frame = requestAnimationFrame(render)
      if (!visible || document.hidden || now - last < 32) return
      const delta = Math.min((now - last) / 1000, 0.05)
      last = now
      const motion = !stateRef.current.paused && !reduce.matches
      if (motion) elapsed += delta
      const targetY = -0.14 + offset + (motion ? mx + Math.sin(elapsed * 0.38) * 0.075 : 0)
      bouquet.rotation.y += (targetY - bouquet.rotation.y) * 0.075
      bouquet.rotation.x += ((motion ? my : 0) + 0.035 - bouquet.rotation.x) * 0.05
      bouquet.position.y = motion ? Math.sin(elapsed * 0.7) * 0.045 : 0
      if (lastColor !== stateRef.current.color) {
        recolorPinkFibres(bouquet, stateRef.current.color)
        lastColor = stateRef.current.color
      }
      renderer.render(scene, camera)
      host.dataset.ready = 'true'
    }
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect(); observer.disconnect()
      canvas.removeEventListener('pointermove', pointer); canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('keydown', keydown); canvas.removeEventListener('webglcontextlost', contextLost)
      disposeModel(scene); renderer.dispose()
    }
  }, [])

  return <div className="bouquet-render">
    <img className="bouquet-fallback" src="/images/hero-bouquet.webp" alt="A handmade-style bouquet of fuzzy pink daisies and golden tulips, tied with a rose-coloured bow" />
    <canvas ref={canvasRef} tabIndex={0} role="img" aria-label="Interactive 3D pipe-cleaner bouquet. Drag to turn, or use left and right arrow keys. Press Home to reset." />
    <span className="drag-hint"><RotateCcw size={13} /> go on, give it a little spin</span>
  </div>
}
