# Common (Общие модули и утилиты)

## Назначение

Общие модули, сервисы и утилиты, используемые во всем приложении.

## Структура

### PrismaModule

Глобальный модуль, предоставляющий `PrismaService` для работы с базой данных.

**Файлы:**

- `prisma.module.ts` - модуль (помечен как `@Global()`)
- `prisma.service.ts` - сервис для работы с Prisma Client

**Особенности:**

- Автоматически подключается/отключается при старте/остановке приложения
- Использует `@prisma/adapter-pg` и `pg` для Prisma v7
- Подключение к БД через `DATABASE_URL` из `.env`

### Утилиты

#### password.util.ts

Утилиты для работы с паролями:

- `hashPassword(password: string)` - хэширование пароля (bcrypt, 10 раундов)
- `comparePassword(password: string, hash: string)` - сравнение пароля с хэшем

**Использование:**

```typescript
import {
  hashPassword,
  comparePassword,
} from '../../common/utils/password.util';
```

### Конфигурация

#### swagger.config.ts

Настройка Swagger для API документации:

- `setupSwagger(app: INestApplication)` - настраивает Swagger UI для приложения

**Использование:**

```typescript
import { setupSwagger } from './common/config/swagger.config';

// В main.ts
setupSwagger(app);
```

**Особенности:**

- Настраивает JWT авторизацию в Swagger
- Сохраняет авторизацию между перезагрузками страницы
- Доступен по адресу `/api`

## Зависимости

- `@prisma/client` - Prisma Client
- `@prisma/adapter-pg` - адаптер для PostgreSQL
- `pg` - драйвер PostgreSQL
- `bcrypt` - хэширование паролей

## Точки интеграции

### PrismaModule

- Импортируется в `AppModule` как глобальный модуль
- Доступен во всех модулях без явного импорта
- Используется во всех сервисах для работы с БД

### password.util

- Используется в `UsersService` при создании/обновлении пользователей
- Используется в `AuthService` при проверке пароля
