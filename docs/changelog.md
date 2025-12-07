# Changelog

Все значительные изменения в проекте документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/).

## [2025-12-07] - Создание модуля Workspaces

### Добавлено
- Модуль Workspaces с полным CRUD функционалом
- WorkspacesController с защищенными endpoints:
  - POST /workspaces - создание workspace
  - GET /workspaces - получение списка workspace пользователя
  - GET /workspaces/:id - получение workspace с пользователями
  - PATCH /workspaces/:id - обновление workspace
  - DELETE /workspaces/:id - удаление workspace
  - POST /workspaces/:id/users - добавление пользователя в workspace
  - DELETE /workspaces/:id/users/:userId - удаление пользователя из workspace
- WorkspacesService с бизнес-логикой:
  - Создание workspace с автоматическим добавлением создателя
  - Проверка прав доступа (ADMIN видит все, остальные - только свои)
  - Управление участниками workspace
- DTO для валидации:
  - CreateWorkspaceDto
  - UpdateWorkspaceDto
  - AddUserToWorkspaceDto
- Типы для Workspace (WorkspaceWithTimestamps, WorkspaceWithUsers)

### Изменено
- Обновлен AppModule для подключения WorkspacesModule
- Все endpoints Workspaces защищены JWT Guard

### Планируется
- Расширение функциональности Workspaces (сметы, ячейки и т.д.)
- AdminJS для управления пользователями
- Инициализация React frontend

## [2025-12-07] - Реализация JWT аутентификации и улучшение типизации

### Добавлено
- Модуль Auth с JWT аутентификацией
- AuthService с методами login и validateUser
- JwtStrategy для проверки токенов
- JwtAuthGuard для защиты endpoints
- Декоратор @CurrentUser для получения текущего пользователя
- Endpoint POST /auth/login
- Типы пользователей в модуле users (AuthenticatedUser, UserWithoutPassword, UserWithPassword)
- Базовая типизация с использованием наследования типов

### Изменено
- Все endpoints Users защищены JWT Guard (кроме POST /users для регистрации)
- Улучшена типизация: убраны все `any` и `as`, добавлена строгая типизация
- Типы пользователей вынесены в модуль users с использованием базовых типов
- Обновлена документация (tasktracker.md, changelog.md)

### Исправлено
- Проблема с JWT_SECRET при создании и проверке токенов (использован registerAsync)
- Добавлено логирование для отладки аутентификации

### Планируется
- Модуль Workspaces
- AdminJS для управления пользователями
- Инициализация React frontend

## [2025-12-07] - Добавление хэширования паролей

### Добавлено
- Утилита для хэширования паролей (password.util.ts)
- Интеграция bcrypt в UsersService
- Автоматическое хэширование паролей при создании и обновлении пользователей

### Изменено
- UsersService теперь хэширует пароли перед сохранением в БД
- Обновлена документация (tasktracker.md, changelog.md)

### Планируется
- Аутентификация (JWT)
- Модуль Workspaces
- AdminJS для управления пользователями
- Инициализация React frontend

## [2025-12-07] - Настройка Backend и создание модуля Users

### Добавлено
- NestJS проект инициализирован
- Prisma ORM настроен (v7 с PostgreSQL adapter)
- Базовая схема БД:
  - Модель User (пользователи)
  - Модель Workspace (проекты)
  - Модель WorkspaceUser (связь многие-ко-многим)
  - Enum Role (ADMIN, MANAGER, WORKER)
- Модуль Users:
  - UsersController (CRUD endpoints)
  - UsersService (бизнес-логика)
  - DTO для валидации (CreateUserDto, UpdateUserDto)
- PrismaService для работы с БД
- Глобальная валидация данных
- Docker Compose для PostgreSQL
- Prisma Studio для просмотра БД

### Изменено
- Обновлена документация проекта

### Планируется
- Хэширование паролей (bcrypt)
- Аутентификация (JWT)
- Модуль Workspaces
- AdminJS для управления пользователями
- Инициализация React frontend

## [2025-02-19] - Инициализация проекта

### Добавлено
- Базовая структура монорепозитория
- Git репозиторий
- Docker Compose конфигурация для PostgreSQL
- Документация проекта (project.md, changelog.md)
- README.md с описанием проекта


