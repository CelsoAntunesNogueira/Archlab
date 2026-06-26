import { useState } from 'react'
import { ARCHITECTURES, METRIC_LABELS } from '@/data/architectures'
import { RadarChart } from '@/components/ui/RadarChart'
import { useReveal } from '@/hooks/useReveal'
import type { Architecture } from '@/types'

function ArchSelector({ label, selected, onSelect }: {
  label: string; selected: Architecture; onSelect: (a: Architecture) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[0.56rem] tracking-[0.28em] uppercase" style={{ color: 'var(--color-dim)' }}>
        {label}
      </span>
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-3 py-3 px-4 font-mono text-[0.72rem] text-left transition-all duration-200"
          style={{ background: 'rgba(5,8,24,0.6)', border: '1px solid rgba(136,150,204,0.15)', color: 'var(--color-star)' }}
        >
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: selected.color }} />
          <span className="flex-1 truncate">{selected.name}</span>
          <span style={{ color: 'var(--color-dim)', fontSize: '0.7rem' }}>{open ? '▴' : '▾'}</span>
        </button>
        {open && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 overflow-y-auto"
            style={{ background: 'rgba(5,8,24,0.98)', border: '1px solid rgba(136,150,204,0.15)', maxHeight: 260 }}>
            {ARCHITECTURES.map(a => (
              <div key={a.id} onClick={() => { onSelect(a); setOpen(false) }}
                className="flex items-center gap-3 py-3 px-4 font-mono text-[0.68rem] transition-all duration-200"
                style={{ borderBottom: '1px solid rgba(136,150,204,0.05)', color: 'var(--color-dim)' }}
                onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(79,195,247,0.06)'; (e.currentTarget).style.color = 'var(--color-star)' }}
                onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'var(--color-dim)' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <span className="flex-1">{a.name}</span>
                <span style={{ fontSize: '0.5rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{a.tier}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function ComparatorPage() {
  const [archA, setArchA] = useState(ARCHITECTURES[0])
  const [archB, setArchB] = useState(ARCHITECTURES[4])
  const headerRef = useReveal()
  const uiRef = useReveal()
  const metrics = Object.entries(METRIC_LABELS)

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      <div ref={headerRef} className="reveal text-center mb-10">
        <span className="font-mono text-[0.6rem] tracking-[0.35em] uppercase block mb-4" style={{ color: 'var(--color-arch-gold)' }}>
          // Comparador de Constelações
        </span>
        <h1 className="font-black tracking-[-0.02em] leading-[1.05]" style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)' }}>
          Compare lado<br />a lado
        </h1>
        <p className="font-mono text-[0.7rem] leading-[1.95] max-w-[420px] mx-auto mt-4" style={{ color: 'var(--color-dim2)' }}>
          Escolha duas arquiteturas e veja como se comportam em diferentes dimensões.
        </p>
      </div>

      <div ref={uiRef} className="reveal"
        style={{ background: 'rgba(13,27,62,0.25)', border: '1px solid rgba(79,195,247,0.1)', backdropFilter: 'blur(16px)' }}>

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6"
          style={{ borderBottom: '1px solid rgba(136,150,204,0.08)' }}>
          <ArchSelector label="// Arquitetura A" selected={archA} onSelect={setArchA} />
          <ArchSelector label="// Arquitetura B" selected={archB} onSelect={setArchB} />
        </div>

        {/* Radar + Bars — stack on mobile */}
        <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6"
          style={{ borderBottom: '1px solid rgba(136,150,204,0.08)' }}>

          {/* Radar */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <RadarChart archA={archA} archB={archB} />
            <div className="flex gap-5 flex-wrap justify-center">
              {[archA, archB].map(a => (
                <div key={a.id} className="flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.1em]" style={{ color: 'var(--color-dim)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                  {a.name}
                </div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="flex-1">
            {metrics.map(([key, label]) => {
              const va = (archA.metrics as Record<string, number>)[key]
              const vb = (archB.metrics as Record<string, number>)[key]
              return (
                <div key={key} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em]" style={{ color: 'var(--color-dim2)' }}>{label}</span>
                    <div className="flex gap-3">
                      <span className="font-mono text-[0.58rem]" style={{ color: archA.color }}>{va}/5</span>
                      <span className="font-mono text-[0.58rem]" style={{ color: archB.color }}>{vb}/5</span>
                    </div>
                  </div>
                  {[{ arch: archA, val: va }, { arch: archB, val: vb }].map(({ arch, val }) => (
                    <div key={arch.id} className="mb-1">
                      <div className="font-mono text-[0.5rem] uppercase tracking-[0.08em] mb-[2px]" style={{ color: 'var(--color-dim)' }}>{arch.name}</div>
                      <div className="h-[3px] rounded-sm overflow-hidden" style={{ background: 'rgba(136,150,204,0.1)' }}>
                        <div className="h-full rounded-sm transition-all duration-700" style={{ width: `${val / 5 * 100}%`, background: arch.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Verdict — stack on mobile */}
        <div className="p-4 sm:p-6" style={{ borderBottom: '1px solid rgba(136,150,204,0.08)' }}>
          <div className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--color-arch-gold)' }}>
            // Análise Comparativa
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[archA, archB].map(a => (
              <div key={a.id} className="p-4 sm:p-5" style={{ background: 'rgba(5,8,24,0.4)', border: '1px solid rgba(136,150,204,0.08)' }}>
                <div className="text-[0.95rem] font-bold mb-3" style={{ color: a.color }}>{a.name}</div>
                {[
                  { title: 'Vantagens', items: a.pros, color: '#a5d6a7', prefix: '↑' },
                  { title: 'Desvantagens', items: a.cons, color: '#ef9a9a', prefix: '↓' },
                ].map(col => (
                  <div key={col.title} className="mb-3">
                    <div className="font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: col.color }}>{col.title}</div>
                    <ul className="flex flex-col gap-1">
                      {col.items.map(item => (
                        <li key={item} className="flex gap-2 font-mono text-[0.62rem] leading-[1.6]" style={{ color: 'var(--color-dim2)' }}>
                          <span style={{ color: col.color, flexShrink: 0 }}>{col.prefix}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Use cases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6">
          {[archA, archB].map(a => (
            <div key={a.id}>
              <div className="font-mono text-[0.54rem] tracking-[0.25em] uppercase mb-2" style={{ color: a.color }}>
                // Quando usar {a.name}
              </div>
              <p className="font-mono text-[0.68rem] leading-[1.8]" style={{ color: 'var(--color-star)' }}>{a.usecase}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
