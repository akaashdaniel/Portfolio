import { useEffect, useRef } from 'react'

// Ambient deep-space background: twinkling starfield, soft drifting nebula
// tones, a signal-graph node network with traveling pulses, and a slowly
// drifting black hole with a rotating accretion disk. Kept low-opacity and
// slow so it never competes with foreground content.
export default function SignalBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, nodes, edges, pulses, raf

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

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

    function drawStars(stars) {
      stars.forEach((s) => {
        s.x -= s.speed
        if (s.x < 0) { s.x = W; s.y = Math.random() * H }
        s.tw += s.tws
        const t = Math.sin(s.tw) * 0.25 + 0.75
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,196,190,${s.alpha * t})`
        ctx.fill()
      })
    }

    // Soft drifting nebula tones — warm ash / cold charcoal, very low opacity
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

    // Black hole: slow drift path + rotating accretion disk
    const hole = {
      x: 0, y: 0, baseX: 0.78, baseY: 0.28, driftT: Math.random() * Math.PI * 2,
      rot: 0,
    }
    function drawBlackHole() {
      hole.driftT += 0.0006
      hole.x = (hole.baseX + Math.sin(hole.driftT) * 0.06) * W
      hole.y = (hole.baseY + Math.cos(hole.driftT * 0.7) * 0.05) * H
      hole.rot += reduced ? 0 : 0.0018

      const coreR = Math.min(W, H) * 0.035

      // outer glow
      const glow = ctx.createRadialGradient(hole.x, hole.y, coreR * 0.5, hole.x, hole.y, coreR * 6)
      glow.addColorStop(0, 'rgba(120,70,40,0.12)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(hole.x, hole.y, coreR * 6, 0, Math.PI * 2)
      ctx.fill()

      // accretion disk — rotated ellipse rings
      ctx.save()
      ctx.translate(hole.x, hole.y)
      ctx.rotate(hole.rot)
      for (let i = 0; i < 3; i++) {
        const rx = coreR * (2.2 + i * 0.9)
        const ry = rx * 0.32
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
        const alpha = 0.22 - i * 0.06
        ctx.strokeStyle = `rgba(180,110,60,${alpha})`
        ctx.lineWidth = coreR * 0.18
        ctx.stroke()
      }
      ctx.restore()

      // event horizon core (blocks center)
      ctx.beginPath()
      ctx.arc(hole.x, hole.y, coreR, 0, Math.PI * 2)
      ctx.fillStyle = '#000000'
      ctx.fill()
    }

    let spawnTimer = 0
    function render() {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0A0A0A'
      ctx.fillRect(0, 0, W, H)

      drawNeb()
      drawStars(far)
      drawStars(mid)
      drawBlackHole()

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
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
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
          ctx.arc(x, y, 2, 0, Math.PI * 2)
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
