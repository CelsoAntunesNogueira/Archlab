export interface QuizQuestion {
  id: string
  text: string
  icon: string
  options: { label: string; value: string; weight: Record<string, number> }[]
}

// Each weight key maps to an architecture id
// Positive = favors that architecture, summed across all answers
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'team_size',
    text: 'Qual o tamanho do seu time de desenvolvimento?',
    icon: '👥',
    options: [
      { label: '1–3 pessoas', value: 'tiny', weight: { monolithic: 3, mvc: 2, layered: 1 } },
      { label: '4–10 pessoas', value: 'small', weight: { mvc: 2, layered: 3, clean: 2 } },
      { label: '11–30 pessoas', value: 'medium', weight: { clean: 3, layered: 2, microservices: 2 } },
      { label: '30+ pessoas (múltiplos times)', value: 'large', weight: { microservices: 4, 'event-driven': 3, cqrs: 2 } },
    ],
  },
  {
    id: 'scale',
    text: 'Qual o volume esperado de usuários simultâneos?',
    icon: '📈',
    options: [
      { label: 'Menos de 1.000', value: 'low', weight: { monolithic: 3, mvc: 2, layered: 2 } },
      { label: '1.000 – 50.000', value: 'medium', weight: { layered: 2, clean: 2, mvc: 1 } },
      { label: '50.000 – 500.000', value: 'high', weight: { microservices: 3, clean: 2, 'event-driven': 2 } },
      { label: 'Milhões (pico imprevisível)', value: 'massive', weight: { serverless: 4, microservices: 3, 'event-driven': 3 } },
    ],
  },
  {
    id: 'domain',
    text: 'Como você descreveria a complexidade do domínio de negócio?',
    icon: '🧩',
    options: [
      { label: 'Simples — CRUD básico', value: 'simple', weight: { monolithic: 3, mvc: 3, layered: 1 } },
      { label: 'Moderado — algumas regras de negócio', value: 'moderate', weight: { layered: 3, mvc: 2, clean: 2 } },
      { label: 'Complexo — muitas regras e fluxos', value: 'complex', weight: { clean: 4, layered: 2, microservices: 2 } },
      { label: 'Altamente complexo — domínio crítico', value: 'critical', weight: { clean: 3, cqrs: 4, 'event-driven': 3 } },
    ],
  },
  {
    id: 'deploy',
    text: 'Com que frequência você precisa fazer deploy?',
    icon: '🚀',
    options: [
      { label: 'Raramente (mensal ou menos)', value: 'rare', weight: { monolithic: 3, layered: 2, mvc: 2 } },
      { label: 'Semanalmente', value: 'weekly', weight: { layered: 2, clean: 2, mvc: 1 } },
      { label: 'Diariamente', value: 'daily', weight: { microservices: 3, clean: 2 } },
      { label: 'Múltiplas vezes ao dia (CI/CD)', value: 'continuous', weight: { microservices: 4, serverless: 3, 'event-driven': 2 } },
    ],
  },
  {
    id: 'budget',
    text: 'Qual o budget de infraestrutura?',
    icon: '💰',
    options: [
      { label: 'Mínimo — quero economizar ao máximo', value: 'minimal', weight: { monolithic: 4, mvc: 2, serverless: 2 } },
      { label: 'Moderado — investimento controlado', value: 'moderate', weight: { layered: 3, mvc: 2, clean: 2 } },
      { label: 'Flexível — pago pelo que uso', value: 'flexible', weight: { serverless: 4, 'event-driven': 2 } },
      { label: 'Alto — performance e escala primeiro', value: 'high', weight: { microservices: 4, cqrs: 3, 'event-driven': 3 } },
    ],
  },
  {
    id: 'reliability',
    text: 'Qual o requisito de disponibilidade do sistema?',
    icon: '🛡️',
    options: [
      { label: 'Básico — downtime pontual é aceitável', value: 'basic', weight: { monolithic: 3, mvc: 2 } },
      { label: 'Importante — mínimo de downtime', value: 'important', weight: { layered: 2, clean: 2, mvc: 1 } },
      { label: 'Crítico — 99.9% de uptime', value: 'critical', weight: { microservices: 3, clean: 2, 'event-driven': 2 } },
      { label: 'Missão crítica — 99.99% (financeiro, saúde)', value: 'mission', weight: { cqrs: 4, microservices: 3, 'event-driven': 4 } },
    ],
  },
  {
    id: 'audit',
    text: 'Você precisa de auditoria completa e histórico de mudanças?',
    icon: '📋',
    options: [
      { label: 'Não — logs básicos são suficientes', value: 'no', weight: { monolithic: 2, mvc: 2, layered: 2 } },
      { label: 'Parcial — algumas ações críticas', value: 'partial', weight: { clean: 2, layered: 2 } },
      { label: 'Sim — rastreabilidade completa', value: 'yes', weight: { cqrs: 3, 'event-driven': 3, clean: 1 } },
      { label: 'Obrigatório por regulação (LGPD, PCI)', value: 'mandatory', weight: { cqrs: 5, 'event-driven': 4 } },
    ],
  },
  {
    id: 'async',
    text: 'Seu sistema precisa de processamento assíncrono ou integração entre sistemas?',
    icon: '⚡',
    options: [
      { label: 'Não — tudo síncrono e simples', value: 'no', weight: { monolithic: 3, mvc: 3 } },
      { label: 'Pouco — alguns jobs em background', value: 'little', weight: { layered: 2, mvc: 2, clean: 1 } },
      { label: 'Moderado — filas e workers', value: 'moderate', weight: { 'event-driven': 3, microservices: 2 } },
      { label: 'Intenso — pipelines e integrações complexas', value: 'heavy', weight: { 'event-driven': 5, cqrs: 3, microservices: 2 } },
    ],
  },
]

export interface QuizResult {
  archId: string
  score: number
  pct: number
}

export function calculateResults(answers: Record<string, string>): QuizResult[] {
  const scores: Record<string, number> = {
    monolithic: 0, mvc: 0, layered: 0, clean: 0,
    microservices: 0, 'event-driven': 0, serverless: 0, cqrs: 0,
  }

  QUIZ_QUESTIONS.forEach((q) => {
    const answer = answers[q.id]
    if (!answer) return
    const option = q.options.find((o) => o.value === answer)
    if (!option) return
    Object.entries(option.weight).forEach(([arch, w]) => {
      scores[arch] = (scores[arch] ?? 0) + w
    })
  })

  const maxScore = Math.max(...Object.values(scores))
  return Object.entries(scores)
    .map(([archId, score]) => ({ archId, score, pct: Math.round((score / maxScore) * 100) }))
    .sort((a, b) => b.score - a.score)
}
