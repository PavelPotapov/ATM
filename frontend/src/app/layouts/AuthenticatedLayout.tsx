/**
 * @file: AuthenticatedLayout.tsx
 * @description: Layout для защищенных страниц с sidebar
 * @created: 2025-01-XX
 */

import { Outlet } from '@tanstack/react-router';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/ui/sidebar';
import { ThemeToggle } from '@/shared/ui/themeToggle';
import { AppSidebar } from '@/widgets/appSidebar';
import { cvaHeader, cvaMain } from './styles/AuthenticatedLayout.styles';

export function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className={cvaHeader()}>
          <SidebarTrigger />
          <ThemeToggle />
        </header>
        <main className={cvaMain()}>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

