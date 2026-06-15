namespace ArchLab.SimulationHub.Models;

public sealed record SimulationStep(
    string Svc,
    string Label,
    string Type,       // "ok" | "err" | "warn" | "info"
    int    DelayMs,
    int    StepIndex,
    int    TotalSteps
);

public sealed record SimulationMetrics(
    int    Latency,
    int    Throughput,
    int    Errors,
    int    Health
);

public sealed record ScenarioConfig(
    string ArchId,
    string ScenarioId,
    double Speed
);

public sealed record SimulationComplete(
    string         ArchId,
    string         ScenarioId,
    SimulationMetrics Metrics,
    DateTimeOffset Timestamp
);
