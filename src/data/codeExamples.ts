export interface CodeExample {
  label: string
  language: string
  code: string
}

export const CODE_EXAMPLES: Record<string, CodeExample[]> = {
  monolithic: [
    {
      label: 'ASP.NET Core',
      language: 'csharp',
      code: `// Program.cs — Aplicação Monolítica com ASP.NET Core (.NET 8)
// Tudo em um único processo: API + Lógica + Banco de Dados

var builder = WebApplication.CreateBuilder(args);

// Todos os serviços registrados no mesmo container
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

// ──────────────────────────────────────────
// Controllers/OrderController.cs
[ApiController]
[Route("api/[controller]")]
public class OrderController(IOrderService orderService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        // Lógica de negócio chamada diretamente — sem rede, sem latência
        var order = await orderService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await orderService.GetByIdAsync(id);
        return order is null ? NotFound() : Ok(order);
    }
}

// ──────────────────────────────────────────
// Services/OrderService.cs
public class OrderService(AppDbContext db, IUserService users) : IOrderService
{
    public async Task<Order> CreateAsync(CreateOrderDto dto)
    {
        // Validação, criação e persistência no mesmo processo
        var user = await users.GetByIdAsync(dto.UserId)
            ?? throw new NotFoundException("Usuário não encontrado");

        var order = new Order
        {
            Id        = Guid.NewGuid(),
            UserId    = user.Id,
            Items     = dto.Items.Select(i => new OrderItem(i)).ToList(),
            CreatedAt = DateTime.UtcNow,
            Status    = OrderStatus.Pending,
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync();
        return order;
    }
}`,
    },
    {
      label: 'Estrutura de Pastas',
      language: 'bash',
      code: `# Estrutura típica de um monólito .NET bem organizado
MonolithApp/
├── Controllers/           # Endpoints HTTP
│   ├── OrderController.cs
│   ├── ProductController.cs
│   └── UserController.cs
├── Services/              # Lógica de negócio
│   ├── OrderService.cs
│   ├── ProductService.cs
│   └── UserService.cs
├── Models/                # Entidades e DTOs
│   ├── Order.cs
│   ├── Product.cs
│   └── DTOs/
├── Data/                  # Acesso a dados
│   ├── AppDbContext.cs
│   └── Migrations/
├── Middleware/            # Middlewares globais
└── Program.cs             # Entry point`,
    },
  ],

  mvc: [
    {
      label: 'ASP.NET Core MVC',
      language: 'csharp',
      code: `// MVC Pattern com ASP.NET Core — Model, View, Controller separados

// ── MODEL ──────────────────────────────────
// Models/Product.cs
public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    public int Stock { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ── CONTROLLER ─────────────────────────────
// Controllers/ProductController.cs
public class ProductController(
    IProductRepository repo,
    IMapper mapper) : Controller
{
    // GET /Product
    public async Task<IActionResult> Index()
    {
        var products = await repo.GetAllAsync();
        return View(mapper.Map<IEnumerable<ProductViewModel>>(products));
    }

    // GET /Product/Create
    public IActionResult Create() => View();

    // POST /Product/Create
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CreateProductViewModel vm)
    {
        if (!ModelState.IsValid) return View(vm);

        var product = mapper.Map<Product>(vm);
        await repo.AddAsync(product);

        TempData["Success"] = "Produto criado com sucesso!";
        return RedirectToAction(nameof(Index));
    }

    // POST /Product/Delete/5
    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        await repo.DeleteAsync(id);
        return RedirectToAction(nameof(Index));
    }
}

// ── VIEW ────────────────────────────────────
// Views/Product/Index.cshtml
@model IEnumerable<ProductViewModel>
@{
    ViewData["Title"] = "Produtos";
}

<h1>Produtos</h1>
<a asp-action="Create" class="btn btn-primary">Novo Produto</a>

<table class="table">
    @foreach (var p in Model)
    {
        <tr>
            <td>@p.Name</td>
            <td>@p.Price.ToString("C")</td>
            <td>@p.Stock</td>
            <td>
                <form asp-action="Delete" asp-route-id="@p.Id" method="post">
                    <button type="submit">Excluir</button>
                </form>
            </td>
        </tr>
    }
</table>`,
    },
    {
      label: 'Repository Pattern',
      language: 'csharp',
      code: `// Repository Pattern com MVC — separação de acesso a dados

// Interfaces/IProductRepository.cs
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(int id);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(int id);
}

// Data/ProductRepository.cs
public class ProductRepository(AppDbContext db) : IProductRepository
{
    public Task<IEnumerable<Product>> GetAllAsync() =>
        Task.FromResult<IEnumerable<Product>>(
            db.Products.OrderBy(p => p.Name));

    public async Task<Product?> GetByIdAsync(int id) =>
        await db.Products.FindAsync(id);

    public async Task AddAsync(Product product)
    {
        db.Products.Add(product);
        await db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        db.Products.Update(product);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is not null)
        {
            db.Products.Remove(product);
            await db.SaveChangesAsync();
        }
    }
}

// Program.cs — registro
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddAutoMapper(typeof(Program));`,
    },
  ],

  layered: [
    {
      label: 'Layered (.NET)',
      language: 'csharp',
      code: `// Arquitetura em Camadas — 4 projetos separados na solução

// ── CAMADA DE APRESENTAÇÃO (API) ───────────
// WebAPI/Controllers/OrderController.cs
[ApiController, Route("api/[controller]")]
public class OrderController(IOrderAppService orderService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest req)
    {
        var result = await orderService.CreateOrderAsync(req);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }
}

// ── CAMADA DE APLICAÇÃO ────────────────────
// Application/Services/OrderAppService.cs
public class OrderAppService(
    IOrderRepository orderRepo,
    IProductRepository productRepo,
    IUnitOfWork uow) : IOrderAppService
{
    public async Task<OrderDto> CreateOrderAsync(CreateOrderRequest req)
    {
        // Orquestra operações sem conter regras de negócio
        var product = await productRepo.GetByIdAsync(req.ProductId)
            ?? throw new NotFoundException("Produto não encontrado");

        var order = new Order(req.CustomerId, product, req.Quantity);
        await orderRepo.AddAsync(order);
        await uow.CommitAsync();

        return OrderDto.FromDomain(order);
    }
}

// ── CAMADA DE DOMÍNIO ──────────────────────
// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; private set; }
    public Guid CustomerId { get; private set; }
    public List<OrderItem> Items { get; private set; } = [];
    public decimal Total => Items.Sum(i => i.Subtotal);
    public OrderStatus Status { get; private set; }

    // Construtor com regras de negócio encapsuladas
    public Order(Guid customerId, Product product, int qty)
    {
        if (product.Stock < qty)
            throw new DomainException("Estoque insuficiente");

        Id = Guid.NewGuid();
        CustomerId = customerId;
        Items.Add(new OrderItem(product, qty));
        Status = OrderStatus.Pending;
    }

    public void Confirm() => Status = OrderStatus.Confirmed;
    public void Cancel() => Status = OrderStatus.Cancelled;
}

// ── CAMADA DE INFRAESTRUTURA ───────────────
// Infrastructure/Repositories/OrderRepository.cs
public class OrderRepository(AppDbContext db) : IOrderRepository
{
    public async Task<Order?> GetByIdAsync(Guid id) =>
        await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task AddAsync(Order order) =>
        await db.Orders.AddAsync(order);
}`,
    },
    {
      label: 'Estrutura da Solução',
      language: 'bash',
      code: `# Solução .NET com 4 projetos em camadas
LayeredApp.sln
├── src/
│   ├── LayeredApp.WebAPI/          # Camada de Apresentação
│   │   ├── Controllers/
│   │   ├── Middlewares/
│   │   └── Program.cs
│   │
│   ├── LayeredApp.Application/     # Camada de Aplicação
│   │   ├── Services/
│   │   ├── DTOs/
│   │   └── Interfaces/
│   │
│   ├── LayeredApp.Domain/          # Camada de Domínio (núcleo)
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Exceptions/
│   │   └── Interfaces/
│   │
│   └── LayeredApp.Infrastructure/  # Camada de Infraestrutura
│       ├── Persistence/
│       │   ├── AppDbContext.cs
│       │   └── Repositories/
│       └── DependencyInjection.cs
│
└── tests/
    ├── LayeredApp.Domain.Tests/
    └── LayeredApp.Application.Tests/

# Regra de dependência: cada camada só conhece a de baixo
# WebAPI → Application → Domain ← Infrastructure`,
    },
  ],

  clean: [
    {
      label: 'Clean Architecture',
      language: 'csharp',
      code: `// Clean Architecture — dependências sempre apontando para dentro
// Baseado em Uncle Bob + padrão usado em .NET Enterprise

// ── DOMÍNIO (núcleo — sem dependências externas) ──
// Domain/Entities/Order.cs
public sealed class Order : AggregateRoot<Guid>
{
    public CustomerId CustomerId { get; private set; }
    public Money Total { get; private set; }
    public OrderStatus Status { get; private set; }
    private readonly List<OrderItem> _items = [];
    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();

    private Order() { } // EF Core

    public static Result<Order> Create(CustomerId customerId, IEnumerable<OrderItem> items)
    {
        if (!items.Any())
            return Result.Failure<Order>(OrderErrors.EmptyItems);

        var order = new Order
        {
            Id = OrderId.New(),
            CustomerId = customerId,
            Status = OrderStatus.Draft,
        };
        order._items.AddRange(items);
        order.Total = Money.Sum(items.Select(i => i.Subtotal));
        order.RaiseDomainEvent(new OrderCreatedDomainEvent(order.Id));
        return Result.Success(order);
    }
}

// ── CASOS DE USO (Application) ────────────
// Application/Orders/CreateOrder/CreateOrderCommand.cs
public sealed record CreateOrderCommand(
    Guid CustomerId,
    List<OrderItemDto> Items) : ICommand<Guid>;

// Application/Orders/CreateOrder/CreateOrderCommandHandler.cs
internal sealed class CreateOrderCommandHandler(
    IOrderRepository orders,
    ICustomerRepository customers,
    IUnitOfWork uow) : ICommandHandler<CreateOrderCommand, Guid>
{
    public async Task<Result<Guid>> Handle(
        CreateOrderCommand cmd, CancellationToken ct)
    {
        var customer = await customers.GetByIdAsync(cmd.CustomerId, ct);
        if (customer is null)
            return Result.Failure<Guid>(CustomerErrors.NotFound);

        var items = cmd.Items.Select(i => OrderItem.Create(i.ProductId, i.Qty, i.Price));
        var orderResult = Order.Create(customer.Id, items);
        if (orderResult.IsFailure)
            return Result.Failure<Guid>(orderResult.Error);

        await orders.AddAsync(orderResult.Value, ct);
        await uow.SaveChangesAsync(ct);
        return Result.Success(orderResult.Value.Id.Value);
    }
}

// ── INTERFACES (contratos que infra implementa) ──
// Domain/Repositories/IOrderRepository.cs
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(OrderId id, CancellationToken ct);
    Task AddAsync(Order order, CancellationToken ct);
    Task UpdateAsync(Order order, CancellationToken ct);
}

// ── INFRAESTRUTURA (implementações externas) ──
// Infrastructure/Persistence/Repositories/OrderRepository.cs
internal sealed class OrderRepository(AppDbContext db) : IOrderRepository
{
    public async Task<Order?> GetByIdAsync(OrderId id, CancellationToken ct) =>
        await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task AddAsync(Order order, CancellationToken ct) =>
        await db.Orders.AddAsync(order, ct);

    public Task UpdateAsync(Order order, CancellationToken ct)
    {
        db.Orders.Update(order);
        return Task.CompletedTask;
    }
}`,
    },
    {
      label: 'CQRS com MediatR',
      language: 'csharp',
      code: `// CQRS dentro da Clean Architecture com MediatR

// ── QUERY ──────────────────────────────────
public sealed record GetOrderByIdQuery(Guid Id) : IQuery<OrderResponse>;

internal sealed class GetOrderByIdQueryHandler(IOrderReadRepository readRepo)
    : IQueryHandler<GetOrderByIdQuery, OrderResponse>
{
    public async Task<Result<OrderResponse>> Handle(
        GetOrderByIdQuery query, CancellationToken ct)
    {
        var order = await readRepo.GetProjectionAsync(query.Id, ct);
        return order is null
            ? Result.Failure<OrderResponse>(OrderErrors.NotFound)
            : Result.Success(order);
    }
}

// ── PIPELINE BEHAVIORS ─────────────────────
// Comportamentos transversais (cross-cutting concerns)
public sealed class ValidationBehavior<TReq, TRes>(
    IEnumerable<IValidator<TReq>> validators)
    : IPipelineBehavior<TReq, TRes>
    where TReq : IBaseCommand
{
    public async Task<TRes> Handle(
        TReq req, RequestHandlerDelegate<TRes> next, CancellationToken ct)
    {
        var ctx = new ValidationContext<TReq>(req);
        var failures = validators
            .Select(v => v.Validate(ctx))
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        if (failures.Count > 0)
            throw new ValidationException(failures);

        return await next();
    }
}

// ── ENDPOINT (Presentation) ─────────────────
app.MapPost("/api/orders", async (
    CreateOrderCommand cmd,
    ISender sender,
    CancellationToken ct) =>
{
    var result = await sender.Send(cmd, ct);
    return result.IsSuccess
        ? Results.Created(\`/api/orders/\${result.Value}\`, result.Value)
        : Results.Problem(result.Error.Description);
});`,
    },
  ],

  'event-driven': [
    {
      label: 'Producer (MassTransit)',
      language: 'csharp',
      code: `// Event-Driven Architecture com MassTransit + RabbitMQ (.NET 8)

// ── CONTRATOS DE EVENTOS (compartilhados) ──
// Contracts/Events/OrderPlacedEvent.cs
public sealed record OrderPlacedEvent(
    Guid OrderId,
    Guid CustomerId,
    decimal Amount,
    DateTimeOffset OccurredAt);

public sealed record PaymentProcessedEvent(
    Guid OrderId,
    bool Success,
    string? FailureReason,
    DateTimeOffset OccurredAt);

// ── PRODUTOR — Order Service ───────────────
// OrderService/Endpoints/PlaceOrderEndpoint.cs
app.MapPost("/orders", async (
    PlaceOrderRequest req,
    IPublishEndpoint bus,
    AppDbContext db) =>
{
    var order = Order.Create(req.CustomerId, req.Items);
    db.Orders.Add(order);
    await db.SaveChangesAsync();

    // Publica no broker — não conhece quem vai consumir
    await bus.Publish(new OrderPlacedEvent(
        OrderId: order.Id,
        CustomerId: order.CustomerId,
        Amount: order.Total,
        OccurredAt: DateTimeOffset.UtcNow));

    return Results.Accepted(\`/orders/\${order.Id}\`);
});

// ── CONSUMIDOR — Payment Service ───────────
// PaymentService/Consumers/OrderPlacedConsumer.cs
public sealed class OrderPlacedConsumer(
    IPaymentGateway gateway,
    IPublishEndpoint bus) : IConsumer<OrderPlacedEvent>
{
    public async Task Consume(ConsumeContext<OrderPlacedEvent> ctx)
    {
        var ev = ctx.Message;

        var result = await gateway.ChargeAsync(ev.CustomerId, ev.Amount);

        // Publica resultado — não conhece quem vai ouvir
        await bus.Publish(new PaymentProcessedEvent(
            OrderId: ev.OrderId,
            Success: result.IsSuccess,
            FailureReason: result.IsSuccess ? null : result.Error,
            OccurredAt: DateTimeOffset.UtcNow));
    }
}

// ── CONSUMIDOR — Notification Service ──────
// NotificationService/Consumers/PaymentProcessedConsumer.cs
public sealed class PaymentProcessedConsumer(
    IEmailService email,
    IOrderRepository orders) : IConsumer<PaymentProcessedEvent>
{
    public async Task Consume(ConsumeContext<PaymentProcessedEvent> ctx)
    {
        var ev = ctx.Message;
        var order = await orders.GetByIdAsync(ev.OrderId);

        var subject = ev.Success
            ? "Seu pedido foi confirmado!"
            : "Problema no pagamento";

        await email.SendAsync(order.CustomerEmail, subject, ev);
    }
}`,
    },
    {
      label: 'Configuração MassTransit',
      language: 'csharp',
      code: `// Program.cs — configuração completa MassTransit + RabbitMQ

builder.Services.AddMassTransit(x =>
{
    // Registra todos os consumers do assembly automaticamente
    x.AddConsumers(Assembly.GetExecutingAssembly());

    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:User"]);
            h.Password(builder.Configuration["RabbitMQ:Pass"]);
        });

        // Retry automático com backoff exponencial
        cfg.UseMessageRetry(r => r.Exponential(
            retryLimit: 5,
            minInterval: TimeSpan.FromSeconds(1),
            maxInterval: TimeSpan.FromSeconds(30),
            intervalDelta: TimeSpan.FromSeconds(2)));

        // Dead Letter Queue para mensagens com falha permanente
        cfg.UseDelayedRedelivery(r => r.Intervals(
            TimeSpan.FromMinutes(5),
            TimeSpan.FromMinutes(15),
            TimeSpan.FromHours(1)));

        cfg.ConfigureEndpoints(ctx);
    });
});

// Saga (Orquestrador de fluxos longos) — opcional
public class OrderStateMachine : MassTransitStateMachine<OrderState>
{
    public State Pending { get; private set; } = null!;
    public State Paid { get; private set; } = null!;
    public State Failed { get; private set; } = null!;

    public Event<OrderPlacedEvent> OrderPlaced { get; private set; } = null!;
    public Event<PaymentProcessedEvent> PaymentProcessed { get; private set; } = null!;

    public OrderStateMachine()
    {
        InstanceState(x => x.CurrentState);
        Event(() => OrderPlaced, x => x.CorrelateById(m => m.Message.OrderId));
        Event(() => PaymentProcessed, x => x.CorrelateById(m => m.Message.OrderId));

        Initially(
            When(OrderPlaced)
                .TransitionTo(Pending));

        During(Pending,
            When(PaymentProcessed, ctx => ctx.Message.Success)
                .TransitionTo(Paid),
            When(PaymentProcessed, ctx => !ctx.Message.Success)
                .TransitionTo(Failed));
    }
}`,
    },
  ],

  serverless: [
    {
      label: 'Azure Functions (.NET)',
      language: 'csharp',
      code: `// Serverless com Azure Functions (.NET 8 Isolated Worker)
// Cada função escala independentemente — custo por execução

// ── FUNCTION: HTTP Trigger ──────────────────
// Functions/CreateOrderFunction.cs
public class CreateOrderFunction(
    IOrderService orderService,
    ILogger<CreateOrderFunction> log)
{
    [Function("CreateOrder")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "orders")]
        HttpRequestData req)
    {
        log.LogInformation("CreateOrder triggered");

        var dto = await req.ReadFromJsonAsync<CreateOrderDto>();
        if (dto is null)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var order = await orderService.CreateAsync(dto);

        var response = req.CreateResponse(HttpStatusCode.Created);
        await response.WriteAsJsonAsync(order);
        return response;
    }
}

// ── FUNCTION: Queue Trigger ─────────────────
// Functions/ProcessPaymentFunction.cs
public class ProcessPaymentFunction(IPaymentGateway gateway)
{
    [Function("ProcessPayment")]
    [ServiceBusOutput("payment-results", Connection = "ServiceBus")]
    public async Task<PaymentResult> Run(
        [ServiceBusTrigger("orders-queue", Connection = "ServiceBus")]
        OrderCreatedMessage message)
    {
        // Processado quando mensagem chega na fila — sem servidor ativo esperando
        var result = await gateway.ChargeAsync(message.CustomerId, message.Amount);

        return new PaymentResult
        {
            OrderId = message.OrderId,
            Success = result.IsSuccess,
            ProcessedAt = DateTime.UtcNow,
        };
    }
}

// ── FUNCTION: Timer Trigger ─────────────────
// Functions/CleanupFunction.cs
public class CleanupFunction(IOrderRepository orders)
{
    // Executa automaticamente todo dia à meia-noite
    [Function("DailyCleanup")]
    public async Task Run(
        [TimerTrigger("0 0 0 * * *")] TimerInfo timer)
    {
        var cutoff = DateTime.UtcNow.AddDays(-30);
        await orders.DeleteAbandonedBeforeAsync(cutoff);
    }
}

// ── FUNCTION: Blob Trigger ──────────────────
// Functions/ProcessUploadFunction.cs
public class ProcessUploadFunction(IFileProcessor processor)
{
    [Function("ProcessUpload")]
    public async Task Run(
        [BlobTrigger("uploads/{name}", Connection = "Storage")]
        Stream blobStream, string name)
    {
        // Disparado automaticamente quando arquivo é enviado ao Blob Storage
        await processor.ProcessAsync(blobStream, name);
    }
}`,
    },
    {
      label: 'AWS Lambda (.NET)',
      language: 'csharp',
      code: `// Serverless com AWS Lambda + API Gateway (.NET 8)

// Function.cs — Handler principal
public class Function
{
    private readonly IServiceProvider _services;

    public Function()
    {
        // Container DI inicializado uma vez (warm instance)
        var services = new ServiceCollection();
        services.AddAWSService<IAmazonDynamoDB>();
        services.AddScoped<IOrderRepository, DynamoOrderRepository>();
        services.AddScoped<IOrderService, OrderService>();
        _services = services.BuildServiceProvider();
    }

    // Handler para API Gateway
    public async Task<APIGatewayProxyResponse> FunctionHandler(
        APIGatewayProxyRequest request,
        ILambdaContext context)
    {
        using var scope = _services.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<IOrderService>();

        var dto = JsonSerializer.Deserialize<CreateOrderDto>(request.Body)
            ?? throw new ArgumentNullException("Body inválido");

        var order = await service.CreateAsync(dto);

        return new APIGatewayProxyResponse
        {
            StatusCode = 201,
            Headers = new Dictionary<string, string>
            {
                { "Content-Type", "application/json" },
                { "Location", \`/orders/\${order.Id}\` },
            },
            Body = JsonSerializer.Serialize(order),
        };
    }
}

// serverless.yml — Deploy via Serverless Framework
/*
service: archlab-orders
provider:
  name: aws
  runtime: dotnet8
  region: us-east-1

functions:
  createOrder:
    handler: OrderLambda::Function::FunctionHandler
    events:
      - httpApi:
          path: /orders
          method: POST
    environment:
      TABLE_NAME: !Ref OrdersTable

resources:
  Resources:
    OrdersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: orders
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
*/`,
    },
  ],

  cqrs: [
    {
      label: 'CQRS + Event Sourcing',
      language: 'csharp',
      code: `// CQRS + Event Sourcing com Marten (.NET 8)
// Estado reconstruído a partir de um log imutável de eventos

// ── EVENTOS DE DOMÍNIO (imutáveis) ─────────
public sealed record OrderCreated(
    Guid OrderId, Guid CustomerId, decimal Amount, DateTimeOffset At);

public sealed record OrderConfirmed(
    Guid OrderId, string Reference, DateTimeOffset At);

public sealed record OrderCancelled(
    Guid OrderId, string Reason, DateTimeOffset At);

public sealed record PaymentFailed(
    Guid OrderId, string Error, DateTimeOffset At);

// ── AGGREGATE (reconstruído de eventos) ────
public class OrderAggregate
{
    public Guid Id { get; private set; }
    public OrderStatus Status { get; private set; }
    public decimal Amount { get; private set; }
    public List<string> History { get; } = [];

    // Marten chama Apply para cada evento ao rehydratar
    public void Apply(OrderCreated e)
    {
        Id = e.OrderId;
        Amount = e.Amount;
        Status = OrderStatus.Pending;
        History.Add(\`Criado em \${e.At:g}\`);
    }

    public void Apply(OrderConfirmed e)
    {
        Status = OrderStatus.Confirmed;
        History.Add(\`Confirmado [\${e.Reference}] em \${e.At:g}\`);
    }

    public void Apply(OrderCancelled e)
    {
        Status = OrderStatus.Cancelled;
        History.Add(\`Cancelado: \${e.Reason} em \${e.At:g}\`);
    }

    public void Apply(PaymentFailed e)
    {
        History.Add(\`Pagamento falhou: \${e.Error} em \${e.At:g}\`);
    }
}

// ── COMMAND HANDLER (escrita) ───────────────
public class PlaceOrderHandler(IDocumentSession session)
    : ICommandHandler<PlaceOrderCommand, Guid>
{
    public async Task<Guid> Handle(PlaceOrderCommand cmd, CancellationToken ct)
    {
        var orderId = Guid.NewGuid();

        // Appenda o evento — jamais sobrescreve estado
        session.Events.StartStream<OrderAggregate>(
            orderId,
            new OrderCreated(orderId, cmd.CustomerId, cmd.Amount, DateTimeOffset.UtcNow));

        await session.SaveChangesAsync(ct);
        return orderId;
    }
}

// ── QUERY HANDLER (leitura — projeção) ──────
// Read Model separado — otimizado para consulta
public class OrderSummary
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int EventCount { get; set; }
}

public class GetOrderSummaryHandler(IQuerySession session)
    : IQueryHandler<GetOrderSummaryQuery, OrderSummary?>
{
    public async Task<OrderSummary?> Handle(
        GetOrderSummaryQuery q, CancellationToken ct)
    {
        // Rehydrata o aggregate a partir do event store
        var aggregate = await session.Events.AggregateStreamAsync<OrderAggregate>(q.Id, token: ct);
        if (aggregate is null) return null;

        return new OrderSummary
        {
            Id = aggregate.Id,
            Status = aggregate.Status.ToString(),
            Amount = aggregate.Amount,
            EventCount = aggregate.History.Count,
        };
    }
}

// ── AUDITORIA COMPLETA ──────────────────────
// Buscar todos os eventos de um pedido (trilha imutável)
public async Task<IReadOnlyList<IEvent>> GetAuditTrail(Guid orderId)
{
    return await session.Events.FetchStreamAsync(orderId);
    // Retorna: OrderCreated → OrderConfirmed → etc.
    // Impossível apagar ou alterar — é o event sourcing
}`,
    },
    {
      label: 'Projeções com Marten',
      language: 'csharp',
      code: `// Projeções — mantêm read models atualizados automaticamente

// Projeção inline — atualizada sincronamente a cada evento
public class OrderSummaryProjection : SingleStreamProjection<OrderSummary>
{
    public OrderSummary Create(OrderCreated e) => new()
    {
        Id = e.OrderId,
        Status = "Pending",
        Amount = e.Amount,
        CreatedAt = e.At,
    };

    public void Apply(OrderConfirmed e, OrderSummary summary)
    {
        summary.Status = "Confirmed";
        summary.Reference = e.Reference;
    }

    public void Apply(OrderCancelled e, OrderSummary summary)
    {
        summary.Status = "Cancelled";
        summary.CancelReason = e.Reason;
    }
}

// Projeção global — agrega múltiplos streams (dashboard)
public class SalesReportProjection : MultiStreamProjection<SalesReport, string>
{
    public SalesReportProjection()
    {
        // Agrupa por data
        Identity<OrderCreated>(e => e.At.ToString("yyyy-MM"));
        Identity<OrderConfirmed>(e => e.At.ToString("yyyy-MM"));
    }

    public void Apply(OrderCreated e, SalesReport report)
    {
        report.Month = e.At.ToString("yyyy-MM");
        report.TotalOrders++;
        report.TotalRevenuePending += e.Amount;
    }

    public void Apply(OrderConfirmed e, SalesReport report)
    {
        report.TotalRevenuePending -= e.Amount; // move para confirmado
        report.TotalRevenueConfirmed += e.Amount;
    }
}

// Registro no Program.cs
builder.Services.AddMarten(opts =>
{
    opts.Connection(connectionString);
    opts.Projections.Add<OrderSummaryProjection>(ProjectionLifecycle.Inline);
    opts.Projections.Add<SalesReportProjection>(ProjectionLifecycle.Async);
}).UseLightweightSessions();`,
    },
  ],

  microservices: [
    {
      label: 'C# / .NET',
      language: 'csharp',
      code: `// OrderService.cs — Microsserviço de Pedidos (.NET 8)
using MassTransit;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<OrderDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Orders")));

builder.Services.AddMassTransit(x => {
    x.AddConsumer<PaymentResultConsumer>();
    x.UsingRabbitMq((ctx, cfg) => {
        cfg.Host("rabbitmq", "/", h => {
            h.Username("guest");
            h.Password("guest");
        });
        cfg.ConfigureEndpoints(ctx);
    });
});

var app = builder.Build();

app.MapPost("/orders", async (
    CreateOrderRequest req,
    OrderDbContext db,
    IPublishEndpoint bus) =>
{
    var order = new Order {
        Id = Guid.NewGuid(),
        CustomerId = req.CustomerId,
        Status = OrderStatus.Pending,
        CreatedAt = DateTime.UtcNow
    };
    db.Orders.Add(order);
    await db.SaveChangesAsync();

    await bus.Publish(new OrderCreatedEvent {
        OrderId = order.Id,
        CustomerId = order.CustomerId,
        TotalAmount = req.Items.Sum(i => i.Price)
    });

    return Results.Created(\`/orders/\${order.Id}\`, order);
});`,
    },
    {
      label: 'Docker Compose',
      language: 'yaml',
      code: `# docker-compose.yml — Stack completa de Microsserviços
version: '3.9'

services:
  api-gateway:
    image: nginx:alpine
    ports: ["80:80"]
    depends_on: [order-svc, payment-svc]

  order-svc:
    build: ./OrderService
    environment:
      - ConnectionStrings__Orders=Host=db-orders
      - RabbitMQ__Host=rabbitmq
    depends_on: [db-orders, rabbitmq]

  payment-svc:
    build: ./PaymentService
    environment:
      - RabbitMQ__Host=rabbitmq

  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]

  db-orders:
    image: postgres:16
    environment:
      POSTGRES_DB: orders
      POSTGRES_PASSWORD: secret

  db-payments:
    image: postgres:16
    environment:
      POSTGRES_DB: payments
      POSTGRES_PASSWORD: secret`,
    },
  ],
}
