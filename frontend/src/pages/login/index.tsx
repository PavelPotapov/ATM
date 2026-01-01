/**
 * @file: index.tsx
 * @description: Страница входа в систему
 * @created: 2025-01-XX
 */

import { LoginForm } from '@/features/authLogin';

export function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}

