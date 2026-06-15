import { useState, useRef, useCallback, useEffect } from 'react'
import { SIM_SCENARIOS, SIM_NODES } from '@/data/simulation'
import { SimulationCanvas, type SimCanvasHandle } from './SimulationCanvas'

interface LogLine { time: string; svc: string; msg: string; type: string }
interface Metrics { latency: number; throughput: number; errors: number; health: number }

const SVC_COLORS: Record<string, string> = {
  gateway:'#f48fb1', orders:'#4fc3f7', payment:'#4fc3f7',
  notif:'#80cbc4', rabbitmq:'#ffd54f', 'db-orders':'#a5d6a7',
  'db-pay':'#a5d6a7', system:'#ce93d8',
}

export function SimulationPanel() {
  const [scenario, setScenario] = useState(0)
  const [running, setRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [speed, setSpeed] = useState(1)
  const [metrics, setMetrics] = useState<Metrics>({ latency:0, throughput:0, errors:0, health:100 })

  const canvasRef = useRef<SimCanvasHandle>(null)
  const sim = useRef({ running:false, step:-1, scenario:0, speed:1, timerId:null as ReturnType<typeof setTimeout>|null })

  useEffect(() => () => { if (sim.current.timerId) clearTimeout(sim.current.timerId) }, [])

  const stopSim = useCallback(() => {
    if (sim.current.timerId) { clearTimeout(sim.current.timerId); sim.current.timerId = null }
    sim.current.running = false
    setRunning(false)
  }, [])

  const addLog = useCallback((svc: string, msg: string, type: string) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false })
    setLogs(prev => [...prev.slice(-80), { time, svc, msg, type }])
  }, [])

  const runStep = useCallback(() => {
    const s = sim.current
    if (!s.running) return
    s.step++
    const sc = SIM_SCENARIOS[s.scenario]

    if (s.step >= sc.steps.length) {
      s.running = false
      setRunning(false)
      setCurrentStep(s.step)
      setMetrics(sc.metrics)
      addLog('system', 'Fluxo completo ✓', 'ok')
      return
    }

    const step = sc.steps[s.step]
    setCurrentStep(s.step)
    canvasRef.current?.spawnPacket(step.svc, step.type)
    addLog(step.svc, step.label, step.type)
    if (step.type === 'err') canvasRef.current?.setNodeFailed(step.svc, true)
    if (step.type === 'ok')  canvasRef.current?.setNodeFailed(step.svc, false)

    const pct = (s.step + 1) / sc.steps.length
    const m = sc.metrics
    setMetrics({
      latency:    Math.round(m.latency * pct * (0.8 + Math.random() * 0.4)),
      throughput: Math.round(m.throughput * pct),
      errors:     Math.round(m.errors * pct),
      health:     Math.round(100 - (100 - m.health) * pct),
    })

    const delay = (1200 / s.speed) * (step.type==='err' ? 2.5 : step.type==='warn' ? 1.5 : 1)
    s.timerId = setTimeout(() => { s.timerId = null; runStep() }, delay)
  }, [addLog])

  const resetAll = useCallback((nextScenario?: number) => {
    stopSim()
    const sc = nextScenario ?? sim.current.scenario
    sim.current.step = -1
    sim.current.scenario = sc
    setCurrentStep(-1)
    setLogs([])
    setMetrics({ latency:0, throughput:0, errors:0, health:100 })
    canvasRef.current?.reset()
  }, [stopSim])

  const startSim = useCallback(() => {
    if (sim.current.running) return
    resetAll()
    setTimeout(() => {
      sim.current.running = true
      sim.current.step = -1
      setRunning(true)
      runStep()
    }, 60)
  }, [resetAll, runStep])

  const handleScenario = useCallback((i: number) => {
    resetAll(i)
    setScenario(i)
  }, [resetAll])

  const sc = SIM_SCENARIOS[scenario]
  const healthColor = metrics.health > 80 ? '#a5d6a7' : metrics.health > 50 ? '#ffb74d' : '#ef5350'

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns:'1fr 360px' }}>
      <div className="flex flex-col gap-4">
        <div style={{ border:'1px solid rgba(244,143,177,0.12)', backdropFilter:'blur(12px)' }}>
          <SimulationCanvas ref={canvasRef} nodes={SIM_NODES} />
        </div>
        <div>
          <div className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-2" style={{ color:'#f48fb1' }}>// Log de Eventos</div>
          <div className="font-mono text-[0.62rem] overflow-y-auto"
            style={{ background:'rgba(2,3,10,0.9)', border:'1px solid rgba(136,150,204,0.08)', height:200, padding:'0.8rem' }}>
            {logs.length===0 && <span style={{ color:'var(--color-dim)' }}>// Aguardando execução...</span>}
            {logs.map((l,i) => (
              <div key={i} className="flex gap-3 py-[0.18rem] leading-[1.5]" style={{ borderBottom:'1px solid rgba(136,150,204,0.04)' }}>
                <span style={{ color:'var(--color-dim)', flexShrink:0, fontSize:'0.58rem' }}>{l.time}</span>
                <span className="font-bold flex-shrink-0 px-1"
                  style={{ color:SVC_COLORS[l.svc]||'#8896cc', fontSize:'0.6rem', border:`1px solid ${SVC_COLORS[l.svc]||'#8896cc'}22` }}>
                  {l.svc}
                </span>
                <span style={{ color:l.type==='ok'?'#a5d6a7':l.type==='err'?'#ef9a9a':l.type==='warn'?'#ffd54f':'var(--color-dim2)' }}>
                  {l.msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div style={{ background:'rgba(8,14,35,0.75)', border:'1px solid rgba(244,143,177,0.12)', padding:'1.4rem', backdropFilter:'blur(12px)' }}>
          <div className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-4" style={{ color:'#f48fb1' }}>// Cenário</div>
          <div className="flex flex-col gap-2">
            {SIM_SCENARIOS.map((s,i) => (
              <button key={i} onClick={() => handleScenario(i)}
                className="flex items-center gap-3 text-left py-3 px-4 font-mono text-[0.65rem] transition-all duration-200"
                style={{ background:scenario===i?'rgba(244,143,177,0.08)':'transparent', border:`1px solid ${scenario===i?'#f48fb1':'rgba(136,150,204,0.15)'}`, color:scenario===i?'#f48fb1':'var(--color-dim2)' }}>
                <span className="text-base flex-shrink-0">{s.icon}</span>{s.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background:'rgba(8,14,35,0.75)', border:'1px solid rgba(244,143,177,0.12)', padding:'1.4rem', backdropFilter:'blur(12px)' }}>
          <div className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-4" style={{ color:'#f48fb1' }}>// Controles</div>
          <div className="flex gap-3">
            <button onClick={startSim} disabled={running}
              className="flex-1 py-3 font-mono text-[0.65rem] tracking-[0.12em] uppercase"
              style={{ border:'1px solid #f48fb1', color:running?'var(--color-dim)':'#f48fb1', background:'transparent', opacity:running?0.5:1 }}>
              ▶ Executar
            </button>
            <button onClick={() => resetAll(scenario)}
              className="flex-1 py-3 font-mono text-[0.65rem] tracking-[0.12em] uppercase"
              style={{ border:'1px solid rgba(136,150,204,0.2)', color:'var(--color-dim2)', background:'transparent' }}>
              ↺ Reset
            </button>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] whitespace-nowrap" style={{ color:'var(--color-dim)' }}>Velocidade</span>
            <input type="range" min={0.3} max={3} step={0.1} value={speed}
              onChange={e => { const v=parseFloat(e.target.value); sim.current.speed=v; setSpeed(v) }}
              className="flex-1 h-[2px] appearance-none outline-none"
              style={{ background:'rgba(136,150,204,0.15)', accentColor:'#f48fb1' }} />
            <span className="font-mono text-[0.58rem] min-w-[2.5rem]" style={{ color:'var(--color-dim)' }}>{speed.toFixed(1)}x</span>
          </div>
        </div>

        <div style={{ background:'rgba(8,14,35,0.75)', border:'1px solid rgba(244,143,177,0.12)', padding:'1.4rem', backdropFilter:'blur(12px)' }}>
          <div className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-4" style={{ color:'#f48fb1' }}>// Fluxo</div>
          <div className="flex flex-col gap-1">
            {sc.steps.map((step,i) => {
              const done=i<currentStep, active=i===currentStep
              return (
                <div key={i} className="flex items-center gap-3 py-2 px-3 font-mono text-[0.6rem] transition-all duration-300"
                  style={{ border:`1px solid ${active?'#f48fb1':done?'rgba(165,214,167,0.2)':'transparent'}`, background:active?'rgba(244,143,177,0.08)':'transparent', color:active?'#f48fb1':done?'#a5d6a7':'var(--color-dim)' }}>
                  <div className="w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 text-[0.5rem]"
                    style={{ borderColor:'currentColor', background:done?'#a5d6a7':'transparent', color:done?'#02030a':'currentColor' }}>
                    {done?'✓':i+1}
                  </div>
                  <span className="leading-[1.5]">{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ background:'rgba(8,14,35,0.75)', border:'1px solid rgba(244,143,177,0.12)', padding:'1.4rem', backdropFilter:'blur(12px)' }}>
          <div className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-4" style={{ color:'#f48fb1' }}>// Métricas</div>
          <div className="grid grid-cols-2 gap-3">
            {([
              { label:'Latência', val:`${metrics.latency}ms`, pct:Math.min(metrics.latency/1000*100,100), color:'#4fc3f7' },
              { label:'Req/s', val:`${metrics.throughput}`, pct:Math.min(metrics.throughput,100), color:'#a5d6a7' },
              { label:'Erros', val:`${metrics.errors}%`, pct:metrics.errors, color:'#ef5350' },
              { label:'Health', val:`${metrics.health}%`, pct:metrics.health, color:healthColor },
            ] as const).map(m => (
              <div key={m.label} className="p-3" style={{ background:'rgba(5,8,24,0.5)', border:'1px solid rgba(136,150,204,0.08)' }}>
                <div className="text-[1.2rem] font-black leading-[1] tracking-[-0.02em]" style={{ color:m.color }}>{m.val}</div>
                <div className="font-mono text-[0.5rem] uppercase tracking-[0.1em] mt-1" style={{ color:'var(--color-dim)' }}>{m.label}</div>
                <div className="h-[2px] mt-2 rounded-full overflow-hidden" style={{ background:'rgba(136,150,204,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-600" style={{ width:`${m.pct}%`, background:m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
