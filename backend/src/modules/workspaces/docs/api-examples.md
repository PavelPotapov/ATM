# Workspaces API - Примеры запросов

Документация с примерами тел запросов для тестирования API через Postman.

## Авторизация

Все endpoints требуют JWT токен в заголовке:
```
Authorization: Bearer <ваш_jwt_токен>
```

---

## 1. POST /workspaces - Создание workspace

**URL:** `POST http://localhost:3000/workspaces`

**Headers:**
```
Authorization: Bearer <токен>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Проект строительства офисного здания",
  "description": "Строительство 5-этажного офисного здания в центре города"
}
```

**Минимальный запрос (без description):**
```json
{
  "name": "Проект №1"
}
```

**Ответ (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Проект строительства офисного здания",
  "description": "Строительство 5-этажного офисного здания в центре города",
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T10:00:00.000Z"
}
```

---

## 2. GET /workspaces - Получение списка workspace

**URL:** `GET http://localhost:3000/workspaces`

**Headers:**
```
Authorization: Bearer <токен>
```

**Body:** Нет (GET запрос)

**Ответ (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Проект строительства офисного здания",
    "description": "Строительство 5-этажного офисного здания в центре города",
    "createdAt": "2025-12-07T10:00:00.000Z",
    "updatedAt": "2025-12-07T10:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Реконструкция моста",
    "description": null,
    "createdAt": "2025-12-07T11:00:00.000Z",
    "updatedAt": "2025-12-07T11:00:00.000Z"
  }
]
```

**Примечание:** 
- ADMIN видит все workspace
- Остальные пользователи видят только те, где они участники

---

## 3. GET /workspaces/:id - Получение workspace с пользователями

**URL:** `GET http://localhost:3000/workspaces/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer <токен>
```

**Body:** Нет (GET запрос)

**Ответ (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Проект строительства офисного здания",
  "description": "Строительство 5-этажного офисного здания в центре города",
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T10:00:00.000Z",
  "users": [
    {
      "id": "53191c61-a5d5-4553-8d93-93d2cb4af828",
      "email": "admin@test.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "role": "ADMIN"
    },
    {
      "id": "63191c61-a5d5-4553-8d93-93d2cb4af829",
      "email": "manager@test.com",
      "firstName": "Петр",
      "lastName": "Петров",
      "role": "MANAGER"
    }
  ]
}
```

**Ошибка (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "У вас нет доступа к этому workspace",
  "error": "Forbidden"
}
```

---

## 4. PATCH /workspaces/:id - Обновление workspace

**URL:** `PATCH http://localhost:3000/workspaces/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer <токен>
Content-Type: application/json
```

**Body (JSON) - обновление только name:**
```json
{
  "name": "Обновленное название проекта"
}
```

**Body (JSON) - обновление только description:**
```json
{
  "description": "Обновленное описание проекта"
}
```

**Body (JSON) - обновление обоих полей:**
```json
{
  "name": "Обновленное название проекта",
  "description": "Обновленное описание проекта"
}
```

**Ответ (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Обновленное название проекта",
  "description": "Обновленное описание проекта",
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T12:00:00.000Z"
}
```

---

## 5. DELETE /workspaces/:id - Удаление workspace

**URL:** `DELETE http://localhost:3000/workspaces/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer <токен>
```

**Body:** Нет (DELETE запрос)

**Ответ (204 No Content):** Без тела ответа

**Ошибка (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "У вас нет доступа к этому workspace",
  "error": "Forbidden"
}
```

---

## 6. POST /workspaces/:id/users - Добавление пользователя в workspace

**URL:** `POST http://localhost:3000/workspaces/550e8400-e29b-41d4-a716-446655440000/users`

**Headers:**
```
Authorization: Bearer <токен>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "63191c61-a5d5-4553-8d93-93d2cb4af829"
}
```

**Ответ (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Проект строительства офисного здания",
  "description": "Строительство 5-этажного офисного здания в центре города",
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T10:00:00.000Z",
  "users": [
    {
      "id": "53191c61-a5d5-4553-8d93-93d2cb4af828",
      "email": "admin@test.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "role": "ADMIN"
    },
    {
      "id": "63191c61-a5d5-4553-8d93-93d2cb4af829",
      "email": "manager@test.com",
      "firstName": "Петр",
      "lastName": "Петров",
      "role": "MANAGER"
    }
  ]
}
```

**Ошибка (404 Not Found) - пользователь не найден:**
```json
{
  "statusCode": 404,
  "message": "Пользователь с ID 63191c61-a5d5-4553-8d93-93d2cb4af829 не найден",
  "error": "Not Found"
}
```

**Ошибка (403 Forbidden) - пользователь уже добавлен:**
```json
{
  "statusCode": 403,
  "message": "Пользователь уже является участником этого workspace",
  "error": "Forbidden"
}
```

---

## 7. DELETE /workspaces/:id/users/:userId - Удаление пользователя из workspace

**URL:** `DELETE http://localhost:3000/workspaces/550e8400-e29b-41d4-a716-446655440000/users/63191c61-a5d5-4553-8d93-93d2cb4af829`

**Headers:**
```
Authorization: Bearer <токен>
```

**Body:** Нет (DELETE запрос)

**Ответ (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Проект строительства офисного здания",
  "description": "Строительство 5-этажного офисного здания в центре города",
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T10:00:00.000Z",
  "users": [
    {
      "id": "53191c61-a5d5-4553-8d93-93d2cb4af828",
      "email": "admin@test.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "role": "ADMIN"
    }
  ]
}
```

---

## Примеры ошибок валидации

### Ошибка валидации (400 Bad Request) - пустое name:
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "name must be longer than or equal to 1 characters"
  ],
  "error": "Bad Request"
}
```

### Ошибка валидации (400 Bad Request) - невалидный UUID:
```json
{
  "statusCode": 400,
  "message": [
    "userId must be a UUID"
  ],
  "error": "Bad Request"
}
```

### Ошибка аутентификации (401 Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## Порядок тестирования

1. **Создайте пользователя** (POST /users) - если еще нет
2. **Войдите в систему** (POST /auth/login) - получите токен
3. **Создайте workspace** (POST /workspaces) - используйте токен
4. **Получите список workspace** (GET /workspaces)
5. **Получите workspace по ID** (GET /workspaces/:id)
6. **Обновите workspace** (PATCH /workspaces/:id)
7. **Добавьте пользователя** (POST /workspaces/:id/users)
8. **Удалите пользователя** (DELETE /workspaces/:id/users/:userId)
9. **Удалите workspace** (DELETE /workspaces/:id)

