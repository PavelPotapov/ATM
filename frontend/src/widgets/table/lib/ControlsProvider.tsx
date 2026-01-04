/**
 * @file: ControlsProvider.tsx
 * @description: Провайдер для управления видимостью панели фильтров
 * @dependencies: useLocalStorage
 * @created: 2025-01-04
 */

import { createContext, useContext } from 'react';
import { useLocalStorage } from '@/shared/hooks';

interface ControlsContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ControlsContext = createContext<ControlsContextType | null>(null);

export function ControlsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useLocalStorage('data-table-controls', true);

  return (
    <ControlsContext.Provider value={{ open, setOpen }}>
      <div className="group/controls" data-expanded={open}>
        {children}
      </div>
    </ControlsContext.Provider>
  );
}

export function useControls() {
  const context = useContext(ControlsContext);

  if (!context) {
    throw new Error('useControls must be used within a ControlsProvider');
  }

  return context;
}

