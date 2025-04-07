import { Category, Ingredient } from '@prisma/client';
import { create } from 'zustand';

interface State {
  activeIngredient: Ingredient | null;
  setActiveIngredient: (activeIngredient: Ingredient | null) => void;
}

export const useIngredientAdminStore = create<State>((set) => ({
  activeIngredient: null,
  setActiveIngredient: (activeIngredient) => set({ activeIngredient }),
}));
