# authLogin Feature

Фича входа в систему. Содержит форму логина, API-запросы и управление сессией пользователя.

## Контракт модуля

### Назначение

Предоставляет UI и логику для аутентификации: форма ввода email/password, отправка запроса, сохранение access token, кэширование данных пользователя и редирект после успешного входа.

### Public API

```typescript
// Компоненты
export { LoginForm } from './ui/LoginForm';

// Хуки
export { useLogin } from './api/hooks/useLogin';
export { useUser } from './api/hooks/useUser';

// Query Keys
export { authKeys } from './api/queryKeys';

// Типы
export type { LoginDto, AuthResponse } from './api/dto/auth.dto';
```

### Функциональные возможности

- **LoginForm** — форма с валидацией (email pattern, password min 6 символов), обработка ошибок, loading-состояние
- **useLogin** — мутация: POST `/auth/login` → сохраняет access_token в localStorage → кэширует user в TanStack Query → редирект на `/workspaces`
- **useUser** — запрос текущего пользователя: GET `/auth/me`, выполняется только при наличии access token (`enabled: !!hasAccessToken()`)

### Использование

```typescript
import { LoginForm } from '@/features/authLogin';
import { useUser } from '@/features/authLogin';

// На странице логина
<LoginForm />

// В любом защищённом компоненте
const user = useUser();
```

### Внутренняя структура

```
authLogin/
├── ui/
│   └── LoginForm.tsx           # Форма входа (react-hook-form)
├── api/
│   ├── dto/
│   │   └── auth.dto.ts         # LoginDto, AuthResponse
│   ├── queries/
│   │   ├── login.ts            # POST /auth/login
│   │   └── getMe.ts            # GET /auth/me
│   ├── hooks/
│   │   ├── useLogin.ts         # Мутация логина
│   │   └── useUser.ts          # Запрос текущего пользователя
│   ├── queryKeys.ts            # authKeys (query key factory)
│   └── index.ts                # Public API
└── docs/
    └── README.md
```

### Зависимости

- **Зависит от**: `@/shared/api` (axiosClient), `@/shared/lib/storage` (jwtTokenStorage), `@/shared/config` (endpoints, routes), `@/app/router`
- **Зависят от него**: `@/features/authLogout` (authKeys), `@/app/router` (route guard через `hasAccessToken`)

### Токены

- **access_token**: сохраняется в `localStorage` через `setAccessToken()`
- **refresh_token**: устанавливается бэкендом в httpOnly cookie — фронтенд его не видит и не управляет

### Ограничения и TODO

- AuthResponse тип живёт внутри feature — если понадобится в entities, нужно вынести
- `useUser` использует `gcTime: Infinity` — данные пользователя никогда не удаляются из кэша
