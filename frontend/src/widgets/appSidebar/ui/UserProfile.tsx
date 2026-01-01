/**
 * @file: UserProfile.tsx
 * @description: Компонент профиля пользователя в footer sidebar
 * @created: 2025-01-XX
 */

import { ChevronUp, LogOut, User } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/shared/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdownMenu';
import { useUser } from '@/features/authLogin/api';
import { useLogout } from '@/features/authLogout';

export function UserProfile() {
  const user = useUser();
  const { mutate: logout, isPending } = useLogout();

  if (!user) {
    return null;
  }

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={displayName}>
              <User />
              <span className="truncate">{displayName}</span>
              <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width]"
          >
            <div className="px-2 py-1.5 text-sm">
              <div className="font-medium">{displayName}</div>
              <div className="text-muted-foreground text-xs">{user.email}</div>
              {user.role && (
                <div className="text-muted-foreground text-xs mt-1">
                  Роль: {user.role}
                </div>
              )}
            </div>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => logout()}
              disabled={isPending}
            >
              <LogOut />
              <span>{isPending ? 'Выход...' : 'Выйти'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

