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

## Choose Your Mode

### Mode A: Production (for demo) ⭐ Recommended

**When to use:** When you want to show the app to someone, test on mobile, or just need a stable version.

**Steps:**

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
   cd backend
   $env:NODE_ENV="production"
   pnpm run start:prod
   ```

3. **Start ngrok (in separate terminal):**
   ```bash
   ngrok http 3000
   ```

4. **Important:** After starting ngrok, update environment files:
   - Update `frontend/.env`: `VITE_API_URL=https://your-ngrok-url.ngrok-free.app`
   - Update `backend/.env`: `FRONTEND_URL=https://your-ngrok-url.ngrok-free.app`
   - Rebuild frontend: `pnpm run build:frontend`
   - Restart backend (stop and run `pnpm run start:backend:prod` again)

5. **Done!** You'll get one URL that serves both frontend and API.

**Result:** One ngrok URL for everything (frontend + API)

---

### Mode B: Dev (for development)

**When to use:** When you're actively coding and need to see changes instantly.

**Steps:**

1. **Start ngrok and copy the URL:**
   ```bash
   ngrok http 3000
   # Copy the URL (e.g., https://xxxx-xx-xx-xx-xx.ngrok-free.app)
   ```

2. **Update `frontend/.env`:**
   ```env
   VITE_API_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
   ```
   **Important:** Replace `xxxx-xx-xx-xx-xx.ngrok-free.app` with your actual ngrok URL from step 1.
   
   **What is this?** This tells the frontend where to send API requests. In dev mode, it should be your ngrok URL (not localhost, because external devices need to access it).

3. **Start backend:**
   ```bash
   cd backend
   pnpm run start:dev
   ```

4. **Start frontend:**
   ```bash
   cd frontend
   pnpm run dev
   ```

**Result:** 
- Frontend: `http://localhost:5173` (local, with hot reload)
- API: `https://xxxx-xx-xx-xx-xx.ngrok-free.app` (via ngrok)

---

## Don't Forget PostgreSQL

**Start database:**
```bash
docker-compose up -d
```

---

## Summary

**For demo (easiest) - from project root:**
1. Copy `.env.example` to `.env` in both folders
2. Start PostgreSQL: `pnpm run docker:up`
3. Build and start: `pnpm run start:prod`
4. Start ngrok: `ngrok http 3000` (in separate terminal)
5. Done!

**For development - from project root:**
1. Copy `.env.example` to `.env` in both folders
2. Start PostgreSQL: `pnpm run docker:up`
3. Start ngrok: `ngrok http 3000` (copy URL)
4. Update `frontend/.env` with ngrok URL
5. Start backend: `pnpm run dev:backend` (in one terminal)
6. Start frontend: `pnpm run dev:frontend` (in another terminal)

---

## Understanding .env files

### Backend `.env`:
- `FRONTEND_URL` - Where frontend is running (for CORS)
  - Dev mode: `http://localhost:5173`
  - Production: same as above (backend serves frontend, so CORS is less critical)

### Frontend `.env`:
- `VITE_API_URL` - Where backend API is running
  - **Local dev (without ngrok):** `http://localhost:3000`
  - **With ngrok (for external access):** `https://your-ngrok-url.ngrok-free.app`
  
**Key point:** In `frontend/.env`, you specify the **backend URL** (which can be localhost OR ngrok URL, depending on your needs).

---

## Need Help?

- Full documentation: `docs/ngrok-setup.md`

