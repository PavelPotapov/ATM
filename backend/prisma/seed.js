/**
 * @file: seed.js
 * @description: Seed-скрипт для создания начальных пользователей (admin, manager, worker)
 * @dependencies: @prisma/client, @prisma/adapter-pg, pg, bcrypt
 * @created: 2026-02-13
 */

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
    email: 'admin@atm.local',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'ATM',
    role: Role.ADMIN,
  },
  {
    email: 'manager@atm.local',
    password: 'manager123',
    firstName: 'Manager',
    lastName: 'ATM',
    role: Role.MANAGER,
  },
  {
    email: 'worker@atm.local',
    password: 'worker123',
    firstName: 'Worker',
    lastName: 'ATM',
    role: Role.WORKER,
  },
];

async function main() {
  console.log('Seeding database...');

  for (const user of defaultUsers) {
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
