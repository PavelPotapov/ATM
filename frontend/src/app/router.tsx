/**
 * @file: router.tsx
 * @description: Конфигурация TanStack Router
 * @dependencies: @tanstack/react-router
 * @created: 2025-01-XX
 */

import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { LoginPage } from '@/pages/login';
import { ExamplePage } from '@/pages/example';

// Root route
const rootRoute = createRootRoute();

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Example route (временно, для тестирования)
const exampleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ExamplePage,
});

// Route tree
const routeTree = rootRoute.addChildren([loginRoute, exampleRoute]);

// Create router
export const router = createRouter({ routeTree });

// Declare router types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

