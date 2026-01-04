# Step-by-Step Setup Guide

## Step 0: Install ngrok

**Recommended: Download directly (easiest way)**

1. Go to https://ngrok.com/download
2. Download for Windows (ZIP file)
3. Extract the ZIP file (you'll get `ngrok.exe`)
4. Add to PATH or use full path:
   - Option A: Copy `ngrok.exe` to a folder in your PATH (e.g., `C:\Windows\System32`)
   - Option B: Create a folder like `C:\tools\ngrok` and add it to PATH
   - Option C: Just use full path: `C:\path\to\ngrok.exe http 3000`

**Alternative: Chocolatey (if you have it):**
```bash
# In PowerShell as Admin
choco install ngrok
```

**After installation, register and get auth token:**
1. Go to https://ngrok.com and sign up (free account)
2. Get your auth token from Dashboard (https://dashboard.ngrok.com/get-started/your-authtoken)
3. Run: `ngrok config add-authtoken YOUR_AUTH_TOKEN`

---

## What to do RIGHT NOW

### Step 1: Create environment files

**Backend:**
```bash
cd backend
copy .env.example .env
```

**Frontend:**
```bash
cd frontend
copy .env.example .env
```

**For now, you can leave default values as they are.**

**Tip:** You can run all commands from the project root using npm/pnpm scripts (see below).

---

## Production Mode Setup

### Steps:

1. **Start PostgreSQL (if not running):**
   ```bash
   # From project root:
   pnpm run docker:up
   # Or manually:
   docker-compose up -d
   ```

2. **Build and start in production:**
   ```bash
   # From project root - builds both frontend and backend, then starts backend:
   pnpm run start:prod
   ```
   
   **Or step by step:**
   ```bash
   # Build frontend:
   pnpm run build:frontend
   
   # Build and start backend:
   pnpm run build:backend
   pnpm run start:backend:prod
   ```

3. **Start ngrok (in separate terminal):**
   ```bash
   ngrok http 3000
   ```

4. **Done!** You'll get one URL that serves both frontend and API.

**Result:** One ngrok URL for everything (frontend + API)

**Important:** 
- Ngrok URL can change when you restart ngrok - **no need to update anything!**
- Frontend uses relative paths automatically (works with any ngrok URL)
- Backend CORS allows all origins in production mode

---

## Summary

**From project root:**
1. Copy `.env.example` to `.env` in both folders (backend and frontend)
2. Start PostgreSQL: `pnpm run docker:up`
3. Build and start: `pnpm run start:prod`
4. Start ngrok: `ngrok http 3000` (in separate terminal)
5. Done! Use the ngrok URL to access your app.

---

## Understanding .env files

### Backend `.env`:
- `FRONTEND_URL` - Not used in production (CORS allows all origins)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET`, `JWT_REFRESH_SECRET` - JWT tokens secrets

### Frontend `.env`:
- `VITE_API_URL` - Not used in production (frontend uses relative paths automatically)

**Key point:** In production mode, `.env` files are mostly for reference. The app works automatically with any ngrok URL!

---

## Постоянный ngrok URL

**Важно:** С текущим решением ngrok URL может меняться - ничего обновлять не нужно!

Если нужна **постоянная ссылка** для демонстрации - см. `docs/PERMANENT_NGROK_URL.md`

---

## Need Help?

- Full documentation: `docs/ngrok-setup.md`
- Permanent URL setup: `docs/PERMANENT_NGROK_URL.md`
