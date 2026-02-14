# Changelog

Все значительные изменения в проекте документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/).

**Для понимания структуры модулей см.:**
- [Обзор модулей Backend](./backend-modules.md)
- [Документация модулей](./backend-modules.md#модули)

## [2026-02-14] - Вынос seed-данных пользователей в .env

### Изменено
- `backend/prisma/seed.js` — credentials пользователей читаются из env-переменных (`SEED_{ROLE}_EMAIL`, `SEED_{ROLE}_PASSWORD`, `SEED_{ROLE}_FIRST_NAME`, `SEED_{ROLE}_LAST_NAME`)
- Добавлен `require('dotenv').config()` для загрузки `.env`
- Guard: если `EMAIL` или `PASSWORD` не заданы — пользователь пропускается с предупреждением
- `backend/.env.example` — добавлены seed-переменные с placeholder `change-me`

---

## [2026-02-14] - Реабилитация TypeScript type-checking в frontend build

### Исправлено
- Все TypeScript ошибки (31 шт.) в `widgets/table`, `entities/estimates`, `features/estimates`
- `ButtonProps` → `React.ComponentProps<typeof Button>` в `DataTableColumnHeader`
- Неиспользуемые импорты и переменные во всех трёх модулях
- Типизация `getFacetedUniqueValues` / `getFacetedMinMaxValues` в `DataTableEnhanced`
- Типизация `row.original` и `column.columnDef.accessorFn`
- Недостающий проп `rowId` в `EditableCell`
- `data.columnId` / `data.rowId` (потенциально `undefined`) в `useUpdateCell`

### Добавлено
- `widgets/table/model/react-table.d.ts` — module augmentation для `@tanstack/react-table` (`ColumnMeta.label`, `TableMeta`, `FilterFns`)

### Изменено
- `frontend/tsconfig.app.json`: убраны исключения `widgets/table`, `features/estimates`, `entities/estimates` — теперь type-check покрывает весь код (кроме `_reference`)
- `frontend/package.json`: `build` → `tsc -b --noEmit && vite build` — type-checking включён в production build

---

## [2026-02-14] - Настройка Railway деплоя и CI/CD

### Добавлено
- **Railway deployment** — настройка автоматического деплоя из GitHub:
  - `preinstall` скрипт для установки зависимостей в backend/ и frontend/
  - `start` скрипт для Railway (`node backend/dist/src/main.js`)
  - `prisma generate` перед `nest build` в пайплайне сборки
  - `prisma migrate deploy` для автоматического применения миграций
- **Seed-скрипт** (`backend/prisma/seed.ts`):
  - Создаёт 3 дефолтных пользователя: admin, manager, worker
  - Идемпотентный — пропускает существующих пользователей
  - Запускается автоматически при `pnpm run build`
- Скрипт `prisma:seed` в `backend/package.json`
- Конфигурация `prisma.seed` в `backend/package.json`
- Скрипт `typecheck` во `frontend/package.json` (`tsc -b --noEmit`)

### Изменено
- `frontend/package.json`: убран `tsc -b` из `build` — Vite собирает через esbuild, typecheck отделён
- `frontend/tsconfig.app.json`: исключены из typecheck папки `widgets/table`, `features/estimates`, `entities/estimates`, `_reference` (будут рефакториться)
- `package.json` (корень): обновлён `build` — порядок: `clean → prisma generate → build:backend → build:frontend → migrate deploy → seed`

### Технические детали
- Railway автоматически определяет `build` и `start` из `package.json`
- `docker-compose.yml` НЕ используется на Railway — только для локальной разработки
- DATABASE_URL на Railway: `${{Postgres.DATABASE_URL}}` (internal network)

### Дефолтные пользователи (seed)
| Email | Пароль | Роль |
|-------|--------|------|
| admin@atm.local | admin123 | ADMIN |
| manager@atm.local | manager123 | MANAGER |
| worker@atm.local | worker123 | WORKER |

## [2026-02-13] - Добавлен скилл Motion (анимации) в CLAUDE.md

### Добавлено
- Секция **Motion (Animations)** в `frontend/CLAUDE.md`:
  - Установка и импорт (`motion/react`)
  - Когда использовать Motion vs auto-animate vs Three.js
  - AnimatePresence (exit-анимации, правила монтирования)
  - Layout Animations (FLIP, layoutId, shared transitions)
  - Scroll Animations (whileInView, useScroll, useTransform, parallax)
  - Gestures (whileHover, whileTap, drag с constraints)
  - Transitions (spring vs tween, когда что использовать)
  - Tailwind + Motion интеграция (убирать transition-* классы)
  - Performance (LazyMotion 4.6 KB, useMotionValue, variants, виртуализация)
  - Accessibility (MotionConfig reducedMotion)
  - Known Issues (8 задокументированных проблем)
  - Anti-Patterns (6 правил)

## [2026-02-13] - Рефакторинг аутентификации и безопасности

### Добавлено
- Refresh token теперь хранится в httpOnly cookie вместо localStorage (защита от XSS)
- `cookie-parser` middleware в backend (`main.ts`)
- Cookie-хелперы в `auth.controller.ts` (`setRefreshTokenCookie`, `clearRefreshTokenCookie`)
- Внутренний тип `LoginResult` в `auth.service.ts` (для передачи refresh token контроллеру)
- Скрипт `clean` в корневом `package.json` (rimraf для очистки dist)
- Документация модулей (правило `docs/README.md` для каждого модуля):
  - `frontend/src/features/authLogin/docs/README.md`
  - `frontend/src/features/authLogout/docs/README.md`
  - `frontend/src/shared/api/docs/README.md`
- CLAUDE.md файлы с правилами для Claude Code (root, backend, frontend)

### Изменено
- `auth.controller.ts`: login устанавливает refresh token в cookie, refresh читает из cookie, logout очищает cookie
- `auth.service.ts`: login возвращает `LoginResult` (с refresh token) вместо `AuthResponse`
- `auth-response.dto.ts`: убран `refresh_token` из Swagger-описания ответа
- `axiosClient.ts`: добавлен `withCredentials: true`, refresh отправляет пустое тело (cookie идёт автоматически)
- `jwtTokenStorage.ts`: удалены все функции работы с refresh token
- `useLogin.ts`: убрано сохранение refresh token в localStorage
- `auth.dto.ts` (frontend): убран `refresh_token` из `AuthResponse`
- `useLogout.ts`: рефакторинг — `onSettled` вместо дублирования `onSuccess`/`onError`
- Обновлена документация `backend/src/modules/auth/docs/README.md`

### Удалено
- `frontend/src/shared/lib/storage/userStorage.ts` — неиспользуемый файл с FSD-нарушением (shared → features)

### Исправлено
- Убрано логирование `JWT_SECRET` в консоль (`auth.service.ts`)
- Устранена XSS-уязвимость: refresh token больше не хранится в localStorage

## [2025-02-07] - Требования к договору на разработку

### Добавлено
- Файл `contract-requirements.md` в корне проекта — контекст для составления договора между Заказчиком, Исполнителем и Менеджером:
  - назначение документа и суть продукта (система учёта смет, роли, MVP);
  - три участника: Заказчик (юрлицо), Исполнитель (Потапов П.С.), Менеджер от заказчика;
  - обязательные пункты: NDA, принадлежность идеи Заказчику, доли с продаж (30% Исполнителю, 15% от доли Исполнителя — Менеджеру), этапы (ТЗ → Прототип → Разработка);
  - **бюджет и трудоёмкость:** бюджет 600 000 ₽, ставка 1 000 ₽/час (600 ч); распределение по этапам: ТЗ/созвоны 80 ч, прототипирование/верстка 120 ч, программирование 400 ч; этапы 2 и 3 допускают параллельное выполнение;
  - защитные формулировки для Исполнителя (объём по ТЗ, оценочные сроки, возможность корректировки);
  - функциональные рамки MVP: лимит страниц (до 15), таблица (столбцы по ролям, история, сортировка, фильтр, поиск, пагинация, формулы, единицы измерения, документы), не более 3 аналитических графиков;
  - ограничения по дизайну (без отдельного макета, тема по пожеланиям) и отсутствие адаптива (минимум 1280 px);
  - чек-лист для подстановки в договор.

## [2025-01-04] - Добавление модуля Estimates (Сметы)

### Добавлено
- Permissions для estimates на бэкенде:
  - `ESTIMATES_CREATE` - создание смет
  - `ESTIMATES_UPDATE` - обновление смет
  - `ESTIMATES_DELETE` - удаление смет
  - `ESTIMATES_VIEW` - просмотр смет
- Распределение permissions по ролям:
  - **ADMIN**: все permissions (CREATE, UPDATE, DELETE, VIEW)
  - **MANAGER**: CREATE, UPDATE, DELETE, VIEW (в своих workspace)
  - **WORKER**: только VIEW
- Prisma схема для модуля Estimates:
  - **Estimate** - смета (ТЗ проекта), связана с Workspace и User (createdBy)
  - **EstimateColumn** - столбец сметы с типами данных (STRING, NUMBER, ENUM, BOOLEAN, DATE)
  - **EstimateRow** - строка сметы
  - **Cell** - ячейка таблицы (значение в пересечении строки и столбца)
  - **CellHistory** - история изменений ячеек (аудит с привязкой к User)
  - **ColumnRolePermission** - разрешения на столбцы для ролей (canView, canEdit, canCreate)
  - **WorkspaceFile** - файлы проекта (ТЗ, сметы, документы) с категориями
- Enum `ColumnDataType` для типов данных столбцов
- Миграция базы данных `20260104125836_add_estimates_and_files`
- Документация архитектуры модуля Estimates (`docs/ESTIMATES_ARCHITECTURE.md`)
- Backend модуль `EstimatesModule`:
  - **EstimatesService** - сервис для работы со сметами и столбцами
  - **EstimatesController** - REST API endpoints для смет
  - DTOs: `CreateEstimateDto`, `UpdateEstimateDto`, `CreateEstimateColumnDto`, `UpdateEstimateColumnDto`
  - Типы: `EstimateWithTimestamps`, `EstimateWithCreator`, `EstimateWithColumns`, `EstimateFull`
  - Endpoints:
    - `POST /estimates` - создание сметы
    - `GET /estimates/workspace/:workspaceId` - список смет проекта
    - `GET /estimates/:id` - получение сметы (с опцией `?full=true` для полной информации)
    - `PATCH /estimates/:id` - обновление сметы
    - `DELETE /estimates/:id` - удаление сметы
    - `POST /estimates/:estimateId/columns` - создание столбца
    - `PATCH /estimates/columns/:columnId` - обновление столбца
    - `DELETE /estimates/columns/:columnId` - удаление столбца
- Документация модуля (`backend/src/modules/estimates/docs/README.md`)

### Изменено
- Обновлена модель `User` - добавлены связи с Estimates и WorkspaceFile
- Обновлена модель `Workspace` - добавлены связи с Estimates и WorkspaceFile
- `AppModule` - добавлен `EstimatesModule` в imports

### Исправлено
- Добавлена проверка ролей при создании смет и столбцов:
  - Только ADMIN и MANAGER могут создавать сметы (`POST /estimates`)
  - Только ADMIN и MANAGER могут создавать столбцы (`POST /estimates/:estimateId/columns`)
  - WORKER получает `403 Forbidden` при попытке создать смету или столбец

### Технические детали
- `EstimateColumn.allowedValues` хранится как JSON строка для ENUM типов
- `Cell.value` хранится как String (парсится при необходимости для NUMBER)
- Разрешения реализованы на уровне ролей (ColumnRolePermission)
- Файлы хранятся локально на сервере (поле `filePath`)

## [2025-01-XX] - Поддержка ngrok для dev и production режимов

### Добавлено
- Подробная инструкция по настройке ngrok для доступа к приложению (`docs/ngrok-setup.md`)
- Быстрый старт (`docs/QUICK_START.md`) с пошаговыми инструкциями
- Поддержка нескольких CORS origins в бэкенде (через запятую в `FRONTEND_URL`)
- Примеры конфигурационных файлов:
  - `backend/.env.example` - пример конфигурации бэкенда
  - `frontend/.env.example` - пример конфигурации фронтенда
- Описание двух режимов работы:
  - **Production режим**: собрать фронтенд один раз, бэкенд отдает фронтенд + API через один ngrok URL
  - **Dev режим**: фронтенд и бэкенд в dev режиме, только бэкенд через ngrok

### Изменено
- Обновлен `backend/src/main.ts`: CORS теперь поддерживает несколько origins через запятую
- Обновлена документация проекта с информацией о вариантах развертывания через ngrok

### Изменено
- Обновлена документация проекта с информацией о вариантах развертывания через ngrok

## [2025-01-XX] - Настройка API клиента и TanStack Query

### Добавлено
- Установлен и настроен axios для работы с API
- Установлен и настроен @tanstack/react-query для управления серверным состоянием
- Создан axios клиент (`frontend/src/shared/api/client.ts`) с:
  - Автоматическим добавлением JWT токенов в заголовки запросов
  - Интерцепторами для обработки ошибок и добавления метаданных
  - Поддержкой структурированных ошибок от бэкенда
- Создан TanStack Query client (`frontend/src/shared/api/query-client.ts`) с:
  - Централизованной обработкой ошибок
  - Логированием детальной информации об ошибках
  - Подготовкой к интеграции аналитики
- Добавлен ReactQueryDevtools для отладки в dev режиме
- Обновлен App.tsx: добавлен QueryClientProvider
- Создана документация модуля API (`frontend/src/shared/api/README.md`)

### Изменено
- Структура проекта: файлы frontend вынесены из `frontend/ATM-front/` в `frontend/`
- Обновлен package.json: изменено имя пакета с `ATM-front` на `atm-frontend`
- Обновлен README.md frontend: исправлены пути в документации

### Технические детали
- Базовый URL API: `http://localhost:3000` (настраивается через `VITE_API_URL`)
- JWT токены берутся из `localStorage.getItem('accessToken')`
- Query client настроен с staleTime: 5 минут, retry: 1 для queries
- Все ошибки логируются с метаданными (URL, метод, статус код)

## [2025-12-07] - Инициализация Frontend

### Добавлено
- Инициализирован React проект с Vite и TypeScript
- Настроен TanStack Query для работы с серверным состоянием
- Настроен TanStack Router для маршрутизации
- Установлен и настроен Tailwind CSS
- Базовая настройка для использования shadcn/ui компонентов
- Установлены библиотеки: react-hook-form, Zustand, TanStack Table, axios
- Создана базовая структура FSD (Feature-Sliced Design):
  - `app/` - инициализация приложения, провайдеры
  - `pages/` - страницы приложения
  - `shared/` - переиспользуемые компоненты и утилиты (API клиент)
- Настроен API клиент с автоматическим добавлением JWT токенов
- Создана главная страница приложения

### Изменено
- Обновлена документация проекта с информацией о frontend стеке

### Планируется
- Добавление компонентов shadcn/ui по мере необходимости
- Реализация модулей авторизации и работы с пользователями
- Реализация модулей для работы с workspace

## [2025-12-07] - Решение: отказ от AdminJS

### Изменено
- Принято решение не использовать AdminJS для административной панели
- Причина: AdminJS работает только с CommonJS, и не удалось создать нормальную обертку для использования в проекте с TypeScript и ES modules

### Планируется
- Административные функции будут реализованы через основной frontend приложение с соответствующими правами доступа для роли ADMIN

## [2025-12-07] - Рефакторинг: вынос конфигурации Swagger

### Изменено
- Настройка Swagger вынесена из `main.ts` в отдельный файл `backend/src/common/config/swagger.config.ts`
- `main.ts` теперь вызывает функцию `setupSwagger(app)` для настройки
- Обновлена документация Common модулей с описанием `swagger.config.ts`

### Улучшено
- Код стал более модульным и читаемым
- Конфигурация Swagger изолирована и может быть легко изменена

## [2025-12-07] - Документация модулей Backend

### Добавлено
- Подробная документация для каждого модуля NestJS:
  - `backend/src/modules/auth/docs/README.md` - документация Auth модуля
  - `backend/src/modules/users/docs/README.md` - документация Users модуля
  - `backend/src/modules/workspaces/docs/README.md` - документация Workspaces модуля
  - `backend/src/common/docs/README.md` - документация Common модулей
- Обзорный документ `docs/backend-modules.md` с описанием всех модулей
- Обновлены ссылки в README.md и project.md на документацию модулей

### Изменено
- Обновлена структура документации для быстрого понимания архитектуры
- Добавлены ссылки на документацию модулей в основных файлах

## [2025-12-07] - Настройка Swagger и улучшение обработки ошибок

### Добавлено
- Swagger UI для интерактивной документации и тестирования API
- Декораторы Swagger для всех контроллеров (@ApiTags, @ApiOperation, @ApiResponse)
- Декораторы Swagger для всех DTO (@ApiProperty)
- Настройка JWT авторизации в Swagger
- Скрипт typecheck для проверки типов TypeScript
- Скрипт test с флагом --verbose для подробного вывода

### Изменено
- Все endpoints документированы в Swagger
- Swagger доступен по адресу http://localhost:3000/api
- Исправлены HTTP коды ошибок: 401 Unauthorized вместо 500 для неавторизованных запросов

### Планируется
- Расширение функциональности Workspaces (сметы, ячейки и т.д.)
- Инициализация React frontend

## [2025-12-07] - Добавление Refresh Token и Logout

### Добавлено
- Поле `refreshToken` в модель User
- Endpoint POST /auth/refresh - обновление access token
- Endpoint POST /auth/logout - выход из системы
- Методы `refresh()` и `logout()` в AuthService
- RefreshTokenDto для валидации refresh token
- Обновлен AuthResponse - теперь включает refresh_token
- Access token теперь действителен 15 минут (было 24 часа)
- Refresh token действителен 7 дней

### Изменено
- AuthService теперь генерирует два токена: access (15м) и refresh (7д)
- Refresh token сохраняется в БД для проверки при обновлении
- Обновлена документация Swagger для новых endpoints
- Исправлены HTTP коды ошибок (401 вместо 500)

### Планируется
- Swagger документация
- Расширение функциональности Workspaces (сметы, ячейки и т.д.)
- Инициализация React frontend

## [2025-12-07] - Создание модуля Workspaces

### Добавлено
- Модуль Workspaces с полным CRUD функционалом
- WorkspacesController с защищенными endpoints:
  - POST /workspaces - создание workspace
  - GET /workspaces - получение списка workspace пользователя
  - GET /workspaces/:id - получение workspace с пользователями
  - PATCH /workspaces/:id - обновление workspace
  - DELETE /workspaces/:id - удаление workspace
  - POST /workspaces/:id/users - добавление пользователя в workspace
  - DELETE /workspaces/:id/users/:userId - удаление пользователя из workspace
- WorkspacesService с бизнес-логикой:
  - Создание workspace с автоматическим добавлением создателя
  - Проверка прав доступа (ADMIN видит все, остальные - только свои)
  - Управление участниками workspace
- DTO для валидации:
  - CreateWorkspaceDto
  - UpdateWorkspaceDto
  - AddUserToWorkspaceDto
- Типы для Workspace (WorkspaceWithTimestamps, WorkspaceWithUsers)

### Изменено
- Обновлен AppModule для подключения WorkspacesModule
- Все endpoints Workspaces защищены JWT Guard

### Планируется
- Расширение функциональности Workspaces (сметы, ячейки и т.д.)
- Инициализация React frontend

## [2025-12-07] - Реализация JWT аутентификации и улучшение типизации

### Добавлено
- Модуль Auth с JWT аутентификацией
- AuthService с методами login и validateUser
- JwtStrategy для проверки токенов
- JwtAuthGuard для защиты endpoints
- Декоратор @CurrentUser для получения текущего пользователя
- Endpoint POST /auth/login
- Типы пользователей в модуле users (AuthenticatedUser, UserWithoutPassword, UserWithPassword)
- Базовая типизация с использованием наследования типов

### Изменено
- Все endpoints Users защищены JWT Guard (кроме POST /users для регистрации)
- Улучшена типизация: убраны все `any` и `as`, добавлена строгая типизация
- Типы пользователей вынесены в модуль users с использованием базовых типов
- Обновлена документация (tasktracker.md, changelog.md)

### Исправлено
- Проблема с JWT_SECRET при создании и проверке токенов (использован registerAsync)
- Добавлено логирование для отладки аутентификации

### Планируется
- Модуль Workspaces
- Инициализация React frontend

## [2025-12-07] - Добавление хэширования паролей

### Добавлено
- Утилита для хэширования паролей (password.util.ts)
- Интеграция bcrypt в UsersService
- Автоматическое хэширование паролей при создании и обновлении пользователей

### Изменено
- UsersService теперь хэширует пароли перед сохранением в БД
- Обновлена документация (tasktracker.md, changelog.md)

### Планируется
- Аутентификация (JWT)
- Модуль Workspaces
- Инициализация React frontend

## [2025-12-07] - Настройка Backend и создание модуля Users

### Добавлено
- NestJS проект инициализирован
- Prisma ORM настроен (v7 с PostgreSQL adapter)
- Базовая схема БД:
  - Модель User (пользователи)
  - Модель Workspace (проекты)
  - Модель WorkspaceUser (связь многие-ко-многим)
  - Enum Role (ADMIN, MANAGER, WORKER)
- Модуль Users:
  - UsersController (CRUD endpoints)
  - UsersService (бизнес-логика)
  - DTO для валидации (CreateUserDto, UpdateUserDto)
- PrismaService для работы с БД
- Глобальная валидация данных
- Docker Compose для PostgreSQL
- Prisma Studio для просмотра БД

### Изменено
- Обновлена документация проекта

### Планируется
- Хэширование паролей (bcrypt)
- Аутентификация (JWT)
- Модуль Workspaces
- Инициализация React frontend

## [2025-02-19] - Инициализация проекта

### Добавлено
- Базовая структура монорепозитория
- Git репозиторий
- Docker Compose конфигурация для PostgreSQL
- Документация проекта (project.md, changelog.md)
- README.md с описанием проекта


