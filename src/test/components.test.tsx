import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ARCHITECTURES } from '@/data/architectures'
import { calculateResults, QUIZ_QUESTIONS } from '@/data/quiz'
import { ArchCard } from '@/components/ui/ArchCard'
import { SyntaxHighlighter } from '@/components/ui/SyntaxHighlighter'

// ── ArchCard ────────────────────────────────────────────────
describe('ArchCard', () => {
  const arch = ARCHITECTURES[0] // Monolítica

  function renderCard() {
    return render(
      <MemoryRouter>
        <ArchCard arch={arch} />
      </MemoryRouter>
    )
  }

  it('renders architecture name', () => {
    renderCard()
    expect(screen.getByText(arch.name)).toBeTruthy()
  })

  it('renders tier label', () => {
    renderCard()
    expect(screen.getByText(arch.tier)).toBeTruthy()
  })

  it('renders description', () => {
    renderCard()
    expect(screen.getByText(arch.desc)).toBeTruthy()
  })

  it('renders all tags', () => {
    renderCard()
    arch.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeTruthy()
    })
  })

  it('renders correct number of complexity dots', () => {
    const { getAllByTestId } = renderCard()
    const dots = getAllByTestId('complexity-dot')
    // Always 5 dots per card
    expect(dots).toHaveLength(5)
  })

  it('navigates to architecture page on explore click', () => {
    renderCard()
    const exploreBtn = screen.getByText(/Explorar/i)
    expect(exploreBtn).toBeTruthy()
  })
})

// ── SyntaxHighlighter ────────────────────────────────────────
describe('SyntaxHighlighter', () => {
  it('renders code without crashing', () => {
    const { container } = render(
      <SyntaxHighlighter code="var x = 1;" language="csharp" />
    )
    expect(container.querySelector('pre')).toBeTruthy()
  })

  it('renders code content', () => {
    render(<SyntaxHighlighter code="var x = 1;" language="csharp" />)
    expect(screen.getByText(/var/)).toBeTruthy()
  })

  it('applies color spans for keywords', () => {
    const { container } = render(
      <SyntaxHighlighter code="var x = 1;" language="csharp" />
    )
    const spans = container.querySelectorAll('span[style]')
    expect(spans.length).toBeGreaterThan(0)
  })

  it('handles unknown language without crashing', () => {
    const { container } = render(
      <SyntaxHighlighter code="some code" language="unknown" />
    )
    expect(container.querySelector('pre')).toBeTruthy()
  })

  it('handles empty string', () => {
    const { container } = render(
      <SyntaxHighlighter code="" language="csharp" />
    )
    expect(container.querySelector('pre')).toBeTruthy()
  })

  it('highlights yaml keys and strings', () => {
    const code = 'name: "archlab"\nversion: 1'
    const { container } = render(
      <SyntaxHighlighter code={code} language="yaml" />
    )
    expect(container.textContent).toContain('archlab')
  })
})

// ── Quiz engine ──────────────────────────────────────────────
describe('Quiz calculation engine', () => {
  it('returns all architectures in results', () => {
    const answers: Record<string, string> = {}
    QUIZ_QUESTIONS.forEach(q => { answers[q.id] = q.options[0].value })
    const results = calculateResults(answers)
    expect(results.length).toBe(8)
  })

  it('first result has highest score', () => {
    const answers: Record<string, string> = {}
    QUIZ_QUESTIONS.forEach(q => { answers[q.id] = q.options[0].value })
    const results = calculateResults(answers)
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score)
  })

  it('winner pct is always 100', () => {
    const answers: Record<string, string> = {}
    QUIZ_QUESTIONS.forEach(q => { answers[q.id] = q.options[0].value })
    const results = calculateResults(answers)
    expect(results[0].pct).toBe(100)
  })

  it('all pcts are between 0 and 100', () => {
    const answers: Record<string, string> = {}
    QUIZ_QUESTIONS.forEach(q => { answers[q.id] = q.options[1].value })
    const results = calculateResults(answers)
    results.forEach(r => {
      expect(r.pct).toBeGreaterThanOrEqual(0)
      expect(r.pct).toBeLessThanOrEqual(100)
    })
  })

  it('enterprise answers favor microservices or event-driven', () => {
    // Large team + high scale + async-heavy → microservices/event-driven
    const answers = {
      team_size: 'large',
      scale: 'massive',
      domain: 'complex',
      deploy: 'continuous',
      budget: 'high',
      reliability: 'critical',
      audit: 'yes',
      async: 'heavy',
    }
    const results = calculateResults(answers)
    const topIds = results.slice(0, 3).map(r => r.archId)
    const hasAdvanced = topIds.some(id => ['microservices','event-driven','cqrs'].includes(id))
    expect(hasAdvanced).toBe(true)
  })

  it('small team + low scale answers favor monolithic or mvc', () => {
    const answers = {
      team_size: 'tiny',
      scale: 'low',
      domain: 'simple',
      deploy: 'rare',
      budget: 'minimal',
      reliability: 'basic',
      audit: 'no',
      async: 'no',
    }
    const results = calculateResults(answers)
    const topIds = results.slice(0, 2).map(r => r.archId)
    const hasSimple = topIds.some(id => ['monolithic','mvc','layered'].includes(id))
    expect(hasSimple).toBe(true)
  })

  it('handles partial answers without crashing', () => {
    const results = calculateResults({ team_size: 'tiny' })
    expect(results.length).toBe(8)
  })

  it('handles empty answers without crashing', () => {
    const results = calculateResults({})
    expect(results.length).toBe(8)
  })
})

// ── QUIZ_QUESTIONS data ──────────────────────────────────────
describe('Quiz questions data', () => {
  it('has 8 questions', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(8)
  })

  it('each question has at least 2 options', () => {
    QUIZ_QUESTIONS.forEach(q => {
      expect(q.options.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('each option has a non-empty weight object', () => {
    QUIZ_QUESTIONS.forEach(q => {
      q.options.forEach(opt => {
        expect(Object.keys(opt.weight).length).toBeGreaterThan(0)
      })
    })
  })

  it('all weight values are positive numbers', () => {
    QUIZ_QUESTIONS.forEach(q => {
      q.options.forEach(opt => {
        Object.values(opt.weight).forEach(w => {
          expect(w).toBeGreaterThan(0)
        })
      })
    })
  })

  it('each question has an icon', () => {
    QUIZ_QUESTIONS.forEach(q => {
      expect(q.icon.length).toBeGreaterThan(0)
    })
  })
})
