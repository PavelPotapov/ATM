/**
 * @file: router.d.ts
 * @description: Декларация типов для TanStack Router
 * @created: 2025-01-XX
 */

import type { router } from './router';

// Декларация типов для TypeScript
// Это нужно для типобезопасной навигации - TypeScript будет знать все ваши роуты
// и их параметры, что даст автодополнение и проверку типов при использовании
// useNavigate(), Link, navigate() и других API роутера
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

