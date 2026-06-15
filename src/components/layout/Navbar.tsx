import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/#explorar', label: 'Explorar'  },
  { to: '/comparar',  label: 'Comparar'  },
  { to: '/quiz',      label: 'Quiz'      },
  { to: '/evolucao',  label: 'Evolução'  },
  { to: '/docs',      label: 'Docs'      },
]

export function Navbar() {
  const location = useLocation()
  const isDetail = location.pathname.startsWith('/architecture')

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5"
      style={{
        background: 'linear-gradient(to bottom, rgba(2,3,10,0.95), transparent)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid rgba(244,143,177,0.05)',
      }}
    >
      <Link
        to="/"
        className="text-[1rem] font-black tracking-[0.18em] uppercase no-underline"
        style={{ color: 'var(--color-star)' }}
      >
        Arch<span style={{ color: 'var(--color-arch-cyan)' }}>Lab</span>
      </Link>

      <ul className="flex gap-8 list-none">
        {links.map((l) => {
          const active = location.pathname === l.to
          return (
            <li key={l.to}>
              <Link
                to={l.to}
                className="font-mono text-[0.63rem] tracking-[0.12em] uppercase no-underline transition-colors duration-200"
                style={{ color: active ? 'var(--color-arch-cyan)' : 'var(--color-dim2)' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-arch-cyan)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = active ? 'var(--color-arch-cyan)' : 'var(--color-dim2)')}
              >
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {isDetail && (
        <Link
          to="/"
          className="font-mono text-[0.63rem] tracking-[0.12em] uppercase no-underline transition-colors duration-200"
          style={{ color: 'var(--color-dim2)' }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-arch-rose)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--color-dim2)')}
        >
          ← Universo
        </Link>
      )}
    </nav>
  )
}
