# Архитектура проекта ATM

## Обзор

ATM (Application for Technical Management) - fullstack приложение для управления строительными проектами и сметами.

## Технологический стек

### Backend
- **NestJS** - прогрессивный Node.js фреймворк для построения эффективных и масштабируемых серверных приложений
- **PostgreSQL** - мощная реляционная база данных
- **Prisma** - современный ORM с типобезопасностью
- **Docker** - контейнеризация для изоляции окружения

### Frontend
- **React 18+** - библиотека для построения пользовательских интерфейсов
- **TypeScript** - типизированный JavaScript
- **Zustand** - легковесное решение для управления состоянием
- **TanStack Router** - типобезопасная маршрутизация
- **TanStack Query** - мощная библиотека для работы с серверным состоянием
- **TanStack Table** - гибкая библиотека для построения таблиц
- **ShadCN UI + Tailwind CSS** - современные UI компоненты

## Архитектура Backend

### Структура модулей

Backend использует модульную архитектуру NestJS:

```
backend/src/
├── modules/
│   ├── {moduleName}/
│   │   ├── {moduleName}.controller.ts  # HTTP endpoints
│   │   ├── {moduleName}.service.ts      # Бизнес-логика
│   │   ├── {moduleName}.module.ts      # Конфигурация модуля
│   │   ├── dto/                         # Data Transfer Objects
│   │   ├── types/                       # TypeScript типы
│   │   ├── guards/                      # Guards для защиты endpoints
│   │   ├── strategies/                  # Passport стратегии
│   │   ├── decorators/                  # Кастомные декораторы
│   │   └── docs/                        # Документация модуля
├── common/                               # Общие модули и утилиты
│   ├── prisma.module.ts                 # Глобальный Prisma модуль
│   ├── prisma.service.ts                # Сервис для работы с БД
│   └── utils/                            # Утилиты (password.util.ts)
└── main.ts                               # Точка входа
```

**Подробная документация модулей:** см. `docs/backend-modules.md`

### Основные модули

1. **Auth** ✅ - аутентификация и авторизация (JWT, refresh token, logout)
   - Документация: `backend/src/modules/auth/docs/README.md`
2. **Users** ✅ - управление пользователями (CRUD)
   - Документация: `backend/src/modules/users/docs/README.md`
3. **Workspaces** ✅ - управление рабочими пространствами (проектами)
   - Документация: `backend/src/modules/workspaces/docs/README.md`
4. **Estimates** ⏳ - управление сметами (планируется)
5. **Cells** ⏳ - управление ячейками таблиц смет (планируется)

**Обзор всех модулей:** `docs/backend-modules.md`

## Архитектура Frontend

### Feature-Sliced Design (FSD)

```
frontend/src/
├── app/           # Инициализация приложения, провайдеры
├── pages/         # Страницы приложения
├── widgets/        # Композитные блоки интерфейса
├── features/       # Бизнес-фичи (авторизация, редактирование и т.д.)
├── entities/       # Бизнес-сущности (User, Workspace, Estimate)
└── shared/         # Переиспользуемые компоненты и утилиты
```

### Правила зависимостей FSD

- `app/` → все слои
- `pages/` → `widgets/`, `features/`, `entities/`, `shared/`
- `widgets/` → `features/`, `entities/`, `shared/`
- `features/` → `entities/`, `shared/`
- `entities/` → `shared/`
- `shared/` → ничего

## Роли пользователей

1. **Admin** - полный доступ ко всем функциям
2. **Manager** - управление проектами и сметами
3. **Worker** - просмотр и редактирование данных в рамках назначенных проектов

## База данных

### Основные сущности

- **User** - пользователи системы
- **Workspace** - рабочие пространства (строительные проекты)
- **Estimate** - сметы
- **EstimateRow** - строки сметы
- **Cell** - ячейки таблицы смет
- **CellHistory** - история изменений ячеек

## API

Backend предоставляет REST API для взаимодействия с frontend.

### Базовый URL
```
http://localhost:3000
```

### Swagger документация
```
http://localhost:3000/api
```

Интерактивная документация API с возможностью тестирования endpoints прямо в браузере.

## Развертывание

### Локальная разработка

1. Запуск PostgreSQL:
   ```bash
   docker-compose up -d
   ```

2. Настройка backend:
   ```bash
   cd backend
   pnpm install
   pnpm exec prisma migrate dev
   pnpm run start:dev
   ```
   
   После запуска:
   - API: http://localhost:3000
   - Swagger: http://localhost:3000/api

3. Настройка frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## CI/CD

Планируется настройка CI/CD через GitHub Actions для автоматической сборки и тестирования.


