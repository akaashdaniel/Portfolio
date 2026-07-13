import { motion } from 'framer-motion'

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

const row1 = [
  ['fab fa-html5', '#e34f26', 'HTML5'],
  ['fab fa-css3-alt', '#1572B6', 'CSS3'],
  ['fab fa-js', '#F7DF1E', 'JavaScript'],
  ['fab fa-java', '#ED8B00', 'Java'],
  ['fab fa-python', '#3776AB', 'Python'],
]
const row2 = [
  ['fab fa-react', '#61DAFB', 'React'],
  ['fab fa-node-js', '#339933', 'Node.js'],
  ['fab fa-git-alt', '#F05032', 'Git'],
  ['fab fa-github', '#e9dfe8', 'GitHub'],
  ['fab fa-aws', '#FF9900', 'AWS'],
]
const row3 = [
  ['fa-solid fa-flask', '#975F8F', 'Flask'],
  ['fa-solid fa-database', '#47A248', 'MongoDB'],
  ['fa-solid fa-brain', '#FF6F00', 'TensorFlow'],
  ['fa-solid fa-fire', '#EE4C2C', 'PyTorch'],
  ['fa-solid fa-robot', '#e9dfe8', 'LangChain'],
]

function Row({ items, reverse, speed = 22 }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] mb-3">
      <div
        className="inline-flex gap-2.5 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {doubled.map(([icon, color, label], i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shrink-0 hover:border-signal hover:scale-105 transition-all"
          >
            <i className={icon} style={{ color }} />
            <span className="text-[13px] text-ink">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...reveal} className="mb-14">
          <span className="eyebrow">// skills</span>
          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tightest text-ink mt-4">
            TOOLS & TECHNOLOGIES 
          </h2>
          <p className="text-muted mt-4 max-w-lg text-[15px]">
            Hover a row to pause it and read.
          </p>
        </motion.div>

        <motion.div {...reveal}>
          <Row items={row1} speed={26} />
          <Row items={row2} reverse speed={24} />
          <Row items={row3} speed={28} />
        </motion.div>
      </div>
    </section>
  )
}
