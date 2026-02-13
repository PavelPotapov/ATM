# Backend Rules — NestJS Expert

## Package Manager

Используй **pnpm**.

---

## Tech Stack

- NestJS 11+
- TypeScript 5.7+ (strict mode)
- Prisma 7 (ORM) + PostgreSQL 16
- JWT + Passport.js (авторизация)
- class-validator + class-transformer (валидация)
- bcrypt (хэширование паролей)
- Swagger/OpenAPI (документация API)

## API Configuration

- Префикс: `/api/v1`
- Swagger: `/api/v1`
- CORS: dev — localhost:5173, prod — все origins
- Global validation pipe с whitelist и transform

---

## Module Architecture & Dependency Injection

### Module Structure

```
backend/src/modules/{moduleName}/
  {moduleName}.module.ts
  {moduleName}.controller.ts
  {moduleName}.service.ts
  dto/
  types/
  guards/       (опционально)
  strategies/   (опционально)
  decorators/   (опционально)
  services/     (опционально, для дополнительных сервисов)
  docs/
    README.md
```

### Feature Module Pattern

```typescript
@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService], // Экспортируй SERVICE, не MODULE
})
export class FeatureModule {}
```

### Dependency Injection Rules

- Все сервисы декорируются `@Injectable()`
- Провайдеры указываются в `providers` модуля
- Для использования в других модулях — добавляй в `exports`
- **Экспортируй сервис, не модуль**: `exports: [FeatureService]`, НЕ `exports: [FeatureModule]`
- Инжектируй зависимости через конструктор

### Circular Dependencies

- Используй `forwardRef()` на ОБЕИХ сторонах зависимости
- Лучше: вынеси общую логику в третий модуль
- `forwardRef()` может маскировать архитектурные проблемы — рассматривай как временное решение

### Custom Injection Tokens

```typescript
export const CONFIG_OPTIONS = Symbol('CONFIG_OPTIONS');

@Module({
  providers: [{
    provide: CONFIG_OPTIONS,
    useValue: { apiUrl: 'https://api.example.com' },
  }],
})
```

### Dynamic Module Pattern

```typescript
@Module({})
export class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [{ provide: 'CONFIG_OPTIONS', useValue: options }],
    };
  }
}
```

---

## Controllers & Request Handling

### Правила

- Контроллеры — тонкие: делегируют логику сервисам
- Используй DTO для валидации входных данных
- Декораторы: `@Get()`, `@Post()`, `@Patch()`, `@Delete()` с путями
- Swagger-декораторы для документации эндпоинтов

### DTO

- Используй `class-validator` декораторы для валидации
- Используй `class-transformer` для трансформации
- Суффикс `.dto.ts`
- Каждый DTO — в отдельном файле или сгруппированы по entity

---

## Request Lifecycle (порядок выполнения)

```
Middleware → Guards → Interceptors (before) → Pipes → Route Handler → Interceptors (after) → Exception Filters
```

### Guards

- Возвращают `boolean` или бросают исключение
- Используй для авторизации и проверки прав
- `@UseGuards(JwtAuthGuard)` на контроллере или маршруте

### Interceptors

- Для трансформации ответов, логирования, кэширования
- Корректно обрабатывай async-операции

### Pipes

- Для валидации и трансформации входных данных
- Global validation pipe уже настроен с `whitelist` и `transform`

### Custom Decorator Pattern

```typescript
export const Auth = (...roles: Role[]) =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(...roles),
  );
```

---

## Authentication & Authorization (JWT + Passport.js)

### Текущая реализация проекта

- Access token (15 мин) + Refresh token (7 дней)
- Refresh token хранится в БД
- Strategy импортируется из `passport-jwt` (НЕ `passport-local`)
- `JwtModule.secret` должен совпадать с `JwtStrategy.secretOrKey`
- Authorization header: `Bearer <token>`

### Common Issues & Fixes

- **"Unknown authentication strategy 'jwt'"** — импортируй Strategy из `passport-jwt`
- **"secretOrPrivateKey must have a value"** — проверь `JWT_SECRET` в `.env`, убедись что `ConfigModule` загружается ДО `JwtModule`
- **401 Unauthorized** — проверь формат `Bearer [token]`, проверь expiration, декодируй на jwt.io

---

## Database Integration (Prisma)

### Правила

- Prisma Service инжектируется через `PrismaModule` (глобальный)
- Используй Prisma `select` для оптимизации запросов (возвращай только нужные поля)
- Soft delete через `deletedAt` поле
- Транзакции через `prisma.$transaction()`
- Миграции: `prisma migrate dev` для development, `prisma migrate deploy` для production

### Prisma Patterns

```typescript
// Инжекция в сервис
constructor(private readonly prisma: PrismaService) {}

// Select оптимизация
const user = await this.prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, firstName: true, lastName: true },
});

// Soft delete
await this.prisma.workspace.update({
  where: { id },
  data: { deletedAt: new Date() },
});

// Транзакция
await this.prisma.$transaction([
  this.prisma.cell.update({ where: { id: cellId }, data: { value } }),
  this.prisma.cellHistory.create({ data: { cellId, userId, oldValue, newValue: value } }),
]);
```

### Избегай

- N+1 запросов — используй `include` или `select` с вложенными relations
- Прямых SQL-запросов без необходимости — Prisma покрывает большинство кейсов
- `synchronize` в production (это TypeORM, но принцип тот же — только миграции)

---

## Error Handling & Logging

### NestJS Exceptions

Используй встроенные HTTP-исключения:

```typescript
throw new NotFoundException(`User with id ${id} not found`);
throw new BadRequestException('Invalid email format');
throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Insufficient permissions');
throw new ConflictException('Email already exists');
```

### Exception Filters

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Логирование

- Используй встроенный `Logger` NestJS
- Логируй с контекстом: `this.logger.error('message', stackTrace, 'ServiceName')`
- В production: структурированные логи (JSON)

---

## Testing Strategies

### Порядок валидации

typecheck → unit tests → integration tests → e2e tests

### Unit Tests (Jest)

```typescript
beforeEach(async () => {
  const module = await Test.createTestingModule({
    providers: [
      ServiceUnderTest,
      { provide: PrismaService, useValue: mockPrismaService },
      { provide: JwtService, useValue: mockJwtService },
    ],
  }).compile();

  service = module.get<ServiceUnderTest>(ServiceUnderTest);
});
```

### Правила тестирования

- Мокируй Prisma Service, JwtService и внешние зависимости
- Никаких реальных подключений к БД в unit-тестах
- Все async-операции должны быть await-ed
- Используй `@golevelup/ts-jest` для `createMock()` хелпера
- E2E тесты — через Supertest

---

## TypeScript в NestJS

NestJS использует классы (контроллеры, сервисы, модули, DTO, guards) — это исключение из правила «избегай классов».

### Общие TypeScript-правила

- Избегай `any`; создавай точные типы
- `readonly` для неизменяемых свойств
- Короткие функции с одной целью (менее 20 строк)
- Early returns вместо вложенных блоков
- Guard clauses для предусловий
- JSDoc для публичных методов

---

## Performance Optimization

### Database

- Используй Prisma `select` вместо полного `findUnique`/`findMany`
- Индексы на часто запрашиваемых полях (уже есть в schema.prisma)
- `$transaction` для атомарных операций
- Пагинация для списков (skip/take)

### Request Processing

- Compression middleware для production
- Rate limiting для публичных эндпоинтов
- Кэширование дорогих операций (Cache Manager)

### Memory

- Очищай event listeners в `onModuleDestroy()`
- Закрывай подключения к БД корректно
- Мониторь heap snapshots при подозрении на утечки

---

## Common Issues & Solutions

| Проблема | Причина | Решение |
|----------|---------|---------|
| "Can't resolve dependencies of [Service] (?)" | Провайдер не в `providers` модуля | Добавь сервис в `providers`, проверь `@Injectable()` |
| "Circular dependency detected" | Модули зависят друг от друга | `forwardRef()` на обеих сторонах или вынеси логику в третий модуль |
| "Unknown authentication strategy 'jwt'" | Неправильный импорт Strategy | Импортируй из `passport-jwt`, не `passport-local` |
| "secretOrPrivateKey must have a value" | JWT_SECRET не загружен | Проверь `.env`, `ConfigModule` должен загружаться до `JwtModule` |
| Connection error при старте | Ошибка в entity/schema | Проверь Prisma schema, запусти `prisma validate` |
| 401 на защищённых эндпоинтах | Неверный формат токена | Формат: `Authorization: Bearer <token>`, проверь expiration |
| "?" в ошибке DI | Отсутствует провайдер на позиции | Посчитай параметры конструктора, найди пропущенный |

---

## Code Review Checklist

### Module Architecture & DI
- [ ] Все сервисы имеют `@Injectable()`
- [ ] Провайдеры в `providers` модуля, экспортируемые — в `exports`
- [ ] Нет circular dependencies (или обоснованный `forwardRef()`)
- [ ] Модули разделены по domain/feature
- [ ] Custom providers используют Symbol tokens (не строки)

### Authentication & Security
- [ ] JWT Strategy импортирован из `passport-jwt`
- [ ] `JwtModule.secret` совпадает с `JwtStrategy.secretOrKey`
- [ ] Token expiration настроен корректно
- [ ] Пароли хэшируются через bcrypt, никогда не возвращаются в ответах
- [ ] JWT_SECRET в `.env`, не захардкожен

### Database (Prisma)
- [ ] Используется `select` для оптимизации запросов
- [ ] Нет N+1 проблем
- [ ] Soft delete через `deletedAt`
- [ ] Транзакции для связанных операций
- [ ] Миграции для всех изменений схемы

### Request Lifecycle
- [ ] Порядок: Middleware → Guards → Interceptors → Pipes → Handler
- [ ] Guards защищают маршруты и возвращают boolean / бросают исключение
- [ ] Exception filters обрабатывают ошибки
- [ ] DTO валидируют входные данные через class-validator

### Performance
- [ ] Кэширование для дорогих операций
- [ ] Connection pooling для БД
- [ ] Пагинация для списков
- [ ] Event listeners очищаются в `onModuleDestroy()`
