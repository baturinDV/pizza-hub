import { Category, Ingredient } from '@prisma/client';
import { create } from 'zustand';

interface State {
  isAdmin:boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useIsAdminStore = create<State>((set) => ({ 
    isAdmin: false,
    setIsAdmin: (isAdmin) => set({ isAdmin }),
}));
