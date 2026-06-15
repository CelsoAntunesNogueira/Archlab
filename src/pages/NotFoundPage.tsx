import { Link } from 'react-router-dom'
import { ConstellationSVG } from '@/components/ui/ConstellationSVG'
import { ARCHITECTURES } from '@/data/architectures'

export function NotFoundPage() {
  const random = ARCHITECTURES[Math.floor(Math.random() * ARCHITECTURES.length)]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
      <ConstellationSVG
        nodes={random.nodes}
        edges={random.edges}
        color={random.color}
        id="404-const"
        className="w-40 h-40 mb-8 opacity-40"
      />

      <p className="font-mono text-[0.62rem] tracking-[0.38em] uppercase mb-4" style={{ color: 'var(--color-dim)' }}>
        // Erro 404
      </p>

      <h1
        className="font-black leading-tight tracking-tight mb-4"
        style={{ fontSize: 'clamp(5rem,15vw,10rem)', color: 'transparent', WebkitTextStroke: '1px rgba(136,150,204,0.3)' }}
      >
        404
      </h1>

      <p className="font-mono text-[0.75rem] leading-[1.9] max-w-sm mb-10" style={{ color: 'var(--color-dim2)' }}>
        Esta constelação não existe no universo do ArchLab.
        <br />
        Talvez esteja em uma galáxia paralela.
      </p>

      <Link
        to="/"
        className="px-8 py-4 font-mono text-[0.7rem] tracking-[0.15em] uppercase no-underline transition-all duration-300"
        style={{ border: '1px solid var(--color-arch-cyan)', color: 'var(--color-arch-cyan)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-arch-cyan)'; e.currentTarget.style.color = 'var(--color-void)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-arch-cyan)' }}
      >
        ← Voltar ao universo
      </Link>
    </div>
  )
}
