import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'


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
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          background: 'rgba(2,3,10,0.97)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(244,143,177,0.07)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-12">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-[0.95rem] font-black tracking-[0.18em] uppercase no-underline flex-shrink-0"
            style={{ color: 'var(--color-star)' }}
          >
            Arch<span style={{ color: 'var(--color-arch-cyan)' }}>Lab</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-8 list-none items-center">
            {links.map((l) => {
              const active = location.pathname === l.to
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-mono text-[0.63rem] tracking-[0.12em] uppercase no-underline transition-colors duration-200"
                    style={{ color: active ? 'var(--color-arch-cyan)' : 'var(--color-dim2)' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--color-arch-cyan)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = active ? 'var(--color-arch-cyan)' : 'var(--color-dim2)')}
                  >
                    {l.label}
                  </Link>
                </li>
              )
            })}

            

            {isDetail && (
              <li>
                <Link
                  to="/"
                  className="font-mono text-[0.63rem] tracking-[0.12em] uppercase no-underline transition-colors duration-200"
                  style={{ color: 'var(--color-dim2)' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--color-arch-rose)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--color-dim2)')}
                >
                  ← Universo
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile: right side */}
          <div className="flex md:hidden items-center gap-3">
            {isDetail && (
              <Link
                to="/"
                onClick={closeMenu}
                className="font-mono text-[0.6rem] tracking-[0.1em] uppercase no-underline"
                style={{ color: 'var(--color-arch-rose)' }}
              >
                ← Voltar
              </Link>
            )}
            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              style={{ background: 'transparent', border: 'none' }}
              aria-label="Menu"
            >
              <span
                className="block w-5 h-[1.5px] transition-all duration-300"
                style={{
                  background: 'var(--color-dim2)',
                  transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block w-5 h-[1.5px] transition-all duration-300"
                style={{
                  background: 'var(--color-dim2)',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-5 h-[1.5px] transition-all duration-300"
                style={{
                  background: 'var(--color-dim2)',
                  transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: menuOpen ? '400px' : '0',
            borderTop: menuOpen ? '1px solid rgba(136,150,204,0.08)' : 'none',
          }}
        >
          <ul className="flex flex-col list-none px-5 py-4 gap-1">
            {links.map((l) => {
              const active = location.pathname === l.to
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={closeMenu}
                    className="block font-mono text-[0.7rem] tracking-[0.12em] uppercase no-underline py-3 px-3 transition-colors duration-200"
                    style={{
                      color: active ? 'var(--color-arch-cyan)' : 'var(--color-dim2)',
                      borderBottom: '1px solid rgba(136,150,204,0.06)',
                      background: active ? 'rgba(79,195,247,0.04)' : 'transparent',
                    }}
                  >
                    {active ? '→ ' : ''}{l.label}
                  </Link>
                </li>
              )
            })}
            
          </ul>
        </div>
      </nav>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[99] md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  )
}
