# ATM - Application for Technical Management

Fullstack приложение для управления строительными проектами и сметами.

## Технологический стек

### Backend
- **NestJS** - фреймворк для Node.js
- **PostgreSQL** - реляционная база данных
- **Prisma** - ORM для работы с БД
- **Docker** - контейнеризация

### Frontend
- **React** - UI библиотека
- **TypeScript** - типизация
- **Zustand** - управление состоянием
- **TanStack Router** - маршрутизация
- **TanStack Query** - работа с серверным состоянием
- **TanStack Table** - таблицы данных
- **ShadCN UI** - UI компоненты (Tailwind CSS)

## Структура проекта

```
ATM/
├── backend/          # NestJS приложение
├── frontend/         # React приложение (FSD архитектура)
├── docs/             # Документация проекта
└── docker-compose.yml # Docker конфигурация
```

## Быстрый старт

### Требования
- Node.js 18+
- pnpm (пакетный менеджер)
- Docker и Docker Compose
- WSL2 (для Windows)

### Установка

1. Клонировать репозиторий
2. Запустить PostgreSQL через Docker:
   ```bash
   docker-compose up -d
   ```
3. Установить зависимости backend:
   ```bash
   cd backend
   pnpm install
   ```
4. Настроить backend (см. backend/README.md)
5. Настроить frontend (см. frontend/README.md)

## Документация

### Общая документация
- [Архитектура проекта](./docs/project.md)
- [Обзор модулей Backend](./docs/backend-modules.md)
- [Changelog](./docs/changelog.md)
- [Task Tracker](./docs/tasktracker.md)

### Документация модулей
- [Auth Module](./backend/src/modules/auth/docs/README.md) - Аутентификация и авторизация
- [Users Module](./backend/src/modules/users/docs/README.md) - Управление пользователями
- [Workspaces Module](./backend/src/modules/workspaces/docs/README.md) - Рабочие пространства
- [Common Module](./backend/src/common/docs/README.md) - Общие модули и утилиты

## Разработка

Проект организован как монорепозиторий. Подробнее о процессе разработки см. в [документации](./docs/project.md).

