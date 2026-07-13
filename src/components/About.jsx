import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

function Avatar() {
  const containerRef = useRef(null)
  const armRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isExcited, setIsExcited] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const eyeX = useSpring(mouseX, { stiffness: 150, damping: 15 })
  const eyeY = useSpring(mouseY, { stiffness: 150, damping: 15 })

  useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy) || 1
      const maxOffset = 2.5
      mouseX.set((dx / dist) * maxOffset)
      mouseY.set((dy / dist) * maxOffset)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    let timeout
    const scheduleBlink = () => {
      timeout = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
        scheduleBlink()
      }, 2200 + Math.random() * 2600)
    }
    scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

  // arm rotation — written directly as a native SVG transform each frame,
  // pivoting exactly at the shoulder point (76, 40). No CSS transform-origin involved.
  useAnimationFrame((t) => {
    if (!armRef.current) return
    const base = 212 // resting "raised hand" angle, safely up-and-right of the shoulder
    const speed = isExcited ? 0.012 : isHovered ? 0.0044 : 0.0022
    const range = isExcited ? 22 : isHovered ? 16 : 11
    const angle = base + Math.sin(t * speed) * range
    armRef.current.setAttribute('transform', `rotate(${angle} 76 40)`)
  })

  const handleClick = () => {
    setIsExcited(true)
    setTimeout(() => setIsExcited(false), 900)
  }

  const particles = [0, 1, 2, 3].map((i) => ({
    id: i,
    x: -20 + i * 14 + (i % 2 === 0 ? -6 : 6),
    delay: i * 0.7,
    duration: 3 + i * 0.4,
  }))

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      animate={{ y: isExcited ? [0, -18, 0, -8, 0] : [0, -5, 0] }}
      transition={
        isExcited
          ? { duration: 0.7, ease: 'easeOut' }
          : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
      }
      style={{ display: 'inline-block', position: 'relative', cursor: 'pointer' }}
    >
      <motion.div
        animate={{
          opacity: isHovered || isExcited ? [0.3, 0.55, 0.3] : [0.15, 0.3, 0.15],
          scale: isExcited ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: isExcited ? 0.7 : 3.5, repeat: isExcited ? 0 : Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -10, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,120,70,0.35), transparent 70%)',
          zIndex: 0,
        }}
      />

      {particles.map((p) => (
        <motion.span
          key={p.id}
          animate={{ y: [0, -50], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: `calc(50% + ${p.x}px)`,
            bottom: 10,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: '#e8a25a',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      <svg width="92" height="110" viewBox="0 0 100 120" style={{ position: 'relative', zIndex: 1 }}>
        {/* back-left leg */}
        <rect x="30" y="80" width="9" height="22" rx="4.5" fill="#4a3624" transform="rotate(-14 34.5 80)" />
        {/* back-right leg */}
        <rect x="61" y="80" width="9" height="22" rx="4.5" fill="#4a3624" transform="rotate(14 65.5 80)" />

        {/* front-left leg (static, resting) */}
        <rect x="14" y="45" width="9" height="42" rx="4.5" fill="#6b4b2f" transform="rotate(18 18.5 45)" />

        {/* rocky body — angular inverted-triangle gem, breathes idly */}
        <motion.g
          style={{ transformOrigin: '50px 58px' }}
          animate={{ scale: isExcited ? [1, 1.06, 1] : [1, 1.015, 1] }}
          transition={{ duration: isExcited ? 0.5 : 4, repeat: isExcited ? 0 : Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M28,20 L72,20 L82,42 L68,80 L50,96 L32,80 L18,42 Z"
            fill="#8a5a34" stroke="#5c3a1f" strokeWidth="1.5" strokeLinejoin="round"
          />
          <path d="M34,32 L44,46 L36,56" stroke="#5c3a1f" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M66,34 L58,48 L66,58" stroke="#5c3a1f" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M44,74 L50,82" stroke="#5c3a1f" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* eyes — idle wander + cursor tracking + blink + brighten on hover/click */}
        <motion.g style={{ x: eyeX, y: eyeY }}>
          <motion.g
            animate={{ x: [0, 1.5, -1.5, 0], y: [0, -1, 1, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.circle
              cx="40" cy="45" r="3.3" fill="#e8a25a"
              animate={{
                opacity: isBlinking ? 0.15 : isHovered || isExcited ? 1 : 0.9,
                scaleY: isBlinking ? 0.15 : 1,
              }}
              style={{ transformOrigin: '40px 45px' }}
              transition={{ duration: 0.12 }}
            />
            <motion.circle
              cx="60" cy="45" r="3.3" fill="#e8a25a"
              animate={{
                opacity: isBlinking ? 0.15 : isHovered || isExcited ? 1 : 0.9,
                scaleY: isBlinking ? 0.15 : 1,
              }}
              style={{ transformOrigin: '60px 45px' }}
              transition={{ duration: 0.12 }}
            />
          </motion.g>
        </motion.g>

        {/* front-right arm — rotation set imperatively each frame via ref, see useAnimationFrame above */}
        <g ref={armRef}>
          <rect x="71.5" y="40" width="9" height="34" rx="4.5" fill="#6b4b2f" />
        </g>
      </svg>
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="relative py-24 border-t border-border bg-gradient-to-b from-signal/[0.04] to-transparent">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...reveal()} className="eyebrow mb-4">// about me</motion.div>

        <motion.div {...reveal(0.05)} className="flex items-start gap-6 mb-10">
          <Avatar />
          <h2 className="font-display font-black text-3xl md:text-5xl leading-[1.05] tracking-tightest text-ink pt-1">
            Building at the intersection of AI research and production engineering.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 mb-8">
          <motion.p {...reveal(0.1)} className="text-[15px] text-muted leading-relaxed">
            I'm a Computer Science engineer from Chennai working across AI/ML,
            full-stack development, and government-grade quality assurance. My
            flagship project, <span className="text-ink">DiseaseGPT</span>, was
            selected and funded by the Tamil Nadu State Council for Science &
            Technology — a state-recognised research grant. I currently
            validate national government platforms as a QA Engineer at ETDC.
          </motion.p>

          <motion.div {...reveal(0.15)} className="flex flex-col gap-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="font-mono text-[10px] tracking-[0.15em] text-signal uppercase mb-1.5">
                Currently working on
              </div>
              <div className="text-[12.5px] text-muted leading-relaxed">
                Deepening my foundations in Python for data science — NumPy,
                Pandas, and applied ML.
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="font-mono text-[10px] tracking-[0.15em] text-signal uppercase mb-1.5">
                Available for
              </div>
              <div className="text-[12.5px] text-muted leading-relaxed">
                Full-time roles in AI/ML & full-stack — plus freelance projects.
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div {...reveal(0.2)} className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="font-display font-black text-3xl text-ink">7.4</div>
            <div className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase mt-1">
              Current CGPA
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="font-display font-black text-3xl text-ink">₹60K</div>
            <div className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase mt-1">
              TNSCST Funding
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}