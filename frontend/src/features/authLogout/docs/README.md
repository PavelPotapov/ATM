# authLogout Feature

Фича выхода из системы. Очищает сессию пользователя на клиенте и сервере.

## Контракт модуля

### Назначение

Отправляет запрос на сервер для удаления refresh token из БД и очистки cookie, очищает access token из localStorage, сбрасывает кэш TanStack Query и перенаправляет на страницу логина.

### Public API

```typescript
export { useLogout } from './api/hooks/useLogout';
```

### Функциональные возможности

- **useLogout** — мутация: POST `/auth/logout` → `onSettled` (вызывается при success и error):
  - `clearTokens()` — удаляет access token из localStorage
  - `queryClient.clear()` — сбрасывает весь кэш
  - `router.navigate('/login')` — редирект

### Использование

```typescript
import { useLogout } from '@/features/authLogout';

const { mutate: logout, isPending } = useLogout();
<button onClick={() => logout()} disabled={isPending}>Выйти</button>
```

### Внутренняя структура

```
authLogout/
├── api/
│   ├── queries/
│   │   └── logout.ts           # POST /auth/logout
│   ├── hooks/
│   │   └── useLogout.ts        # Мутация выхода
│   └── index.ts
└── docs/
    └── README.md
```

### Зависимости

- **Зависит от**: `@/shared/api`, `@/shared/lib/storage` (clearTokens), `@/features/authLogin` (authKeys для очистки кэша), `@/app/router`
