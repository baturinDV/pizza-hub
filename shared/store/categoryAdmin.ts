import { Category } from '@prisma/client';
import { create } from 'zustand';

interface State {
  activeCategory: Category | null;
  setActiveCategory: (activeCategory: Category | null) => void;
}

export const useCategoryAdminStore = create<State>((set) => ({
  activeCategory: null,
  setActiveCategory: (activeCategory) => set({ activeCategory }),
}));
