# План реализации UI для модуля Estimates (Сметы)

## Цель
Добавить на фронтенде UI для отображения смет проекта и процесс создания смет.

## Архитектура (FSD)

Проект использует Feature-Sliced Design (FSD):
- **entities/** - бизнес-сущности (workspaces, users, estimates)
- **features/** - фичи (authLogin, users, estimates)
- **pages/** - страницы
- **shared/** - общие компоненты
- **widgets/** - виджеты

## Этап 1: API слой (entities/estimates/api)

### 1.1. Endpoints в shared/config/endpoints.config.ts
- Добавить `ESTIMATES` секцию с endpoints:
  - `LIST: '/estimates'`
  - `BY_WORKSPACE: (workspaceId: string) => '/estimates/workspace/${workspaceId}'`
  - `BY_ID: (id: string) => '/estimates/${id}'`
  - `CREATE: '/estimates'`
  - `UPDATE: (id: string) => '/estimates/${id}'`
  - `DELETE: (id: string) => '/estimates/${id}'`
  - `CREATE_COLUMN: (estimateId: string) => '/estimates/${estimateId}/columns'`
  - `UPDATE_COLUMN: (columnId: string) => '/estimates/columns/${columnId}'`
  - `DELETE_COLUMN: (columnId: string) => '/estimates/columns/${columnId}'`

### 1.2. DTOs (entities/estimates/api/dto/)
- `estimate.dto.ts` - типы для Estimate, EstimateColumn
- `create-estimate.dto.ts` - DTO для создания сметы
- `update-estimate.dto.ts` - DTO для обновления сметы
- `create-estimate-column.dto.ts` - DTO для создания столбца
- `update-estimate-column.dto.ts` - DTO для обновления столбца

### 1.3. Query Keys (entities/estimates/api/queryKeys.ts)
- `estimatesKeys` - factory для query keys:
  - `list: null`
  - `byWorkspace: (workspaceId: string) => [workspaceId]`
  - `detail: (id: string) => [id]`
  - `columns: (estimateId: string) => [estimateId, 'columns']`

### 1.4. Queries (entities/estimates/api/queries/)
- `getEstimatesByWorkspace.ts` - получение списка смет проекта
- `getEstimateById.ts` - получение сметы по ID (с опцией full)
- `createEstimate.ts` - создание сметы
- `updateEstimate.ts` - обновление сметы
- `deleteEstimate.ts` - удаление сметы
- `createEstimateColumn.ts` - создание столбца
- `updateEstimateColumn.ts` - обновление столбца
- `deleteEstimateColumn.ts` - удаление столбца

### 1.5. Hooks (entities/estimates/api/hooks/)
- `useEstimatesByWorkspace.ts` - хук для списка смет проекта
- `useEstimate.ts` - хук для получения сметы по ID
- `useCreateEstimate.ts` - хук для создания сметы (mutation)
- `useUpdateEstimate.ts` - хук для обновления сметы (mutation)
- `useDeleteEstimate.ts` - хук для удаления сметы (mutation)
- `useCreateEstimateColumn.ts` - хук для создания столбца
- `useUpdateEstimateColumn.ts` - хук для обновления столбца
- `useDeleteEstimateColumn.ts` - хук для удаления столбца

### 1.6. Публичный API (entities/estimates/api/index.ts)
- Экспорт всех hooks, queries, DTOs, queryKeys

## Этап 2: UI компоненты для отображения (entities/estimates/ui/)

### 2.1. EstimateCard (entities/estimates/ui/EstimateCard/)
- Компонент карточки сметы для списка
- Показывает: название, описание, дату создания, количество столбцов
- Ссылка на детальную страницу сметы

### 2.2. EstimateList (entities/estimates/ui/EstimateList/)
- Компонент списка смет
- Использует EstimateCard
- Обработка loading/error состояний

## Этап 3: Features (features/estimates/)

### 3.1. CreateEstimateDialog (features/estimates/ui/CreateEstimateDialog/)
- Диалог создания сметы
- Форма с полями:
  - Workspace (select, если не передан через props)
  - Название сметы (обязательное)
  - Описание (опциональное)
- Валидация через react-hook-form
- Использование useCreateEstimate hook
- Инвалидация кеша после создания

### 3.2. DeleteEstimateButton (features/estimates/ui/DeleteEstimateButton/)
- Кнопка удаления сметы
- Подтверждение через AlertDialog
- Использование useDeleteEstimate hook

### 3.3. Публичный API (features/estimates/index.ts)
- Экспорт UI компонентов

## Этап 4: Страница Workspace - секция смет

### 4.1. Обновление pages/workspaces/$workspaceId.tsx
- Добавить секцию "Сметы проекта"
- Использовать EstimateList для отображения
- Кнопка "Создать смету" (только для ADMIN/MANAGER)
- Использовать CreateEstimateDialog
- Проверка прав через useHasPermission или проверка роли

## Этап 5: Routes

### 5.1. Обновление shared/config/routes.config.ts
- Добавить `ESTIMATES: '/estimates'`
- Добавить `ESTIMATE_DETAIL: (id: string) => '/estimates/${id}'`

### 5.2. Обновление app/router/router.tsx
- Добавить роут для детальной страницы сметы (если нужна отдельная страница)

## Этап 6: Детальная страница сметы (опционально, для будущего)

### 6.1. pages/estimates/$estimateId.tsx
- Отображение полной информации о смете
- Список столбцов
- В будущем: таблица с данными (rows, cells)

## Порядок реализации

### Фаза 1: API слой (базовый)
1. ✅ Добавить endpoints в `shared/config/endpoints.config.ts`
2. ✅ Создать DTOs
3. ✅ Создать queryKeys
4. ✅ Создать queries (getEstimatesByWorkspace, getEstimateById, createEstimate)
5. ✅ Создать hooks (useEstimatesByWorkspace, useEstimate, useCreateEstimate)
6. ✅ Создать публичный API index.ts

### Фаза 2: UI компоненты (базовые)
7. ✅ Создать EstimateCard компонент
8. ✅ Создать EstimateList компонент
9. ✅ Создать CreateEstimateDialog
10. ✅ Создать DeleteEstimateButton

### Фаза 3: Интеграция в страницу Workspace
11. ✅ Обновить `pages/workspaces/$workspaceId.tsx`:
    - Добавить секцию "Сметы проекта"
    - Интегрировать EstimateList
    - Добавить кнопку создания сметы
    - Проверка прав доступа

### Фаза 4: Тестирование
12. ✅ Проверить создание сметы
13. ✅ Проверить отображение списка смет
14. ✅ Проверить права доступа (WORKER не может создавать)
15. ✅ Проверить удаление сметы

## Дополнительные задачи (на будущее)

- [ ] Детальная страница сметы с таблицей
- [ ] Редактирование сметы
- [ ] Управление столбцами (создание, редактирование, удаление)
- [ ] Работа со строками и ячейками
- [ ] История изменений ячеек

## Технические детали

### Используемые библиотеки
- `@tanstack/react-query` - для запросов
- `react-hook-form` - для форм
- `@tanstack/react-router` - для роутинга
- `lucide-react` - для иконок
- `@/shared/ui/*` - UI компоненты (Card, Dialog, Button, etc.)

### Проверка прав доступа
- Использовать `useUser` из `features/authLogin` для получения роли пользователя
- Проверка роли: `user?.role === 'ADMIN' || user?.role === 'MANAGER'` для создания смет
- WORKER не может создавать сметы (проверка на фронте + на бэке)

### Стилизация
- Использовать существующие стили из `shared/ui`
- Следовать паттернам из других страниц (workspaces, users)

