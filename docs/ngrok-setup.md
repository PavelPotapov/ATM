# Настройка ngrok для доступа к приложению

## Обзор

Данная инструкция описывает настройку ngrok для предоставления внешнего доступа к локальному приложению.

## Быстрый старт

### Шаг 1: Настройка переменных окружения

**Backend:**
```bash
cd backend
# Скопируйте пример конфигурации
copy .env.example .env
# Отредактируйте .env файл (пока можно оставить значения по умолчанию)
```

**Frontend:**
```bash
cd frontend
# Скопируйте пример конфигурации
copy .env.example .env
# Отредактируйте .env файл (пока можно оставить значения по умолчанию)
```

### Шаг 2: Выберите режим работы

**Для демонстрации (Production режим):**
1. Соберите фронтенд: `cd frontend && pnpm run build`
2. Запустите бэкенд в production: `cd backend && pnpm run build && NODE_ENV=production pnpm run start:prod`
3. Запустите ngrok: `ngrok http 3000`
4. Готово! Один URL для всего приложения

**Для разработки (Dev режим):**
1. Запустите бэкенд в dev: `cd backend && pnpm run start:dev`
2. Запустите фронтенд в dev: `cd frontend && pnpm run dev`
3. Запустите ngrok для бэкенда: `ngrok http 3000`
4. Обновите `VITE_API_URL` в `.env` фронтенда на ngrok URL (например: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)

## Два варианта работы с ngrok

### Вариант 1: Production режим (рекомендуется для демонстрации)

**Собрать фронтенд один раз + бэкенд в production:**

- ✅ Собрать фронтенд один раз: `cd frontend && pnpm run build`
- ✅ Бэкенд отдает фронтенд + API (все через один ngrok URL)
- ✅ Один ngrok туннель для всего приложения
- ✅ Проще для демонстрации - один URL для всего
- ❌ Нет HMR (Hot Module Replacement) - нужно пересобирать при изменениях

**Когда использовать:** Для демонстрации клиенту, тестирования на мобильных устройствах, когда не нужна активная разработка.

### Вариант 2: Dev режим (рекомендуется для разработки)

**Фронтенд в dev + бэкенд в dev:**

- ✅ Фронтенд на `localhost:5173` с HMR (быстрые изменения)
- ✅ Бэкенд на `localhost:3000` через ngrok
- ✅ Удобно для активной разработки
- ❌ Нужно два URL (локальный для фронта, ngrok для бэка)
- ❌ Нужно настраивать CORS

**Когда использовать:** Для активной разработки, когда нужно видеть изменения в реальном времени.

## Рекомендуемый подход для демонстрации: Production режим

**Почему этот подход для демонстрации:**
- ✅ Проще настройка - один ngrok URL
- ✅ Бэкенд отдает фронтенд автоматически
- ✅ Меньше проблем с CORS
- ✅ БД уже в Docker, менять не нужно
- ✅ Не нужно завертывать бэкенд в Docker

## Текущая архитектура

```
┌─────────────────┐
│   PostgreSQL     │  (Docker, порт 5432)
│   (Docker)       │
└─────────────────┘
         ▲
         │
┌─────────────────┐
│   Backend       │  (Локально, порт 3000)
│   (NestJS)      │
└─────────────────┘
         ▲
         │
┌─────────────────┐
│   Frontend      │  (Локально, порт 5173)
│   (Vite)        │
└─────────────────┘
```

## Шаги настройки

### 1. Установка ngrok

**Windows (через Chocolatey):**
```bash
choco install ngrok
```

**Или скачать с официального сайта:**
https://ngrok.com/download

**Или через npm (глобально):**
```bash
npm install -g ngrok
```

### 2. Регистрация и получение токена

1. Зарегистрируйтесь на https://ngrok.com
2. Получите токен авторизации в Dashboard
3. Авторизуйтесь:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

### 3. Запуск ngrok для бэкенда

Запустите ngrok, пробросив порт 3000 (бэкенд):

```bash
ngrok http 3000
```

После запуска вы получите URL вида:
```
Forwarding: https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3000
```

**Важно:** Сохраните этот URL (например, `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)

### 4. Настройка бэкенда (CORS)

**Создайте `.env` файл в `backend/` на основе `.env.example`:**

```bash
cd backend
copy .env.example .env
```

**Для Dev режима (фронтенд локально):**
```env
FRONTEND_URL=http://localhost:5173
```

**Для Production режима (все через ngrok):**
```env
FRONTEND_URL=http://localhost:5173
# В production бэкенд отдает фронтенд, CORS не критичен, но можно оставить
```

**Важно:** Бэкенд уже поддерживает несколько origins через запятую. Если нужно добавить ngrok URL фронтенда:

```env
FRONTEND_URL=http://localhost:5173,https://your-frontend-ngrok-url.ngrok-free.app
```

### 5. Настройка фронтенда (API URL)

**Создайте `.env` файл в `frontend/` на основе `.env.example`:**

```bash
cd frontend
copy .env.example .env
```

#### Для Production режима (Вариант A):

Фронтенд уже собран и встроен в бэкенд, настройка не требуется. Бэкенд автоматически отдает фронтенд и API через один ngrok URL.

#### Для Dev режима (Вариант B):

Обновите `.env` файл:

```env
# URL бэкенда через ngrok
VITE_API_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
```

**Важно:** 
- Замените `xxxx-xx-xx-xx-xx.ngrok-free.app` на ваш реальный ngrok URL
- Перезапустите dev-сервер фронтенда после изменения `.env`

### 6. Запуск приложения

#### Вариант A: Production режим (рекомендуется для демонстрации)

**Терминал 1 - PostgreSQL (Docker):**
```bash
docker-compose up -d
```

**Терминал 2 - Сборка фронтенда (один раз):**
```bash
cd frontend
pnpm install
pnpm run build
```

**Терминал 3 - Backend (production):**
```bash
cd backend
pnpm install
pnpm run build
# Windows PowerShell:
$env:NODE_ENV="production"; pnpm run start:prod
# Или Linux/Mac:
NODE_ENV=production pnpm run start:prod
```

**Терминал 4 - ngrok:**
```bash
ngrok http 3000
```

**Результат:** Один ngrok URL дает доступ и к фронтенду, и к API.

#### Вариант B: Dev режим (для активной разработки)

**Терминал 1 - PostgreSQL (Docker):**
```bash
docker-compose up -d
```

**Терминал 2 - ngrok (для бэкенда):**
```bash
ngrok http 3000
# Скопируйте полученный URL (например: https://xxxx-xx-xx-xx-xx.ngrok-free.app)
```

**Терминал 3 - Backend (dev):**
```bash
cd backend
pnpm install
pnpm run start:dev
```

**Терминал 4 - Frontend (dev):**
```bash
cd frontend
pnpm install
# Обновите .env файл с ngrok URL бэкенда:
# VITE_API_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
pnpm run dev
```

**Результат:** 
- Фронтенд: `http://localhost:5173` (локально)
- API: `https://xxxx-xx-xx-xx-xx.ngrok-free.app` (через ngrok)

## Дополнительные варианты

### Вариант 3: Фронтенд через ngrok (не рекомендуется)

Если нужно предоставить доступ к фронтенду:

1. Запустите ngrok для фронтенда:
   ```bash
   ngrok http 5173
   ```

2. Обновите CORS на бэкенде, добавив ngrok URL фронтенда

3. Обновите `VITE_API_URL` на фронтенде на ngrok URL бэкенда

**Проблемы:**
- Медленнее разработка (нет HMR)
- Больше проблем с CORS
- Сложнее настройка

### Вариант 4: Оба через ngrok

Если нужно предоставить доступ и к фронтенду, и к бэкенду:

1. Запустите два ngrok туннеля:
   ```bash
   # Терминал 1
   ngrok http 3000
   
   # Терминал 2
   ngrok http 5173
   ```

2. Обновите CORS на бэкенде
3. Обновите `VITE_API_URL` на фронтенде

### Вариант 5: Бэкенд в Docker + ngrok

Если хотите завернуть бэкенд в Docker:

1. Создайте `Dockerfile` для бэкенда
2. Обновите `docker-compose.yml`
3. Запустите ngrok для Docker контейнера

**Не рекомендуется**, так как:
- Усложняет разработку
- Медленнее перезапуск
- Больше конфигурации

## Постоянный ngrok URL (платный план)

Если нужен постоянный URL (не меняется при перезапуске):

1. Перейдите на платный план ngrok
2. Зарезервируйте домен в Dashboard
3. Используйте зарезервированный домен:
   ```bash
   ngrok http 3000 --domain=your-reserved-domain.ngrok.app
   ```

## Безопасность

⚠️ **Важно:**
- ngrok URL публично доступен
- Не используйте в production без дополнительной защиты
- Рассмотрите использование ngrok с аутентификацией:
  ```bash
  ngrok http 3000 --basic-auth="username:password"
  ```

## Проверка работы

1. Откройте фронтенд: `http://localhost:5173`
2. Проверьте, что запросы идут на ngrok URL бэкенда
3. Проверьте Network tab в DevTools браузера

## Troubleshooting

### CORS ошибки

- Убедитесь, что `FRONTEND_URL` на бэкенде содержит правильный URL
- Проверьте, что фронтенд отправляет запросы на правильный `VITE_API_URL`

### ngrok URL меняется при перезапуске

- Это нормально для бесплатного плана
- Обновляйте `.env` файл фронтенда при каждом перезапуске ngrok
- Или используйте платный план с постоянным доменом

### Бэкенд не доступен через ngrok

- Убедитесь, что бэкенд запущен на порту 3000
- Проверьте, что ngrok запущен и указывает на порт 3000
- Проверьте логи ngrok

## Полезные ссылки

- [ngrok Documentation](https://ngrok.com/docs)
- [ngrok Dashboard](https://dashboard.ngrok.com)

