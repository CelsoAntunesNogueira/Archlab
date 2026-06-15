import { useEffect, useRef } from 'react'
import type { Architecture } from '@/types'

interface DiagramNode {
  id: string
  x: number
  y: number
  label: string
  sub: string
  color: string
  r: number
}

interface DiagramEdge { from: string; to: string; dashed?: boolean }
interface ArchDiagram { nodes: DiagramNode[]; edges: DiagramEdge[] }

const DIAGRAMS: Record<string, ArchDiagram> = {
  monolithic: {
    nodes: [
      { id:'client', x:.5, y:.10, label:'Cliente',   sub:'Browser/App',    color:'#8896cc', r:24 },
      { id:'app',    x:.5, y:.45, label:'Monólito',  sub:'API+Logic+Data', color:'#4fc3f7', r:38 },
      { id:'db',     x:.5, y:.82, label:'Database',  sub:'SQL Server',     color:'#a5d6a7', r:24 },
    ],
    edges:[{ from:'client', to:'app' },{ from:'app', to:'db' }],
  },
  mvc: {
    nodes: [
      { id:'client', x:.5,  y:.08, label:'Cliente',    sub:'HTTP Request',   color:'#8896cc', r:22 },
      { id:'ctrl',   x:.5,  y:.32, label:'Controller', sub:'Recebe+Roteia',  color:'#a5d6a7', r:28 },
      { id:'model',  x:.22, y:.62, label:'Model',      sub:'Regras+Dados',   color:'#a5d6a7', r:26 },
      { id:'view',   x:.78, y:.62, label:'View',       sub:'Template HTML',  color:'#a5d6a7', r:26 },
      { id:'db',     x:.22, y:.88, label:'Database',   sub:'SQL Server',     color:'#a5d6a7', r:20 },
    ],
    edges:[
      { from:'client', to:'ctrl' },
      { from:'ctrl', to:'model' },
      { from:'ctrl', to:'view' },
      { from:'model', to:'db' },
    ],
  },
  layered: {
    nodes: [
      { id:'pres',   x:.5, y:.10, label:'Apresentação', sub:'Controllers',    color:'#ffd54f', r:28 },
      { id:'app',    x:.5, y:.35, label:'Aplicação',    sub:'Services/DTOs',  color:'#ffd54f', r:28 },
      { id:'domain', x:.5, y:.60, label:'Domínio',      sub:'Entities/Rules', color:'#ffd54f', r:30 },
      { id:'infra',  x:.5, y:.85, label:'Infra',        sub:'Repos/Database', color:'#ffd54f', r:28 },
    ],
    edges:[
      { from:'pres', to:'app' },
      { from:'app', to:'domain' },
      { from:'infra', to:'domain' },
      { from:'app', to:'infra', dashed:true },
    ],
  },
  clean: {
    nodes: [
      { id:'ui',     x:.50, y:.08, label:'UI / API',       sub:'Controllers',  color:'#8896cc', r:22 },
      { id:'app',    x:.50, y:.30, label:'Application',    sub:'Use Cases',    color:'#ce93d8', r:26 },
      { id:'domain', x:.50, y:.57, label:'Domain',         sub:'Entities',     color:'#ce93d8', r:34 },
      { id:'infra',  x:.18, y:.30, label:'Infrastructure', sub:'Repos/EF',     color:'#8896cc', r:24 },
      { id:'ext',    x:.82, y:.30, label:'External',       sub:'APIs/Email',   color:'#8896cc', r:22 },
      { id:'db',     x:.18, y:.80, label:'Database',       sub:'SQL Server',   color:'#a5d6a7', r:20 },
    ],
    edges:[
      { from:'ui', to:'app' },
      { from:'app', to:'domain' },
      { from:'infra', to:'domain', dashed:true },
      { from:'ext', to:'domain', dashed:true },
      { from:'infra', to:'db' },
    ],
  },
  microservices: {
    nodes: [
      { id:'gw',     x:.50, y:.08, label:'API Gateway', sub:'YARP/Nginx',    color:'#f48fb1', r:26 },
      { id:'orders', x:.20, y:.38, label:'Orders Svc',  sub:'.NET 8',        color:'#4fc3f7', r:22 },
      { id:'pay',    x:.50, y:.38, label:'Payment Svc', sub:'.NET 8',        color:'#4fc3f7', r:22 },
      { id:'notif',  x:.80, y:.38, label:'Notif Svc',   sub:'Node.js',       color:'#4fc3f7', r:22 },
      { id:'mq',     x:.50, y:.64, label:'RabbitMQ',    sub:'Message Broker',color:'#ffd54f', r:24 },
      { id:'dbo',    x:.20, y:.88, label:'DB Orders',   sub:'PostgreSQL',    color:'#a5d6a7', r:18 },
      { id:'dbp',    x:.50, y:.88, label:'DB Payments', sub:'PostgreSQL',    color:'#a5d6a7', r:18 },
    ],
    edges:[
      { from:'gw', to:'orders' },{ from:'gw', to:'pay' },{ from:'gw', to:'notif' },
      { from:'orders', to:'mq', dashed:true },{ from:'pay', to:'mq', dashed:true },
      { from:'orders', to:'dbo' },{ from:'pay', to:'dbp' },
    ],
  },
  'event-driven': {
    nodes: [
      { id:'prod1', x:.22, y:.12, label:'Producer A', sub:'Order Service', color:'#ffb74d', r:22 },
      { id:'prod2', x:.78, y:.12, label:'Producer B', sub:'User Service',  color:'#ffb74d', r:22 },
      { id:'bus',   x:.50, y:.45, label:'Event Bus',  sub:'Kafka/RabbitMQ',color:'#ffd54f', r:32 },
      { id:'con1',  x:.15, y:.82, label:'Consumer A', sub:'Payment Svc',  color:'#ffb74d', r:22 },
      { id:'con2',  x:.50, y:.82, label:'Consumer B', sub:'Notif Svc',    color:'#ffb74d', r:22 },
      { id:'con3',  x:.85, y:.82, label:'Consumer C', sub:'Analytics',    color:'#ffb74d', r:22 },
    ],
    edges:[
      { from:'prod1', to:'bus' },{ from:'prod2', to:'bus' },
      { from:'bus', to:'con1', dashed:true },
      { from:'bus', to:'con2', dashed:true },
      { from:'bus', to:'con3', dashed:true },
    ],
  },
  serverless: {
    nodes: [
      { id:'apigw', x:.50, y:.08, label:'API Gateway',  sub:'AWS/Azure',    color:'#80cbc4', r:24 },
      { id:'fn1',   x:.20, y:.35, label:'Fn: Orders',   sub:'Lambda',       color:'#80cbc4', r:22 },
      { id:'fn2',   x:.50, y:.35, label:'Fn: Payment',  sub:'Lambda',       color:'#80cbc4', r:22 },
      { id:'fn3',   x:.80, y:.35, label:'Fn: Notify',   sub:'Lambda',       color:'#80cbc4', r:22 },
      { id:'queue', x:.50, y:.62, label:'SQS / Bus',    sub:'Queue',        color:'#ffd54f', r:22 },
      { id:'db',    x:.20, y:.88, label:'DynamoDB',     sub:'NoSQL',        color:'#a5d6a7', r:20 },
      { id:'timer', x:.80, y:.62, label:'Timer Trigger',sub:'CRON',         color:'#ce93d8', r:20 },
    ],
    edges:[
      { from:'apigw', to:'fn1' },{ from:'apigw', to:'fn2' },{ from:'apigw', to:'fn3' },
      { from:'fn2', to:'queue', dashed:true },{ from:'fn3', to:'queue', dashed:true },
      { from:'fn1', to:'db' },{ from:'timer', to:'fn3', dashed:true },
    ],
  },
  cqrs: {
    nodes: [
      { id:'cmd',    x:.25, y:.08, label:'Command',     sub:'Write Side',   color:'#ef9a9a', r:24 },
      { id:'qry',    x:.75, y:.08, label:'Query',       sub:'Read Side',    color:'#ef9a9a', r:24 },
      { id:'wmodel', x:.25, y:.38, label:'Write Model', sub:'Aggregate',    color:'#ef9a9a', r:24 },
      { id:'rmodel', x:.75, y:.38, label:'Read Model',  sub:'Projection',   color:'#ef9a9a', r:24 },
      { id:'es',     x:.50, y:.64, label:'Event Store', sub:'Imutável',     color:'#ffd54f', r:28 },
      { id:'wdb',    x:.25, y:.88, label:'Write DB',    sub:'EventStoreDB', color:'#a5d6a7', r:20 },
      { id:'rdb',    x:.75, y:.88, label:'Read DB',     sub:'PostgreSQL',   color:'#a5d6a7', r:20 },
    ],
    edges:[
      { from:'cmd', to:'wmodel' },{ from:'qry', to:'rmodel' },
      { from:'wmodel', to:'es' },{ from:'es', to:'rmodel', dashed:true },
      { from:'wmodel', to:'wdb' },{ from:'rmodel', to:'rdb' },
    ],
  },
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) }
}

interface Props { arch: Architecture }

export function DiagramCanvas({ arch }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)

  useEffect(() => {
    const el = canvasRef.current!
    const ctx = el.getContext('2d')!

    const diagram = DIAGRAMS[arch.id]
    if (!diagram) return

    // Cancel any previous animation loop
    cancelAnimationFrame(animRef.current)

    // ── Size canvas correctly ──────────────────────────────
    // Use ResizeObserver so we get the real width after layout
    let started = false

    function setSize() {
      const parent = el.parentElement
      const w = parent ? parent.clientWidth : 800
      el.width  = w > 0 ? w : 800
      el.height = 500
    }

    function getPos(id: string) {
      const node = diagram.nodes.find(n => n.id === id)!
      return { x: node.x * el.width, y: node.y * el.height }
    }

    interface Pkt {
      fromX: number; fromY: number; toX: number; toY: number
      p: number; color: string; trail: {x:number;y:number}[]
    }
    let packets: Pkt[] = []
    let t = 0

    function spawnPacket() {
      const edge = diagram.edges[Math.floor(Math.random() * diagram.edges.length)]
      const from = getPos(edge.from)
      const to   = getPos(edge.to)
      const node = diagram.nodes.find(n => n.id === edge.from)!
      packets.push({ fromX:from.x, fromY:from.y, toX:to.x, toY:to.y, p:0, color:node.color, trail:[] })
    }

    function drawFrame() {
      const W = el.width, H = el.height
      ctx.clearRect(0, 0, W, H)

      // Edges
      diagram.edges.forEach(edge => {
        const f = getPos(edge.from), t2 = getPos(edge.to)
        ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t2.x, t2.y)
        ctx.strokeStyle = 'rgba(136,150,204,0.2)'
        ctx.lineWidth = 1
        ctx.setLineDash(edge.dashed ? [5,5] : [])
        ctx.stroke(); ctx.setLineDash([])
      })

      // Nodes
      diagram.nodes.forEach(node => {
        const x = node.x * W, y = node.y * H
        const {r:cr,g:cg,b:cb} = hexToRgb(node.color)
        const grd = ctx.createRadialGradient(x,y,0,x,y,node.r*2.8)
        grd.addColorStop(0,`rgba(${cr},${cg},${cb},0.14)`)
        grd.addColorStop(1,'transparent')
        ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(x,y,node.r*2.8,0,Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(x,y,node.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(${cr},${cg},${cb},0.12)`; ctx.fill()
        ctx.strokeStyle=node.color; ctx.lineWidth=1.5; ctx.stroke()
        ctx.fillStyle=node.color; ctx.font='700 11px Syne,sans-serif'
        ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText(node.label, x, y-4)
        ctx.fillStyle='rgba(136,150,204,0.65)'; ctx.font='8.5px Space Mono,monospace'
        ctx.fillText(node.sub, x, y+9)
      })

      // Packets
      packets = packets.filter(p => {
        p.p += 0.018; if (p.p >= 1) return false
        const ease = p.p<0.5 ? 2*p.p*p.p : 1-Math.pow(-2*p.p+2,2)/2
        const x = p.fromX+(p.toX-p.fromX)*ease
        const y = p.fromY+(p.toY-p.fromY)*ease
        p.trail.push({x,y}); if (p.trail.length>10) p.trail.shift()
        const {r:cr,g:cg,b:cb} = hexToRgb(p.color)
        p.trail.forEach((pt,i) => {
          ctx.globalAlpha=(i/p.trail.length)*0.35
          ctx.fillStyle=`rgba(${cr},${cg},${cb},1)`
          ctx.beginPath(); ctx.arc(pt.x,pt.y,1.5*(i/p.trail.length),0,Math.PI*2); ctx.fill()
        })
        ctx.globalAlpha=1
        ctx.fillStyle=`rgba(${cr},${cg},${cb},1)`
        ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill()
        ctx.fillStyle=`rgba(${cr},${cg},${cb},0.2)`
        ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fill()
        return true
      })

      if (t % 70 === 0) spawnPacket()
      t++
      animRef.current = requestAnimationFrame(drawFrame)
    }

    function start() {
      if (started) return
      started = true
      setSize()
      drawFrame()
    }

    // ResizeObserver fires once immediately with the real size
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      if (w > 0) {
        el.width  = Math.round(w)
        el.height = 500
        if (!started) start()
      }
    })
    ro.observe(el.parentElement ?? el)

    // Fallback: if ResizeObserver doesn't fire quickly (e.g. hidden tab)
    const fallback = setTimeout(() => {
      if (!started) start()
    }, 100)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      clearTimeout(fallback)
      started = false
      packets = []
    }
  }, [arch.id])

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="block w-full"
        style={{ background:'rgba(8,14,35,0.4)', height: 500 }}
      />
      <div className="flex flex-wrap gap-4 p-4" style={{ borderTop:'1px solid rgba(136,150,204,0.08)' }}>
        {[
          { color: arch.color, label: 'Serviços principais' },
          { color: '#ffd54f',  label: 'Broker / Mensageria' },
          { color: '#a5d6a7',  label: 'Banco de Dados'      },
          { color: '#8896cc',  label: 'Externo / Cliente'   },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.1em]"
            style={{ color:'var(--color-dim)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background:l.color }} />
            {l.label}
          </div>
        ))}
        <div className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.1em] ml-2"
          style={{ color:'var(--color-dim)' }}>
          <div className="w-6 border-t border-dashed" style={{ borderColor:'rgba(136,150,204,0.4)' }} />
          Assíncrono
        </div>
      </div>
    </div>
  )
}
