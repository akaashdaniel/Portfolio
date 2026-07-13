import { motion } from 'framer-motion'

const NAME_LINES = ['AKAASH', 'DANIEL']

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-10 px-4 py-1.5 border border-border rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-signal" />
          <span className="eyebrow text-[11px] tracking-widest uppercase text-signal2">
            Available for opportunities
          </span>
        </motion.div>

        <div className="relative">
          <div className="select-none">
            {NAME_LINES.map((line, li) => (
              <div key={line} className="flex overflow-hidden">
                {line.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1 + li * 0.26 + i * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="font-display font-black text-[clamp(3.4rem,10.5vw,8.5rem)] leading-[0.94] tracking-tightest inline-block text-ink"
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
            aria-hidden="true"
            className="pointer-events-none absolute font-display font-black text-[clamp(3.4rem,10.5vw,8.5rem)] leading-[0.94] tracking-tightest whitespace-nowrap select-none"
            style={{
              WebkitTextStroke: '1.5px rgba(151,95,143,0.45)',
              color: 'transparent',
              bottom: '-2.2rem',
              right: '-0.3rem',
              zIndex: 0,
            }}
          >
            DANIEL.
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-10 font-mono text-[13px] tracking-[0.2em] uppercase text-muted"
        >
          AI/ML Engineer &nbsp;·&nbsp; Full-Stack Developer &nbsp;·&nbsp; Researcher
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-6 md:left-10 flex flex-col items-center gap-2"
      >
        <div className="w-px h-9 bg-gradient-to-b from-signal to-transparent" />
        <div className="text-[9px] tracking-[0.3em] text-muted [writing-mode:vertical-rl]">
          SCROLL
        </div>
      </motion.div>
    </section>
  )
}
