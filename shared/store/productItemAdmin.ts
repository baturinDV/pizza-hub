import { ProductWithIngredients } from '@/@types/productWithIngredients';
import { Category, ProductItem } from '@prisma/client';
import { create } from 'zustand';

interface State {
  activeProductItem: ProductItem | null;
  setActiveProductItem: (activeProductItem: ProductItem | null) => void;
}

export const useProductItemAdminStore = create<State>((set) => ({
  activeProductItem: null,
  setActiveProductItem: (activeProductItem) => set({ activeProductItem }),
}));
