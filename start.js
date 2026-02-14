/**
 * @file: start.js
 * @description: Production startup script — runs migrations, seed, then starts the app
 * @created: 2026-02-14
 */

const { execSync } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');

function run(cmd, label) {
  console.log(`\n▸ ${label}...`);
  try {
    execSync(cmd, { cwd: backendDir, stdio: 'inherit', env: process.env });
    console.log(`  ✅ ${label} — done`);
  } catch (err) {
    console.error(`  ❌ ${label} — failed (exit code ${err.status})`);
    process.exit(1);
  }
}

// 1. Apply database migrations
run('npx prisma migrate deploy', 'Prisma migrate deploy');

// 2. Seed database (idempotent — skips existing users)
run('npx prisma db seed', 'Prisma db seed');

// 3. Start the NestJS application
console.log('\n▸ Starting NestJS...\n');
require('./backend/dist/src/main.js');
