# ATM Frontend

Frontend часть приложения ATM (Application for Technical Management) для управления строительными проектами и сметами.

## Технологический стек

- **React 19** - библиотека для построения пользовательских интерфейсов
- **TypeScript** - типизированный JavaScript
- **Vite** - сборщик и dev-сервер
- **shadcn/ui** - UI компоненты на основе Radix UI (Vega стиль)
- **Tailwind CSS** - utility-first CSS фреймворк
- **TanStack Query** - работа с серверным состоянием (будет добавлено)
- **TanStack Router** - типобезопасная маршрутизация (будет добавлено)
- **react-hook-form** - работа с формами (будет добавлено)
- **Zustand** - управление локальным состоянием (будет добавлено)

## Структура проекта (FSD - Feature-Sliced Design)

```
frontend/src/
├── app/              # Инициализация приложения, провайдеры
│   └── App.tsx       # Корневой компонент
├── pages/            # Страницы приложения
├── widgets/          # Композитные блоки интерфейса
├── features/         # Бизнес-фичи (авторизация, редактирование и т.д.)
├── entities/         # Бизнес-сущности (User, Workspace, Estimate)
└── shared/           # Переиспользуемые компоненты и утилиты
    ├── ui/           # UI компоненты (shadcn/ui)
    ├── lib/          # Утилиты (cn, helpers)
    ├── hooks/        # Переиспользуемые хуки
    └── api/          # API клиент (будет добавлено)
```

## Правила зависимостей FSD

- `app/` → все слои
- `pages/` → `widgets/`, `features/`, `entities/`, `shared/`
- `widgets/` → `features/`, `entities/`, `shared/`
- `features/` → `entities/`, `shared/`
- `entities/` → `shared/`
- `shared/` → ничего

## Настройка shadcn/ui

Проект настроен для использования shadcn/ui компонентов. Все новые компоненты будут автоматически добавляться в `src/shared/ui/` благодаря настройкам в `components.json`.

### Добавление нового компонента

```bash
pnpm dlx shadcn@latest add button
```

Компонент будет добавлен в `src/shared/ui/button.tsx`

### Использование компонентов

```tsx
import { Button } from "@/shared/ui/button"

export function MyComponent() {
  return <Button>Click me</Button>
}
```

## Алиасы путей

Проект использует следующие алиасы:

- `@/*` → `src/*`
- `@/app/*` → `src/app/*`
- `@/pages/*` → `src/pages/*`
- `@/widgets/*` → `src/widgets/*`
- `@/features/*` → `src/features/*`
- `@/entities/*` → `src/entities/*`
- `@/shared/*` → `src/shared/*`

## Быстрый старт

### Установка зависимостей

```bash
pnpm install
```

### Запуск dev-сервера

```bash
pnpm dev
```

Приложение будет доступно по адресу `http://localhost:5173`

### Сборка для production

```bash
pnpm build
```

Собранные файлы будут в папке `dist/`

### Предпросмотр production сборки

```bash
pnpm preview
```

## Конфигурация

- `components.json` - настройки shadcn/ui (компоненты попадают в `shared/ui`)
- `vite.config.ts` - конфигурация Vite с алиасами FSD
- `tsconfig.json` - конфигурация TypeScript с алиасами FSD
- `tailwind.config.js` - конфигурация Tailwind CSS (настроена для shadcn/ui)
