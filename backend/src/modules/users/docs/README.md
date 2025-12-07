# Модуль Users (Пользователи)

## Назначение

Модуль отвечает за управление пользователями системы: создание, получение, обновление и удаление. Также предоставляет методы для поиска пользователей по email (используется в Auth модуле).

## Публичный API

### Endpoints

- `POST /users` - создание нового пользователя (регистрация, без авторизации)
- `GET /users` - получение списка всех пользователей (требует JWT)
- `GET /users/:id` - получение пользователя по ID (требует JWT)
- `PATCH /users/:id` - обновление пользователя (требует JWT)
- `DELETE /users/:id` - удаление пользователя (требует JWT)

### Экспортируемые сущности

- `UsersService` - сервис для работы с пользователями
- Типы: `AuthenticatedUser`, `UserWithoutPassword`, `UserWithPassword`

## Внутреннее устройство

### Структура модуля

```
users/
├── users.controller.ts      # HTTP endpoints
├── users.service.ts          # Бизнес-логика
├── users.module.ts           # Конфигурация модуля
├── dto/
│   ├── create-user.dto.ts    # DTO для создания пользователя
│   └── update-user.dto.ts    # DTO для обновления (PartialType от CreateUserDto)
└── types/
    └── user.types.ts         # Типы пользователей
```

### Основные компоненты

#### UsersService

- `create(createUserDto: CreateUserDto)` - создание пользователя с хэшированием пароля
- `findAll()` - получение всех пользователей (без паролей)
- `findOne(id: string)` - получение пользователя по ID (без пароля)
- `findByEmail(email: string)` - поиск пользователя по email (с паролем, для Auth)
- `update(id: string, updateUserDto: UpdateUserDto)` - обновление пользователя
- `remove(id: string)` - удаление пользователя

#### Типы пользователей

- `BaseUser` - базовый тип с общими полями (id, email, firstName, lastName, role)
- `UserWithTimestamps` - расширяет BaseUser, добавляет createdAt, updatedAt
- `AuthenticatedUser` - пользователь после аутентификации (BaseUser)
- `UserWithoutPassword` - пользователь без пароля для API (UserWithTimestamps)
- `UserWithPassword` - пользователь с паролем для внутреннего использования

### Валидация

- Email должен быть валидным и уникальным
- Пароль минимум 6 символов
- Роль: ADMIN, MANAGER, WORKER (по умолчанию WORKER)
- firstName и lastName опциональны

## Зависимости

### Внутренние

- `PrismaModule` - для работы с БД

### Внешние

- `bcrypt` - хэширование паролей (через password.util)
- `class-validator` - валидация DTO

## Точки интеграции

### Используется в:

- `AuthModule` - для поиска пользователей при аутентификации
- Все защищенные endpoints требуют JWT (кроме POST /users)

### Использует:

- `PrismaService` - для работы с БД
- `hashPassword()` - утилита для хэширования паролей

## Безопасность

- Пароли всегда хэшируются перед сохранением (bcrypt, 10 раундов)
- Пароли никогда не возвращаются в ответах API
- При обновлении пароль также хэшируется
- Email уникален в системе

## Известные ограничения и TODO

- [ ] Добавить проверку прав доступа (только ADMIN может удалять пользователей?)
- [ ] Добавить пагинацию для GET /users
- [ ] Добавить фильтрацию и сортировку
- [ ] Добавить валидацию email на уникальность перед созданием
