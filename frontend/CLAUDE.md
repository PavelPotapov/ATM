# Frontend Rules

## Package Manager

Используй **pnpm**.

---

## Architecture: Feature-Sliced Design (FSD)

### Layers

```
app/        — инициализация приложения, провайдеры, роутер
pages/      — полноценные страницы
widgets/    — составные UI-компоненты
features/   — бизнес-фичи
entities/   — бизнес-сущности
shared/     — переиспользуемые утилиты и компоненты
```

### Dependency Rules (строго!)

```
app/      → все слои
pages/    → widgets, features, entities, shared
widgets/  → features, entities, shared
features/ → entities, shared
entities/ → shared
shared/   → ничего (только внешние библиотеки)
```

Импорт вверх по иерархии **запрещён**. Например, `entities/` не может импортировать из `features/`.

### Slice Structure

Каждый slice в widgets/, features/, entities/ должен содержать:

```
sliceName/
  ui/           — React-компоненты
  model/        — типы, интерфейсы, стор (опционально)
  lib/          — утилиты и хелперы (опционально)
  api/          — запросы к API (опционально)
  config/       — конфигурация (опционально)
  index.ts      — публичный API слайса
```

### Public API

- Импортируй **только через index.ts** файлы слайсов
- Никогда не импортируй напрямую из внутренних файлов слайса

### Import Aliases

Используй алиасы вместо относительных путей:
- `@/app`, `@/pages`, `@/widgets`, `@/features`, `@/entities`, `@/shared`

## Naming Conventions

### Components
- **PascalCase** для компонентов: `EstimateTable`, `LoginForm`
- Префикс `use` для хуков: `useWorkspaces`, `useCreateEstimate`

### Files
- **camelCase** для составных имён: `axiosClient.ts`, `jwtTokenStorage.ts`
- Однословные файлы в camelCase: `utils.ts`
- Суффиксы (опционально, когда контекст неясен): `.config.ts`, `.dto.ts`, `.d.ts`

## Types

- Типы доменных сущностей — в `entities/{entity}/model/`
- Общие типы — в `shared/`
- Избегай дублирования типов

## Code Principles

- TypeScript strict mode
- Разделяй бизнес-логику и представление
- Компоненты должны быть "тонкими" (минимум логики в JSX)

---

## API Layer Rules (TanStack Query)

### Tech Stack

- Axios client: `shared/api/axiosClient.ts`
- TanStack Query для серверного состояния и кэширования
- Query Key Factory (`@lukemorales/query-key-factory`)

### Structure

```
shared/api/
├── axiosClient.ts           # Базовый axios-клиент
├── queryClient.ts           # TanStack Query клиент
└── endpoints.config.ts      # Все API-эндпоинты

entities/{entityName}/
├── api/
│   ├── dto/                 # TypeScript DTO-типы
│   ├── queries/             # Функции запросов (getWorkspaces.ts, getWorkspaceById.ts)
│   ├── hooks/               # React-хуки (useWorkspaces.ts, useCreateWorkspace.ts)
│   ├── queryKeys.ts         # Query Key Factory
│   └── index.ts             # Публичный API
```

### QueryClient Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 минут
      gcTime: 30 * 60 * 1000,     // 30 минут
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

- Всегда подключай `ReactQueryDevtools` в development-режиме

### Endpoint Constants

Все эндпоинты централизованы в `shared/api/endpoints.config.ts`:
- Используй `as const` для type safety
- Используй функции для динамических путей: `BY_ID: (id: string) => \`/workspaces/${id}\``

### Queries Pattern

- Файлы в `api/queries/`
- Именование: глагол + сущность: `getWorkspaces`, `createWorkspace`
- Импорт из `shared/api/axiosClient`
- Используй константы из `API_ENDPOINTS`
- Типизируй ответы дженериками: `apiClient.get<Type>()`
- Один файл = одна функция
- Добавляй JSDoc-комментарии

### Hooks Pattern

- Файлы в `api/hooks/`
- `useQuery` для GET-запросов
- `useMutation` для POST/PUT/DELETE
- Всегда используй query keys из `queryKeys.ts`
- Используй `onSuccess` / `onSettled` для инвалидации кэша
- Именование: `use` + глагол + сущность: `useWorkspaces`, `useCreateWorkspace`
- Один файл = один хук

### Optimistic Updates (для мутаций)

```typescript
const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateItem,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: itemsKeys.list.queryKey });
      const previous = queryClient.getQueryData(itemsKeys.list.queryKey);
      queryClient.setQueryData(itemsKeys.list.queryKey, (old) => /* optimistic update */);
      return { previous };
    },
    onError: (_err, _newData, context) => {
      queryClient.setQueryData(itemsKeys.list.queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.list.queryKey });
    },
  });
};
```

### Query Key Factory (`@lukemorales/query-key-factory`)

```typescript
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workspacesKeys = createQueryKeys('workspaces', {
  list: null,
  detail: (id: string) => [id],
});
```

- Создавай `queryKeys.ts` в каждом модуле `api/`
- Используй `.queryKey` в useQuery/useMutation
- Единый источник правды для ключей кэша
- Иерархическая организация: `entity → action → params`

### Dependent Queries

```typescript
const { data: user } = useQuery({ queryKey: userKeys.detail(id).queryKey, queryFn: getUser });
const { data: posts } = useQuery({
  queryKey: postsKeys.list.queryKey,
  queryFn: () => getPostsByUser(user!.id),
  enabled: !!user, // Запрос выполнится только когда user загружен
});
```

### Data Selection (оптимизация ре-рендеров)

```typescript
const { data: userName } = useQuery({
  queryKey: userKeys.detail(id).queryKey,
  queryFn: getUser,
  select: (data) => data.name, // Компонент ре-рендерится только при изменении name
});
```

### Anti-Patterns (избегать!)

- НЕ используй `useEffect` для загрузки данных — используй `useQuery`
- НЕ храни серверное состояние в `useState` — это работа TanStack Query
- НЕ пропускай обработку `isLoading` / `isError` состояний
- НЕ создавай избыточно специфичные query keys
- НЕ забывай инвалидировать кэш после мутаций

### Token Management

- `accessToken` в localStorage (через `shared/lib/storage/token-storage.ts`)
- Утилиты: `getAccessToken()`, `setAccessToken(token)`, `removeAccessToken()`, `hasAccessToken()`
- Axios-клиент автоматически обрабатывает 401 с refresh token
- При неудачном refresh — редирект на login

### Module Public API Example

```typescript
export type { Workspace } from './queries/getWorkspaces';
export { workspacesKeys } from './queryKeys';
export { getWorkspaces, getWorkspaceById } from './queries/getWorkspaces';
export { useWorkspaces } from './hooks/useWorkspaces';
export { useWorkspace } from './hooks/useWorkspace';
export { useCreateWorkspace } from './hooks/useCreateWorkspace';
```

---

## Zustand State Management

### Когда использовать

- Клиентское состояние, НЕ связанное с сервером (серверное состояние → TanStack Query)
- UI-состояние, которое шарится между несвязанными компонентами
- Состояние форм/фильтров, которое нужно персистить
- Любое глобальное клиентское состояние

### Структура store-модуля

```
entities/{entityName}/model/   или   shared/stores/{storeName}/
├── types.ts            # Типы state и actions (отдельно!)
├── {storeName}Store.ts # Создание стора
├── selectors.ts        # Селекторы (чистые функции)
├── hooks.ts            # React-хуки (публичный API для компонентов)
└── index.ts            # Реэкспорт public API
```

### Types — разделение state и actions

```typescript
// types.ts
interface CartState {
  items: CartItem[];
  wishlist: Book[];
}

interface CartActions {
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

export interface CartStore extends CartState {
  actions: CartActions;  // Actions ВСЕГДА вложены в объект `actions`
}
```

**Ключевое правило:** actions группируются в объект `actions`, а не лежат рядом со state. Это даёт стабильную ссылку — компоненты, использующие только actions, не ре-рендерятся при изменении state.

### Store — создание с middleware

Порядок middleware: `devtools(persist(immer(...)))`.

```typescript
// cartStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartStore } from './types';

const devToolsOptions = {
  store: 'cart-storage',
  name: 'CartStore',
  enabled: import.meta.env.DEV,
};

const persistOptions = {
  name: 'cart-storage',
  partialize: (state: CartStore) => {
    const { actions: _, ...rest } = state;
    return rest;  // Никогда не персистим actions
  },
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        wishlist: [],

        actions: {
          addToCart: (book) => {
            set((state) => {
              state.items.push({ book, quantity: 1 });
            }, false, 'addToCart');
          },

          removeFromCart: (bookId) => {
            set((state) => {
              const index = state.items.findIndex((item) => item.book.id === bookId);
              if (index !== -1) state.items.splice(index, 1);
            }, false, 'removeFromCart');
          },

          clearCart: () => {
            set((state) => { state.items = []; }, false, 'clearCart');
          },
        },
      })),
      persistOptions,
    ),
    devToolsOptions,
  ),
);
```

### Immer — правила мутаций

```typescript
// ПРАВИЛЬНО: мутируем draft напрямую
set((state) => {
  state.count += 1;
  state.items.push(newItem);
  state.nested.property = 'value';
});

// НЕПРАВИЛЬНО: не возвращай новый объект при использовании immer
set((state) => ({ ...state, count: state.count + 1 }));
```

### Selectors — чистые функции

```typescript
// selectors.ts
import type { CartStore } from './types';

export const cartActionsSelector = (state: CartStore) => state.actions;
export const cartItemsSelector = (state: CartStore) => state.items;

// Вычисляемые селекторы
export const cartTotalPriceSelector = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.book.price * item.quantity, 0);

// Параметризованные селекторы (каррирование)
export const isInCartSelector = (bookId: number) => (state: CartStore) =>
  state.items.some((item) => item.book.id === bookId);
```

### Hooks — публичный API для компонентов

```typescript
// hooks.ts
import { useCartStore } from './cartStore';
import { cartActionsSelector, cartItemsSelector, cartTotalPriceSelector, isInCartSelector } from './selectors';
import type { CartStore } from './types';

export const useCartActions = (): CartStore['actions'] => useCartStore(cartActionsSelector);
export const useCartItems = (): CartStore['items'] => useCartStore(cartItemsSelector);
export const useCartTotalPrice = (): number => useCartStore(cartTotalPriceSelector);
export const useIsInCart = (bookId: number): boolean => useCartStore(isInCartSelector(bookId));
```

**Компоненты импортируют ТОЛЬКО хуки из `hooks.ts`, никогда напрямую store.**

### useShallow — для объектных селекторов

```typescript
import { useShallow } from 'zustand/shallow';

// Если селектор возвращает новый объект — оберни в useShallow
export const useAllFilters = () => useFiltersStore(useShallow(allFiltersSelector));
```

### Persist — конфигурация

```typescript
const persistOptions = {
  name: 'storage-key',              // Ключ в localStorage
  version: 1,                       // Для миграций
  storage: sessionStorage,          // По умолчанию localStorage
  partialize: (state: MyStore) => {
    const { actions: _, ...rest } = state;
    return rest;                    // Всегда исключай actions
  },
};
```

### DevTools — именование actions

Каждый `set()` вызов должен иметь label для Redux DevTools:

```typescript
// Строка
set((state) => { state.value = 1; }, false, 'setValue');

// Объект с payload
set((state) => { state.items.push(item); }, false, { type: 'addItem', payload: item });
```

### Context-based Store (для сторов с начальными пропсами)

Используй `createStore()` + React Context, когда нужны разные инстансы с разными начальными данными:

```typescript
import { createStore } from 'zustand';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

const SettingsContext = createContext<ReturnType<typeof createSettingsStore> | null>(null);

export const SettingsProvider = ({ children, ...initialState }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createSettingsStore(initialState);
  }
  return <SettingsContext value={storeRef.current}>{children}</SettingsContext>;
};

export function useSettingsStore<T>(selector: (state: SettingsStore) => T): T {
  const store = useContext(SettingsContext);
  if (!store) throw new Error('useSettingsStore must be used within SettingsProvider');
  return useStore(store, selector);
}
```

### Чеклист при создании стора

1. Типы state и actions разделены; actions вложены в объект `actions`
2. Middleware: `devtools(persist(immer(...)))` (persist опционален)
3. Actions определены внутри `actions`, не рядом со state
4. Мутации через immer (мутируем draft, не возвращаем новый объект)
5. `partialize` исключает `actions` из persist
6. DevTools label на каждый `set()`
7. Селекторы — отдельный файл, чистые функции
8. Хуки — отдельный файл, единственный способ доступа из компонентов
9. `useShallow` для селекторов, возвращающих объекты

---

## TanStack Table (v8)

### Versions

- `@tanstack/react-table@8.21.3`
- `@tanstack/react-virtual@3.13.18` (для виртуализации)

### КРИТИЧЕСКИ ВАЖНО: мемоизация data и columns

```typescript
import { useReactTable, getCoreRowModel, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

function UsersTable() {
  const data = useMemo(() => [...users], [users]); // Стабильная ссылка!
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  // ...
}
```

**Без `useMemo` на data/columns — бесконечные ре-рендеры!**

### Server-Side Patterns (с TanStack Query)

```typescript
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
const [columnFilters, setColumnFilters] = useState([]);
const [sorting, setSorting] = useState([]);

// КРИТИЧЕСКИ: ВСЕ состояние таблицы в query key
const { data, isLoading } = useQuery({
  queryKey: ['users', pagination, columnFilters, sorting],
  queryFn: () => fetchUsers({ pagination, filters: columnFilters, sorting }),
});

const table = useReactTable({
  data: data?.data ?? [],
  columns,
  getCoreRowModel: getCoreRowModel(),
  // manual* флаги — сервер управляет этими функциями
  manualPagination: true,
  manualFiltering: true,
  manualSorting: true,
  pageCount: data?.pagination.pageCount ?? 0,
  state: { pagination, columnFilters, sorting },
  onPaginationChange: setPagination,
  onColumnFiltersChange: setColumnFilters,
  onSortingChange: setSorting,
});
```

### Virtualization (1000+ строк)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const containerRef = useRef<HTMLDivElement>(null);
const { rows } = table.getRowModel();

const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => containerRef.current,
  estimateSize: () => 50,
  overscan: 10,
});
```

### Column/Row Pinning

```typescript
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  enableColumnPinning: true,
  initialState: {
    columnPinning: { left: ['select', 'name'], right: ['actions'] },
  },
});
```

### Row Expanding (вложенные данные)

```typescript
import { getExpandedRowModel } from '@tanstack/react-table';

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getSubRows: (row) => row.subRows,
});
```

### Row Grouping

```typescript
import { getGroupedRowModel } from '@tanstack/react-table';

const columns = [
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    aggregationFn: 'sum',
    aggregatedCell: ({ getValue }) => `Total: ${getValue()}`,
  },
];
// Встроенные aggregation: 'sum', 'min', 'max', 'mean', 'median', 'unique', 'uniqueCount', 'count'
```

### Known Issues & Solutions

1. **Infinite Re-Renders** — `data`/`columns` меняют ссылку каждый рендер → `useMemo`
2. **Query + Table State Mismatch** — query key не содержит pagination/filters/sorting → включи ВСЁ состояние в query key
3. **Server-Side не работает** — забыли `manualPagination: true` / `manualFiltering` / `manualSorting` + `pageCount`
4. **React 19 Compiler** — автоматическая мемоизация ломает таблицу → добавь `"use no memo"` в начало компонента
5. **Row Selection при удалении данных** — выбранные удалённые строки остаются в selection → вручную чисти `setRowSelection`
6. **Virtualization в скрытых контейнерах (tabs/modals)** — бесконечные ре-рендеры → `enabled: containerRef.current?.getClientRects().length !== 0`
7. **Column Pinning с grouped columns** — неправильное позиционирование → пиннь отдельные колонки, не группы
8. **Grouping performance** — деградация на 10k+ строк → серверная группировка или пагинация
9. **TypeScript `getValue()` в grouped columns** → возвращает `unknown` → используй type assertion или `renderValue()`

---

## Motion (Animations)

### Package

```bash
pnpm add motion
```

Импорт: `import { motion, AnimatePresence } from "motion/react"`

Vite + React + TypeScript — работает из коробки, никакой конфигурации не нужно.

### Когда использовать Motion

**Используй:**
- Жесты (drag-and-drop, hover scale/rotation, tap)
- Scroll-анимации (parallax, viewport reveals, progress bars)
- Layout-переходы (shared elements, expand/collapse, tab navigation)
- Модальные окна с backdrop и exit-анимациями
- SVG-анимации (path morphing, line drawing)

**НЕ используй:**
- Простые анимации добавления/удаления из списка — используй `auto-animate` (3 KB vs 34 KB)
- Статический контент без взаимодействия
- 3D-анимации — используй Three.js / React Three Fiber

### Core: motion component

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### AnimatePresence (exit-анимации)

AnimatePresence **должен оставаться смонтированным**. Условие — внутри.

```tsx
import { AnimatePresence, motion } from "motion/react";

// ПРАВИЛЬНО — AnimatePresence всегда смонтирован
<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>

// НЕПРАВИЛЬНО — exit-анимация не сработает
{isVisible && (
  <AnimatePresence>
    <motion.div>Content</motion.div>
  </AnimatePresence>
)}
```

**Правила:**
- AnimatePresence оборачивает условие, не наоборот
- Все дочерние элементы **должны иметь уникальный `key`**
- `mode="wait"` — для последовательных переходов (предыдущий уходит → новый появляется)

### Layout Animations

```tsx
// Автоматическая FLIP-анимация при изменении layout
<motion.div layout>
  {isExpanded ? <FullContent /> : <Summary />}
</motion.div>

// Shared element transitions — элементы с одинаковым layoutId анимируются между собой
<motion.div layoutId="card-1">...</motion.div>
```

**Специальные пропсы:**
- `layout` — включает FLIP layout-анимацию
- `layoutId` — связывает элементы для shared transitions
- `layoutScroll` — для элементов в scrollable контейнерах
- `layoutRoot` — для элементов в fixed-position контейнерах

### Scroll Animations

```tsx
import { motion, useScroll, useTransform } from "motion/react";

// Viewport-triggered
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
>
  Appears when 100px from viewport
</motion.div>

// Scroll-linked
function ParallaxHero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return <motion.div style={{ y }}>Parallax content</motion.div>;
}
```

### Gestures

```tsx
// Используй while* пропсы, НЕ event handlers
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ boxShadow: "0 0 0 2px rgba(66,153,225,0.6)" }}
>
  Button
</motion.button>

// Drag
<motion.div
  drag="x"
  dragConstraints={{ left: -200, right: 200 }}
  dragElastic={0.2}
/>
```

### Transitions (Spring & Tween)

```tsx
// Spring (по умолчанию для transform) — физически естественные, прерываемые
<motion.div
  animate={{ x: 100 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
/>

// Tween — для duration-based анимаций
<motion.div
  animate={{ opacity: 1 }}
  transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
/>
```

**Правило:** для интерактивных анимаций (жесты, drag) используй spring — они прерываемы. Tween с duration для простых появлений/исчезновений.

### Tailwind + Motion

Tailwind для стилей, Motion для анимаций. **Убирай Tailwind transitions!**

```tsx
// НЕПРАВИЛЬНО — Tailwind transition конфликтует с Motion
<motion.div className="transition-all duration-300" animate={{ x: 100 }} />

// ПРАВИЛЬНО — убери Tailwind transition
<motion.div className="bg-blue-600 rounded-lg px-4 py-2" animate={{ x: 100 }} />
```

### Performance

#### LazyMotion (уменьшение бандла: 34 KB → 4.6 KB)

```tsx
import { LazyMotion, domAnimation, m } from "motion/react";

// В app/providers или layout
<LazyMotion features={domAnimation}>
  {/* Используй 'm' вместо 'motion' */}
  <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    Lightweight animation
  </m.div>
</LazyMotion>
```

#### Предотвращение ре-рендеров

```tsx
import { useMotionValue, useTransform } from "motion/react";

// ПРАВИЛЬНО — useMotionValue не вызывает ре-рендер
const x = useMotionValue(0);
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

<motion.div style={{ x, opacity }} drag="x" />

// НЕПРАВИЛЬНО — useState вызывает ре-рендер на каждый кадр
const [x, setX] = useState(0);
```

**Правила:**
- `useMotionValue` вместо `useState` для анимируемых значений
- `useTransform` для производных значений (не пересчитывай в useEffect)
- Определяй `variants` вне компонента (стабильная ссылка)
- Hardware acceleration: `style={{ willChange: "transform" }}` для тяжёлых анимаций
- 50+ анимируемых элементов → используй виртуализацию (`@tanstack/react-virtual`)

#### Variants (вынеси за пределы компонента)

```tsx
// ПРАВИЛЬНО — стабильная ссылка, без ре-рендеров
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Card() {
  return <motion.div variants={cardVariants} initial="hidden" animate="visible" />;
}
```

### Accessibility

```tsx
import { MotionConfig } from "motion/react";

// В app/providers — уважай настройку пользователя
<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

- `"user"` — уважает OS `prefers-reduced-motion` (рекомендуется)
- `"always"` — отключает анимации полностью
- `"never"` — игнорирует настройку

### Known Issues

1. **AnimatePresence exit не работает** — AnimatePresence обёрнут в условие или отсутствует `key` → AnimatePresence снаружи, key на каждом child
2. **Tailwind transitions конфликт** — `transition-*` классы → убери их при использовании Motion
3. **Layout-анимации в scroll-контейнерах** — неполные переходы → добавь `layoutScroll` на scroll-контейнер
4. **Layout-анимации в fixed-элементах** — неверное позиционирование → добавь `layoutRoot` на fixed-элемент
5. **layoutId + AnimatePresence** — элементы не размонтируются → оберни в `LayoutGroup`
6. **50+ анимируемых элементов** — тормоза → виртуализация (`react-window`, `@tanstack/react-virtual`)
7. **Процентные значения ломают layout-анимации** — переведи в пиксели
8. **React 19 StrictMode + Drag** — жесты ломаются (Ant Design) → временно отключи StrictMode или используй React 18

### Anti-Patterns

- НЕ смешивай Tailwind `transition-*` и Motion-анимации
- НЕ используй `useState` для анимируемых значений — используй `useMotionValue`
- НЕ определяй `variants` внутри компонента — выноси наружу
- НЕ оборачивай AnimatePresence в условие — условие внутри
- НЕ анимируй `width`/`height` напрямую — используй `layout` prop для FLIP
- НЕ используй Motion для простых list add/remove — используй `auto-animate`

---

## Styling Rules (CVA)

### Scope

Эти правила **НЕ** применяются к shadcn/ui компонентам в `shared/ui/`.
shadcn-компоненты остаются в оригинальном виде.
CVA-правила — только для кастомных компонентов в app/, pages/, widgets/, features/, entities/.

### File Structure

```
layer/
  sliceName/
    ui/
      ComponentName/
        ComponentName.tsx
        styles/
          ComponentName.styles.ts
```

### Basic CVA (без вариантов)

```typescript
// ComponentName.styles.ts
import { cva } from 'class-variance-authority';

export const cvaRoot = cva([
  'component-name-cvaRoot',     // уникальный идентификатор для дебага
  'flex flex-col min-w-36',
  'bg-general_background_MIII_450_dark',
]);
```

### CVA with Variants

```typescript
export const cvaCardsContainer = cva(
  ['component-name-cvaCardsContainer', 'flex flex-col mx-auto z-[100]'],
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
```

### Naming

- CVA-имена начинаются с `cva`: `cvaRoot`, `cvaButtonContent`, `cvaCardsContainer`
- Первый класс — уникальный идентификатор: `component-name-cvaRoot`
- kebab-case для идентификатора компонента: `authenticated-layout-cvaRoot`
