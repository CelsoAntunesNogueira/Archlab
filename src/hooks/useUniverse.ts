import { useEffect, useRef } from 'react'

interface Star {
  x: number; y: number; r: number; alpha: number
  speed: number; phase: number; parallaxFactor: number
}
interface Nebula { x: number; y: number; r: number; color: string; alpha: number }
interface FloatNode { x: number; y: number; vx: number; vy: number; r: number; color: string }

export function useUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return
    let W = canvas.width
    let H = canvas.height
    let stars: Star[] = [], nebulae: Nebula[] = [], nodes: FloatNode[] = []
    let mouseX = 0, mouseY = 0, scrollY = 0, t = 0
    let animId: number

    const nebulaColors = ['rgba(79,195,247,', 'rgba(206,147,216,', 'rgba(255,213,79,', 'rgba(244,143,177,', 'rgba(128,203,196,']
    const nodeColors = ['#4fc3f7', '#ce93d8', '#ffd54f', '#f48fb1', '#a5d6a7', '#80cbc4']

    function init() {
      W = canvas!.width = window.innerWidth
      H = canvas!.height = window.innerHeight
      stars = Array.from({ length: 280 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        alpha: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
        parallaxFactor: Math.random() * 0.3 + 0.05,
      }))
      nebulae = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 280 + 120,
        color: nebulaColors[i % nebulaColors.length],
        alpha: Math.random() * 0.025 + 0.008,
      }))
      nodes = Array.from({ length: 18 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.6,
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      nebulae.forEach((n, i) => {
        const mx = (mouseX / W - 0.5) * (i % 2 === 0 ? 20 : -15)
        const my = (mouseY / H - 0.5) * (i % 2 === 0 ? 15 : -20)
        const g = ctx.createRadialGradient(n.x + mx, n.y + my, 0, n.x + mx, n.y + my, n.r)
        g.addColorStop(0, n.color + n.alpha + ')')
        g.addColorStop(1, n.color + '0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(n.x + mx, n.y + my, n.r, 0, Math.PI * 2); ctx.fill()
      })
      stars.forEach(s => {
        const py = s.y - scrollY * s.parallaxFactor
        const a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase))
        ctx.fillStyle = `rgba(232,238,255,${a})`
        ctx.beginPath(); ctx.arc(s.x, py, s.r, 0, Math.PI * 2); ctx.fill()
      })
      nodes.forEach((n, i) => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        nodes.slice(i + 1).forEach(m => {
          const dx = m.x - n.x, dy = m.y - n.y, d = Math.sqrt(dx * dx + dy * dy)
          if (d < 190) {
            ctx.strokeStyle = `rgba(79,195,247,${(1 - d / 190) * 0.13})`
            ctx.lineWidth = 0.5
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke()
          }
        })
        const dx = mouseX - n.x, dy = mouseY - n.y, dm = Math.sqrt(dx * dx + dy * dy)
        const glow = dm < 120 ? (1 - dm / 120) * 0.4 : 0
        ctx.globalAlpha = 0.45 + glow
        ctx.fillStyle = n.color
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + glow * 3, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = 1
      })
      t += 0.012
      animId = requestAnimationFrame(draw)
    }

    const onResize = () => init()
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onScroll = () => { scrollY = window.scrollY }

    init(); draw()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return canvasRef
}
