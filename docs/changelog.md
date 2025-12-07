# Changelog

Все значительные изменения в проекте документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/).

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

### Известные проблемы
- Пароли хранятся в открытом виде (требуется хэширование)

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


