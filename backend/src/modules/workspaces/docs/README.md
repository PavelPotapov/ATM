# Модуль Workspaces (Рабочие пространства)

## Назначение

Модуль отвечает за управление рабочими пространствами (строительными проектами). Позволяет создавать workspace, управлять участниками и контролировать доступ на основе ролей пользователей.

## Публичный API

### Endpoints

- `POST /workspaces` - создание нового workspace (создатель автоматически добавляется)
- `GET /workspaces` - получение списка workspace пользователя (ADMIN видит все, исключаются удаленные)
- `GET /workspaces/:id` - получение workspace с информацией о пользователях
- `PATCH /workspaces/:id` - обновление workspace (логируется в истории)
- `DELETE /workspaces/:id` - мягкое удаление workspace (soft delete)
- `DELETE /workspaces/:id/permanent` - принудительное удаление workspace (hard delete, только ADMIN)
- `POST /workspaces/:id/restore` - восстановление workspace из корзины
- `GET /workspaces/:id/history` - получение истории изменений workspace
- `POST /workspaces/:id/users` - добавление пользователя в workspace (логируется в истории)
- `DELETE /workspaces/:id/users/:userId` - удаление пользователя из workspace (логируется в истории)

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
│   ├── workspace.types.ts           # Типы workspace
│   └── workspace-history.types.ts    # Типы истории изменений
└── docs/
    └── api-examples.md        # Примеры запросов для тестирования
```

### Основные компоненты

#### WorkspacesService

- `create(createWorkspaceDto, user)` - создание workspace, создатель автоматически добавляется, логируется в истории
- `findAll(user)` - получение списка workspace (ADMIN видит все, остальные - только свои), исключаются удаленные
- `findOne(id, user)` - получение workspace с проверкой доступа, исключаются удаленные
- `update(id, updateWorkspaceDto, user)` - обновление с проверкой прав, логируется в истории
- `remove(id, user)` - мягкое удаление (soft delete) с проверкой прав, логируется в истории
- `permanentlyDelete(id, user)` - принудительное удаление (hard delete), только для ADMIN, логируется в истории
- `restore(id, user)` - восстановление workspace из корзины, логируется в истории
- `addUser(workspaceId, addUserDto, user)` - добавление пользователя в workspace, логируется в истории
- `removeUser(workspaceId, userId, user)` - удаление пользователя из workspace, логируется в истории
- `getHistory(workspaceId, user)` - получение истории изменений workspace
- `logHistory(...)` - приватный метод для логирования изменений
- `checkAccessAndGet(workspaceId, user)` - приватный метод проверки доступа и получения workspace

### Типы

- `BaseWorkspace` - базовый тип (id, name, description)
- `WorkspaceWithTimestamps` - расширяет BaseWorkspace, добавляет createdAt, updatedAt
- `WorkspaceWithUsers` - workspace с информацией о пользователях
- `WorkspaceHistoryAction` - enum действий в истории (CREATED, UPDATED, DELETED, RESTORED, USER_ADDED, USER_REMOVED, PERMANENTLY_DELETED)
- `WorkspaceHistoryEntry` - запись в истории изменений

### Права доступа

#### ADMIN (Администратор)
- Видит все workspace (включая удаленные для восстановления)
- Может создавать workspace
- Может редактировать любые workspace
- Может удалять любые workspace (мягкое удаление)
- Может принудительно удалять workspace (hard delete)
- Может восстанавливать любые workspace
- Может добавлять/удалять пользователей в любые workspace

#### MANAGER (Менеджер)
- Видит только те workspace, где он участник (исключая удаленные)
- Может создавать workspace (становится участником)
- Может редактировать workspace, где он участник
- Может удалять workspace, где он участник (мягкое удаление)
- Может восстанавливать workspace, где он был участником
- Может добавлять/удалять пользователей в workspace, где он участник

#### WORKER (Работник)
- Видит только те workspace, где он участник (исключая удаленные)
- Может только просматривать workspace
- Не может создавать, редактировать, удалять workspace
- Не может добавлять/удалять пользователей

При попытке доступа к чужому workspace возвращается 403 Forbidden

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
- Модели: `Workspace`, `WorkspaceUser`, `User`, `WorkspaceHistory`

## Бизнес-логика

### Создание workspace

1. Создается workspace с указанным именем и описанием
2. Создатель автоматически добавляется в участники (WorkspaceUser)
3. Возвращается созданный workspace

### Управление участниками

- Один пользователь может быть в нескольких workspace
- Один workspace может иметь несколько пользователей
- Связь многие-ко-многим через таблицу WorkspaceUser
- При принудительном удалении workspace все связи удаляются (Cascade)

### Мягкое удаление (Soft Delete)

- При удалении workspace устанавливается поле `deletedAt`
- Удаленные workspace не отображаются в списках (кроме ADMIN для восстановления)
- Удаленные workspace можно восстановить через `POST /workspaces/:id/restore`
- История изменений сохраняется даже для удаленных workspace

### Принудительное удаление (Hard Delete)

- Доступно только для ADMIN
- Окончательно удаляет workspace из БД
- Перед удалением логируется в истории
- После принудительного удаления восстановление невозможно

### История изменений (Audit Log)

Все изменения workspace логируются в таблицу `WorkspaceHistory`:
- Создание workspace (CREATED)
- Обновление полей (UPDATED) - сохраняются старое и новое значение
- Мягкое удаление (DELETED)
- Восстановление (RESTORED)
- Добавление пользователя (USER_ADDED)
- Удаление пользователя (USER_REMOVED)
- Принудительное удаление (PERMANENTLY_DELETED)

Каждая запись содержит:
- ID workspace и пользователя
- Действие (action)
- Измененное поле (field)
- Старое и новое значение (oldValue, newValue)
- Дополнительные метаданные (metadata)
- Время изменения (createdAt)

## Известные ограничения и TODO

- [x] История изменений workspace (аудит)
- [x] Мягкое удаление (soft delete)
- [x] Принудительное удаление (hard delete)
- [x] Восстановление workspace из корзины
- [ ] Добавить роли внутри workspace (owner, member и т.д.)
- [ ] Добавить пагинацию для GET /workspaces
- [ ] Добавить фильтрацию и поиск
- [ ] Добавить фильтрацию удаленных workspace для ADMIN
- [ ] Расширить функциональность: сметы, ячейки
- [ ] Добавить валидацию: пользователь не может добавить себя дважды
