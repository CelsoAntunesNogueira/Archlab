import { Outlet } from 'react-router-dom'
import { Cursor } from '@/components/ui/Cursor'
import { Navbar } from '@/components/layout/Navbar'
import { useUniverse } from '@/hooks/useUniverse'

export function Layout() {
  const universeRef = useUniverse()

  return (
    <>
      <Cursor />
      <canvas
        ref={universeRef}
        className="fixed inset-0 z-0"
        style={{ opacity: 0.65 }}
      />
      <Navbar />
      <main className="relative z-10 pt-20">
        <Outlet />
      </main>
      <footer
        className="relative z-10 flex items-center justify-between px-12 py-10 max-w-[1300px] mx-auto"
        style={{ borderTop: '1px solid rgba(136,150,204,0.07)' }}
      >
        <div className="text-[0.9rem] font-black tracking-[0.1em] uppercase">
          Arch<span style={{ color: 'var(--color-arch-cyan)' }}>Lab</span>
        </div>
        <p className="font-mono text-[0.6rem] tracking-[0.1em]" style={{ color: 'var(--color-dim)' }}>
          // Explorador de Arquiteturas · Em desenvolvimento
        </p>
      </footer>
    </>
  )
}
