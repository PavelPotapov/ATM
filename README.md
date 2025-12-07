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

- [Архитектура проекта](./docs/project.md)
- [Changelog](./docs/changelog.md)
- [Task Tracker](./docs/tasktracker.md)

## Разработка

Проект организован как монорепозиторий. Подробнее о процессе разработки см. в [документации](./docs/project.md).

