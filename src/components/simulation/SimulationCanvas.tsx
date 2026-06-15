import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import type { SimNode, Packet } from '@/types'
import { SIM_EDGES } from '@/data/simulation'

export interface SimCanvasHandle {
  spawnPacket: (svcId: string, type: Packet['type']) => void
  setNodeFailed: (id: string, failed: boolean) => void
  reset: () => void
}

interface Props { nodes: SimNode[] }

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) }
}

export const SimulationCanvas = forwardRef<SimCanvasHandle, Props>(({ nodes: initialNodes }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<SimNode[]>(initialNodes.map(n => ({ ...n })))
  const packetsRef = useRef<Packet[]>([])
  const animRef = useRef<number>(0)
  const speedRef = useRef(1)

  useImperativeHandle(ref, () => ({
    spawnPacket(svcId: string, type: Packet['type']) {
      const el = canvasRef.current!
      const svcNode = nodesRef.current.find(n => n.id === svcId); if (!svcNode) return
      let target: SimNode | undefined
      for (const [a, b] of SIM_EDGES) {
        if (a === svcId && !target) target = nodesRef.current.find(n => n.id === b)
        if (b === svcId && !target) target = nodesRef.current.find(n => n.id === a)
      }
      if (!target) return
      const color = type==='err'?'#ef5350':type==='warn'?'#ffd54f':type==='ok'?'#a5d6a7':'#4fc3f7'
      packetsRef.current.push({
        x: svcNode.x*el.width, y: svcNode.y*el.height,
        tx: target.x*el.width, ty: target.y*el.height,
        progress:0, speed:0.025, color, type, trail:[],
      })
    },
    setNodeFailed(id: string, failed: boolean) {
      const node = nodesRef.current.find(n => n.id === id)
      if (node) node.failed = failed
    },
    reset() {
      nodesRef.current = initialNodes.map(n => ({ ...n }))
      packetsRef.current = []
    },
  }))

  useEffect(() => {
    const el = canvasRef.current!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = el.getContext('2d')!

    const resize = () => {
      // el is guaranteed non-null here
      el.width = el.parentElement?.clientWidth ?? window.innerWidth
      el.height = 480
    }
    resize()
    window.addEventListener('resize', resize)

    function renderNodes() {
      const W = el.width, H = el.height
      SIM_EDGES.forEach(([a, b]) => {
        const na = nodesRef.current.find(n => n.id===a)
        const nb = nodesRef.current.find(n => n.id===b)
        if (!na||!nb) return
        ctx.beginPath(); ctx.moveTo(na.x*W, na.y*H); ctx.lineTo(nb.x*W, nb.y*H)
        ctx.strokeStyle='rgba(136,150,204,0.15)'; ctx.lineWidth=1; ctx.stroke()
      })
      nodesRef.current.forEach(node => {
        const x=node.x*W, y=node.y*H
        const color = node.failed ? '#ef5350' : node.color
        const {r,g,b} = hexToRgb(color)
        const grd = ctx.createRadialGradient(x,y,0,x,y,node.r*3)
        grd.addColorStop(0,`rgba(${r},${g},${b},0.12)`); grd.addColorStop(1,'transparent')
        ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(x,y,node.r*3,0,Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(x,y,node.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(${r},${g},${b},0.12)`; ctx.fill()
        ctx.strokeStyle=color; ctx.lineWidth=node.failed?2:1.5; ctx.stroke()
        ctx.fillStyle=color; ctx.font='700 10px Syne,sans-serif'
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(node.label,x,y)
        if (node.failed) {
          ctx.strokeStyle='#ef5350'; ctx.lineWidth=2
          const s=8
          ctx.beginPath(); ctx.moveTo(x-s,y-node.r-s); ctx.lineTo(x+s,y-node.r+s); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(x+s,y-node.r-s); ctx.lineTo(x-s,y-node.r+s); ctx.stroke()
        }
      })
    }

    function renderPackets() {
      packetsRef.current = packetsRef.current.filter(p => {
        p.progress += p.speed * speedRef.current
        if (p.progress >= 1) return false
        const ease = p.progress<0.5 ? 2*p.progress*p.progress : 1-Math.pow(-2*p.progress+2,2)/2
        const x = p.x+(p.tx-p.x)*ease, y = p.y+(p.ty-p.y)*ease
        p.trail.push({x,y}); if (p.trail.length>12) p.trail.shift()
        const {r,g,b} = hexToRgb(p.color)
        p.trail.forEach((pt,i) => {
          ctx.globalAlpha=(i/p.trail.length)*0.4
          ctx.fillStyle=`rgba(${r},${g},${b},1)`
          ctx.beginPath(); ctx.arc(pt.x,pt.y,2*(i/p.trail.length),0,Math.PI*2); ctx.fill()
        })
        ctx.globalAlpha=1
        ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2)
        ctx.fillStyle=`rgba(${r},${g},${b},1)`; ctx.fill()
        ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2)
        ctx.fillStyle=`rgba(${r},${g},${b},0.25)`; ctx.fill()
        return true
      })
    }

    function loop() {
      ctx.clearRect(0,0,el.width,el.height)
      renderNodes(); renderPackets()
      animRef.current = requestAnimationFrame(loop)
    }
    loop()

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize',resize) }
  }, [initialNodes])

  return <canvas ref={canvasRef} className="block w-full" style={{background:'rgba(8,14,35,0.4)'}} />
})

SimulationCanvas.displayName = 'SimulationCanvas'
