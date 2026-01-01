/**
 * @file: AppSidebar.tsx
 * @description: Компонент боковой панели приложения
 * @created: 2025-01-XX
 */

import { FolderKanban, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/shared/ui/sidebar';
import { UserProfile } from '@/entities/user';
import { ROUTES } from '@/shared/config/routes.config';
import { Link, useRouterState } from '@tanstack/react-router';
import { useHasPermission, PERMISSIONS } from '@/features/permissions';

const allMenuItems = [
  {
    title: 'Workspaces',
    url: ROUTES.WORKSPACES,
    icon: FolderKanban,
    permission: null, // Все авторизованные пользователи видят Workspaces
  },
  {
    title: 'Пользователи',
    url: ROUTES.USERS,
    icon: Users,
    permission: PERMISSIONS.USERS_VIEW,
  },
] as const;

export function AppSidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  // Получаем разрешения один раз
  const hasUsersView = useHasPermission(PERMISSIONS.USERS_VIEW);

  // Фильтруем пункты меню на основе разрешений
  const menuItems = allMenuItems.filter((item) => {
    if (item.permission === null) return true; // Доступно всем
    if (item.permission === PERMISSIONS.USERS_VIEW) return hasUsersView;
    return false;
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Приложение</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

