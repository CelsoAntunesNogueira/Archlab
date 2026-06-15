import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUIZ_QUESTIONS, calculateResults } from '@/data/quiz'
import { ARCHITECTURES } from '@/data/architectures'
import { ConstellationSVG } from '@/components/ui/ConstellationSVG'
import { useReveal } from '@/hooks/useReveal'

type Phase = 'intro' | 'questions' | 'results'

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current) / total) * 100
  return (
    <div className="w-full h-[2px] mb-8" style={{ background: 'rgba(136,150,204,0.12)' }}>
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${pct}%`, background: 'var(--color-arch-gold)' }}
      />
    </div>
  )
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  const r = useReveal()
  return (
    <div ref={r} className="reveal flex flex-col items-center text-center py-20 max-w-xl mx-auto">
      <div className="text-6xl mb-6">🌌</div>
      <span className="font-mono text-[0.62rem] tracking-[0.38em] uppercase block mb-4" style={{ color: 'var(--color-arch-gold)' }}>
        // Descoberta de Arquitetura
      </span>
      <h1 className="font-black leading-[1.05] tracking-tight mb-6" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
        Qual constelação<br />é o seu sistema?
      </h1>
      <p className="font-mono text-[0.75rem] leading-[1.9] mb-10" style={{ color: 'var(--color-dim2)' }}>
        Responda {QUIZ_QUESTIONS.length} perguntas sobre seu projeto e descubra qual arquitetura de software é a mais adequada para o seu contexto.
      </p>
      <button
        onClick={onStart}
        className="px-10 py-4 font-mono text-[0.75rem] tracking-[0.15em] uppercase transition-all duration-300"
        style={{ border: '1px solid var(--color-arch-gold)', color: 'var(--color-arch-gold)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-arch-gold)'; e.currentTarget.style.color = 'var(--color-void)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-arch-gold)' }}
      >
        Iniciar Quiz →
      </button>
    </div>
  )
}

function QuestionScreen({
  index,
  total,
  answers,
  onAnswer,
  onBack,
}: {
  index: number
  total: number
  answers: Record<string, string>
  onAnswer: (qId: string, val: string) => void
  onBack: () => void
}) {
  const q = QUIZ_QUESTIONS[index]
  const selected = answers[q.id]

  return (
    <div className="max-w-2xl mx-auto py-12">
      <ProgressBar current={index} total={total} />

      <div className="font-mono text-[0.62rem] tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--color-dim)' }}>
        Pergunta {index + 1} de {total}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">{q.icon}</span>
        <h2 className="font-bold leading-[1.2]" style={{ fontSize: 'clamp(1.2rem,3vw,1.8rem)' }}>{q.text}</h2>
      </div>

      <div className="flex flex-col gap-3 mb-10">
        {q.options.map(opt => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onAnswer(q.id, opt.value)}
              className="text-left px-6 py-4 font-mono text-[0.72rem] leading-[1.6] transition-all duration-200"
              style={{
                border: `1px solid ${isSelected ? 'var(--color-arch-gold)' : 'rgba(136,150,204,0.15)'}`,
                background: isSelected ? 'rgba(255,213,79,0.08)' : 'rgba(8,14,35,0.4)',
                color: isSelected ? 'var(--color-arch-gold)' : 'var(--color-dim2)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(255,213,79,0.4)'; e.currentTarget.style.color = 'var(--color-star)' }}}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(136,150,204,0.15)'; e.currentTarget.style.color = 'var(--color-dim2)' }}}
            >
              <span className="mr-3" style={{ color: isSelected ? 'var(--color-arch-gold)' : 'var(--color-dim)' }}>
                {isSelected ? '◉' : '○'}
              </span>
              {opt.label}
            </button>
          )
        })}
      </div>

      {index > 0 && (
        <button
          onClick={onBack}
          className="font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-colors duration-200"
          style={{ color: 'var(--color-dim)', background: 'none', border: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-dim2)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
        >
          ← Pergunta anterior
        </button>
      )}
    </div>
  )
}

function ResultsScreen({
  answers,
  onReset,
}: {
  answers: Record<string, string>
  onReset: () => void
}) {
  const navigate = useNavigate()
  const results = calculateResults(answers)
  const top3 = results.slice(0, 3)
  const winner = top3[0]
  const winnerArch = ARCHITECTURES.find(a => a.id === winner.archId)
  const r = useReveal()

  if (!winnerArch) return null

  return (
    <div ref={r} className="reveal max-w-4xl mx-auto py-12">
      {/* Winner */}
      <div className="text-center mb-16">
        <span className="font-mono text-[0.62rem] tracking-[0.38em] uppercase block mb-4" style={{ color: 'var(--color-arch-gold)' }}>
          // Sua constelação ideal
        </span>
        <h2 className="font-black tracking-tight mb-2" style={{ fontSize: 'clamp(2rem,6vw,4rem)', color: winnerArch.color }}>
          {winnerArch.name}
        </h2>
        <p className="font-mono text-[0.75rem] leading-[1.9] max-w-md mx-auto mb-8" style={{ color: 'var(--color-dim2)' }}>
          {winnerArch.longDesc}
        </p>
        <ConstellationSVG
          nodes={winnerArch.nodes}
          edges={winnerArch.edges}
          color={winnerArch.color}
          id={`quiz-${winnerArch.id}`}
          className="w-48 h-48 mx-auto mb-8"
        />
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(`/architecture/${winnerArch.id}`)}
            className="px-8 py-3 font-mono text-[0.7rem] tracking-[0.15em] uppercase transition-all duration-300"
            style={{ border: `1px solid ${winnerArch.color}`, color: winnerArch.color }}
            onMouseEnter={e => { e.currentTarget.style.background = winnerArch.color; e.currentTarget.style.color = 'var(--color-void)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = winnerArch.color }}
          >
            Explorar em detalhes →
          </button>
          <button
            onClick={onReset}
            className="px-8 py-3 font-mono text-[0.7rem] tracking-[0.15em] uppercase transition-all duration-200"
            style={{ border: '1px solid rgba(136,150,204,0.2)', color: 'var(--color-dim2)', background: 'transparent' }}
          >
            ↺ Refazer quiz
          </button>
        </div>
      </div>

      {/* All scores */}
      <div style={{ background: 'rgba(8,14,35,0.5)', border: '1px solid rgba(136,150,204,0.08)', padding: '2rem', backdropFilter: 'blur(12px)' }}>
        <div className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--color-arch-gold)' }}>
          // Ranking completo
        </div>
        <div className="flex flex-col gap-3">
          {results.map((res, i) => {
            const arch = ARCHITECTURES.find(a => a.id === res.archId)
            if (!arch) return null
            return (
              <div key={res.archId} className="flex items-center gap-4">
                <span className="font-mono text-[0.58rem] w-5 text-right flex-shrink-0" style={{ color: 'var(--color-dim)' }}>
                  {i + 1}
                </span>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: arch.color }} />
                <span className="font-bold text-sm w-44 flex-shrink-0">{arch.name}</span>
                <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(136,150,204,0.1)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${res.pct}%`, background: arch.color, transitionDelay: `${i * 80}ms` }}
                  />
                </div>
                <span className="font-mono text-[0.62rem] w-10 text-right flex-shrink-0" style={{ color: arch.color }}>
                  {res.pct}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top 3 cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {top3.map((res, i) => {
          const arch = ARCHITECTURES.find(a => a.id === res.archId)
          if (!arch) return null
          const medals = ['🥇', '🥈', '🥉']
          return (
            <div
              key={res.archId}
              className="p-5 transition-all duration-300 cursor-pointer"
              style={{ background: 'rgba(8,14,35,0.5)', border: `1px solid ${arch.color}22`, backdropFilter: 'blur(8px)' }}
              onClick={() => navigate(`/architecture/${arch.id}`)}
              onMouseEnter={e => (e.currentTarget.style.borderColor = arch.color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = `${arch.color}22`)}
            >
              <div className="text-2xl mb-2">{medals[i]}</div>
              <div className="font-bold mb-1" style={{ color: arch.color }}>{arch.name}</div>
              <div className="font-mono text-[0.58rem] uppercase tracking-[0.1em]" style={{ color: 'var(--color-dim)' }}>{arch.tier}</div>
              <ConstellationSVG
                nodes={arch.nodes}
                edges={arch.edges}
                color={arch.color}
                id={`top-${arch.id}`}
                className="w-full h-16 mt-3"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function QuizPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswer = (qId: string, val: string) => {
    const next = { ...answers, [qId]: val }
    setAnswers(next)
    if (index + 1 < QUIZ_QUESTIONS.length) {
      setTimeout(() => setIndex(i => i + 1), 220)
    } else {
      setTimeout(() => setPhase('results'), 220)
    }
  }

  const handleBack = () => setIndex(i => Math.max(0, i - 1))

  const handleReset = () => {
    setAnswers({})
    setIndex(0)
    setPhase('intro')
  }

  return (
    <div className="min-h-screen px-8 pt-4">
      {phase === 'intro' && <IntroScreen onStart={() => setPhase('questions')} />}
      {phase === 'questions' && (
        <QuestionScreen
          index={index}
          total={QUIZ_QUESTIONS.length}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}
      {phase === 'results' && <ResultsScreen answers={answers} onReset={handleReset} />}
    </div>
  )
}
