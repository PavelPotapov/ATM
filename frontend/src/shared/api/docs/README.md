# shared/api

Базовый API-слой приложения. HTTP-клиент, конфигурация TanStack Query и автоматическое управление JWT-токенами.

## Контракт модуля

### Назначение

Предоставляет настроенный Axios-клиент с автоматической JWT-авторизацией, обработкой 401 через refresh token (httpOnly cookie) и конфигурацию TanStack Query.

### Public API

```typescript
export { apiClient } from './axiosClient';       // Axios instance
export { queryClient } from './queryClient';       // TanStack Query client
export { API_ENDPOINTS } from '@/shared/config/endpoints.config';
```

### Функциональные возможности

#### axiosClient

- **Base URL**: production — пустая строка (relative paths), development — `VITE_API_URL` или `http://localhost:3000`
- **withCredentials: true** — cookies отправляются с каждым запросом (для refresh token)
- **Request interceptor**: добавляет `Authorization: Bearer <access_token>` из localStorage
- **Response interceptor**: при 401 автоматически вызывает `/auth/refresh` → получает новый access_token → повторяет запрос
- **Race condition protection**: несколько одновременных 401 ждут один и тот же refresh Promise

#### queryClient

- `staleTime: 5 мин` — данные считаются свежими 5 минут
- `retry: 1` — одна повторная попытка для queries
- `retry: false` — без повторов для mutations
- `QueryCache.onError` и `MutationCache.onError` — логирование ошибок

### Использование

```typescript
import { apiClient } from '@/shared/api';

// GET запрос
const response = await apiClient.get<UserDto[]>(API_ENDPOINTS.USERS.LIST);

// POST запрос
const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, loginDto);
```

### Внутренняя структура

```
shared/api/
├── axiosClient.ts      # Axios instance + interceptors
├── queryClient.ts      # TanStack Query configuration
├── index.ts            # Barrel exports
└── docs/
    └── README.md
```

### Зависимости

- **Зависит от**: `@/shared/lib/storage` (jwtTokenStorage), `@/shared/config` (endpoints, routes), `@/app/router` (dynamic import для redirect)
- **Зависят от него**: все entities/features/widgets, которые делают API-запросы

### Конфигурация

| Переменная | Описание | Default |
|-----------|----------|---------|
| `VITE_API_URL` | URL бэкенда (только dev) | `http://localhost:3000` |

### Ограничения и TODO

- `axiosClient` динамически импортирует `@/app/router` для redirect — это обратная зависимость (shared → app), но через dynamic import для избежания circular dependency
