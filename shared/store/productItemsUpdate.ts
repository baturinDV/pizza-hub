import { create } from 'zustand';

interface State {
  isProductItemsUpdate: boolean;
  setIsProductItemsUpdate: (isProductItemsUpdate: boolean) => void;
}

export const useProductItemsUpdateStore = create<State>((set) => ({
  isProductItemsUpdate: true,
  setIsProductItemsUpdate: (isProductItemsUpdate) => set({ isProductItemsUpdate }),
}));

