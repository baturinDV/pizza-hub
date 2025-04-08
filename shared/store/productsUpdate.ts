import { create } from 'zustand';

interface State {
  isProductsUpdate: boolean;
  setIsProductsUpdate: (isProductsUpdate: boolean) => void;
}

export const useProductsUpdateStore = create<State>((set) => ({
  isProductsUpdate: true,
  setIsProductsUpdate: (isProductsUpdate) => set({ isProductsUpdate }),
}));

