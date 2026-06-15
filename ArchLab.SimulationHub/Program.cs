using ArchLab.SimulationHub.Hubs;
using ArchLab.SimulationHub.Services;

var builder = WebApplication.CreateBuilder(args);

// ── SERVIÇOS ──────────────────────────────────────────────────

builder.Services.AddSignalR(opt =>
{
    opt.EnableDetailedErrors = builder.Environment.IsDevelopment();
    opt.MaximumReceiveMessageSize = 32 * 1024; // 32 KB
    opt.ClientTimeoutInterval    = TimeSpan.FromSeconds(60);
    opt.KeepAliveInterval        = TimeSpan.FromSeconds(15);
});

// Motor de simulação — singleton para evitar recriação desnecessária
builder.Services.AddSingleton<ISimulationEngine, SimulationEngine>();

// CORS — permite o front-end React conectar via WebSocket
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>()
    ?? ["http://localhost:5173", "http://localhost:3000"];

builder.Services.AddCors(opt =>
    opt.AddPolicy("ReactApp", policy =>
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials())); // Obrigatório para SignalR WebSocket

// Health check
builder.Services.AddHealthChecks();

// ── APP ───────────────────────────────────────────────────────

var app = builder.Build();

app.UseCors("ReactApp");

if (app.Environment.IsDevelopment())
    app.UseDeveloperExceptionPage();

// Rota do hub SignalR
app.MapHub<SimulationHub>("/hubs/simulation");

// Health check endpoint
app.MapHealthChecks("/health");

// Info endpoint
app.MapGet("/", () => new
{
    name    = "ArchLab Simulation Hub",
    version = "1.0.0",
    hub     = "/hubs/simulation",
    status  = "running",
});

app.Run();
