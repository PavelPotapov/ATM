/**
 * @file: router.tsx
 * @description: Конфигурация TanStack Router
 * @dependencies: @tanstack/react-router, @tanstack/react-router-devtools
 * @created: 2025-01-XX
 */

import { createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { LoginPage } from '@/pages/login';
import { WorkspacesPage } from '@/pages/workspaces';
import { WorkspacePage } from '@/pages/workspaces/$workspaceId';
import { UsersPage } from '@/pages/users';
import { AuthenticatedLayout } from '@/app/layouts/AuthenticatedLayout';
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

// Layout route для защищенных страниц
const authenticatedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated-layout',
  beforeLoad: () => {
    if (!hasAccessToken()) {
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
  },
  component: AuthenticatedLayout,
});

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
  getParentRoute: () => authenticatedLayoutRoute,
  path: ROUTES.WORKSPACES,
  component: WorkspacesPage,
});

// Workspace detail route (защищенная страница)
const workspaceDetailRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/workspaces/$workspaceId',
  component: WorkspacePage,
});

// Users route (защищенная страница)
const usersRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: ROUTES.USERS,
  component: UsersPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedLayoutRoute.addChildren([workspacesRoute, workspaceDetailRoute, usersRoute]),
]);

// Create router
export const router = createRouter({ routeTree });

