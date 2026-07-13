import { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'your_service_id'
const TEMPLATE_ID = 'your_template_id'
const PUBLIC_KEY = 'your_public_key'

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
}

function Field({ label, textarea, ...props }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div>
      <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-muted block mb-1.5">{label}</label>
      <Tag
        {...props}
        rows={textarea ? 3 : undefined}
        required
        className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-ink text-sm placeholder:text-mutedlo outline-none focus:border-signal transition-colors resize-none"
      />
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name, from_email: form.email, message: form.message,
      }, PUBLIC_KEY)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative py-20 border-t border-border">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...reveal} className="mb-3">
          <span className="eyebrow">// contact</span>
        </motion.div>
        <motion.h2 {...reveal} className="font-display font-black text-4xl md:text-6xl tracking-tightest text-ink mb-4">
          LET'S CONNECT
        </motion.h2>
        <motion.p {...reveal} className="text-[14px] text-muted mb-6">
          Open to full-time roles and freelance projects.
        </motion.p>

        <motion.div {...reveal} className="flex flex-wrap gap-x-6 gap-y-2 mb-10 text-[13px]">
          <a href="mailto:akaash.daniel.dev@gmail.com" className="text-ink hover:text-signal flex items-center gap-2 transition-colors">
            <i className="fa fa-envelope text-signal text-xs" /> akaash.daniel.dev@gmail.com
          </a>
          <a href="tel:+916382177949" className="text-ink hover:text-signal flex items-center gap-2 transition-colors">
            <i className="fa fa-phone text-signal text-xs" /> +91 63821 77949
          </a>
          <a href="https://linkedin.com/in/akaash-daniel" target="_blank" rel="noreferrer" className="text-ink hover:text-signal flex items-center gap-2 transition-colors">
            <i className="fa-brands fa-linkedin text-signal text-xs" /> LinkedIn
          </a>
          <a href="https://github.com/akaashdaniel" target="_blank" rel="noreferrer" className="text-ink hover:text-signal flex items-center gap-2 transition-colors">
            <i className="fa-brands fa-github text-signal text-xs" /> GitHub
          </a>
        </motion.div>

        <motion.form {...reveal} onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
          </div>
          <Field label="Message" name="message" textarea value={form.message} onChange={handleChange} placeholder="Tell me about the opportunity or project..." />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-signal text-onaccent font-semibold text-sm rounded-lg px-5 py-2.5 flex items-center justify-center gap-2 hover:bg-signal/85 transition-colors disabled:opacity-60"
          >
            {status === 'sending' && <i className="fa fa-circle-notch fa-spin text-xs" />}
            {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent ✓' : 'Send Message'}
          </button>
          {status === 'error' && (
            <p className="text-red-400 text-xs text-center">Something went wrong — email me directly instead.</p>
          )}
        </motion.form>
      </div>
    </section>
  )
}