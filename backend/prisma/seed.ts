/**
 * @file: seed.ts
 * @description: Seed-скрипт для создания начальных пользователей (admin, manager, worker)
 * @dependencies: @prisma/client, bcrypt
 * @created: 2026-02-13
 */

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

interface SeedUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

const defaultUsers: SeedUser[] = [
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
  console.log('🌱 Seeding database...');

  for (const user of defaultUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existing) {
      console.log(`  ⏭ User ${user.email} already exists, skipping`);
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

    console.log(`  ✅ Created ${user.role}: ${user.email} (password: ${user.password})`);
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
