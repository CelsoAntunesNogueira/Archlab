using ArchLab.SimulationHub.Models;

namespace ArchLab.SimulationHub.Services;

public interface ISimulationEngine
{
    IAsyncEnumerable<SimulationStep> RunAsync(ScenarioConfig config, CancellationToken ct = default);
    SimulationMetrics GetFinalMetrics(ScenarioConfig config);
}

// ── DATA ──────────────────────────────────────────────────────

file static class ScenarioData
{
    public static readonly Dictionary<string, List<SimulationStep>> Scenarios = new()
    {
        ["create-order"] =
        [
            new("gateway",   "Cliente envia POST /orders",          "info", 400,  0, 11),
            new("gateway",   "Gateway autentica e roteia",          "info", 350,  1, 11),
            new("orders",    "OrderService valida o pedido",        "info", 300,  2, 11),
            new("db-orders", "OrderService persiste no DB",         "ok",   500,  3, 11),
            new("rabbitmq",  "Evento OrderCreated → RabbitMQ",     "info", 200,  4, 11),
            new("payment",   "PaymentService consome evento",       "info", 450,  5, 11),
            new("payment",   "Pagamento processado com sucesso",    "ok",   600,  6, 11),
            new("rabbitmq",  "Evento PaymentDone → RabbitMQ",      "info", 200,  7, 11),
            new("notif",     "NotifService envia email/push",       "ok",   300,  8, 11),
            new("db-orders", "OrderService atualiza status",        "ok",   400,  9, 11),
            new("gateway",   "Response 201 Created ao cliente",     "ok",   150, 10, 11),
        ],

        ["high-load"] =
        [
            new("gateway",  "100 req/s chegando ao Gateway",          "warn", 500, 0, 8),
            new("gateway",  "Rate limiter ativado (80 req/s)",        "warn", 400, 1, 8),
            new("orders",   "OrderService escalando (3 réplicas)",    "info", 800, 2, 8),
            new("payment",  "PaymentService sob pressão",             "warn", 600, 3, 8),
            new("rabbitmq", "RabbitMQ acumulando mensagens",          "warn", 500, 4, 8),
            new("payment",  "Kubernetes adiciona pod automático",     "ok",   900, 5, 8),
            new("payment",  "Carga distribuída entre réplicas",       "ok",   400, 6, 8),
            new("gateway",  "Throughput estabilizado: 85 req/s",      "ok",   300, 7, 8),
        ],

        ["service-failure"] =
        [
            new("gateway",   "Cliente envia pedido",                  "info",  400, 0, 9),
            new("gateway",   "Gateway roteia para PaymentService",    "info",  300, 1, 9),
            new("payment",   "PaymentService — TIMEOUT 5s",           "err",  5000, 2, 9),
            new("payment",   "Retry #1 → ainda falha",               "err",  2000, 3, 9),
            new("payment",   "Retry #2 → ainda falha",               "err",  2000, 4, 9),
            new("gateway",   "Polly aciona circuit breaker",          "warn",  400, 5, 9),
            new("rabbitmq",  "Pedido entra em fila de retry",        "warn",  300, 6, 9),
            new("db-orders", "Fallback: pagamento pendente salvo",   "warn",  500, 7, 9),
            new("gateway",   "Cliente recebe 202 Accepted",           "ok",   150, 8, 9),
        ],

        ["circuit-breaker"] =
        [
            new("payment", "PaymentService com falha contínua",     "err",   500, 0, 9),
            new("gateway", "Circuit Breaker: ABERTO (30s)",         "warn",  600, 1, 9),
            new("gateway", "Requisições rejeitadas imediatamente",  "warn",  300, 2, 9),
            new("gateway", "Latência protegida: sem espera",        "info",  400, 3, 9),
            new("gateway", "Após 30s: estado HALF-OPEN",            "info",  800, 4, 9),
            new("payment", "Teste: 1 requisição de probe",          "info",  600, 5, 9),
            new("payment", "PaymentService recuperado ✓",           "ok",    500, 6, 9),
            new("gateway", "Circuit Breaker: FECHADO",              "ok",    400, 7, 9),
            new("gateway", "Tráfego normal restaurado",             "ok",    300, 8, 9),
        ],
    };

    public static readonly Dictionary<string, SimulationMetrics> Metrics = new()
    {
        ["create-order"]    = new(180, 45,  0,  100),
        ["high-load"]       = new(340, 85,  3,   92),
        ["service-failure"] = new(5200, 12, 35,  60),
        ["circuit-breaker"] = new(95,  40,  8,   85),
    };
}

// ── ENGINE ────────────────────────────────────────────────────

public sealed class SimulationEngine : ISimulationEngine
{
    public async IAsyncEnumerable<SimulationStep> RunAsync(
        ScenarioConfig config,
        [System.Runtime.CompilerServices.EnumeratorCancellation]
        CancellationToken ct = default)
    {
        if (!ScenarioData.Scenarios.TryGetValue(config.ScenarioId, out var steps))
            yield break;

        foreach (var step in steps)
        {
            ct.ThrowIfCancellationRequested();

            yield return step;

            var delay = (int)(step.DelayMs / config.Speed);
            await Task.Delay(delay, ct);
        }
    }

    public SimulationMetrics GetFinalMetrics(ScenarioConfig config) =>
        ScenarioData.Metrics.TryGetValue(config.ScenarioId, out var m)
            ? m
            : new SimulationMetrics(0, 0, 0, 100);
}
