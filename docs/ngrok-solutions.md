# Решения проблемы меняющегося ngrok URL

## Проблема

При каждом перезапуске ngrok URL меняется, что требует:
- Обновления `.env` файлов
- Пересборки фронтенда
- Перезапуска бэкенда

## Решения

### ✅ Решение 1: Относительные пути (РЕАЛИЗОВАНО)

**Как работает:**
- В production фронтенд использует `window.location.origin` (текущий домен)
- Фронтенд и API на одном ngrok домене, поэтому относительные пути работают
- CORS настроен на разрешение всех origins в production

**Преимущества:**
- ✅ Не нужно обновлять `.env` при смене ngrok URL
- ✅ Не нужно пересобирать фронтенд
- ✅ Работает автоматически

**Недостатки:**
- ❌ Не работает в dev режиме (нужен явный URL)

**Использование:**
Просто запускайте как обычно - всё работает автоматически!

---

### Решение 2: Постоянный ngrok домен (платный)

**Как работает:**
1. Переходите на платный план ngrok
2. Резервируете постоянный домен в Dashboard
3. Используете: `ngrok http 3000 --domain=your-domain.ngrok.app`

**Преимущества:**
- ✅ URL не меняется
- ✅ Можно использовать в `.env` файлах

**Недостатки:**
- ❌ Платно ($8/месяц)

**Настройка:**
```bash
# После резервирования домена в Dashboard
ngrok http 3000 --domain=your-reserved-domain.ngrok.app
```

---

### Решение 3: Автоматический скрипт обновления

**Как работает:**
Скрипт автоматически извлекает ngrok URL и обновляет `.env` файлы.

**Создайте `scripts/update-ngrok-url.ps1`:**
```powershell
# Получаем ngrok URL из API
$ngrokUrl = (Invoke-RestMethod http://localhost:4040/api/tunnels).tunnels[0].public_url

# Обновляем frontend/.env
$frontendEnv = Get-Content frontend\.env -Raw
$frontendEnv = $frontendEnv -replace 'VITE_API_URL=.*', "VITE_API_URL=$ngrokUrl"
Set-Content frontend\.env $frontendEnv

# Обновляем backend/.env
$backendEnv = Get-Content backend\.env -Raw
$backendEnv = $backendEnv -replace 'FRONTEND_URL=.*', "FRONTEND_URL=$ngrokUrl"
Set-Content backend\.env $backendEnv

Write-Host "Updated to: $ngrokUrl"
```

**Использование:**
```bash
# После запуска ngrok
./scripts/update-ngrok-url.ps1
pnpm run build:frontend
# Перезапустить бэкенд
```

---

### Решение 4: Dev режим (для разработки)

**Как работает:**
В dev режиме `VITE_API_URL` читается динамически, без пересборки.

**Преимущества:**
- ✅ Можно менять URL без пересборки
- ✅ Hot reload работает

**Недостатки:**
- ❌ Нужно обновлять `.env` вручную
- ❌ Медленнее production

---

## Рекомендация

**Для production:** Используйте Решение 1 (относительные пути) - уже реализовано!

**Для разработки:** Используйте Решение 4 (dev режим)

**Если нужен постоянный URL:** Используйте Решение 2 (платный ngrok)

