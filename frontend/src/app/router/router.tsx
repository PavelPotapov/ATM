/**
 * @file: router.tsx
 * @description: Конфигурация TanStack Router
 * @dependencies: @tanstack/react-router, @tanstack/react-router-devtools
 * @created: 2025-01-XX
 */

import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { LoginPage } from '@/pages/login';
import { ExamplePage } from '@/pages/example';
import { ROUTES } from './routes.config';

// Root route с компонентом для devtools
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools initialIsOpen={false} />}
    </>
  ),
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.LOGIN,
  component: LoginPage,
});

// Example route (временно, для тестирования)
const exampleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.ROOT,
  component: ExamplePage,
});

// Route tree
const routeTree = rootRoute.addChildren([loginRoute, exampleRoute]);

// Create router
export const router = createRouter({ routeTree });

