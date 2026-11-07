import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Heart, Menu, Minus, MoveUpRight, Pause, Play, Plus, Scissors, X } from 'lucide-react'
import { creations, faqs, studio, studioMedia, type Creation } from './content'
import EnquiryDialog, { type Enquiry } from './components/EnquiryDialog'
import type { BouquetPalette } from './lib/craft'

const BouquetScene = lazy(() => import('./components/BouquetScene'))
const categories = ['All creations', ...new Set(creations.map(creation => creation.category))]

function Flower({ className = '', petals = 6 }: { className?: string; petals?: number }) {
  return <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">{Array.from({ length: petals }, (_, i) => <ellipse key={i} cx="40" cy="23" rx="12" ry="21" fill="currentColor" transform={`rotate(${i * 360 / petals} 40 40)`} />)}<circle cx="40" cy="40" r="10" fill="var(--color-yellow)" /></svg>
}

function ProductDialog({ product, onClose, onEnquire }: { product: Creation; onClose: () => void; onEnquire: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current!
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    el.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous; el.close(); if (trigger?.isConnected) trigger.focus({ preventScroll: true }) }
  }, [])
  return <dialog className="product-dialog" ref={ref} onCancel={onClose} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); if (e.target === e.currentTarget && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) onClose() }} aria-labelledby="product-title">
    <button className="icon-button dialog-close" onClick={onClose} aria-label="Close creation"><X size={21} /></button>
    <div className={`product-dialog-media surface-${product.color}`}>
      <div className="product-dialog-image">
        {showVideo && product.video && !videoFailed
          ? <video src={product.video} poster={product.image} controls playsInline muted preload="metadata" width="478" height="850" aria-label={`Video of ${product.name}`} onError={() => { setVideoFailed(true); setShowVideo(false) }} />
          : <img src={product.image} alt={product.imageAlt} width="960" height="1280" />}
      </div>
      {product.video && <div className="product-media-options" role="group" aria-label="Creation photos and video"><button aria-pressed={!showVideo} onClick={() => setShowVideo(false)}>Photo</button><button aria-pressed={showVideo} disabled={videoFailed} onClick={() => setShowVideo(true)}><Play size={14} />Watch video</button></div>}
      {videoFailed && <p className="media-error" role="status">The clip couldn’t load. You can still explore the photo.</p>}
    </div>
    <div className="product-dialog-copy"><h2 id="product-title">{product.name}</h2><p>{product.story}</p><span className="handmade-note"><Heart size={16} /> Handmade, one happy twist at a time.</span><button className="button button-dark" onClick={onEnquire}>Make it my own <ArrowUpRight size={18} /></button><p className="form-note">A handmade piece from our little world. Colours, availability, and pricing are confirmed with the studio.</p></div>
  </dialog>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const menuToggle = useRef<HTMLButtonElement>(null)
  const savedFilter = useRef<HTMLButtonElement>(null)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [palette, setPalette] = useState<BouquetPalette>('rose')
  const [filter, setFilter] = useState('All creations')
  const [selected, setSelected] = useState<Creation | null>(null)
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [saved, setSaved] = useState<string[]>(() => { try { const value: unknown = JSON.parse(localStorage.getItem('twist-bloom-favourites') || '[]'); return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && creations.some(p => p.id === id)) : [] } catch { return [] } })
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && menu) { menuToggle.current?.focus(); setMenu(false) } }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [menu])

  function favorite(product: Creation) {
    const exists = saved.includes(product.id)
    const next = exists ? saved.filter(id => id !== product.id) : [...saved, product.id]
    setSaved(next)
    if (exists && filter === 'Saved') requestAnimationFrame(() => { const nextButton = document.querySelector<HTMLButtonElement>('.product-grid .favorite-button'); (nextButton || savedFilter.current)?.focus() })
    try { localStorage.setItem('twist-bloom-favourites', JSON.stringify(next)) } catch { /* Favourites still work for this visit. */ }
    setToast(exists ? 'Removed from your favourites.' : 'A little joy saved to your favourites.')
  }

  const visible = creations.filter(p => filter === 'All creations' || filter === p.category || (filter === 'Saved' && saved.includes(p.id)))
  const nav = (mobile = false) => <>{[['Our creations', '#creations'], ['Our story', '#story'], ['Workshops', '#workshops']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}{mobile && <ArrowUpRight size={20} />}</a>)}</>

  return <div className={`site ${paused ? 'motion-paused' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="announcement"><Flower /><span>A little twist. A lot of joy.</span><Flower /></div>
    <header className="site-header">
      <a className="wordmark" href="#" aria-label="Twist and Bloom home"><Flower className="brand-flower" /><span>twist<span className="wordmark-and">&</span>bloom<span className="wordmark-dot">.</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav()}</nav>
      <button className="header-contact" onClick={() => setEnquiry({ kind: 'hello' })}>Let’s talk <ArrowUpRight size={17} /></button>
      <button ref={menuToggle} className="icon-button menu-toggle" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      {menu && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{nav(true)}<button onClick={() => { setMenu(false); setEnquiry({ kind: 'hello' }) }}>Let’s talk <ArrowUpRight size={20} /></button></nav>}
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">Little things.<br />Big happy<br /><span>feelings<svg className="feeling-underline" viewBox="0 0 390 20" aria-hidden="true"><path d="M5 12C98 1 277 1 382 8M48 18C162 10 291 11 356 14" /></svg>.</span></h1>
          <p>Flowers, flowerpots, fridge magnets, and keychains.<br className="desktop-break" /> All made from a fuzzy stem and a happy thought.<br className="desktop-break" /> A little handmade happiness, just for you.</p>
          <a className="button button-dark hero-cta" href="#creations">Explore our little world <ArrowUpRight size={19} /></a>
          <a className="hero-secondary" href="#workshops">Or, come make a little magic with us <ArrowRight size={16} /></a>
          <div className="hero-footnote"><span className="hand-icon"><Heart size={17} /></span>Made by hand. Kept by heart.</div>
        </div>
        <div className="hero-art">
          <div className="art-backdrop" aria-hidden="true"><span className="backdrop-ring" /></div>
          <Flower className="hero-floating-flower" />
          <span className="art-side-note">soft stems.<br />endless possibilities.</span>
          <Suspense fallback={<div className="bouquet-render"><img className="scene-loading-image" src="/images/hero-bouquet.webp" alt="Fuzzy pink daisies and golden tulips in a handmade-style bouquet" /></div>}><BouquetScene paused={paused} color={palette} /></Suspense>
          <div className="handmade-stamp" aria-label="Made with happy hands"><Heart size={21} strokeWidth={1.5} /><span>made with<br />happy hands</span><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" /></svg></div>
          <div className="palette-picker"><span>A different kind of mood</span><div role="group" aria-label="Bouquet colour mood">{([['rose', 'Rose pink'], ['lilac', 'Lilac dream'], ['peach', 'Peach sunshine']] as [BouquetPalette, string][]).map(([value, name]) => <button key={value} aria-label={name} aria-pressed={palette === value} className={`palette-swatch swatch-${value} ${palette === value ? 'selected' : ''}`} onClick={() => setPalette(value)}>{palette === value && <Check size={12} />}</button>)}</div></div>
        </div>
        <a className="scroll-cue" href="#creations" aria-label="Scroll to our creations"><ArrowDown size={16} /></a>
      </section>

      <div className="joy-ribbon" aria-label="Handmade, heart full, a little out of the ordinary"><div className="ribbon-track">{[0, 1].map(i => <div className="ribbon-set" key={i} aria-hidden={i === 1}><span>A LITTLE FUZZ, A LOT OF LOVE</span><Flower /><span>HAPPINESS IS HANDMADE</span><Flower /><span>PERFECTLY IMPERFECT</span><Flower /></div>)}</div></div>

      <section id="creations" className="creations section-wrap" aria-labelledby="creations-title">
        <div className="section-heading"><h2 id="creations-title">Say hello to<br />your next little <span className="accent-word">joy.</span></h2><div className="section-intro"><p>For your desk, your fridge, your favourite person.<br />A few possibilities from our colourful little world.</p><span>Dreamed up in colour. Twisted into life.</span></div></div>
        <div className="collection-toolbar"><div className="collection-filters" role="group" aria-label="Filter creations">{categories.map(item => <button key={item} className={filter === item ? 'active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="mobile-collection-filter"><span className="sr-only">Show creations</span><select value={filter} onChange={e => setFilter(e.target.value)}>{[...categories, 'Saved'].map(item => <option key={item} value={item}>{item === 'Saved' ? 'My favourites' : item}</option>)}</select></label><button ref={savedFilter} className={`saved-filter ${filter === 'Saved' ? 'active' : ''}`} onClick={() => setFilter(filter === 'Saved' ? 'All creations' : 'Saved')} aria-pressed={filter === 'Saved'}><Heart size={16} /><span>Saved{saved.length > 0 && ` (${saved.length})`}</span></button></div>
        <div className="product-grid" aria-live="polite">
          {visible.map((p, i) => <article className="product-card" key={p.id} style={{ '--card-index': i } as React.CSSProperties}>
            <div className={`product-image surface-${p.color}`}><button className="product-image-button" onClick={() => setSelected(p)} aria-label={`Explore ${p.name}`}><img src={p.image} alt={p.imageAlt} width="960" height="1280" loading="lazy" /><span className="product-explore">Take a closer look <ArrowUpRight size={15} /></span></button><button className={`favorite-button ${saved.includes(p.id) ? 'is-saved' : ''}`} onClick={() => favorite(p)} aria-label={`${saved.includes(p.id) ? 'Unsave' : 'Save'} ${p.name}`} aria-pressed={saved.includes(p.id)}><Heart size={18} /></button></div>
            <div className="product-title-row"><button onClick={() => setSelected(p)}><h3>{p.name}</h3></button><button className="product-arrow" onClick={() => setSelected(p)} aria-label={`View ${p.name}`}><ArrowUpRight size={19} /></button></div><p>{p.description}</p>
          </article>)}
          {!visible.length && <div className="empty-saved"><Heart size={28} /><h3>A little space for your favourites.</h3><p>Tap a heart on a creation to keep it here.</p><button className="text-link" onClick={() => setFilter('All creations')}>Explore all creations <ArrowRight size={16} /></button></div>}
        </div>
        <div className="collection-footer"><span>Something only you could dream up?</span><button className="text-link" onClick={() => setEnquiry({ kind: 'creation' })}>Let’s make it personal <MoveUpRight size={16} /></button></div>
        <p className="collection-note">Photographed by the studio. Open a creation to see it in motion, then make it personal with us.</p>
      </section>

      <section id="story" className="story section-wrap" aria-labelledby="story-title">
        <div className="story-art"><div className="story-photo"><img src={studioMedia.story} alt="A hand holding a little brown pot of handmade pale pink pipe-cleaner daisies" width="960" height="1280" loading="lazy" /><span className="story-photo-caption">a little patience + a lot of heart</span></div><div className="story-sticker"><Scissors size={23} /><span>less scrolling.<br />more creating.</span></div></div>
        <div className="story-copy"><h2 id="story-title">Just a pipe cleaner.<br />Until it <span className="accent-word">isn’t.</span></h2><p className="story-lede">A bend. A loop. A “what if?”<br />That’s where the good stuff begins.</p><p>There’s something lovely about making something with your hands. Taking an ordinary little thing and turning it into a gift, a keepsake, a reason to smile.</p><p>That’s our little world at Twist & Bloom. We make things slowly, with a playful spirit and a whole lot of heart. Because joy doesn’t have to be complicated.</p><div className="story-signoff"><Flower /><span>Small things. Made to mean something.</span></div></div>
      </section>

      <section id="workshops" className="workshops" aria-labelledby="workshop-title"><div className="workshop-inner section-wrap">
        <div className="workshop-copy"><h2 id="workshop-title">Your hands.<br />A little <span>magic.</span></h2><p>Step away from the everyday. Pick a colour, learn a twist, and watch something wonderful take shape.</p><p>Our pipe-cleaner workshops bring people together through the simple joy of making. Come with an idea. Leave with something that feels like you.</p><button className="button button-dark" onClick={() => setEnquiry({ kind: 'workshop' })}>Find your creative side <ArrowUpRight size={19} /></button><span className="workshop-small">For curious minds & hands that want to make.</span></div>
        <div className="workshop-art"><img src={studioMedia.workshop} alt="A handmade pot of blue pipe-cleaner daisies, an idea to inspire your own creation" width="960" height="1280" loading="lazy" /><div className="workshop-label"><Flower /><span>oh, you<br /><strong>made</strong> that!</span></div><span className="workshop-art-caption">Your next “look what I made” moment.</span></div>
        <div className="workshop-steps"><div><span className="step-number">01</span><div><h3>Pick your happy colours</h3><p>There’s no wrong combination.</p></div></div><div><span className="step-number">02</span><div><h3>Find your little rhythm</h3><p>One bend, loop, and twist at a time.</p></div></div><div><span className="step-number">03</span><div><h3>Make a memory</h3><p>And something lovely to go with it.</p></div></div></div>
      </div></section>

      <section className="faq section-wrap" aria-labelledby="faq-title"><div className="faq-intro"><h2 id="faq-title">A little <br />curious?</h2><p>We like that about you.</p><Flower /></div><div className="faq-list">{faqs.map((item, i) => <div className={`faq-item ${openFaq === i ? 'is-open' : ''}`} key={item.question}><h3><button aria-expanded={openFaq === i} aria-controls={`faq-answer-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>{item.question}<span>{openFaq === i ? <Minus size={18} /> : <Plus size={18} />}</span></button></h3><div id={`faq-answer-${i}`} className="faq-answer" hidden={openFaq !== i}><p>{item.answer}</p></div></div>)}</div></section>
    </main>

    <footer className="footer"><div className="footer-top section-wrap"><div><h2>Let’s put a little<br /><span>happy</span> into the world.</h2><p>One fuzzy, wonderful thing at a time.</p></div><button className="footer-contact" onClick={() => setEnquiry({ kind: 'hello' })}><ArrowUpRight size={34} /><span>Say hello</span></button><Flower className="footer-flower" /></div><div className="footer-bottom section-wrap"><a className="wordmark" href="#" aria-label="Twist and Bloom home"><Flower className="brand-flower" /><span>twist<span className="wordmark-and">&</span>bloom.</span></a><span className="copyright">© {new Date().getFullYear()} {studio.name}. Made with a little joy.</span><div className="footer-links">{studio.instagram && <a href={studio.instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13} /></a>}<button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? 'Play motion' : 'Pause motion'}</button><a href="#">Back to top <ChevronDown className="back-top-icon" size={14} /></a></div></div></footer>
    {selected && <ProductDialog product={selected} onClose={() => setSelected(null)} onEnquire={() => { const name = selected.name; setSelected(null); setEnquiry({ kind: 'creation', product: name }) }} />}
    {enquiry && <EnquiryDialog enquiry={enquiry} onClose={() => setEnquiry(null)} />}
    <div className={`toast ${toast ? 'toast-visible' : ''}`} role="status"><Heart size={15} />{toast}</div>
  </div>
}
