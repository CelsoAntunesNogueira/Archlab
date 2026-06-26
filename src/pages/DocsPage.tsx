import { useEffect, useRef, useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Section =
  | 'overview'
  | 'architecture'
  | 'frontend'
  | 'backend'
  | 'simulation'
  | 'deployment'
  | 'roadmap'

interface NavItem {
  id: Section
  label: string
  icon: string
}

const NAV: NavItem[] = [
  { id: 'overview', icon: '🌌', label: 'Visão Geral' },
  { id: 'architecture', icon: '🏗️', label: 'Arquitetura' },
  { id: 'frontend', icon: '⚛️', label: 'Front-end' },
  { id: 'backend', icon: '⚙️', label: 'Backend .NET' },
  { id: 'simulation', icon: '▶', label: 'Simulação' },
  { id: 'deployment', icon: '🚀', label: 'Deploy' },
  { id: 'roadmap', icon: '📍', label: 'Roadmap' },
]

function SectionTitle({
  tag,
  title,
  sub,
}: {
  tag: string
  title: string
  sub?: string
}) {
  const r = useReveal()

  return (
    <div ref={r} className="reveal mb-8 sm:mb-10">
      <span
        className="font-mono text-xs tracking-[0.25em] uppercase block mb-3"
        style={{ color: 'var(--color-arch-rose)' }}
      >
        {tag}
      </span>

      <h2
        className="font-black leading-[1.05] tracking-tight mb-3"
        style={{ fontSize: 'clamp(1.6rem, 6vw, 2.8rem)' }}
      >
        {title}
      </h2>

      {sub && (
        <p
          className="font-mono text-xs sm:text-sm leading-7 max-w-xl"
          style={{ color: 'var(--color-dim2)' }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

function Card({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const r = useReveal()

  return (
    <div
      ref={r}
      className="reveal p-4 sm:p-5 lg:p-6 rounded-xl"
      style={{
        background: 'rgba(8,14,35,0.6)',
        border: '1px solid rgba(136,150,204,0.1)',
        backdropFilter: 'blur(10px)',
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function Code({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="relative mt-4 mb-6 overflow-hidden rounded-xl"
      style={{
        background: 'rgba(2,3,10,0.9)',
        border: '1px solid rgba(136,150,204,0.1)',
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2"
        style={{ borderBottom: '1px solid rgba(136,150,204,0.08)' }}
      >
        <span
          className="font-mono text-xs tracking-[0.12em] uppercase"
          style={{ color: 'var(--color-dim)' }}
        >
          {lang}
        </span>

        <button
          onClick={copy}
          className="min-h-11 px-2 font-mono text-xs tracking-[0.08em] uppercase transition-colors duration-200"
          style={{
            background: 'none',
            border: 'none',
            color: copied ? 'var(--color-arch-green)' : 'var(--color-dim)',
          }}
        >
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>

      <pre
        className="px-4 sm:px-5 py-4 font-mono text-xs sm:text-[0.72rem] leading-7 overflow-x-auto"
        style={{ color: 'var(--color-dim2)' }}
      >
        {code}
      </pre>
    </div>
  )
}

function Badge({
  children,
  color = 'var(--color-arch-cyan)',
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <span
      className="inline-block px-2 py-1 font-mono text-xs tracking-[0.08em] uppercase mr-2 mb-2"
      style={{ border: `1px solid ${color}40`, color }}
    >
      {children}
    </span>
  )
}

function Divider() {
  return (
    <div
      className="my-8"
      style={{ height: 1, background: 'rgba(136,150,204,0.07)' }}
    />
  )
}

function OverviewSection() {
  return (
    <div>
      <SectionTitle
        tag="// 01 · Visão Geral"
        title="O que é o ArchLab?"
        sub="Uma ferramenta interativa para explorar, entender e comparar padrões de arquitetura de software — com simulações ao vivo, exemplos de código reais e um quiz de recomendação."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: '🌌',
            title: 'Universo Visual',
            desc: 'Cada arquitetura como uma constelação no espaço — visual único e memorável.',
          },
          {
            icon: '▶',
            title: 'Simulações ao Vivo',
            desc: 'Fluxo de requisições, falhas e circuit breakers rodando em tempo real no canvas.',
          },
          {
            icon: '🔬',
            title: 'Código Real',
            desc: 'Exemplos prontos em C# .NET para cada padrão arquitetural.',
          },
        ].map((item, i) => (
          <Card key={i} delay={i * 0.08}>
            <div className="text-3xl mb-3">{item.icon}</div>
            <div className="font-bold text-sm mb-2">{item.title}</div>
            <p
              className="font-mono text-xs sm:text-sm leading-7"
              style={{ color: 'var(--color-dim2)' }}
            >
              {item.desc}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-4"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Stack do projeto
        </div>

        <div className="flex flex-wrap">
          {[
            'React 18',
            'TypeScript',
            'Vite',
            'Tailwind CSS v4',
            'React Router v6',
            'Vitest',
            'Canvas API',
            'C# .NET 8',
            'SignalR',
            'MassTransit',
            'RabbitMQ',
          ].map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </Card>
    </div>
  )
}

function ArchitectureSection() {
  return (
    <div>
      <SectionTitle
        tag="// 02 · Arquitetura"
        title="Estrutura do projeto"
        sub="O ArchLab é um SPA React com roteamento client-side. O backend .NET com SignalR é uma extensão futura já scaffoldada."
      />

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-4"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Estrutura de pastas
        </div>

        <Code
          lang="bash"
          code={`archlab/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout.tsx, Navbar.tsx
│   │   ├── ui/              # Cursor, ConstellationSVG, ArchCard, RadarChart
│   │   └── simulation/      # SimulationCanvas, SimulationPanel
│   ├── data/
│   │   ├── architectures.ts # 8 arquiteturas com métricas e metadados
│   │   ├── simulation.ts    # 4 cenários de simulação + nós do grafo
│   │   ├── quiz.ts          # 8 perguntas + motor de recomendação
│   │   └── codeExamples.ts  # Exemplos de código por arquitetura
│   ├── hooks/
│   │   ├── useCursor.ts     # Cursor customizado com trilha de partículas
│   │   ├── useReveal.ts     # Scroll reveal com IntersectionObserver
│   │   └── useUniverse.ts   # Canvas do universo estrelado
│   ├── pages/
│   │   ├── HomePage.tsx     # Hero + Grid de constelações + Features
│   │   ├── ArchitecturePage.tsx # Detalhe com tabs: Overview/Simulação/Código
│   │   ├── ComparatorPage.tsx   # Comparador com radar chart
│   │   ├── QuizPage.tsx         # Quiz de recomendação
│   │   └── DocsPage.tsx         # Esta documentação
│   ├── types/index.ts       # Tipos TypeScript globais
│   ├── App.tsx              # Roteamento React Router
│   └── main.tsx             # Entry point
│
├── ArchLab.SimulationHub/   # Backend .NET com SignalR (scaffold)
│   ├── Hubs/SimulationHub.cs
│   ├── Services/SimulationEngine.cs
│   └── Program.cs
│
├── vite.config.ts
├── vitest.config.ts
└── package.json`}
        />
      </Card>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-4"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Fluxo de dados
        </div>

        <div
          className="font-mono text-xs sm:text-sm leading-8"
          style={{ color: 'var(--color-dim2)' }}
        >
          <div>
            1. <span style={{ color: 'var(--color-arch-cyan)' }}>data/</span> →
            Fonte única de verdade (arquiteturas, quiz, exemplos)
          </div>
          <div>
            2. <span style={{ color: 'var(--color-arch-cyan)' }}>hooks/</span> →
            Lógica de efeitos (canvas, cursor, reveal)
          </div>
          <div>
            3. <span style={{ color: 'var(--color-arch-cyan)' }}>components/</span>{' '}
            → UI reutilizável sem estado de negócio
          </div>
          <div>
            4. <span style={{ color: 'var(--color-arch-cyan)' }}>pages/</span> →
            Composição de componentes + estado local
          </div>
          <div>
            5. <span style={{ color: 'var(--color-arch-cyan)' }}>App.tsx</span> →
            Roteamento declarativo React Router
          </div>
        </div>
      </Card>
    </div>
  )
}

function FrontendSection() {
  return (
    <div>
      <SectionTitle
        tag="// 03 · Front-end"
        title="React + TypeScript + Vite"
        sub="SPA moderno com Tailwind CSS v4, path aliases, testes com Vitest e animações via Canvas API nativa."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            title: 'Path Aliases',
            desc: 'Import com @/ em vez de ../../ — configurado no vite.config.ts e tsconfig.json.',
          },
          {
            title: 'Tailwind v4',
            desc: 'CSS-first config com @theme. Cores customizadas do projeto via variáveis CSS.',
          },
          {
            title: 'Canvas API',
            desc: 'Universo estrelado, constelações e simulações renderizadas nativamente — sem libs externas.',
          },
          {
            title: 'Vitest',
            desc: 'Testes unitários com jsdom. Arquivo de setup configurado. Rodar: npm run test:run',
          },
        ].map((item, i) => (
          <Card key={i} delay={i * 0.06}>
            <div
              className="font-bold text-sm mb-2"
              style={{ color: 'var(--color-arch-cyan)' }}
            >
              {item.title}
            </div>

            <p
              className="font-mono text-xs sm:text-sm leading-7"
              style={{ color: 'var(--color-dim2)' }}
            >
              {item.desc}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Comandos
        </div>

        <Code
          lang="bash"
          code={`npm install          # Instalar dependências
npm run dev          # Dev server → localhost:5173
npm run build        # Build de produção → dist/
npm run typecheck    # Verificação TypeScript
npm run test:run     # Rodar testes uma vez
npm run test         # Testes em watch mode
npm run lint         # ESLint
npm run format       # Prettier`}
        />
      </Card>
    </div>
  )
}

function BackendSection() {
  return (
    <div>
      <SectionTitle
        tag="// 04 · Backend .NET"
        title="SignalR Simulation Hub"
        sub="Scaffold completo de um hub SignalR para streaming de simulações em tempo real. Pronto para conectar ao front-end React."
      />

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Estrutura do projeto .NET
        </div>

        <Code
          lang="bash"
          code={`ArchLab.SimulationHub/
├── Hubs/
│   └── SimulationHub.cs       # Hub SignalR — recebe comandos, emite eventos
├── Services/
│   ├── ISimulationEngine.cs   # Interface do motor de simulação
│   └── SimulationEngine.cs    # Lógica de simulação por cenário
├── Models/
│   ├── SimulationStep.cs      # Passo de simulação (svc, tipo, latência)
│   └── ScenarioConfig.cs      # Configuração de cenário
├── Program.cs                 # Entry point + CORS + SignalR
└── appsettings.json`}
        />
      </Card>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // SimulationHub.cs
        </div>

        <Code
          lang="csharp"
          code={`// Hubs/SimulationHub.cs
public class SimulationHub(ISimulationEngine engine) : Hub
{
    public async Task StartSimulation(
        string archId, string scenarioId, double speed)
    {
        var config = new ScenarioConfig(archId, scenarioId, speed);
        var connectionId = Context.ConnectionId;

        await foreach (var step in engine.RunAsync(config))
        {
            await Clients.Caller.SendAsync("SimulationStep", step);
            await Task.Delay(step.DelayMs);
        }

        await Clients.Caller.SendAsync("SimulationComplete", new {
            archId, scenarioId, timestamp = DateTimeOffset.UtcNow
        });
    }

    public async Task CancelSimulation()
    {
        engine.Cancel(Context.ConnectionId);
        await Clients.Caller.SendAsync("SimulationCancelled");
    }
}`}
        />
      </Card>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Program.cs + CORS
        </div>

        <Code
          lang="csharp"
          code={`// Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR(opt => {
    opt.EnableDetailedErrors = builder.Environment.IsDevelopment();
    opt.MaximumReceiveMessageSize = 32 * 1024;
});

builder.Services.AddSingleton<ISimulationEngine, SimulationEngine>();

builder.Services.AddCors(opt => opt.AddPolicy("React", policy =>
    policy
        .WithOrigins("http://localhost:5173", "https://archlab.vercel.app")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()));

var app = builder.Build();

app.UseCors("React");
app.MapHub<SimulationHub>("/hubs/simulation");
app.Run();`}
        />
      </Card>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Conexão no React (hook futuro)
        </div>

        <Code
          lang="typescript"
          code={`// hooks/useSimulationHub.ts
import * as signalR from '@microsoft/signalr'
import { useEffect, useRef } from 'react'

export function useSimulationHub() {
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/simulation')
      .withAutomaticReconnect()
      .build()

    conn.on('SimulationStep', (step: SimStep) => {
      dispatch({ type: 'STEP', payload: step })
    })

    conn.on('SimulationComplete', () => {
      dispatch({ type: 'COMPLETE' })
    })

    conn.start()
    connectionRef.current = conn

    return () => {
      conn.stop()
    }
  }, [])

  const startSimulation = (
    archId: string,
    scenarioId: string,
    speed: number
  ) => connectionRef.current?.invoke('StartSimulation', archId, scenarioId, speed)

  return { startSimulation }
}`}
        />
      </Card>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Como rodar o backend
        </div>

        <Code
          lang="bash"
          code={`cd ArchLab.SimulationHub

dotnet restore
dotnet run
# → http://localhost:5000

npm install @microsoft/signalr`}
        />
      </Card>
    </div>
  )
}

function SimulationSection() {
  return (
    <div>
      <SectionTitle
        tag="// 05 · Simulação"
        title="Motor de Simulação"
        sub="A simulação roda 100% no front-end via Canvas API. Cada cenário é uma sequência de passos que animam pacotes entre nós do grafo."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            title: '4 Cenários',
            items: [
              'Criar Pedido — fluxo feliz completo',
              'Alta Carga — rate limiting e auto-scale',
              'Falha de Serviço — retry + fallback',
              'Circuit Breaker — open/half-open/closed',
            ],
          },
          {
            title: 'Componentes',
            items: [
              'SimulationCanvas — renderização canvas',
              'SimulationPanel — controles e logs',
              'useImperativeHandle — API do canvas',
              'requestAnimationFrame — loop suave',
            ],
          },
        ].map((col, i) => (
          <Card key={i}>
            <div
              className="font-bold text-sm mb-3"
              style={{ color: 'var(--color-arch-rose)' }}
            >
              {col.title}
            </div>

            <ul className="flex flex-col gap-2">
              {col.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 font-mono text-xs sm:text-sm"
                  style={{ color: 'var(--color-dim2)' }}
                >
                  <span style={{ color: 'var(--color-arch-rose)' }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Como adicionar um novo cenário
        </div>

        <Code
          lang="typescript"
          code={`// src/data/simulation.ts
export const SIM_SCENARIOS: SimScenario[] = [
  {
    name: 'Meu Novo Cenário',
    icon: '🔥',
    steps: [
      { label: 'Passo 1 — descrição', svc: 'gateway', type: 'info' },
      { label: 'Passo 2 — sucesso', svc: 'orders', type: 'ok' },
      { label: 'Passo 3 — aviso', svc: 'payment', type: 'warn' },
      { label: 'Passo 4 — erro', svc: 'payment', type: 'err' },
    ],
    metrics: { latency: 250, throughput: 60, errors: 5, health: 95 },
  },
]`}
        />
      </Card>
    </div>
  )
}

function DeploySection() {
  return (
    <div>
      <SectionTitle
        tag="// 06 · Deploy"
        title="Hospedagem e CI/CD"
        sub="Front-end na Vercel (zero config para Vite). Backend .NET no Render ou Railway com deploy automático via GitHub."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <div
            className="font-bold text-sm mb-4"
            style={{ color: 'var(--color-arch-cyan)' }}
          >
            ⚡ Front-end — Vercel
          </div>

          <ol className="flex flex-col gap-2">
            {[
              'Push do repositório para o GitHub',
              'Conectar repo na vercel.com',
              'Vercel detecta Vite automaticamente',
              'Deploy automático em cada push para main',
              'URL: seu-projeto.vercel.app',
            ].map((step, i) => (
              <li
                key={i}
                className="flex gap-3 font-mono text-xs sm:text-sm"
                style={{ color: 'var(--color-dim2)' }}
              >
                <span
                  style={{
                    color: 'var(--color-arch-cyan)',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <div
            className="font-bold text-sm mb-4"
            style={{ color: 'var(--color-arch-rose)' }}
          >
            ⚙️ Backend — Render
          </div>

          <ol className="flex flex-col gap-2">
            {[
              'Push do projeto .NET para GitHub',
              'Criar Web Service no render.com',
              'Build command: dotnet publish -c Release',
              'Start command: dotnet ArchLab.SimulationHub.dll',
              'Free tier: hiberna após inatividade (30s cold start)',
            ].map((step, i) => (
              <li
                key={i}
                className="flex gap-3 font-mono text-xs sm:text-sm"
                style={{ color: 'var(--color-dim2)' }}
              >
                <span
                  style={{
                    color: 'var(--color-arch-rose)',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card>
        <div
          className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--color-arch-rose)' }}
        >
          // Variáveis de ambiente
        </div>

        <Code
          lang="bash"
          code={`# .env.local (front-end)
VITE_SIGNALR_URL=http://localhost:5000
VITE_SIGNALR_URL=https://archlab-api.onrender.com

# appsettings.json (backend)
{
  "AllowedOrigins": ["https://archlab.vercel.app"],
  "ConnectionStrings": {
    "RabbitMQ": "amqp://guest:guest@localhost"
  }
}`}
        />
      </Card>
    </div>
  )
}

function RoadmapSection() {
  const phases = [
    {
      phase: 'Fase 1 — MVP (atual)',
      color: 'var(--color-arch-green)',
      done: true,
      items: [
        'Home com universo de constelações animado',
        '8 arquiteturas com cards interativos',
        'Comparador com radar chart e barras',
        'Página de detalhe com 3 abas (Overview, Simulação, Código)',
        'Simulação client-side com 4 cenários',
        'Quiz de recomendação com 8 perguntas',
        'Exemplos de código para 7 arquiteturas',
        'Scaffold backend .NET com SignalR',
        'Documentação integrada',
      ],
    },
    {
      phase: 'Fase 2 — Backend Real',
      color: 'var(--color-arch-gold)',
      done: false,
      items: [
        'Conectar SimulationHub ao front-end via @microsoft/signalr',
        'Streaming de passos em tempo real pelo WebSocket',
        'Cenários controlados pelo servidor (latência realista)',
        'Métricas calculadas server-side',
        'Persistência de sessões de simulação',
      ],
    },
    {
      phase: 'Fase 3 — Conteúdo',
      color: 'var(--color-arch-violet)',
      done: false,
      items: [
        'Roadmap evolutivo (Monólito → Microsserviços)',
        'Simulador de falhas com chaos engineering',
        'Mais arquiteturas: Saga, BFF, Strangler Fig',
        'Diagrama interativo drag-and-drop',
        'Estimativa de custo de infra por arquitetura',
      ],
    },
    {
      phase: 'Fase 4 — Produto',
      color: 'var(--color-arch-rose)',
      done: false,
      items: [
        'Modo de compartilhamento de resultados do quiz',
        'Gerador de arquitetura por IA (Claude API)',
        'Modo colaborativo — múltiplos usuários na simulação',
        'Exportar diagrama como PNG/SVG',
        'Internacionalização (EN/PT)',
      ],
    },
  ]

  return (
    <div>
      <SectionTitle
        tag="// 07 · Roadmap"
        title="Próximas fases"
        sub="O ArchLab foi construído com evolução em mente. Cada fase adiciona uma camada de funcionalidade sem quebrar o que já existe."
      />

      <div className="flex flex-col gap-4">
        {phases.map((p, i) => (
          <Card key={i} delay={i * 0.08}>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  background: p.color,
                  boxShadow: p.done ? `0 0 8px ${p.color}` : 'none',
                }}
              />
              <div className="font-bold" style={{ color: p.color }}>
                {p.phase}
              </div>

              {p.done && (
                <span
                  className="font-mono text-xs px-2 py-1 tracking-[0.08em] uppercase"
                  style={{ border: `1px solid ${p.color}40`, color: p.color }}
                >
                  Concluído
                </span>
              )}
            </div>

            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              {p.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 font-mono text-xs sm:text-sm"
                  style={{ color: 'var(--color-dim2)' }}
                >
                  <span
                    style={{
                      color: p.done ? p.color : 'var(--color-dim)',
                      flexShrink: 0,
                    }}
                  >
                    {p.done ? '✓' : '○'}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}

const SECTIONS: Record<Section, React.FC> = {
  overview: OverviewSection,
  architecture: ArchitectureSection,
  frontend: FrontendSection,
  backend: BackendSection,
  simulation: SimulationSection,
  deployment: DeploySection,
  roadmap: RoadmapSection,
}

export function DocsPage() {
  const [active, setActive] = useState<Section>('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const ActiveSection = SECTIONS[active]
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEsc)

    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  const handleSelectSection = (section: Section) => {
    setActive(section)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen lg:flex">
    {/* Mobile topbar */}
      <div
        className="lg:hidden sticky top-0 z-40 px-4 py-3 border-b"
        style={{
          background: 'rgba(8,14,35,0.92)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(136,150,204,0.08)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Título da página */}
          <div className="min-w-0">
            <div
              className="font-mono text-xs tracking-[0.24em] uppercase"
              style={{ color: 'var(--color-dim)' }}
            >
              // Documentação
            </div>
          </div>

          {/* Botão do Menu exibindo a aba atual */}
          <div ref={menuRef} className="relative flex-shrink-0">
            <button
              type="button"
              aria-label="Abrir navegação"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="min-h-11 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-mono text-sm"
              style={{
                border: '1px solid rgba(136,150,204,0.14)',
                background: menuOpen
                  ? 'rgba(244,143,177,0.08)'
                  : 'rgba(8,14,35,0.72)',
                color: 'var(--color-dim2)',
              }}
            >
              {/* Mostra o nome da aba ativa dinamicamente */}
              <span>{NAV.find((item) => item.id === active)?.label}</span>
              
              {/* Ícone de seta indicando estado do menu */}
              <span className="text-[10px] opacity-70">
                {menuOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* Dropdown (mantido igual ao original) */}
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-3 w-[min(88vw,20rem)] max-w-xs overflow-hidden rounded-xl z-50"
                style={{
                  background: 'rgba(58,63,82,0.96)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                }}
              >
                <nav className="p-2">
                  {NAV.map((item) => {
                    const isActive = active === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSection(item.id)}
                        className="w-full min-h-11 flex items-center gap-3 px-3 py-2 text-left rounded-lg font-mono text-sm transition-colors"
                        style={{
                          background: isActive
                            ? 'rgba(37, 99, 235, 0.95)'
                            : 'transparent',
                          color: isActive ? '#f8fbff' : 'var(--color-dim2)',
                        }}
                      >
                        <span className="w-5 text-center">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block lg:w-56 lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start lg:pt-8 lg:pl-8 lg:pr-4"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <div
          className="font-mono text-xs tracking-[0.28em] uppercase mb-5"
          style={{ color: 'var(--color-dim)' }}
        >
          // Documentação
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="min-h-11 flex items-center gap-3 px-3 py-2 font-mono text-sm tracking-[0.05em] text-left transition-all duration-200 rounded-lg"
              style={{
                background:
                  active === item.id
                    ? 'rgba(244,143,177,0.08)'
                    : 'transparent',
                border: `1px solid ${
                  active === item.id
                    ? 'rgba(244,143,177,0.3)'
                    : 'transparent'
                }`,
                color:
                  active === item.id
                    ? 'var(--color-arch-rose)'
                    : 'var(--color-dim2)',
              }}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 w-full max-w-4xl px-4 py-6 sm:px-6 lg:py-10 lg:pr-10 lg:pl-6">
        <ActiveSection />
        <Divider />

        <div
          className="font-mono text-xs sm:text-sm text-center"
          style={{ color: 'var(--color-dim)' }}
        >
          ArchLab · Explorador de Arquiteturas de Software · {new Date().getFullYear()}
        </div>
      </main>
    </div>
  )
}
