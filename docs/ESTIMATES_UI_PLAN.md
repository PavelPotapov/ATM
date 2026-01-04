# План реализации UI для модуля Estimates (Сметы)

## Цель
Добавить на фронтенде UI для отображения смет проекта и процесс создания смет.

## Архитектура (FSD)

Проект использует Feature-Sliced Design (FSD):
- **entities/** - бизнес-сущности (workspaces, users, **estimates**)
- **features/** - фичи управления сущностями (authLogin, users, **estimates**)
- **pages/** - страницы
- **shared/** - общие компоненты
- **widgets/** - виджеты

## Важные уточнения

1. **Estimates как сущность** - вся работа с API, DTOs, queries, hooks находится в `entities/estimates/api`
2. **Фичи управления** - UI компоненты для создания, удаления, редактирования в `features/estimates`
3. **Workspace состоит из смет** - на странице workspace отображается список смет проекта
4. **Детальная страница сметы** - при клике на смету открывается детальная страница со столбцами и данными
5. **Permissions вместо ролей** - использовать `useHasPermission` для проверки прав доступа

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
- `estimate.dto.ts` - типы для Estimate, EstimateColumn (ответы от API)
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
- Ссылка на детальную страницу сметы (`/estimates/$estimateId`)

### 2.2. EstimateList (entities/estimates/ui/EstimateList/)
- Компонент списка смет
- Использует EstimateCard
- Обработка loading/error состояний
- Показывает пустое состояние, если смет нет

## Этап 3: Features (features/estimates/) - управление сущностью

### 3.1. CreateEstimateDialog (features/estimates/ui/CreateEstimateDialog/)
- Диалог создания сметы
- Форма с полями:
  - Workspace (скрыто, передается через props из страницы workspace)
  - Название сметы (обязательное)
  - Описание (опциональное)
- Валидация через react-hook-form
- Использование useCreateEstimate hook
- Инвалидация кеша после создания
- Проверка permissions через `useHasPermission(PERMISSIONS.ESTIMATES_CREATE)`

### 3.2. DeleteEstimateButton (features/estimates/ui/DeleteEstimateButton/)
- Кнопка удаления сметы
- Подтверждение через AlertDialog
- Использование useDeleteEstimate hook
- Проверка permissions через `useHasPermission(PERMISSIONS.ESTIMATES_DELETE)`

### 3.3. Публичный API (features/estimates/index.ts)
- Экспорт UI компонентов

## Этап 4: Страница Workspace - секция смет

### 4.1. Обновление pages/workspaces/$workspaceId.tsx
- Добавить секцию "Сметы проекта" после информации о workspace
- Использовать `useEstimatesByWorkspace(workspaceId)` для получения списка
- Использовать `EstimateList` для отображения
- Кнопка "Создать смету" (только для пользователей с `ESTIMATES_CREATE` permission)
- Использовать `CreateEstimateDialog` с предзаполненным `workspaceId`
- Проверка прав через `useHasPermission(PERMISSIONS.ESTIMATES_CREATE)`

## Этап 5: Детальная страница сметы

### 5.1. Routes
- Обновить `shared/config/routes.config.ts`:
  - Добавить `ESTIMATE_DETAIL: (id: string) => '/estimates/${id}'`
- Обновить `app/router/router.tsx`:
  - Добавить роут `/estimates/$estimateId`

### 5.2. Страница pages/estimates/$estimateId.tsx
- Отображение полной информации о смете:
  - Название, описание
  - Информация о создателе
  - Дата создания/обновления
- Список столбцов сметы (EstimateColumn):
  - Название столбца
  - Тип данных
  - Обязательность
  - Разрешенные значения (для ENUM)
- Кнопка "Удалить смету" (для пользователей с `ESTIMATES_DELETE` permission)
- В будущем: таблица с данными (rows, cells)

## Этап 6: Permissions на фронтенде

### 6.1. Обновление frontend/src/features/permissions/constants/permissions.ts
- Добавить permissions для estimates:
  ```typescript
  ESTIMATES_CREATE: 'estimates.create',
  ESTIMATES_UPDATE: 'estimates.update',
  ESTIMATES_DELETE: 'estimates.delete',
  ESTIMATES_VIEW: 'estimates.view',
  ```

### 6.2. Обновление frontend/src/features/permissions/types/permissions.types.ts
- Добавить `ESTIMATES = 'estimates'` в `PermissionEntity`

## Порядок реализации

### Фаза 1: Permissions (бэкенд + фронтенд)
1. ✅ Добавить permissions для estimates на бэкенде
2. ✅ Обновить PermissionsService для ролей
3. ✅ Добавить permissions для estimates на фронтенде

### Фаза 2: API слой (entities/estimates/api)
4. ✅ Добавить endpoints в `shared/config/endpoints.config.ts`
5. ✅ Создать DTOs
6. ✅ Создать queryKeys
7. ✅ Создать queries (getEstimatesByWorkspace, getEstimateById, createEstimate, deleteEstimate)
8. ✅ Создать hooks (useEstimatesByWorkspace, useEstimate, useCreateEstimate, useDeleteEstimate)
9. ✅ Создать публичный API index.ts

### Фаза 3: UI компоненты (entities/estimates/ui)
10. ✅ Создать EstimateCard компонент
11. ✅ Создать EstimateList компонент

### Фаза 4: Features (features/estimates)
12. ✅ Создать CreateEstimateDialog
13. ✅ Создать DeleteEstimateButton

### Фаза 5: Интеграция в страницу Workspace
14. ✅ Обновить `pages/workspaces/$workspaceId.tsx`:
    - Добавить секцию "Сметы проекта"
    - Интегрировать EstimateList
    - Добавить кнопку создания сметы (с проверкой permissions)
    - Использовать CreateEstimateDialog

### Фаза 6: Детальная страница сметы
15. ✅ Добавить роут `/estimates/$estimateId`
16. ✅ Создать `pages/estimates/$estimateId.tsx`:
    - Отображение информации о смете
    - Список столбцов
    - Кнопка удаления (с проверкой permissions)

### Фаза 7: Тестирование
17. ✅ Проверить создание сметы
18. ✅ Проверить отображение списка смет на странице workspace
19. ✅ Проверить детальную страницу сметы
20. ✅ Проверить права доступа (WORKER не может создавать)
21. ✅ Проверить удаление сметы

## Дополнительные задачи (на будущее)

- [ ] Редактирование сметы
- [ ] Управление столбцами (создание, редактирование, удаление) на детальной странице
- [ ] Работа со строками и ячейками (таблица данных)
- [ ] История изменений ячеек
- [ ] Формулы в ячейках

## Технические детали

### Используемые библиотеки
- `@tanstack/react-query` - для запросов
- `react-hook-form` - для форм
- `@tanstack/react-router` - для роутинга
- `lucide-react` - для иконок
- `@/shared/ui/*` - UI компоненты (Card, Dialog, Button, etc.)

### Проверка прав доступа
- **Использовать `useHasPermission` из `features/permissions`**
- Примеры:
  - `useHasPermission(PERMISSIONS.ESTIMATES_CREATE)` - для создания
  - `useHasPermission(PERMISSIONS.ESTIMATES_DELETE)` - для удаления
  - `useHasPermission(PERMISSIONS.ESTIMATES_VIEW)` - для просмотра
- Permissions на бэкенде:
  - **ADMIN**: все permissions (CREATE, UPDATE, DELETE, VIEW)
  - **MANAGER**: CREATE, UPDATE, DELETE, VIEW (в своих workspace)
  - **WORKER**: только VIEW

### Стилизация
- Использовать существующие стили из `shared/ui`
- Следовать паттернам из других страниц (workspaces, users)

### Структура файлов

```
frontend/src/
├── entities/
│   └── estimates/
│       ├── api/
│       │   ├── dto/
│       │   ├── hooks/
│       │   ├── queries/
│       │   ├── queryKeys.ts
│       │   └── index.ts
│       └── ui/
│           ├── EstimateCard/
│           └── EstimateList/
├── features/
│   └── estimates/
│       ├── ui/
│       │   ├── CreateEstimateDialog/
│       │   └── DeleteEstimateButton/
│       └── index.ts
└── pages/
    ├── workspaces/
    │   └── $workspaceId.tsx (обновить)
    └── estimates/
        └── $estimateId.tsx (создать)
```
