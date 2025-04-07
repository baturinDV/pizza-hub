import { create } from 'zustand';

interface State {
  isIngredientsUpdate: boolean;
  setIsingredientsUpdate: (isCategoriesUpdate: boolean) => void;
}

export const useIngredientsUpdateStore = create<State>((set) => ({
  isIngredientsUpdate: true,
  setIsingredientsUpdate: (isIngredientsUpdate) => set({ isIngredientsUpdate }),
}));