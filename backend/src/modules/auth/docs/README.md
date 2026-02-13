# Auth Module (Backend)

Модуль аутентификации и авторизации. Управляет JWT-токенами, сессиями пользователей и ролевыми разрешениями.

## Контракт модуля

### Назначение

Обеспечивает полный цикл аутентификации: вход, выход, обновление токенов и проверку разрешений. Access token передаётся в заголовке `Authorization: Bearer <token>`, refresh token — в httpOnly cookie.

### Public API

| Эндпоинт | Метод | Guard | Описание |
|----------|-------|-------|----------|
| `/auth/login` | POST | — | Вход: принимает `{email, password}`, возвращает `{access_token, user}`. Refresh token ставится в httpOnly cookie. |
| `/auth/refresh` | POST | — | Обновление access token. Refresh token читается из cookie. Возвращает `{access_token}`. |
| `/auth/logout` | POST | JwtAuthGuard | Выход: удаляет refresh token из БД и очищает cookie. |
| `/auth/me` | GET | JwtAuthGuard | Возвращает данные текущего пользователя. |
| `/auth/permissions` | GET | JwtAuthGuard | Возвращает список разрешений текущего пользователя по его роли. |

### Экспортируемые сущности

- `AuthService` — сервис аутентификации
- `PermissionsService` — маппинг роль → разрешения
- `JwtAuthGuard` — guard для защиты endpoints
- `@CurrentUser()` — декоратор для получения пользователя из Request
- `JwtStrategy` — Passport стратегия для JWT

### Функциональные возможности

- **JWT авторизация**: access token (15 мин) + refresh token (7 дней, httpOnly cookie)
- **Ролевая модель**: ADMIN, MANAGER, WORKER с определёнными наборами разрешений
- **Автоматический refresh**: фронтенд при получении 401 автоматически запрашивает новый access token
- **Безопасное хранение**: refresh token в httpOnly cookie (недоступен из JS), пароли хэшируются bcrypt

### Использование

```typescript
// Защита эндпоинта
@UseGuards(JwtAuthGuard)
@Get('protected')
handler(@CurrentUser() user: AuthenticatedUser) { ... }

// Проверка разрешений
const canCreate = permissionsService.hasPermission(user.role, 'workspaces.create');
```

### Внутренняя структура

```
auth/
├── auth.module.ts              # DI: импорт UsersModule, JwtModule, PassportModule
├── auth.controller.ts          # Эндпоинты + cookie-логика
├── auth.service.ts             # Бизнес-логика: login, refresh, logout, validateUser
├── guards/
│   └── jwt-auth.guard.ts       # JwtAuthGuard — защита маршрутов
├── strategies/
│   └── jwt.strategy.ts         # Passport JWT Strategy — верификация токена
├── decorators/
│   └── current-user.decorator.ts  # @CurrentUser() — извлекает user из Request
├── services/
│   └── permissions.service.ts  # Маппинг роль → разрешения
├── dto/
│   ├── login.dto.ts            # { email, password }
│   ├── refresh-token.dto.ts    # Legacy (не используется после cookie-миграции)
│   └── auth-response.dto.ts    # Swagger-описание ответов
├── types/
│   └── permissions.types.ts    # Permission, PermissionsList
└── docs/
    └── README.md
```

### Зависимости

- **Зависит от**: `UsersModule`, `PrismaModule`, `@nestjs/jwt`, `passport-jwt`, `cookie-parser`
- **Зависят от него**: все защищённые модули (через `JwtAuthGuard`)

### Cookie-параметры refresh token

| Параметр | Значение | Описание |
|----------|----------|----------|
| httpOnly | true | Недоступен из JavaScript |
| secure | true (prod) | Только HTTPS |
| sameSite | lax | Защита от CSRF |
| path | /api/v1/auth | Отправляется только на auth-эндпоинты |
| maxAge | 7 дней | Время жизни cookie |

### Типы

- `JwtPayload` — payload токена: `{sub, email, role}`
- `AuthResponse` — ответ login: `{access_token, user}` (без refresh_token)
- `LoginResult` — внутренний тип: `{access_token, refresh_token, user}` (для контроллера)
- `RefreshResponse` — ответ refresh: `{access_token}`
- `AuthenticatedUser` — данные пользователя: `{id, email, firstName, lastName, role}`

### Ограничения и TODO

- [ ] Rate limiting на `/auth/login`
- [ ] Token blacklist для немедленного отзыва (сейчас access token живёт до expiration)
- [ ] Refresh token rotation (выпуск нового refresh token при каждом refresh)
- [ ] Логирование подозрительной активности
