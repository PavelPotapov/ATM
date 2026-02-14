/**
 * @file: start.js
 * @description: Production startup script — runs migrations, seed, then starts the app
 * @created: 2026-02-14
 */

const { execSync } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');

// pg installed in backend/node_modules, not root
const { Pool } = require(path.join(backendDir, 'node_modules', 'pg'));

function run(cmd, label) {
  console.log(`\n▸ ${label}...`);
  try {
    const output = execSync(cmd, { cwd: backendDir, env: process.env, encoding: 'utf-8' });
    if (output && output.trim()) {
      console.log(output);
    }
    console.log(`  ✅ ${label} — done`);
  } catch (err) {
    console.error(`  ❌ ${label} — failed (exit code ${err.status})`);
    if (err.stdout) console.log('STDOUT:', err.stdout);
    if (err.stderr) console.error('STDERR:', err.stderr);
    process.exit(1);
  }
}

async function checkDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('  ❌ DATABASE_URL is not set!');
    process.exit(1);
  }

  // Mask URL for logging (show host only)
  try {
    const parsed = new URL(url);
    console.log(`  DATABASE_URL host: ${parsed.hostname}:${parsed.port}, db: ${parsed.pathname}`);
  } catch {
    console.log('  DATABASE_URL is set but could not parse');
  }

  // Connect via pg Pool (same way as PrismaService) and check tables
  const pool = new Pool({ connectionString: url });
  try {
    const result = await pool.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`
    );
    const tables = result.rows.map(r => r.tablename);
    console.log(`  Tables in public schema (${tables.length}): ${tables.join(', ') || '(none)'}`);

    if (tables.includes('users')) {
      const countResult = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`  Users count: ${countResult.rows[0].count}`);
    } else {
      console.log('  ⚠️  "users" table NOT found via pg Pool!');
    }
  } catch (err) {
    console.error('  ❌ pg Pool query failed:', err.message);
  } finally {
    await pool.end();
  }
}

async function main() {
  // 0. Check DATABASE_URL
  console.log('\n▸ Checking DATABASE_URL...');
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('  ❌ DATABASE_URL is not set!');
    process.exit(1);
  }
  try {
    const parsed = new URL(url);
    console.log(`  Host: ${parsed.hostname}:${parsed.port}, DB: ${parsed.pathname}`);
  } catch {
    console.log('  DATABASE_URL is set (could not parse URL)');
  }

  // 1. Apply database migrations
  run('npx prisma migrate deploy', 'Prisma migrate deploy');

  // 2. Check tables after migration (via pg Pool — same as PrismaService)
  console.log('\n▸ Checking database tables via pg Pool...');
  await checkDatabase();

  // 3. Seed database (idempotent — skips existing users)
  run('npx prisma db seed', 'Prisma db seed');

  // 4. Check tables after seed
  console.log('\n▸ Checking database tables after seed...');
  await checkDatabase();

  // 5. Start the NestJS application
  console.log('\n▸ Starting NestJS...\n');
  require('./backend/dist/src/main.js');
}

main().catch((err) => {
  console.error('❌ Startup failed:', err);
  process.exit(1);
});
