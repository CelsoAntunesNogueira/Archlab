import { useEffect, useRef } from 'react'

export function useCursor() {
  const curRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cx = 0, cy = 0, rx = 0, ry = 0
    const trail: { x: number; y: number; r: number; alpha: number; vx: number; vy: number; color: string }[] = []
    const colors = ['#f48fb1', '#ce93d8', '#4fc3f7', '#ffd54f']

    const canvas = trailRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMove = (e: MouseEvent) => {
      cx = e.clientX
      cy = e.clientY
      if (curRef.current) {
        curRef.current.style.left = cx + 'px'
        curRef.current.style.top = cy + 'px'
      }
      if (Math.random() < 0.4) {
        trail.push({
          x: cx + (Math.random() - 0.5) * 6,
          y: cy + (Math.random() - 0.5) * 6,
          r: Math.random() * 1.8 + 0.4,
          alpha: 1,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.7,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    let animId: number
    const animate = () => {
      rx += (cx - rx) * 0.12
      ry += (cy - ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px'
        ringRef.current.style.top = ry + 'px'
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.03; p.r *= 0.97
        if (p.alpha <= 0) { trail.splice(i, 1); continue }
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return { curRef, ringRef, trailRef }
}
