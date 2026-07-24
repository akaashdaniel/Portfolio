import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TAU = Math.PI * 2

// Sun sits low-left; planets recede on a diagonal toward the far upper-right
// corner, getting smaller and more distant as t -> 1.
const SUN = { xF: 0.09, yF: 0.95 }
const FAR = { xF: 0.98, yF: 0.03 }

const PLANETS = [
  { t: 0.14, size: 3.4, color: '#8a7f74', trail: 3 },
  { t: 0.25, size: 4.6, color: '#c9a56d', trail: 4 },
  { t: 0.36, size: 4.8, color: '#7d93a0', trail: 4 },
  { t: 0.47, size: 3.6, color: '#a25c3c', trail: 4 },
  { t: 0.59, size: 8.2, color: '#b99a7c', trail: 5 },
  { t: 0.71, size: 6.8, color: '#c8b48a', trail: 5, ring: true },
  { t: 0.83, size: 5.0, color: '#7fa3a1', trail: 4 },
  { t: 0.93, size: 4.4, color: '#5f72a3', trail: 4 },
]

export default function SignalBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W, H, nodes, edges, pulses, raf
    const scroll = { y: 0 }
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function onPointerMove(e) {
      pointer.tx = e.clientX / window.innerWidth
      pointer.ty = e.clientY / window.innerHeight
    }
    if (!reduced) window.addEventListener('mousemove', onPointerMove)

    // ---------- signal-graph node network ----------
    function buildGraph() {
      const count = Math.max(16, Math.min(30, Math.floor((W * H) / 70000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        r: Math.random() * 1.3 + 0.5,
      }))
      edges = []
      nodes.forEach((n, i) => {
        nodes.forEach((m, j) => {
          if (j <= i) return
          const dx = n.x - m.x, dy = n.y - m.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < Math.min(W, H) * 0.2) edges.push([i, j])
        })
      })
      pulses = []
    }
    buildGraph()

    // ---------- starfield ----------
    function mkStars(n, minR, maxR, speed, alpha) {
      return Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * (maxR - minR) + minR, speed,
        alpha: Math.random() * alpha + alpha * 0.3,
        tw: Math.random() * Math.PI * 2, tws: Math.random() * 0.012 + 0.005,
      }))
    }
    const far = mkStars(120, 0.2, 0.6, 0.025, 0.28)
    const mid = mkStars(60, 0.4, 0.9, 0.06, 0.4)

    function drawStars(stars, parallax) {
      const ox = (pointer.x - 0.5) * parallax
      const oy = (pointer.y - 0.5) * parallax
      stars.forEach((s) => {
        s.x -= s.speed
        if (s.x < 0) { s.x = W; s.y = Math.random() * H }
        s.tw += s.tws
        const t = Math.sin(s.tw) * 0.25 + 0.75
        ctx.beginPath()
        ctx.arc(s.x + ox, s.y + oy, s.r, 0, TAU)
        ctx.fillStyle = `rgba(200,196,190,${s.alpha * t})`
        ctx.fill()
      })
    }

    // ---------- ambient nebula ----------
    const nebulae = [
      { x: 0.2, y: 0.25, r: 0.22, c: 'rgba(148,143,136,', a: 0.02 },
      { x: 0.82, y: 0.7, r: 0.2, c: 'rgba(55,30,30,', a: 0.03 },
    ]
    let nt = 0
    function drawNeb() {
      nt += 0.0015
      nebulae.forEach((n, i) => {
        const cx = (n.x + Math.sin(nt + i) * 0.02) * W
        const cy = (n.y + Math.cos(nt + i) * 0.02) * H
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r * W)
        g.addColorStop(0, n.c + n.a + ')')
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      })
    }

    // ---------- solar system ----------
    let driftT = Math.random() * TAU
    let sunPulse = 0

    function drawSun(sx, sy) {
      sunPulse += reduced ? 0 : 0.02
      const pulse = 1 + Math.sin(sunPulse) * 0.06
      const coreR = Math.min(W, H) * 0.032 * pulse

      const glow = ctx.createRadialGradient(sx, sy, coreR * 0.4, sx, sy, coreR * 7)
      glow.addColorStop(0, 'rgba(220,160,90,0.18)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(sx, sy, coreR * 7, 0, TAU)
      ctx.fill()

      const core = ctx.createRadialGradient(sx - coreR * 0.3, sy - coreR * 0.3, 0, sx, sy, coreR)
      core.addColorStop(0, '#f2c98a')
      core.addColorStop(1, '#c9863f')
      ctx.beginPath()
      ctx.arc(sx, sy, coreR, 0, TAU)
      ctx.fillStyle = core
      ctx.fill()
    }

    function drawPlanet(p, i, sx, sy, fx, fy) {
      const wob = reduced ? 0 : Math.sin(driftT * 0.6 + i * 1.3) * 4
      const parX = (10 + p.t * 34) * (pointer.x - 0.5)
      const parY = (6 + p.t * 20) * (pointer.y - 0.5)
      const x = sx + (fx - sx) * p.t + wob + parX
      const y = sy + (fy - sy) * p.t + scroll.y * (0.12 + p.t * 0.35) + parY

      // dust trail back toward the sun
      for (let k = 1; k <= p.trail; k++) {
        const tt = k / (p.trail + 1)
        const trailX = x - (x - sx) * tt * 0.12
        const trailY = y - (y - sy) * tt * 0.12
        ctx.beginPath()
        ctx.arc(trailX, trailY, p.size * (1 - tt) * 0.35, 0, TAU)
        ctx.fillStyle = `rgba(190,160,130,${0.1 * (1 - tt)})`
        ctx.fill()
      }

      if (p.ring) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(-0.35)
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size * 2.1, p.size * 0.7, 0, 0, TAU)
        ctx.strokeStyle = 'rgba(200,180,140,0.35)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      }

      ctx.beginPath()
      ctx.arc(x, y, p.size, 0, TAU)
      ctx.fillStyle = p.color
      ctx.fill()
    }

    function drawSolarSystem() {
      driftT += reduced ? 0 : 0.004
      const sx = SUN.xF * W + (pointer.x - 0.5) * 16
      const sy = SUN.yF * H + scroll.y * 0.1 + (pointer.y - 0.5) * 8
      const fx = FAR.xF * W
      const fy = FAR.yF * H
      drawSun(sx, sy)
      PLANETS.forEach((p, i) => drawPlanet(p, i, sx, sy, fx, fy))
    }

    // ---------- occasional comet streak ----------
    let comet = null
    function maybeSpawnComet() {
      if (reduced || comet) return
      if (Math.random() < 0.0012) {
        comet = {
          x: -60,
          y: Math.random() * H * 0.35,
          vx: 7 + Math.random() * 3,
          vy: 2.2 + Math.random() * 1.4,
        }
      }
    }
    function drawComet() {
      if (!comet) return
      comet.x += comet.vx
      comet.y += comet.vy
      const tailX = comet.x - comet.vx * 6
      const tailY = comet.y - comet.vy * 6
      const grad = ctx.createLinearGradient(tailX, tailY, comet.x, comet.y)
      grad.addColorStop(0, 'rgba(230,210,180,0)')
      grad.addColorStop(1, 'rgba(240,220,190,0.8)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(comet.x, comet.y)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(comet.x, comet.y, 1.6, 0, TAU)
      ctx.fillStyle = 'rgba(250,235,210,0.95)'
      ctx.fill()
      if (comet.x > W + 60 || comet.y > H + 60) comet = null
    }

    // ---------- scroll-driven parallax (created once, top-level of this effect) ----------
    let st
    if (!reduced) {
      st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          scroll.y = self.progress * 300
        },
      })
    }

    function tickPointer() {
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
    }

    let spawnTimer = 0
    function render() {
      tickPointer()
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0A0A0A'
      ctx.fillRect(0, 0, W, H)

      drawNeb()
      drawStars(far, 14)
      drawStars(mid, 26)
      drawSolarSystem()
      maybeSpawnComet()
      drawComet()

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      })
      edges.forEach(([i, j]) => {
        const a = nodes[i], b = nodes[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const d = Math.sqrt(dx * dx + dy * dy)
        const maxD = Math.min(W, H) * 0.2
        if (d > maxD) return
        const alpha = (1 - d / maxD) * 0.08
        ctx.beginPath()
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(148,143,136,${alpha})`
        ctx.lineWidth = 1
        ctx.stroke()
      })
      nodes.forEach((n) => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, TAU)
        ctx.fillStyle = 'rgba(183,180,174,0.22)'
        ctx.fill()
      })

      if (!reduced) {
        spawnTimer++
        if (spawnTimer > 75 && edges.length) {
          spawnTimer = 0
          const [i, j] = edges[Math.floor(Math.random() * edges.length)]
          pulses.push({ i, j, t: 0 })
        }
        for (let k = pulses.length - 1; k >= 0; k--) {
          const p = pulses[k]
          p.t += 0.012
          if (p.t >= 1) { pulses.splice(k, 1); continue }
          const a = nodes[p.i], b = nodes[p.j]
          const x = a.x + (b.x - a.x) * p.t
          const y = a.y + (b.y - a.y) * p.t
          const glow = Math.sin(p.t * Math.PI)
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, TAU)
          ctx.fillStyle = `rgba(183,180,174,${glow * 0.85})`
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      if (!reduced) window.removeEventListener('mousemove', onPointerMove)
      if (st) st.kill()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
