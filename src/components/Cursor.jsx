import { useEffect, useRef, useState } from 'react'

// A small rocket that follows the pointer with smooth lerp, banks into
// its direction of travel, and trails an animated flame. Disabled on
// touch devices.
export default function Cursor() {
  const shipRef = useRef(null)
  const flameRef = useRef(null)
  const trailRef = useRef([])
  const trailElsRef = useRef([])
  const [active, setActive] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    setIsTouch(touch)
    if (touch) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let x = mx, y = my
    let angle = -Math.PI / 2 // pointing up by default
    let raf
    let flameT = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!active) setActive(true)
    }
    window.addEventListener('mousemove', onMove)

    const hoverables = 'a, button, input, textarea, [role="button"]'
    const onOver = (e) => { if (e.target.closest(hoverables)) setHovering(true) }
    const onOut = (e) => { if (e.target.closest(hoverables)) setHovering(false) }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    function tick() {
      const dx = mx - x
      const dy = my - y
      x += dx * 0.16
      y += dy * 0.16

      const speed = Math.sqrt(dx * dx + dy * dy)
      if (speed > 0.6) {
        const target = Math.atan2(dy, dx) + Math.PI / 2
        let diff = target - angle
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        angle += diff * 0.18
      }

      if (shipRef.current) {
        shipRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`
      }

      flameT += 0.3
      if (flameRef.current) {
        const flicker = 0.75 + Math.sin(flameT) * 0.25
        flameRef.current.style.transform = `scaleY(${flicker})`
      }

      trailRef.current.unshift({ x, y })
      if (trailRef.current.length > 6) trailRef.current.pop()
      trailElsRef.current.forEach((el, i) => {
        const p = trailRef.current[i]
        if (el && p) {
          const t = 1 - i / trailRef.current.length
          el.style.transform = `translate(${p.x}px, ${p.y}px)`
          el.style.opacity = (t * 0.3 * Math.min(speed / 4, 1)).toString()
        }
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [active])

  if (isTouch) return null

  return (
    <div className={`fixed inset-0 z-[99999] pointer-events-none transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailElsRef.current[i] = el)}
          className="absolute top-0 left-0 w-1 h-1 rounded-full bg-signal2"
          style={{ marginLeft: -2, marginTop: -2, opacity: 0 }}
        />
      ))}
      <div
        ref={shipRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{ marginLeft: 0, marginTop: 0 }}
      >
        <svg
          width={hovering ? 28 : 22}
          height={hovering ? 34 : 27}
          viewBox="0 0 22 28"
          style={{
            marginLeft: hovering ? -14 : -11,
            marginTop: hovering ? -17 : -13,
            transition: 'width .2s, height .2s, margin .2s',
            filter: `drop-shadow(0 0 6px ${hovering ? 'rgba(201,198,193,0.6)' : 'rgba(183,180,174,0.5)'})`,
            overflow: 'visible',
          }}
        >
          {/* flame */}
          <g ref={flameRef} style={{ transformOrigin: '11px 24px' }}>
            <path d="M11,24 L7.5,31 L11,28.5 L14.5,31 Z" fill="#8a5a3a" opacity="0.9" />
            <path d="M11,24 L8.8,29 L11,27.3 L13.2,29 Z" fill="#c98a5a" />
          </g>
          {/* fins */}
          <path d="M8,18 L2,25 L8,23 Z" fill={hovering ? '#948F88' : '#33312F'} />
          <path d="M14,18 L20,25 L14,23 Z" fill={hovering ? '#948F88' : '#33312F'} />
          {/* body */}
          <path
            d="M11,0 C15,4 16.5,10 16,19 L6,19 C5.5,10 7,4 11,0 Z"
            fill={hovering ? '#c9c6c1' : '#B7B4AE'}
            stroke={hovering ? '#948F88' : '#726E68'}
            strokeWidth="0.6"
          />
          {/* window */}
          <circle cx="11" cy="9" r="2.6" fill={hovering ? '#371E1E' : '#33312F'} />
          <circle cx="11" cy="9" r="2.6" fill="none" stroke={hovering ? '#c9c6c1' : '#948F88'} strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  )
}
