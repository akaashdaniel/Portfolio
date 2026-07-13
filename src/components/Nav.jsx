import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#work', label: 'Work' },
  { href: '/Akaash_Daniel_Resume.pdf', label: 'Resume', external: true },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg/85 backdrop-blur-xl border-b border-border py-3'
            : 'py-6'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#top" className="font-display font-semibold text-lg tracking-tight text-ink flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal inline-block" />
            Akaash Daniel
          </a>
          <ul className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target={l.external ? '_blank' : undefined}
                  rel={l.external ? 'noreferrer' : undefined}
                  className="text-sm text-muted hover:text-ink transition-colors font-body"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="text-sm font-medium bg-signal text-onaccent px-4 py-2 rounded-md hover:bg-signal/85 transition-colors"
              >
                Get in touch
              </a>
            </li>
          </ul>
          <button
            className="md:hidden text-ink text-xl"
            onClick={() => setMobOpen(true)}
            aria-label="Open menu"
          >
            <i className="fa fa-bars" />
          </button>
        </nav>
      </header>

      {mobOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-bg/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
        >
          <button
            className="absolute top-6 right-6 text-muted text-2xl"
            onClick={() => setMobOpen(false)}
            aria-label="Close menu"
          >
            <i className="fa fa-times" />
          </button>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              onClick={() => setMobOpen(false)}
              className="font-display text-3xl font-medium text-ink"
            >
              {l.label}
            </a>
          ))}
        </motion.div>
      )}
    </>
  )
}
