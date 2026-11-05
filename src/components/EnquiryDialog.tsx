import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download, X } from 'lucide-react'
import { studio } from '../content'

export type Enquiry = { kind: 'creation' | 'workshop' | 'hello'; product?: string }

export default function EnquiryDialog({ enquiry, onClose }: { enquiry: Enquiry; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [group, setGroup] = useState('')

  useEffect(() => {
    const el = dialog.current!
    const previousOverflow = document.body.style.overflow
    el.showModal()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow; el.close() }
  }, [])

  function prepare(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    for (const field of [form.elements.namedItem('name'), form.elements.namedItem('message')]) {
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.setCustomValidity(field.value.trim() ? '' : 'Please add a few words so we can put your enquiry together.')
        if (!field.reportValidity()) return
      }
    }
    const text = `Hello ${studio.name}!\n\nMy name is ${name.trim()}. ${enquiry.kind === 'workshop' ? 'I’d love to know more about your workshops.' : enquiry.product ? `I’m interested in ${enquiry.product}.` : 'I’d love to get in touch.'}\n${group ? `Group size: ${group}\n` : ''}\n${message.trim()}\n\nYou can reach me at ${email.trim()}.`
    setNote(text)
  }

  async function copy() {
    try { await navigator.clipboard.writeText(note); setCopied(true); setCopyError(false) }
    catch { setCopyError(true) }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([note], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = 'twist-and-bloom-enquiry.txt'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const contactLink = studio.whatsapp ? `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(note)}` : studio.email ? `mailto:${studio.email}?subject=${encodeURIComponent(enquiry.kind === 'workshop' ? 'Workshop enquiry' : 'A little handmade idea')}&body=${encodeURIComponent(note)}` : ''

  return <dialog ref={dialog} className="enquiry-dialog" onCancel={onClose} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); if (e.target === e.currentTarget && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) onClose() }} aria-labelledby="enquiry-title">
    <button className="icon-button dialog-close" aria-label="Close enquiry" onClick={onClose}><X size={21} /></button>
    <svg className="dialog-flower" viewBox="0 0 80 80" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx="40" cy="23" rx="12" ry="21" fill="currentColor" transform={`rotate(${i * 60} 40 40)`} />)}<circle cx="40" cy="40" r="10" fill="var(--color-yellow)" /></svg>
    <h2 id="enquiry-title">{note ? 'A lovely place to start.' : enquiry.kind === 'workshop' ? 'Let’s make a day of it.' : 'Every little idea starts here.'}</h2>
    {note ? <div className="enquiry-result">
      <p>Your enquiry is ready. {contactLink ? 'Open your messaging app to send it to the studio.' : 'Save or copy your note to share with the studio. Contact details are coming soon.'}</p>
      <textarea aria-label="Your prepared enquiry" readOnly value={note} rows={8} />
      {contactLink && <a className="button button-dark" href={contactLink} target="_blank" rel="noreferrer">{studio.whatsapp ? 'Continue in WhatsApp' : 'Open email'}<ArrowUpRight size={17} /></a>}
      <div className="result-actions"><button className="button button-dark" onClick={copy}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Copied to clipboard' : 'Copy enquiry'}</button><button className="icon-button" onClick={download} aria-label="Download enquiry"><Download size={20} /></button></div>
      <p role="status" className="form-note">{copyError ? 'Copy is unavailable in this browser. Select the note above or download it instead.' : 'Nothing has been sent or booked yet.'}</p>
      <button className="text-link" onClick={() => { setNote(''); setCopied(false) }}>Edit my note</button>
    </div> : <form onSubmit={prepare}>
      <p>{enquiry.product ? `Something like “${enquiry.product}”? Tell us what would make it yours.` : enquiry.kind === 'workshop' ? 'A catch-up with friends, a team afternoon, or just a little time to create. Tell us what you’re imagining.' : 'A gift, a workshop, a wonderfully unusual idea—we’d love to hear it.'}</p>
      <div className="form-row"><label>Your name<input required autoComplete="name" name="name" value={name} onChange={e => { setName(e.target.value); e.target.setCustomValidity('') }} maxLength={80} placeholder="What should we call you?" /></label><label>Email address<input required type="email" autoComplete="email" name="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={200} placeholder="you@example.com" /></label></div>
      {enquiry.kind === 'workshop' && <label>How many people?<select value={group} onChange={e => setGroup(e.target.value)}><option value="">Still figuring it out</option><option>Just me</option><option>2–5 people</option><option>6–12 people</option><option>More than 12 people</option></select></label>}
      <label>A little about your idea<textarea required name="message" value={message} onChange={e => { setMessage(e.target.value); e.target.setCustomValidity('') }} rows={4} maxLength={2000} placeholder={enquiry.kind === 'workshop' ? 'Your city, preferred date, and who’s joining…' : 'Favourite colours, a special occasion, a little detail…'} /></label>
      <button className="button button-dark submit-button" type="submit">Put my enquiry together <ArrowUpRight size={18} /></button>
      <p className="form-note">This prepares a note for you to share. It doesn’t confirm an order or booking.</p>
    </form>}
  </dialog>
}
