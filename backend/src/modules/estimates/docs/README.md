# Модуль Estimates (Сметы)

## Назначение

Модуль для работы со сметами проектов. Смета представляет собой таблицу с данными о материалах, работах и других ресурсах проекта. Модуль позволяет:

- Создавать и управлять сметами для проектов (workspaces)
- Определять структуру таблицы через столбцы (columns)
- Настраивать типы данных и ограничения для столбцов
- Отслеживать историю изменений (через CellHistory)

## Публичный API

### Endpoints

#### Сметы (Estimates)

- `POST /estimates` - Создание новой сметы
- `GET /estimates/workspace/:workspaceId` - Получение всех смет проекта
- `GET /estimates/:id` - Получение сметы по ID
- `GET /estimates/:id?full=true` - Получение полной информации о смете (со столбцами и количеством строк)
- `PATCH /estimates/:id` - Обновление сметы
- `DELETE /estimates/:id` - Удаление сметы (мягкое удаление)

#### Столбцы смет (Columns)

- `POST /estimates/:estimateId/columns` - Создание столбца сметы
- `PATCH /estimates/columns/:columnId` - Обновление столбца сметы
- `DELETE /estimates/columns/:columnId` - Удаление столбца сметы

### DTOs

- `CreateEstimateDto` - данные для создания сметы
- `UpdateEstimateDto` - данные для обновления сметы
- `CreateEstimateColumnDto` - данные для создания столбца
- `UpdateEstimateColumnDto` - данные для обновления столбца

### Типы

- `EstimateWithTimestamps` - смета с временными метками
- `EstimateWithCreator` - смета с информацией о создателе
- `EstimateWithColumns` - смета со столбцами
- `EstimateFull` - полная информация о смете

## Внутреннее устройство

### Структура

```
estimates/
├── dto/
│   ├── create-estimate.dto.ts
│   ├── update-estimate.dto.ts
│   ├── create-estimate-column.dto.ts
│   └── update-estimate-column.dto.ts
├── types/
│   └── estimate.types.ts
├── estimates.controller.ts
├── estimates.service.ts
├── estimates.module.ts
└── docs/
    └── README.md
```

### Основные компоненты

- **EstimatesService** - бизнес-логика работы со сметами:
  - Проверка доступа к workspace
  - CRUD операции для смет
  - CRUD операции для столбцов
  - Валидация данных

- **EstimatesController** - обработка HTTP запросов:
  - Валидация входных данных через DTO
  - Аутентификация через JWT
  - Swagger документация

### База данных

Модуль использует следующие модели Prisma:

- `Estimate` - смета
- `EstimateColumn` - столбец сметы
- `EstimateRow` - строка сметы
- `Cell` - ячейка таблицы
- `CellHistory` - история изменений ячейки
- `ColumnRolePermission` - разрешения на столбцы для ролей

## Точки интеграции

- **WorkspacesModule** - сметы привязаны к проектам (workspaces)
- **UsersModule** - отслеживание создателей смет и столбцов
- **AuthModule** - аутентификация через JWT

## Безопасность

- Все endpoints требуют аутентификации (`@UseGuards(JwtAuthGuard)`)
- Проверка доступа к workspace перед операциями
- ADMIN видит все workspace, MANAGER и WORKER - только свои
- **Создание смет и столбцов**: только ADMIN и MANAGER могут создавать сметы и столбцы
- WORKER может только просматривать и редактировать данные в существующих сметах (в рамках своих разрешений)

## Известные ограничения и TODO

- [ ] Реализация работы со строками (rows) и ячейками (cells)
- [ ] Реализация истории изменений ячеек (CellHistory)
- [ ] Реализация разрешений на столбцы для ролей (ColumnRolePermission)
- [ ] Валидация значений ячеек согласно типу данных столбца
- [ ] Поддержка формул в ячейках
- [ ] Парсинг PDF/XLSX файлов для автоматического создания смет

