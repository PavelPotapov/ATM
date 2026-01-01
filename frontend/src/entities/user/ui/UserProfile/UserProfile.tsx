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
import {
  cvaDisplayName,
  cvaChevron,
  cvaDropdownContent,
  cvaUserInfo,
  cvaUserName,
  cvaUserEmail,
  cvaUserRole,
} from './styles/UserProfile.styles';

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
              <span className={cvaDisplayName()}>{displayName}</span>
              <ChevronUp className={cvaChevron()} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className={cvaDropdownContent()}
          >
            <div className={cvaUserInfo()}>
              <div className={cvaUserName()}>{displayName}</div>
              <div className={cvaUserEmail()}>{user.email}</div>
              {user.role && (
                <div className={cvaUserRole()}>
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

