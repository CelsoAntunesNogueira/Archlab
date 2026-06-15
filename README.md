# ArchLab 🌌

> **Explorador interativo de arquiteturas de software** — cada padrão como uma constelação no universo do software.

Um projeto de portfólio fullstack que demonstra domínio em arquitetura de software, React moderno, TypeScript, animações Canvas, C# .NET e qualidade de código.

---

## 🚀 Começar

```bash
npm install && npm run dev
# → http://localhost:5173
```

Backend .NET (opcional):
```bash
cd ArchLab.SimulationHub && dotnet run
# → http://localhost:5000/hubs/simulation
```

---

## 📸 Páginas

| Rota | Descrição |
|---|---|
| `/` | Home — universo estrelado + grid de 8 constelações |
| `/architecture/:id` | Visão Geral · Diagrama · Simulação ao Vivo · Código |
| `/comparar` | Radar chart + barras comparativas por 6 dimensões |
| `/quiz` | 8 perguntas + motor de recomendação com scoring |
| `/evolucao` | Roadmap interativo: Monólito → Layered → Micro → CQRS |
| `/docs` | Documentação técnica integrada |

---

## 🛠️ Stack

**Front-end:** React 18 · TypeScript · Vite · Tailwind CSS v4 · React Router v6 · Canvas API · vite-plugin-pwa

**Back-end:** ASP.NET Core .NET 8 · SignalR · @microsoft/signalr

**Qualidade:** Vitest · @testing-library/react · ESLint · Prettier

---

## 🧪 Testes

```bash
npm run test:run   # 30 testes — 2 arquivos
```

Cobertura: dados das arquiteturas, motor do quiz, ArchCard, SyntaxHighlighter.

---

## 🏗️ Arquiteturas cobertas (8)

Monolítica · MVC · Layered · Clean Architecture · Microsserviços · Event-Driven · Serverless · CQRS + Event Sourcing

Cada uma com: métricas comparativas, diagrama animado, simulação ao vivo, exemplos em C# .NET.

---

## ⚙️ Comandos

```bash
npm run dev          # Dev server
npm run build        # Build → dist/
npm run typecheck    # tsc --noEmit
npm run test:run     # Testes
npm run lint         # ESLint
npm run format       # Prettier
```

---

## 🌐 Deploy

**Vercel** (front-end) — conectar repo, Vite detectado automaticamente.

**Render** (backend) — build: `dotnet publish -c Release`, start: `dotnet ArchLab.SimulationHub.dll`.

```env
# .env.local
VITE_SIGNALR_URL=http://localhost:5000
```

---

## 📁 Estrutura

```
src/
├── components/     diagram · layout · simulation · ui
├── data/           architectures · codeExamples · quiz · simulation
├── hooks/          useCursor · useReveal · useSimulationHub · useUniverse
├── pages/          Home · Architecture · Comparator · Quiz · Evolution · Docs · 404
├── test/           30 testes + setup com mocks de browser APIs
└── types/

ArchLab.SimulationHub/
├── Hubs/           SimulationHub.cs — StartSimulation · CancelSimulation
├── Services/       SimulationEngine.cs — IAsyncEnumerable por cenário
└── Models/         SimulationStep · SimulationMetrics · ScenarioConfig
```

---

## 📍 Roadmap

- [x] 8 arquiteturas com constelações visuais únicas
- [x] Comparador com radar chart
- [x] Simulações client-side (4 cenários)
- [x] Diagramas interativos com pacotes animados para todas as arquiteturas
- [x] Quiz com motor de scoring (8 perguntas)
- [x] Código C# com syntax highlight próprio (sem deps externas)
- [x] Roadmap evolutivo interativo (5 fases)
- [x] Backend .NET + SignalR (scaffold + hook React)
- [x] PWA (manifest + service worker)
- [x] 30 testes (unit + componente)
- [ ] Simulação real via SignalR em produção
- [ ] Quiz com IA (Claude API)
- [ ] Mais arquiteturas: Saga, BFF, Strangler Fig

---

## 👤 Autor

**Celso Antunes Nogueira** — Fullstack Developer · C# / .NET · React · TypeScript

[![GitHub](https://img.shields.io/badge/GitHub-CelsoAntunesNogueira-181717?style=flat&logo=github)](https://github.com/CelsoAntunesNogueira)
[![Portfolio](https://img.shields.io/badge/Portfolio-devcelso.netlify.app-00C7B7?style=flat&logo=netlify)](https://devcelso.netlify.app)
