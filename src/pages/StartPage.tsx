import { Link } from 'react-router-dom'
import { useReveal } from '@/hooks/useReveal'

interface PathOption {
  id: string
  icon: string
  tag: string
  title: string
  desc: string
  points: string[]
  cta: string
  href: string
  credit: string
  color: string
}

const PATHS: PathOption[] = [
  {
    id: 'videos',
    icon: '',
    tag: 'Caminho 1',
    title: 'Aprender com vídeos',
    desc: 'Para quem prefere ver alguém explicando passo a passo. Videoaulas gratuitas, em português, para começar do zero.',
    points: ['Algoritmo e lógica de programação', 'HTML5 e CSS3', 'JavaScript, Python, Java e PHP', 'Git'],
    cta: 'Ir para o Curso em Vídeo',
    href: 'https://www.youtube.com/@cursoemvideo/playlists',
    credit: 'Canal Curso em Vídeo · prof. Gustavo Guanabara',
    color: '#f48fb1',
  },
  {
    id: 'roadmap',
    icon: '',
    tag: 'Caminho 2',
    title: 'Seguir um roadmap',
    desc: 'Para quem é autodidata e prefere um mapa para estudar no próprio ritmo, escolhendo a ordem.',
    points: ['Mapa visual no Miro', 'Você define o ritmo e a ordem', 'trilha do Jr ao Sênior'],
    cta: 'Abrir o roadmap',
    href: 'https://miro.com/app/board/uXjVG1Y69Ww=/',
    credit: 'Mapa do Arquiteto · Renato Augusto',
    color: '#4fc3f7',
  },
]

function PathCard({ item, delay }: { item: PathOption; delay: number }) {
  const ref = useReveal()

  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        transitionDelay: `${delay}s`,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(8,14,35,0.6)',
        border: `1px solid ${item.color}30`,
        backdropFilter: 'blur(12px)',
        padding: '1.75rem',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: item.color,
          marginBottom: '0.5rem',
        }}
      >
        {item.tag}
      </div>

      <h2
        style={{
          fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          marginBottom: '0.75rem',
        }}
      >
        {item.title}
      </h2>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          lineHeight: 1.9,
          color: 'var(--color-dim2)',
          marginBottom: '1.25rem',
        }}
      >
        {item.desc}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {item.points.map((point) => (
          <li
            key={point}
            style={{
              display: 'flex',
              gap: '0.6rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              lineHeight: 1.6,
              color: 'var(--color-dim2)',
            }}
          >
            <span style={{ color: item.color, flexShrink: 0 }}>→</span>
            {point}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto' }}>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.95rem 1.25rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: `1px solid ${item.color}`,
            color: item.color,
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = item.color
            e.currentTarget.style.color = '#02030a'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = item.color
          }}
        >
          {item.cta} ↗
        </a>

        <div
          style={{
            marginTop: '0.75rem',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.54rem',
            letterSpacing: '0.1em',
            color: 'var(--color-dim)',
          }}
        >
          {item.credit}
        </div>
      </div>
    </div>
  )
}

export function StartPage() {
  const headerRef = useReveal()
  const footerRef = useReveal()

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1rem 4rem' }}>
      <div ref={headerRef} className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--color-arch-gold)',
            marginBottom: '1rem',
          }}
        >
          // Começando do zero
        </span>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 6vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: '1rem',
          }}
        >
          Por onde você quer
          <br />
          começar?
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            lineHeight: 1.95,
            maxWidth: 460,
            margin: '0 auto',
            color: 'var(--color-dim2)',
          }}
        >
          Escolha o caminho que combina com você e depois volte para explorar as arquiteturas.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '1rem',
        }}
      >
        {PATHS.map((path, i) => (
          <PathCard key={path.id} item={path} delay={i * 0.08} />
        ))}
      </div>

      <div ref={footerRef} className="reveal" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            lineHeight: 1.9,
            color: 'var(--color-dim2)',
            marginBottom: '1.25rem',
          }}
        >
          Já pegou o básico? Veja como sistemas reais são organizados.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/quiz"
            style={{
              padding: '0.85rem 1.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid var(--color-arch-gold)',
              color: 'var(--color-arch-gold)',
            }}
          >
            Descobrir minha arquitetura
          </Link>
          <Link
            to="/"
            style={{
              padding: '0.85rem 1.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid rgba(136,150,204,0.3)',
              color: 'var(--color-dim2)',
            }}
          >
            Ver as arquiteturas
          </Link>
        </div>

        <p
          style={{
            marginTop: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.54rem',
            lineHeight: 1.8,
            letterSpacing: '0.08em',
            color: 'var(--color-dim)',
          }}
        >
          Os conteúdos externos pertencem aos seus autores: Curso em Vídeo (Gustavo Guanabara) e Mapa do Arquiteto (Renato Augusto).
        </p>
      </div>
    </div>
  )
}
