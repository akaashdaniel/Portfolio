import { motion } from 'framer-motion'

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

function Cell({ label, children, wide, last }) {
  return (
    <div
      className={`relative p-5 md:p-6 border-border hover:bg-cardhi hover:border-signal transition-colors ${
        wide ? 'sm:col-span-2' : ''
      } ${last ? '' : 'border-b sm:border-b-0'} sm:border-r border-b sm:last:border-r-0`}
    >
      <span className="absolute top-4 right-5 text-mutedlo text-xs">↗</span>
      <div className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase mb-2.5">
        {label}
      </div>
      {children}
    </div>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...reveal} className="mb-14">
          <span className="eyebrow">// contact</span>
          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tightest text-ink mt-4">
            LET'S CONNECT
          </h2>
        </motion.div>

        <motion.div
          {...reveal}
          className="grid sm:grid-cols-4 border border-border rounded-xl overflow-hidden bg-card"
        >
          <Cell label="Name">
            <div className="text-[14px] text-ink">Akaash Daniel S</div>
          </Cell>
          <Cell label="Email">
            <a href="mailto:akaash.daniel.dev@gmail.com" className="text-[14px] text-ink hover:text-signal2 break-all">
              akaash.daniel.dev@gmail.com
            </a>
          </Cell>
          <Cell label="Phone">
            <a href="tel:+916382177949" className="text-[14px] text-ink hover:text-signal2">
              +91 63821 77949
            </a>
          </Cell>
          <Cell label="Location" last>
            <div className="text-[14px] text-ink">Chennai, India</div>
          </Cell>

          <Cell label="Socials" wide>
            <div className="text-[14px] text-ink leading-loose">
              <a href="https://linkedin.com/in/akaash-daniel" target="_blank" rel="noreferrer" className="hover:text-signal2 block">
                LinkedIn — /akaash-daniel
              </a>
              <a href="https://github.com/akaashdaniel" target="_blank" rel="noreferrer" className="hover:text-signal2 block">
                GitHub — /akaashdaniel
              </a>
            </div>
          </Cell>
          <Cell label="Available for" wide last>
            <div className="text-[14px] text-ink mb-2">
              Full-time roles &nbsp;·&nbsp; Freelance projects
            </div>
            <div className="text-[12px] italic text-signal">
              Building intelligent systems, one commit at a time.
            </div>
          </Cell>
        </motion.div>
      </div>
    </section>
  )
}
