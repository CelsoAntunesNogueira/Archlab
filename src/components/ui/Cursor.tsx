import { useCursor } from '@/hooks/useCursor'

export function Cursor() {
  const { curRef, ringRef, trailRef } = useCursor()

  return (
    <>
      <div
        ref={curRef}
        className="fixed z-[9999] pointer-events-none"
        style={{
          width: 8, height: 8,
          background: '#f48fb1',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 12px #f48fb1, 0 0 28px rgba(244,143,177,0.4)',
        }}
      />
      <div
        ref={ringRef}
        className="fixed z-[9998] pointer-events-none"
        style={{
          width: 28, height: 28,
          border: '1px solid rgba(244,143,177,0.35)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.18s ease',
        }}
      />
      <canvas
        ref={trailRef}
        className="fixed inset-0 z-[9997] pointer-events-none"
      />
    </>
  )
}
