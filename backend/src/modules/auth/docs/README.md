# Модуль Auth (Аутентификация)

## Назначение

Модуль отвечает за аутентификацию пользователей, генерацию и валидацию JWT токенов, а также управление сессиями через refresh token.

## Публичный API

### Endpoints

- `POST /auth/login` - вход в систему, получение access и refresh токенов
- `POST /auth/refresh` - обновление access token с помощью refresh token
- `POST /auth/logout` - выход из системы, удаление refresh token

### Экспортируемые сущности

- `AuthService` - сервис для аутентификации
- `JwtAuthGuard` - guard для защиты endpoints
- `@CurrentUser()` - декоратор для получения текущего пользователя
- `JwtStrategy` - стратегия Passport для проверки JWT токенов

## Внутреннее устройство

### Структура модуля

```
auth/
├── auth.controller.ts      # HTTP endpoints
├── auth.service.ts          # Бизнес-логика (login, refresh, logout, validateUser)
├── auth.module.ts           # Конфигурация модуля
├── dto/
│   ├── login.dto.ts         # DTO для входа
│   ├── refresh-token.dto.ts # DTO для обновления токена
│   └── auth-response.dto.ts  # DTO для ответов (Swagger)
├── guards/
│   └── jwt-auth.guard.ts    # Guard для защиты endpoints
├── strategies/
│   └── jwt.strategy.ts      # Passport стратегия для JWT
└── decorators/
    └── current-user.decorator.ts # Декоратор @CurrentUser()
```

### Основные компоненты

#### AuthService

- `login(loginDto: LoginDto)` - аутентификация, возвращает access_token (15м) и refresh_token (7д)
- `refresh(refreshToken: string)` - обновление access token
- `logout(userId: string)` - удаление refresh token из БД
- `validateUser(email, password)` - валидация пользователя по email и паролю

#### JwtAuthGuard

- Защищает endpoints, требуя валидный JWT токен
- Автоматически выбрасывает `UnauthorizedException` (401) при отсутствии/невалидном токене
- Логирует все попытки доступа

#### JwtStrategy

- Проверяет валидность JWT токена
- Извлекает payload из токена
- Проверяет существование пользователя в БД
- Возвращает данные пользователя для `@CurrentUser()`

### Типы

- `JwtPayload` - интерфейс для payload токена (sub, email, role)
- `AuthResponse` - ответ при успешном login (access_token, refresh_token, user)
- `RefreshResponse` - ответ при обновлении токена (access_token)

## Зависимости

### Внутренние

- `UsersModule` - для получения данных пользователей
- `PrismaModule` - для работы с БД (сохранение refresh token)

### Внешние

- `@nestjs/jwt` - работа с JWT токенами
- `@nestjs/passport` - интеграция Passport
- `passport-jwt` - стратегия для JWT
- `bcrypt` - хэширование паролей (через UsersService)

## Точки интеграции

### Используется в:

- Все защищенные endpoints (через `@UseGuards(JwtAuthGuard)`)
- Контроллеры для получения текущего пользователя (через `@CurrentUser()`)

### Использует:

- `UsersService.findByEmail()` - для поиска пользователя при login
- `PrismaService` - для сохранения/удаления refresh token

## Конфигурация

### Переменные окружения

- `JWT_SECRET` - секретный ключ для подписи токенов (обязательно)

### Настройки токенов

- Access token: 15 минут
- Refresh token: 7 дней
- Хранится в БД: refresh token сохраняется в поле `User.refreshToken`

## Безопасность

- Пароли никогда не возвращаются в ответах
- Refresh token проверяется в БД при обновлении
- При logout refresh token удаляется из БД
- Все ошибки возвращают правильные HTTP коды (401 Unauthorized)

## Известные ограничения и TODO

- [ ] Добавить rate limiting для login endpoint
- [ ] Добавить возможность отзыва всех токенов пользователя
- [ ] Добавить логирование подозрительной активности
- [ ] Рассмотреть использование refresh token rotation
