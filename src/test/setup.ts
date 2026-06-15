// ── Browser API mocks (não disponíveis no jsdom) ──────────────

// IntersectionObserver — usado por useReveal()
globalThis.IntersectionObserver = class IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe()    {}
  unobserve()  {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
} as unknown as typeof IntersectionObserver

// ResizeObserver — usado por componentes de canvas
globalThis.ResizeObserver = class ResizeObserver {
  observe()    {}
  unobserve()  {}
  disconnect() {}
} as unknown as typeof ResizeObserver

// HTMLCanvasElement.getContext — jsdom não suporta canvas rendering
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext

// requestAnimationFrame — necessário para loops de animação
globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16) as unknown as number
globalThis.cancelAnimationFrame  = (id: number) => clearTimeout(id)

import '@testing-library/jest-dom'
