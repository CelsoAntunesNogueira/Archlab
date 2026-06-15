export type Tier = 'Básica' | 'Intermediária' | 'Avançada'

export interface ArchMetrics {
  [key: string]: number
  escalabilidade: number
  complexidade: number
  custo: number
  resiliencia: number
  velocidade: number
  maturidade: number
}

export interface NodePoint {
  x: number
  y: number
}

export interface Architecture {
  id: string
  name: string
  tier: Tier
  color: string
  glow: string
  desc: string
  longDesc: string
  tags: string[]
  complexity: number
  metrics: ArchMetrics
  pros: string[]
  cons: string[]
  usecase: string
  nodes: [number, number][]
  edges: [number, number][]
}

export interface SimStep {
  label: string
  svc: string
  type: 'ok' | 'err' | 'warn' | 'info'
}

export interface SimScenario {
  name: string
  icon: string
  steps: SimStep[]
  metrics: {
    latency: number
    throughput: number
    errors: number
    health: number
  }
}

export interface SimNode {
  id: string
  x: number
  y: number
  label: string
  color: string
  r: number
  failed: boolean
}

export interface Packet {
  x: number
  y: number
  tx: number
  ty: number
  progress: number
  speed: number
  color: string
  type: SimStep['type']
  trail: { x: number; y: number }[]
}
