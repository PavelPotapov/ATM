# Модуль Workspaces (Рабочие пространства)

## Назначение

Модуль отвечает за управление рабочими пространствами (строительными проектами). Позволяет создавать workspace, управлять участниками и контролировать доступ на основе ролей пользователей.

## Публичный API

### Endpoints

- `POST /workspaces` - создание нового workspace (создатель автоматически добавляется)
- `GET /workspaces` - получение списка workspace пользователя (ADMIN видит все)
- `GET /workspaces/:id` - получение workspace с информацией о пользователях
- `PATCH /workspaces/:id` - обновление workspace
- `DELETE /workspaces/:id` - удаление workspace
- `POST /workspaces/:id/users` - добавление пользователя в workspace
- `DELETE /workspaces/:id/users/:userId` - удаление пользователя из workspace

### Экспортируемые сущности

- `WorkspacesService` - сервис для работы с workspace
- Типы: `WorkspaceWithTimestamps`, `WorkspaceWithUsers`

## Внутреннее устройство

### Структура модуля

```
workspaces/
├── workspaces.controller.ts  # HTTP endpoints
├── workspaces.service.ts      # Бизнес-логика
├── workspaces.module.ts       # Конфигурация модуля
├── dto/
│   ├── create-workspace.dto.ts      # DTO для создания
│   ├── update-workspace.dto.ts      # DTO для обновления
│   └── add-user-to-workspace.dto.ts # DTO для добавления пользователя
├── types/
│   └── workspace.types.ts    # Типы workspace
└── docs/
    └── api-examples.md        # Примеры запросов для тестирования
```

### Основные компоненты

#### WorkspacesService

- `create(createWorkspaceDto, user)` - создание workspace, создатель автоматически добавляется
- `findAll(user)` - получение списка workspace (ADMIN видит все, остальные - только свои)
- `findOne(id, user)` - получение workspace с проверкой доступа
- `update(id, updateWorkspaceDto, user)` - обновление с проверкой прав
- `remove(id, user)` - удаление с проверкой прав
- `addUser(workspaceId, addUserDto, user)` - добавление пользователя в workspace
- `removeUser(workspaceId, userId, user)` - удаление пользователя из workspace
- `checkAccess(workspaceId, user)` - приватный метод проверки доступа

### Типы

- `BaseWorkspace` - базовый тип (id, name, description)
- `WorkspaceWithTimestamps` - расширяет BaseWorkspace, добавляет createdAt, updatedAt
- `WorkspaceWithUsers` - workspace с информацией о пользователях

### Права доступа

- **ADMIN**: видит и может управлять всеми workspace
- **MANAGER/WORKER**: видят и могут управлять только теми workspace, где они участники
- При попытке доступа к чужому workspace возвращается 403 Forbidden

## Зависимости

### Внутренние

- `PrismaModule` - для работы с БД
- `AuthModule` - для получения текущего пользователя

### Внешние

- `class-validator` - валидация DTO

## Точки интеграции

### Используется в:

- Все endpoints требуют JWT авторизации
- Использует `@CurrentUser()` для получения текущего пользователя

### Использует:

- `PrismaService` - для работы с БД
- Модели: `Workspace`, `WorkspaceUser`, `User`

## Бизнес-логика

### Создание workspace

1. Создается workspace с указанным именем и описанием
2. Создатель автоматически добавляется в участники (WorkspaceUser)
3. Возвращается созданный workspace

### Управление участниками

- Один пользователь может быть в нескольких workspace
- Один workspace может иметь несколько пользователей
- Связь многие-ко-многим через таблицу WorkspaceUser
- При удалении workspace все связи удаляются (Cascade)

## Известные ограничения и TODO

- [ ] Добавить роли внутри workspace (owner, member и т.д.)
- [ ] Добавить пагинацию для GET /workspaces
- [ ] Добавить фильтрацию и поиск
- [ ] Расширить функциональность: сметы, ячейки, история изменений
- [ ] Добавить валидацию: пользователь не может добавить себя дважды
