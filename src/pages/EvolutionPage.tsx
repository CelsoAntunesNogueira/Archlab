import { useState, useRef, useEffect } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface EvolutionStage {
  id: string
  title: string
  arch: string
  color: string
  users: string
  team: string
  year: string
  description: string
  stack: string[]
  pain: string
  trigger: string
}

const STAGES: EvolutionStage[] = [
  {
    id: 'monolith',
    title: 'Fase 1 — Nascimento',
    arch: 'Monolítica',
    color: '#4fc3f7',
    users: '< 1.000',
    team: '1–3 devs',
    year: 'Ano 1',
    description:
      'A startup começa com um monólito simples. Tudo em um projeto, um banco, um deploy. Velocidade máxima de desenvolvimento, zero overhead operacional.',
    stack: ['ASP.NET Core', 'SQL Server', 'Azure App Service'],
    pain: 'Deploy demora 20 min. Qualquer mudança requer deploy completo. Time crescendo.',
    trigger: 'Time chega a 6 pessoas. Dois times pisando no mesmo código constantemente.',
  },
  {
    id: 'modular',
    title: 'Fase 2 — Organização',
    arch: 'Modular (Layered)',
    color: '#ffd54f',
    users: '10.000',
    team: '4–8 devs',
    year: 'Ano 2',
    description:
      'O monólito é refatorado em módulos bem definidos com Clean Architecture. Domínio isolado, testes mais fáceis, deploy ainda único mas código muito mais organizado.',
    stack: ['Clean Architecture', 'MediatR', 'EF Core', 'xUnit'],
    pain: 'Módulo de pagamento precisa escalar sozinho. Banco de dados vira gargalo.',
    trigger: 'Black Friday derruba o sistema. Pagamentos precisam de 3x mais recursos que o resto.',
  },
  {
    id: 'services',
    title: 'Fase 3 — Extração',
    arch: 'Serviços Estratégicos',
    color: '#ce93d8',
    users: '100.000',
    team: '10–20 devs',
    year: 'Ano 3',
    description:
      'Os domínios mais críticos são extraídos: Pagamentos e Notificações viram serviços independentes. O monólito ainda existe mas é menor. Strangler Fig Pattern.',
    stack: ['Docker', 'RabbitMQ', 'API Gateway (YARP)', 'Redis Cache'],
    pain: 'Comunicação entre serviços cresce. Debug de erros distribuídos é difícil.',
    trigger: '5 times autônomos. Cada time quer deploy independente. Monólito bloqueia tudo.',
  },
  {
    id: 'microservices',
    title: 'Fase 4 — Escala Total',
    arch: 'Microsserviços',
    color: '#f48fb1',
    users: '1.000.000+',
    team: '5 times × 6 devs',
    year: 'Ano 5',
    description:
      'Decomposição completa em microsserviços independentes. Cada time possui seus serviços do início ao fim. Deploy contínuo, escala granular, resiliência máxima.',
    stack: ['Kubernetes', 'Kafka', 'Istio', 'Jaeger', 'Prometheus + Grafana'],
    pain: 'Transações distribuídas são complexas. Custo de infra elevado.',
    trigger: 'Sistema financeiro regulado precisa de auditoria completa. Event Sourcing é obrigatório.',
  },
  {
    id: 'cqrs',
    title: 'Fase 5 — Maturidade',
    arch: 'CQRS + Event Sourcing',
    color: '#ef9a9a',
    users: '10.000.000+',
    team: '10+ times',
    year: 'Ano 7+',
    description:
      'Os domínios mais críticos (pagamentos, auditoria) adotam CQRS e Event Sourcing. Histórico imutável, leitura e escrita otimizadas separadamente, compliance total.',
    stack: ['Marten', 'EventStoreDB', 'Read Models dedicados', 'Saga Orchestration'],
    pain: 'Complexidade extrema. Apenas times sênior conseguem manter.',
    trigger: 'Este é o nível mais maduro para a maioria das empresas. Poucos chegam aqui.',
  },
]

function StageCard({ stage, active, onClick, index }: {
  stage: EvolutionStage
  active: boolean
  onClick: () => void
  index: number
}) {
  const r = useReveal()
  return (
    <div
      ref={r}
      className="reveal cursor-pointer transition-all duration-300 relative"
      style={{ transitionDelay: `${index * 0.06}s` }}
      onClick={onClick}
    >
      {/* connector line */}
      {index < STAGES.length - 1 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px"
          style={{
            top: '100%',
            height: 32,
            background: `linear-gradient(to bottom, ${stage.color}60, transparent)`,
            zIndex: 1,
          }}
        />
      )}

      <div
        className="p-5 transition-all duration-300"
        style={{
          background: active ? `${stage.color}12` : 'rgba(8,14,35,0.5)',
          border: `1px solid ${active ? stage.color : 'rgba(136,150,204,0.1)'}`,
          backdropFilter: 'blur(10px)',
          transform: active ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              background: stage.color,
              boxShadow: active ? `0 0 10px ${stage.color}` : 'none',
            }}
          />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase" style={{ color: stage.color }}>
            {stage.year}
          </span>
          <span className="font-mono text-[0.52rem] tracking-[0.12em] uppercase ml-auto" style={{ color: 'var(--color-dim)' }}>
            {stage.users} usuários
          </span>
        </div>
        <div className="font-bold text-[0.9rem] mb-1">{stage.arch}</div>
        <div className="font-mono text-[0.6rem]" style={{ color: 'var(--color-dim)' }}>{stage.team}</div>
      </div>
    </div>
  )
}

function StageDetail({ stage }: { stage: EvolutionStage }) {
  const r = useReveal()
  return (
    <div ref={r} className="reveal sticky top-28">
      <div
        className="p-8"
        style={{
          background: 'rgba(8,14,35,0.7)',
          border: `1px solid ${stage.color}30`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <span className="font-mono text-[0.58rem] tracking-[0.3em] uppercase block mb-2" style={{ color: stage.color }}>
            {stage.title}
          </span>
          <h2 className="font-black text-[2rem] leading-tight mb-1">{stage.arch}</h2>
          <div className="flex gap-4 font-mono text-[0.6rem]" style={{ color: 'var(--color-dim)' }}>
            <span>{stage.users} usuários</span>
            <span>·</span>
            <span>{stage.team}</span>
            <span>·</span>
            <span>{stage.year}</span>
          </div>
        </div>

        <p className="font-mono text-[0.72rem] leading-[1.9] mb-6" style={{ color: 'var(--color-dim2)' }}>
          {stage.description}
        </p>

        {/* Stack */}
        <div className="mb-6">
          <div className="font-mono text-[0.56rem] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--color-dim)' }}>Stack</div>
          <div className="flex flex-wrap gap-2">
            {stage.stack.map(s => (
              <span
                key={s}
                className="px-2 py-1 font-mono text-[0.58rem] tracking-[0.08em]"
                style={{ border: `1px solid ${stage.color}30`, color: stage.color }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Pain point */}
        <div
          className="p-4 mb-4"
          style={{ background: 'rgba(239,154,154,0.06)', border: '1px solid rgba(239,154,154,0.15)' }}
        >
          <div className="font-mono text-[0.54rem] tracking-[0.2em] uppercase mb-2" style={{ color: '#ef9a9a' }}>
            ↓ Ponto de dor
          </div>
          <p className="font-mono text-[0.67rem] leading-[1.75]" style={{ color: 'var(--color-dim2)' }}>{stage.pain}</p>
        </div>

        {/* Trigger */}
        <div
          className="p-4"
          style={{ background: 'rgba(165,214,167,0.06)', border: '1px solid rgba(165,214,167,0.15)' }}
        >
          <div className="font-mono text-[0.54rem] tracking-[0.2em] uppercase mb-2" style={{ color: '#a5d6a7' }}>
            → Gatilho da próxima fase
          </div>
          <p className="font-mono text-[0.67rem] leading-[1.75]" style={{ color: 'var(--color-dim2)' }}>{stage.trigger}</p>
        </div>
      </div>
    </div>
  )
}

function EvolutionCanvas({ activeIndex }: { activeIndex: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function draw() {
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = canvas.offsetWidth || 800
      canvas.height = 120

      const W = canvas.width
      const H = 120
      const PAD = 56
      const usableW = W - PAD * 2

      ctx.clearRect(0, 0, W, H)

      const colors = STAGES.map(s => s.color)
      const nodeX = STAGES.map((_, i) =>
        STAGES.length === 1 ? W / 2 : PAD + (usableW / (STAGES.length - 1)) * i
      )
      const nodeY = 52

      // Connections
      for (let i = 0; i < STAGES.length - 1; i++) {
        const active = i <= activeIndex - 1
        ctx.beginPath()
        ctx.moveTo(nodeX[i], nodeY)
        ctx.lineTo(nodeX[i + 1], nodeY)
        ctx.strokeStyle = active ? colors[i] + 'aa' : 'rgba(136,150,204,0.15)'
        ctx.lineWidth = active ? 2 : 1
        ctx.setLineDash(active ? [] : [4, 4])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Nodes
      STAGES.forEach((stage, i) => {
        const x = nodeX[i]
        const isActive = i === activeIndex
        const isPast = i < activeIndex

        if (isActive || isPast) {
          const grd = ctx.createRadialGradient(x, nodeY, 0, x, nodeY, 26)
          grd.addColorStop(0, stage.color + '30')
          grd.addColorStop(1, 'transparent')
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(x, nodeY, 26, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(x, nodeY, isActive ? 10 : 7, 0, Math.PI * 2)
        ctx.fillStyle = isActive || isPast ? stage.color : 'rgba(136,150,204,0.2)'
        ctx.fill()
        if (isActive) {
          ctx.strokeStyle = stage.color
          ctx.lineWidth = 2
          ctx.stroke()
        }

        ctx.fillStyle = isActive ? stage.color : isPast ? stage.color + '99' : 'rgba(136,150,204,0.4)'
        ctx.font = `${isActive ? '700' : '400'} 10px Syne, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        const label = stage.arch.split(' ')[0]
        ctx.fillText(label, x, nodeY + 16)
      })
    }

    draw()

    const observer = new ResizeObserver(() => draw())
    observer.observe(canvas.parentElement ?? canvas)
    return () => observer.disconnect()
  }, [activeIndex])

  return (
    <canvas
      ref={canvasRef}
      className="w-full block"
      style={{ height: 120 }}
    />
  )
}

export function EvolutionPage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const headerRef = useReveal()

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      <div ref={headerRef} className="reveal text-center mb-16">
        <span className="font-mono text-[0.62rem] tracking-[0.38em] uppercase block mb-4" style={{ color: 'var(--color-arch-gold)' }}>
          // Roadmap Evolutivo
        </span>
        <h1 className="font-black tracking-[-0.02em] leading-[1.05] mb-5" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}>
          Como um sistema<br />evolui com o tempo
        </h1>
        <p className="font-mono text-[0.76rem] leading-[1.95] max-w-[520px] mx-auto" style={{ color: 'var(--color-dim2)' }}>
          Nenhuma empresa começa com microsserviços. Cada arquitetura existe para resolver um problema específico do momento. Veja a jornada real de um produto de software.
        </p>
      </div>

      {/* Timeline canvas */}
      <div
        className="mb-12 p-6"
        style={{ background: 'rgba(8,14,35,0.5)', border: '1px solid rgba(136,150,204,0.08)', backdropFilter: 'blur(10px)' }}
      >
        <EvolutionCanvas activeIndex={activeIdx} />
      </div>

      {/* Main content */}
      <div className="grid gap-8" style={{ gridTemplateColumns: '280px 1fr' }}>
        {/* Stage list */}
        <div className="flex flex-col gap-8">
          {STAGES.map((stage, i) => (
            <StageCard
              key={stage.id}
              stage={stage}
              active={activeIdx === i}
              onClick={() => setActiveIdx(i)}
              index={i}
            />
          ))}
        </div>

        {/* Detail */}
        <StageDetail stage={STAGES[activeIdx]} />
      </div>

      {/* Nav */}
      <div className="flex justify-center gap-4 mt-16">
        <button
          onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
          disabled={activeIdx === 0}
          className="px-6 py-3 font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-200"
          style={{
            border: '1px solid rgba(136,150,204,0.2)',
            color: activeIdx === 0 ? 'var(--color-dim)' : 'var(--color-dim2)',
            background: 'transparent',
            opacity: activeIdx === 0 ? 0.4 : 1,
          }}
        >
          ← Fase anterior
        </button>
        <span className="flex items-center font-mono text-[0.6rem]" style={{ color: 'var(--color-dim)' }}>
          {activeIdx + 1} / {STAGES.length}
        </span>
        <button
          onClick={() => setActiveIdx(i => Math.min(STAGES.length - 1, i + 1))}
          disabled={activeIdx === STAGES.length - 1}
          className="px-6 py-3 font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-200"
          style={{
            border: `1px solid ${STAGES[activeIdx].color}`,
            color: STAGES[activeIdx].color,
            background: 'transparent',
            opacity: activeIdx === STAGES.length - 1 ? 0.4 : 1,
          }}
        >
          Próxima fase →
        </button>
      </div>
    </div>
  )
}
