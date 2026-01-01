/**
 * @file: router.tsx
 * @description: Конфигурация TanStack Router
 * @dependencies: @tanstack/react-router, @tanstack/react-router-devtools
 * @created: 2025-01-XX
 */

import { createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { LoginPage } from '@/pages/login';
import { ExamplePage } from '@/pages/example';
import { WorkspacesPage } from '@/pages/workspaces';
import { ROUTES } from '@/shared/config/routes.config';
import { hasAccessToken } from '@/shared/lib/storage/jwtTokenStorage';

// Root route с компонентом для devtools
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools initialIsOpen={false} />}
    </>
  ),
});

// Функция для проверки авторизации
const requireAuth = () => {
  if (!hasAccessToken()) {
    throw redirect({
      to: ROUTES.LOGIN,
    });
  }
};

// Функция для редиректа авторизованных пользователей с логина
const redirectIfAuthenticated = () => {
  if (hasAccessToken()) {
    throw redirect({
      to: ROUTES.WORKSPACES,
    });
  }
};

// Login route (редирект на workspaces, если уже авторизован)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.LOGIN,
  beforeLoad: redirectIfAuthenticated,
  component: LoginPage,
});

// Workspaces route (защищенная страница)
const workspacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.WORKSPACES,
  beforeLoad: requireAuth,
  component: WorkspacesPage,
});

// Example route (временно, для тестирования)
const exampleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.ROOT,
  component: ExamplePage,
});

// Route tree
const routeTree = rootRoute.addChildren([loginRoute, workspacesRoute, exampleRoute]);

// Create router
export const router = createRouter({ routeTree });

