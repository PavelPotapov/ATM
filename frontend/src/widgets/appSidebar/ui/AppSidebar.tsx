/**
 * @file: AppSidebar.tsx
 * @description: Компонент боковой панели приложения
 * @created: 2025-01-XX
 */

import { FolderKanban } from 'lucide-react';
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
import { UserProfile } from './UserProfile';
import { ROUTES } from '@/shared/config/routes.config';
import { Link, useRouterState } from '@tanstack/react-router';

const menuItems = [
  {
    title: 'Workspaces',
    url: ROUTES.WORKSPACES,
    icon: FolderKanban,
  },
];

export function AppSidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  

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

