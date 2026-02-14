/**
 * @file: seed.js
 * @description: Seed-скрипт для создания начальных пользователей (admin, manager, worker)
 * @dependencies: @prisma/client, @prisma/adapter-pg, pg, bcrypt, dotenv
 * @created: 2026-02-13
 */

require('dotenv').config();

const { PrismaClient, Role } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

const defaultUsers = [
  {
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    firstName: process.env.SEED_ADMIN_FIRST_NAME || 'Admin',
    lastName: process.env.SEED_ADMIN_LAST_NAME || 'ATM',
    role: Role.ADMIN,
  },
  {
    email: process.env.SEED_MANAGER_EMAIL,
    password: process.env.SEED_MANAGER_PASSWORD,
    firstName: process.env.SEED_MANAGER_FIRST_NAME || 'Manager',
    lastName: process.env.SEED_MANAGER_LAST_NAME || 'ATM',
    role: Role.MANAGER,
  },
  {
    email: process.env.SEED_WORKER_EMAIL,
    password: process.env.SEED_WORKER_PASSWORD,
    firstName: process.env.SEED_WORKER_FIRST_NAME || 'Worker',
    lastName: process.env.SEED_WORKER_LAST_NAME || 'ATM',
    role: Role.WORKER,
  },
];

async function main() {
  console.log('Seeding database...');

  for (const user of defaultUsers) {
    if (!user.email || !user.password) {
      console.log(`  skip: ${user.role} — SEED_${user.role}_EMAIL or SEED_${user.role}_PASSWORD not set`);
      continue;
    }

    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existing) {
      console.log(`  skip: ${user.email} already exists`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    console.log(`  created ${user.role}: ${user.email}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
