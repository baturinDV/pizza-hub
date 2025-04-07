import { create } from 'zustand';

interface State {
  isCategoriesUpdate: boolean;
  setIsCategoriesUpdate: (isCategoriesUpdate: boolean) => void;
}

export const useCategoriesUpdateStore = create<State>((set) => ({
  isCategoriesUpdate: true,
  setIsCategoriesUpdate: (isCategoriesUpdate) => set({ isCategoriesUpdate }),
}));

