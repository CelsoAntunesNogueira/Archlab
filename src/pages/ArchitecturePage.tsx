import { useParams, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ARCHITECTURES, METRIC_LABELS } from '@/data/architectures'
import { CODE_EXAMPLES } from '@/data/codeExamples'
import { SimulationPanel } from '@/components/simulation/SimulationPanel'
import { DiagramCanvas } from '@/components/diagram/DiagramCanvas'
import { SyntaxHighlighter } from '@/components/ui/SyntaxHighlighter'
import { useReveal } from '@/hooks/useReveal'

type Tab = 'overview' | 'diagram' | 'simulation' | 'code'


const DEFAULT_CODE = [
  { label: 'Exemplo', language: 'csharp', code: `// Exemplo de código para esta arquitetura\n// Selecione uma arquitetura com exemplos implementados.` },
]

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="py-4 px-7 font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-200"
      style={{
        color: active ? '#f48fb1' : 'var(--color-dim)',
        borderBottom: active ? '2px solid #f48fb1' : '2px solid transparent',
        background: 'transparent',
        
      }}
    >
      {label}
    </button>
  )
}

export function ArchitecturePage() {
  const { id } = useParams<{ id: string }>()
  const arch = ARCHITECTURES.find(a => a.id === id)
  const [tab, setTab] = useState<Tab>('overview')
  const [codeIdx, setCodeIdx] = useState(0)
  const overviewRef = useReveal()

  if (!arch) return <Navigate to="/" replace />

  const codeExamples = CODE_EXAMPLES[arch.id] ?? DEFAULT_CODE
  const metrics = Object.entries(METRIC_LABELS)

  return (
    <div>
      {/* Hero strip */}
      <div
        className="px-12 pt-8 pb-8 max-w-[1300px] mx-auto grid gap-12 items-end"
        style={{ gridTemplateColumns: '1fr auto', borderBottom: '1px solid rgba(136,150,204,0.08)' }}
      >
        <div>
          <p
            className="font-mono text-[0.62rem] tracking-[0.35em] uppercase mb-4"
            style={{ color: arch.color, animation: 'fadeUp 0.7s 0.2s both' }}
          >
            // Arquitetura · {arch.tier}
          </p>
          <h1
            className="font-black leading-[0.9] tracking-[-0.03em] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', animation: 'fadeUp 0.8s 0.35s both' }}
          >
            <span style={{ color: 'var(--color-star)' }}>
              {arch.name.split(' ').slice(0, -1).join(' ')}{' '}
            </span>
            <span style={{ color: 'transparent', WebkitTextStroke: `1.5px ${arch.color}`, filter: `drop-shadow(0 0 20px ${arch.color}80)` }}>
              {arch.name.split(' ').slice(-1)[0]}
            </span>
          </h1>
          <p
            className="font-mono text-[0.78rem] leading-[1.9] max-w-[560px]"
            style={{ color: 'var(--color-dim2)', animation: 'fadeUp 0.8s 0.5s both' }}
          >
            {arch.longDesc}
          </p>
        </div>

        <div className="flex flex-col gap-4" style={{ animation: 'fadeUp 0.8s 0.6s both' }}>
          {[
            { val: `${arch.metrics.escalabilidade}/5`, label: 'Escalabilidade' },
            { val: `${arch.metrics.complexidade}/5`, label: 'Complexidade' },
            { val: `${arch.metrics.resiliencia}/5`, label: 'Resiliência' },
          ].map(m => (
            <div
              key={m.label}
              className="flex flex-col items-center py-3 px-5"
              style={{ background: 'rgba(8,14,35,0.75)', border: `1px solid ${arch.color}22`, backdropFilter: 'blur(12px)' }}
            >
              <span className="text-[1.6rem] font-black tracking-[-0.03em]" style={{ color: arch.color }}>{m.val}</span>
              <span className="font-mono text-[0.52rem] tracking-[0.18em] uppercase mt-1" style={{ color: 'var(--color-dim)' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs bar */}
      <div
        className="sticky top-16 z-[90]"
        style={{ background: 'rgba(2,3,10,0.97)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(136,150,204,0.08)' }}
      >
        <div className="max-w-[1300px] mx-auto px-12 flex">
          <TabBtn label="Visão Geral" active={tab === 'overview'} onClick={() => setTab('overview')} />
          <TabBtn label="Diagrama" active={tab === 'diagram'} onClick={() => setTab('diagram')} />
          <TabBtn label="Simulação ao Vivo" active={tab === 'simulation'} onClick={() => setTab('simulation')} />
          <TabBtn label="Código" active={tab === 'code'} onClick={() => setTab('code')} />
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-[1300px] mx-auto px-12 py-10">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div ref={overviewRef} className="reveal">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* When to use */}
              <div style={{ background: 'rgba(8,14,35,0.75)', border: `1px solid ${arch.color}15`, padding: '2rem', backdropFilter: 'blur(12px)' }}>
                <div className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-4" style={{ color: arch.color }}>// Quando usar</div>
                <p className="font-mono text-[0.72rem] leading-[1.9]" style={{ color: 'var(--color-dim2)' }}>{arch.usecase}</p>
              </div>

              {/* Tags */}
              <div style={{ background: 'rgba(8,14,35,0.75)', border: `1px solid ${arch.color}15`, padding: '2rem', backdropFilter: 'blur(12px)' }}>
                <div className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-4" style={{ color: arch.color }}>// Tags</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {arch.tags.map(t => (
                    <span key={t} className="px-3 py-1 font-mono text-[0.58rem] tracking-[0.1em] uppercase" style={{ border: `1px solid ${arch.color}30`, color: arch.color }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="font-mono text-[0.58rem] uppercase" style={{ color: 'var(--color-dim)' }}>Complexidade</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < arch.complexity ? arch.color : 'rgba(136,150,204,0.18)', boxShadow: i < arch.complexity ? `0 0 6px ${arch.color}` : 'none' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics bars */}
            <div className="mb-6" style={{ background: 'rgba(8,14,35,0.75)', border: `1px solid ${arch.color}15`, padding: '2rem', backdropFilter: 'blur(12px)' }}>
              <div className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-6" style={{ color: arch.color }}>// Métricas</div>
              <div className="grid grid-cols-2 gap-6">
                {metrics.map(([key, label]) => {
                  const val = (arch.metrics as Record<string, number>)[key]
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em]" style={{ color: 'var(--color-dim2)' }}>{label}</span>
                        <span className="font-mono text-[0.62rem]" style={{ color: arch.color }}>{val}/5</span>
                      </div>
                      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(136,150,204,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${val / 5 * 100}%`, background: arch.color, boxShadow: `0 0 8px ${arch.color}` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pros / Cons */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: 'Vantagens', items: arch.pros, color: '#a5d6a7', prefix: '↑' },
                { title: 'Desvantagens', items: arch.cons, color: '#ef9a9a', prefix: '↓' },
              ].map(col => (
                <div key={col.title} style={{ background: 'rgba(8,14,35,0.75)', border: `1px solid ${col.color}20`, padding: '2rem', backdropFilter: 'blur(12px)' }}>
                  <div className="font-mono text-[0.58rem] tracking-[0.25em] uppercase mb-4" style={{ color: col.color }}>{col.title}</div>
                  <ul className="flex flex-col gap-2">
                    {col.items.map(item => (
                      <li key={item} className="flex gap-2 font-mono text-[0.68rem] leading-[1.7]" style={{ color: 'var(--color-dim2)' }}>
                        <span style={{ color: col.color, flexShrink: 0 }}>{col.prefix}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIAGRAM */}
        {tab === 'diagram' && (
          <div>
            <div className="mb-6 reveal" ref={useReveal()}>
              <div className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-4" style={{ color: arch.color }}>
                // Diagrama de Arquitetura — Interativo
              </div>
              <div style={{ border: `1px solid ${arch.color}20`, backdropFilter: 'blur(12px)', background: 'rgba(8,14,35,0.6)' }}>
                <DiagramCanvas arch={arch} />
              </div>
            </div>
          </div>
        )}

        {/* SIMULATION */}
        {tab === 'simulation' && <SimulationPanel />}

        {/* CODE */}
        {tab === 'code' && (
          <div>
            <div className="flex gap-0 mb-6" style={{ borderBottom: '1px solid rgba(136,150,204,0.08)' }}>
              {codeExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setCodeIdx(i)}
                  className="py-3 px-5 font-mono text-[0.6rem] tracking-[0.12em] uppercase transition-all duration-200"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: codeIdx === i ? `2px solid ${arch.color}` : '2px solid transparent',
                    color: codeIdx === i ? arch.color : 'var(--color-dim)',
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
            <div
              className="relative overflow-x-auto"
              style={{ background: 'rgba(2,3,10,0.9)', border: '1px solid rgba(136,150,204,0.08)', padding: '1.5rem' }}
            >
              <button
                onClick={() => navigator.clipboard.writeText(codeExamples[codeIdx].code)}
                className="absolute top-3 right-3 py-1 px-3 font-mono text-[0.55rem] tracking-[0.1em] uppercase transition-all duration-200"
                style={{ border: '1px solid rgba(136,150,204,0.2)', background: 'transparent', color: 'var(--color-dim)' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = arch.color; (e.target as HTMLElement).style.color = arch.color }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(136,150,204,0.2)'; (e.target as HTMLElement).style.color = 'var(--color-dim)' }}
              >
                Copiar
              </button>
              <SyntaxHighlighter
                code={codeExamples[codeIdx].code}
                language={codeExamples[codeIdx].language ?? 'csharp'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
