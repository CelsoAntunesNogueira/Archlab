import type { SimScenario, SimNode } from '@/types'

export const SIM_SCENARIOS: SimScenario[] = [
  {
    name: 'Criar Pedido',
    icon: '🛒',
    steps: [
      { label: 'Cliente envia POST /orders', svc: 'gateway', type: 'info' },
      { label: 'Gateway autentica e roteia', svc: 'gateway', type: 'info' },
      { label: 'OrderService valida o pedido', svc: 'orders', type: 'info' },
      { label: 'OrderService persiste no DB', svc: 'db-orders', type: 'ok' },
      { label: 'Evento OrderCreated → RabbitMQ', svc: 'rabbitmq', type: 'info' },
      { label: 'PaymentService consome evento', svc: 'payment', type: 'info' },
      { label: 'Pagamento processado com sucesso', svc: 'payment', type: 'ok' },
      { label: 'Evento PaymentDone → RabbitMQ', svc: 'rabbitmq', type: 'info' },
      { label: 'NotifService envia email/push', svc: 'notif', type: 'ok' },
      { label: 'OrderService atualiza status', svc: 'db-orders', type: 'ok' },
      { label: 'Response 201 Created ao cliente', svc: 'gateway', type: 'ok' },
    ],
    metrics: { latency: 180, throughput: 45, errors: 0, health: 100 },
  },
  {
    name: 'Alta Carga',
    icon: '⚡',
    steps: [
      { label: '100 req/s chegando ao Gateway', svc: 'gateway', type: 'warn' },
      { label: 'Rate limiter ativado (80 req/s)', svc: 'gateway', type: 'warn' },
      { label: 'OrderService escalando (3 réplicas)', svc: 'orders', type: 'info' },
      { label: 'PaymentService sob pressão', svc: 'payment', type: 'warn' },
      { label: 'RabbitMQ acumulando mensagens', svc: 'rabbitmq', type: 'warn' },
      { label: 'Kubernetes adiciona pod automático', svc: 'payment', type: 'ok' },
      { label: 'Carga distribuída entre réplicas', svc: 'payment', type: 'ok' },
      { label: 'Throughput estabilizado: 85 req/s', svc: 'gateway', type: 'ok' },
    ],
    metrics: { latency: 340, throughput: 85, errors: 3, health: 92 },
  },
  {
    name: 'Falha de Serviço',
    icon: '💥',
    steps: [
      { label: 'Cliente envia pedido', svc: 'gateway', type: 'info' },
      { label: 'Gateway roteia para PaymentService', svc: 'gateway', type: 'info' },
      { label: 'PaymentService — TIMEOUT 5s', svc: 'payment', type: 'err' },
      { label: 'Retry #1 → ainda falha', svc: 'payment', type: 'err' },
      { label: 'Retry #2 → ainda falha', svc: 'payment', type: 'err' },
      { label: 'Polly aciona circuit breaker', svc: 'gateway', type: 'warn' },
      { label: 'Pedido entra em fila de retry', svc: 'rabbitmq', type: 'warn' },
      { label: 'Fallback: pagamento pendente salvo', svc: 'db-orders', type: 'warn' },
      { label: 'Cliente recebe 202 Accepted', svc: 'gateway', type: 'ok' },
    ],
    metrics: { latency: 5200, throughput: 12, errors: 35, health: 60 },
  },
  {
    name: 'Circuit Breaker',
    icon: '🔄',
    steps: [
      { label: 'PaymentService com falha contínua', svc: 'payment', type: 'err' },
      { label: 'Circuit Breaker: ABERTO (30s)', svc: 'gateway', type: 'warn' },
      { label: 'Requisições rejeitadas imediatamente', svc: 'gateway', type: 'warn' },
      { label: 'Latência protegida: sem espera', svc: 'gateway', type: 'info' },
      { label: 'Após 30s: estado HALF-OPEN', svc: 'gateway', type: 'info' },
      { label: 'Teste: 1 requisição de probe', svc: 'payment', type: 'info' },
      { label: 'PaymentService recuperado ✓', svc: 'payment', type: 'ok' },
      { label: 'Circuit Breaker: FECHADO', svc: 'gateway', type: 'ok' },
      { label: 'Tráfego normal restaurado', svc: 'gateway', type: 'ok' },
    ],
    metrics: { latency: 95, throughput: 40, errors: 8, health: 85 },
  },
]

export const SIM_NODES: SimNode[] = [
  { id: 'client',    x: 0.5,  y: 0.06, label: 'Cliente',     color: '#8896cc', r: 22, failed: false },
  { id: 'gateway',   x: 0.5,  y: 0.20, label: 'API Gateway', color: '#f48fb1', r: 26, failed: false },
  { id: 'orders',    x: 0.2,  y: 0.42, label: 'Orders',      color: '#4fc3f7', r: 22, failed: false },
  { id: 'payment',   x: 0.45, y: 0.42, label: 'Payment',     color: '#4fc3f7', r: 22, failed: false },
  { id: 'notif',     x: 0.7,  y: 0.42, label: 'Notif',       color: '#4fc3f7', r: 22, failed: false },
  { id: 'rabbitmq',  x: 0.5,  y: 0.60, label: 'RabbitMQ',   color: '#ffd54f', r: 22, failed: false },
  { id: 'db-orders', x: 0.2,  y: 0.80, label: 'DB Orders',   color: '#a5d6a7', r: 18, failed: false },
  { id: 'db-pay',    x: 0.45, y: 0.80, label: 'DB Pay',      color: '#a5d6a7', r: 18, failed: false },
]

export const SIM_EDGES: [string, string][] = [
  ['client', 'gateway'],
  ['gateway', 'orders'],
  ['gateway', 'payment'],
  ['gateway', 'notif'],
  ['orders', 'rabbitmq'],
  ['payment', 'rabbitmq'],
  ['notif', 'rabbitmq'],
  ['orders', 'db-orders'],
  ['payment', 'db-pay'],
]
