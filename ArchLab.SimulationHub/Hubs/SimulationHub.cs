using ArchLab.SimulationHub.Models;
using ArchLab.SimulationHub.Services;
using Microsoft.AspNetCore.SignalR;

namespace ArchLab.SimulationHub.Hubs;

public sealed class SimulationHub(
    ISimulationEngine engine,
    ILogger<SimulationHub> log) : Hub
{
    // CancellationToken por conexão para cancelar simulação em andamento
    private static readonly Dictionary<string, CancellationTokenSource> _cts = [];

    /// <summary>
    /// Inicia uma simulação e transmite cada passo em tempo real.
    /// Chamada pelo cliente React via: connection.invoke("StartSimulation", archId, scenarioId, speed)
    /// </summary>
    public async Task StartSimulation(string archId, string scenarioId, double speed)
    {
        var connId = Context.ConnectionId;
        log.LogInformation("StartSimulation: arch={Arch} scenario={Scenario} speed={Speed} conn={Conn}",
            archId, scenarioId, speed, connId);

        // Cancela simulação anterior da mesma conexão, se houver
        if (_cts.TryGetValue(connId, out var existingCts))
        {
            existingCts.Cancel();
            existingCts.Dispose();
        }

        var cts = new CancellationTokenSource();
        _cts[connId] = cts;

        var config = new ScenarioConfig(archId, scenarioId, Math.Clamp(speed, 0.3, 5.0));

        try
        {
            await foreach (var step in engine.RunAsync(config, cts.Token))
            {
                // Emite cada passo para o cliente que iniciou
                await Clients.Caller.SendAsync("SimulationStep", step, cts.Token);
            }

            var metrics = engine.GetFinalMetrics(config);
            await Clients.Caller.SendAsync("SimulationComplete", new SimulationComplete(
                archId, scenarioId, metrics, DateTimeOffset.UtcNow));
        }
        catch (OperationCanceledException)
        {
            log.LogInformation("Simulation cancelled: conn={Conn}", connId);
        }
        finally
        {
            _cts.Remove(connId);
        }
    }

    /// <summary>
    /// Cancela a simulação em andamento da conexão atual.
    /// </summary>
    public Task CancelSimulation()
    {
        var connId = Context.ConnectionId;
        if (_cts.TryGetValue(connId, out var cts))
        {
            cts.Cancel();
            _cts.Remove(connId);
        }
        return Clients.Caller.SendAsync("SimulationCancelled");
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        // Cleanup ao desconectar
        if (_cts.TryGetValue(Context.ConnectionId, out var cts))
        {
            cts.Cancel();
            cts.Dispose();
            _cts.Remove(Context.ConnectionId);
        }
        return base.OnDisconnectedAsync(exception);
    }
}
