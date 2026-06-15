import { useEffect, useRef } from 'react'
import type { Architecture } from '@/types'
import { METRIC_LABELS } from '@/data/architectures'

interface Props {
  archA: Architecture
  archB: Architecture
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

export function RadarChart({ archA, archB }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2, R = 100
    const keys = Object.keys(METRIC_LABELS)
    const N = keys.length

    ctx.clearRect(0, 0, W, H)

    // Grid rings
    for (let ring = 1; ring <= 5; ring++) {
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        const angle = (Math.PI * 2 / N) * i - Math.PI / 2
        const x = cx + Math.cos(angle) * (R * ring / 5)
        const y = cy + Math.sin(angle) * (R * ring / 5)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = 'rgba(136,150,204,0.12)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Axes + labels
    keys.forEach((k, i) => {
      const angle = (Math.PI * 2 / N) * i - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R)
      ctx.strokeStyle = 'rgba(136,150,204,0.18)'
      ctx.lineWidth = 1
      ctx.stroke()
      const lx = cx + Math.cos(angle) * (R + 20)
      const ly = cy + Math.sin(angle) * (R + 20)
      ctx.fillStyle = 'rgba(136,150,204,0.7)'
      ctx.font = '7.5px Space Mono, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(METRIC_LABELS[k].toUpperCase(), lx, ly)
    })

    // Draw polygon
    function drawPoly(arch: Architecture) {
      const { r, g, b } = hexToRgb(arch.color)
      ctx.beginPath()
      keys.forEach((k, i) => {
        const val = (arch.metrics as Record<string, number>)[k] / 5
        const angle = (Math.PI * 2 / N) * i - Math.PI / 2
        const x = cx + Math.cos(angle) * R * val
        const y = cy + Math.sin(angle) * R * val
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.fillStyle = `rgba(${r},${g},${b},0.15)`
      ctx.fill()
      ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`
      ctx.lineWidth = 1.5
      ctx.stroke()
      keys.forEach((k, i) => {
        const val = (arch.metrics as Record<string, number>)[k] / 5
        const angle = (Math.PI * 2 / N) * i - Math.PI / 2
        const x = cx + Math.cos(angle) * R * val
        const y = cy + Math.sin(angle) * R * val
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},1)`
        ctx.fill()
      })
    }

    drawPoly(archA)
    drawPoly(archB)
  }, [archA, archB])

  return <canvas ref={canvasRef} width={280} height={280} />
}
