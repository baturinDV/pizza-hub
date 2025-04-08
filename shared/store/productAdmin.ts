import { ProductWithIngredients } from '@/@types/productWithIngredients';
import { Category } from '@prisma/client';
import { create } from 'zustand';

interface State {
  activeProduct: ProductWithIngredients | null;
  setActiveProduct: (activeProduct: ProductWithIngredients | null) => void;
}

export const useProductAdminStore = create<State>((set) => ({
  activeProduct: null,
  setActiveProduct: (activeProduct) => set({ activeProduct }),
}));
