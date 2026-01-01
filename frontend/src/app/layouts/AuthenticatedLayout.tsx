/**
 * @file: AuthenticatedLayout.tsx
 * @description: Layout для защищенных страниц с sidebar
 * @created: 2025-01-XX
 */

import { Outlet } from '@tanstack/react-router';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/ui/sidebar';
import { ThemeToggle } from '@/shared/ui/themeToggle';
import { AppSidebar } from '@/widgets/appSidebar';

export function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
          <SidebarTrigger />
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

