# API Client

Модуль для работы с API: axios клиент и TanStack Query client.

## Структура

- `axios-client.ts` - axios клиент с интерцептором для JWT токенов
- `query-client.ts` - TanStack Query client
- `index.ts` - экспорт всех публичных API

## Использование

### Axios клиент

```typescript
import { apiClient } from '@/shared/api';

// GET запрос
const response = await apiClient.get('/users');

// POST запрос
const newUser = await apiClient.post('/users', { email, password });
```

### TanStack Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
});

// Mutation
const mutation = useMutation({
  mutationFn: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
});
```

## Особенности

### JWT токены

Токен автоматически добавляется в заголовки из `localStorage.getItem('accessToken')`.

### React Query Devtools

В dev режиме доступны React Query Devtools для отладки запросов.

## Конфигурация

Базовый URL API настраивается через переменную окружения `VITE_API_URL` (по умолчанию: `http://localhost:3000`).

Создайте файл `.env` в папке `frontend/` на основе `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

Vite автоматически загружает переменные из `.env` файла. Переменные должны начинаться с `VITE_` для доступа в коде через `import.meta.env.VITE_API_URL`.

