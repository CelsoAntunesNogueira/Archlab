import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type React from 'react'
import { ARCHITECTURES } from '@/data/architectures'
import { ArchCard } from '@/components/ui/ArchCard'
import { useReveal } from '@/hooks/useReveal'

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return
      const sy = window.scrollY
      heroRef.current.style.transform = `translateY(${sy * 0.25}px)`
      heroRef.current.style.opacity = String(Math.max(0, 1 - sy / 500))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center text-center px-8 relative"
    >
      <p
        className="font-mono text-[0.68rem] tracking-[0.38em] uppercase mb-6"
        style={{ color: 'var(--color-arch-cyan)', animation: 'fadeUp 0.8s 0.3s both' }}
      >
        // Explorador de Arquiteturas de Software
      </p>

      <h1
        className="font-black leading-[0.88] tracking-[-0.03em] mb-6"
        style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', animation: 'fadeUp 0.9s 0.5s both' }}
      >
        <span style={{ color: 'var(--color-star)' }}>Arch</span>
        <br />
        <span
          style={{
            color: 'transparent',
            WebkitTextStroke: '1.5px var(--color-arch-cyan)',
            filter: 'drop-shadow(0 0 30px rgba(79,195,247,0.5))',
          }}
        >
          Lab
        </span>
      </h1>

      <p
        className="font-mono leading-[1.9] max-w-[500px] mb-12"
        style={{
          fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)',
          color: 'var(--color-dim2)',
          animation: 'fadeUp 0.9s 0.7s both',
        }}
      >
        Cada arquitetura é uma constelação no universo do software.
        <br />
        Explore, compare e entenda como sistemas são estruturados.
      </p>

      <div
        className="flex gap-4 flex-wrap justify-center"
        style={{ animation: 'fadeUp 0.9s 0.9s both' }}
      >
        <a
          href="#explorar"
          className="px-9 py-4 font-mono text-[0.72rem] tracking-[0.15em] uppercase relative overflow-hidden transition-colors duration-300 no-underline"
          style={{ border: '1px solid var(--color-arch-cyan)', color: 'var(--color-arch-cyan)' }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.color = 'var(--color-void)'
            el.style.background = 'var(--color-arch-cyan)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.color = 'var(--color-arch-cyan)'
            el.style.background = 'transparent'
          }}
        >
          Explorar Constelações
        </a>
        <Link
          to="/comparar"
          className="px-9 py-4 font-mono text-[0.72rem] tracking-[0.15em] uppercase transition-all duration-300 no-underline"
          style={{ border: '1px solid rgba(136,150,204,0.3)', color: 'var(--color-dim2)' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-dim2)'
            e.currentTarget.style.color = 'var(--color-star)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(136,150,204,0.3)'
            e.currentTarget.style.color = 'var(--color-dim2)'
          }}
        >
          Comparar Arquiteturas
        </Link>
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: 'fadeUp 1s 1.5s both' }}
      >
       
        <div
          className="w-px h-10"
          style={{
            background: 'linear-gradient(to bottom, var(--color-dim), transparent)',
            animation: 'scrollPulse 2s infinite',
          }}
        />
      </div>
    </section>
  )
}

function StatsSection() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal()
  const refs = [r1, r2, r3, r4]
  const stats = [
    { val: '8', label: 'Arquiteturas' },
    { val: '∞', label: 'Simulações' },
    { val: '3', label: 'Níveis' },
    { val: '01', label: 'Universo' },
  ]

  return (
    <section style={{ borderTop: '1px solid rgba(136,150,204,0.07)', borderBottom: '1px solid rgba(136,150,204,0.07)', padding: '4rem 2rem' }}>
      <div className="max-w-[980px] mx-auto grid grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i} ref={refs[i]} className="reveal">
            <span className="block text-[3rem] font-black tracking-[-0.04em] leading-none mb-2" style={{ color: 'var(--color-arch-cyan)' }}>
              {s.val}
            </span>
            <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase" style={{ color: 'var(--color-dim)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ConstellationsSection() {
  const headerRef = useReveal()

  return (
    <section className="py-24 px-8 max-w-[1300px] mx-auto" id="explorar">
      <div ref={headerRef} className="reveal text-center mb-20">
        <span className="font-mono text-[0.62rem] tracking-[0.38em] uppercase block mb-4" style={{ color: 'var(--color-arch-gold)' }}>
          // Constelações do Sistema
        </span>
        <h2 className="font-black tracking-[-0.02em] leading-[1.05]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Escolha sua<br />arquitetura
        </h2>
        <p className="font-mono text-[0.76rem] leading-[1.95] max-w-[460px] mx-auto mt-5" style={{ color: 'var(--color-dim2)' }}>
          Do monólito à nuvem distribuída — cada padrão resolve um problema diferente.
        </p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))' }}>
        {ARCHITECTURES.map((arch, i) => (
          <ArchCard key={arch.id} arch={arch} delay={(i % 3) * 0.07} />
        ))}
      </div>
    </section>
  )
}

interface FeatureItem { icon: string; name: string; desc: string; to: string }

function FeatureCard({ item }: { item: FeatureItem }) {
  const ref = useReveal()
  return (
    <Link
      to={item.to}
      ref={ref as React.Ref<HTMLAnchorElement>}
      className="reveal p-10 transition-colors duration-300 no-underline block"
      style={{ background: 'var(--color-void)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,27,62,0.5)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-void)')}
    >
      <span className="text-[1.6rem] mb-4 block">{item.icon}</span>
      <div className="text-[1rem] font-bold mb-2" style={{ color: 'var(--color-star)' }}>{item.name}</div>
      <p className="font-mono text-[0.66rem] leading-[1.9]" style={{ color: 'var(--color-dim2)' }}>{item.desc}</p>
    </Link>
  )
}

function FeaturesSection() {
  const headerRef = useReveal()
  const features: FeatureItem[] = [
    { icon: '⬡', name: 'Diagramas Interativos', desc: 'Visualize componentes, fluxos e conexões de cada arquitetura em tempo real.', to:''  },
    { icon: '▶', name: 'Simulações ao Vivo', desc: 'Acompanhe uma requisição passando por 4 cenários: fluxo feliz, alta carga, falha e circuit breaker.', to: '' },
    { icon: '⇄', name: 'Comparador', desc: 'Compare duas arquiteturas com radar chart e barras por 6 dimensões.', to: '/comparar' },
    { icon: '◈', name: 'Quiz Inteligente', desc: '8 perguntas sobre seu contexto — descubra qual arquitetura é ideal para o seu sistema.', to: '/quiz' },
    { icon: '{ }', name: 'Exemplos de Código', desc: 'Código real em C# .NET para 7 arquiteturas — do monólito ao CQRS + Event Sourcing.', to: '' },
    { icon: '◉', name: 'Roadmap Evolutivo', desc: 'Veja como um sistema real evolui do monólito ao CQRS ao longo de anos.', to: '/evolucao' },
  ]

  return (
    <section className="py-28 px-8 max-w-[1100px] mx-auto" id="features">
      <div ref={headerRef} className="reveal text-center mb-16">
        <span className="font-mono text-[0.62rem] tracking-[0.38em] uppercase block mb-4" style={{ color: 'var(--color-arch-gold)' }}>
          // Ferramentas do Explorador
        </span>
        <h2 className="font-black tracking-[-0.02em] leading-[1.05]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Não apenas teoria.<br />Experiência.
        </h2>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1px',
          background: 'rgba(136,150,204,0.07)',
          border: '1px solid rgba(136,150,204,0.07)',
        }}
      >
        {features.map((f, i) => <FeatureCard key={i} item={f} />)}
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ConstellationsSection />
      <FeaturesSection />
    </>
  )
}
