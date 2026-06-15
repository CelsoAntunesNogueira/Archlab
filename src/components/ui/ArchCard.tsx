import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import type { Architecture } from '@/types'
import { ConstellationSVG } from '@/components/ui/ConstellationSVG'
import { useReveal } from '@/hooks/useReveal'

interface Props {
  arch: Architecture
  delay?: number
}

export function ArchCard({ arch, delay = 0 }: Props) {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const revealRef = useReveal()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%'
    const my = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%'
    cardRef.current!.style.setProperty('--mx', mx)
    cardRef.current!.style.setProperty('--my', my)
  }

  return (
    <div
      ref={(el) => {
        ;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el
        ;(revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      className="reveal group relative backdrop-blur-sm overflow-hidden transition-all duration-350"
      style={{
        background: 'rgba(13,27,62,0.28)',
        border: `1px solid rgba(136,150,204,0.08)`,
        transitionDelay: `${delay}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (cardRef.current) {
          cardRef.current.style.borderColor = arch.color
          cardRef.current.style.background = 'rgba(13,27,62,0.58)'
          cardRef.current.style.transform = 'translateY(-5px)'
        }
      }}
      onMouseLeave={() => {
        if (cardRef.current) {
          cardRef.current.style.borderColor = 'rgba(136,150,204,0.08)'
          cardRef.current.style.background = 'rgba(13,27,62,0.28)'
          cardRef.current.style.transform = 'translateY(0)'
        }
      }}
    >
      {/* Radial glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), ${arch.glow}, transparent 60%)`,
        }}
      />

      <div className="relative p-8">
        <div
          className="font-mono text-[0.56rem] tracking-[0.32em] uppercase mb-2"
          style={{ color: arch.color, opacity: 0.85 }}
        >
          {arch.tier}
        </div>

        <div className="text-[1.35rem] font-bold tracking-tight mb-4">{arch.name}</div>

        <ConstellationSVG
          nodes={arch.nodes}
          edges={arch.edges}
          color={arch.color}
          id={arch.id}
          className="w-full h-[88px] mb-6"
        />

        <p className="font-mono text-[0.7rem] leading-[1.85] mb-6" style={{ color: 'var(--color-dim2)' }}>
          {arch.desc}
        </p>

        <div className="flex flex-wrap gap-[0.35rem] mb-6">
          {arch.tags.map((tag) => (
            <span
              key={tag}
              className="px-[0.65rem] py-[0.22rem] font-mono text-[0.55rem] tracking-[0.1em] uppercase"
              style={{ border: '1px solid rgba(136,150,204,0.18)', color: 'var(--color-dim2)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.1em]" style={{ color: 'var(--color-dim)' }}>
              Complexidade
            </span>
            <div className="flex gap-[3px]">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  data-testid="complexity-dot"
                  className="w-[6px] h-[6px] rounded-full"
                  style={{
                    background: i < arch.complexity ? arch.color : 'rgba(136,150,204,0.18)',
                    boxShadow: i < arch.complexity ? `0 0 6px ${arch.color}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate(`/architecture/${arch.id}`)}
            className="font-mono text-[0.62rem] tracking-[0.18em] uppercase transition-all duration-250 group-hover:tracking-[0.25em]"
            style={{ color: arch.color }}
          >
            Explorar →
          </button>
        </div>
      </div>
    </div>
  )
}
