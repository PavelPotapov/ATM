# Документация модулей Backend

Обзор всех модулей NestJS приложения для быстрого понимания архитектуры.

## Общая структура

```
backend/src/
├── modules/          # Бизнес-модули
│   ├── auth/        # Аутентификация и авторизация
│   ├── users/       # Управление пользователями
│   └── workspaces/  # Рабочие пространства
├── common/          # Общие модули и утилиты
│   ├── prisma.module.ts
│   ├── prisma.service.ts
│   └── utils/
│       └── password.util.ts
└── main.ts          # Точка входа
```

## Модули

### 1. Auth Module
**Путь:** `backend/src/modules/auth/`  
**Документация:** `backend/src/modules/auth/docs/README.md`

**Назначение:** Аутентификация, JWT токены, refresh token, logout

**Endpoints:**
- `POST /auth/login` - вход, получение токенов
- `POST /auth/refresh` - обновление access token
- `POST /auth/logout` - выход из системы

**Ключевые компоненты:**
- `AuthService` - бизнес-логика аутентификации
- `JwtAuthGuard` - защита endpoints
- `JwtStrategy` - проверка JWT токенов
- `@CurrentUser()` - декоратор для получения текущего пользователя

**Зависимости:**
- `UsersModule` - для поиска пользователей
- `PrismaModule` - для сохранения refresh token

---

### 2. Users Module
**Путь:** `backend/src/modules/users/`  
**Документация:** `backend/src/modules/users/docs/README.md`

**Назначение:** Управление пользователями (CRUD)

**Endpoints:**
- `POST /users` - создание (регистрация, без авторизации)
- `GET /users` - список всех пользователей (JWT)
- `GET /users/:id` - получение по ID (JWT)
- `PATCH /users/:id` - обновление (JWT)
- `DELETE /users/:id` - удаление (JWT)

**Ключевые компоненты:**
- `UsersService` - бизнес-логика работы с пользователями
- Типы: `AuthenticatedUser`, `UserWithoutPassword`, `UserWithPassword`

**Особенности:**
- Пароли всегда хэшируются (bcrypt)
- Пароли никогда не возвращаются в API
- Email уникален

**Зависимости:**
- `PrismaModule` - для работы с БД

---

### 3. Workspaces Module
**Путь:** `backend/src/modules/workspaces/`  
**Документация:** `backend/src/modules/workspaces/docs/README.md`

**Назначение:** Управление рабочими пространствами (строительными проектами)

**Endpoints:**
- `POST /workspaces` - создание (JWT)
- `GET /workspaces` - список workspace пользователя (JWT)
- `GET /workspaces/:id` - получение с пользователями (JWT)
- `PATCH /workspaces/:id` - обновление (JWT)
- `DELETE /workspaces/:id` - удаление (JWT)
- `POST /workspaces/:id/users` - добавление пользователя (JWT)
- `DELETE /workspaces/:id/users/:userId` - удаление пользователя (JWT)

**Ключевые компоненты:**
- `WorkspacesService` - бизнес-логика работы с workspace
- Проверка прав доступа: ADMIN видит все, остальные - только свои

**Особенности:**
- Создатель автоматически добавляется как участник
- Связь многие-ко-многим с пользователями через WorkspaceUser
- Проверка доступа при всех операциях

**Зависимости:**
- `PrismaModule` - для работы с БД
- `AuthModule` - для получения текущего пользователя

---

## Common модули

### PrismaModule
**Путь:** `backend/src/common/`  
**Документация:** `backend/src/common/docs/README.md`

**Назначение:** Глобальный модуль для работы с БД

**Компоненты:**
- `PrismaService` - сервис для работы с Prisma Client
- Автоматическое подключение/отключение при старте/остановке

**Использование:**
- Доступен во всех модулях без явного импорта (глобальный модуль)

### Утилиты

#### password.util.ts
**Назначение:** Хэширование и проверка паролей

**Функции:**
- `hashPassword(password)` - хэширование (bcrypt, 10 раундов)
- `comparePassword(password, hash)` - сравнение пароля с хэшем

---

## Схема базы данных

### Модели
- **User** - пользователи (id, email, password, firstName, lastName, role, refreshToken)
- **Workspace** - рабочие пространства (id, name, description)
- **WorkspaceUser** - связь многие-ко-многим (userId, workspaceId)

### Enum
- **Role** - ADMIN, MANAGER, WORKER

---

## Безопасность

### Аутентификация
- JWT токены (access: 15м, refresh: 7д)
- Refresh token хранится в БД
- При logout refresh token удаляется

### Авторизация
- Все endpoints (кроме POST /users и POST /auth/login) требуют JWT
- Проверка прав доступа в WorkspacesService
- ADMIN имеет полный доступ

### Хэширование
- Пароли хэшируются bcrypt (10 раундов)
- Пароли никогда не возвращаются в API

---

## Конфигурация

### Переменные окружения (.env)
- `DATABASE_URL` - строка подключения к PostgreSQL
- `JWT_SECRET` - секретный ключ для JWT токенов
- `PORT` - порт приложения (по умолчанию 3000)

### Swagger
- Доступен по адресу: `http://localhost:3000/api`
- JWT авторизация настроена
- Все endpoints документированы

---

## Зависимости между модулями

```
AppModule
├── PrismaModule (глобальный)
├── UsersModule
│   └── использует PrismaModule
├── AuthModule
│   ├── использует UsersModule
│   └── использует PrismaModule
└── WorkspacesModule
    ├── использует PrismaModule
    └── использует AuthModule (через @CurrentUser())
```

---

## Быстрый старт для новых разработчиков

1. **Изучить схему БД:** `backend/prisma/schema.prisma`
2. **Понять аутентификацию:** `backend/src/modules/auth/docs/README.md`
3. **Изучить типы:** `backend/src/modules/users/types/user.types.ts`
4. **Посмотреть примеры API:** `backend/src/modules/workspaces/docs/api-examples.md`
5. **Протестировать в Swagger:** `http://localhost:3000/api`

---

## Расширяемость

Модули спроектированы для легкого расширения:
- Workspaces можно расширить сметами, ячейками, историей
- Auth можно добавить роли, права доступа
- Users можно добавить профили, настройки

Каждый модуль имеет свою папку `docs/README.md` с подробной документацией.

