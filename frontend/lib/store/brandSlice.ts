import { StateCreator } from "zustand";

interface BrandState {
  description: string;
  minBerries: number;
  minRewards: number;
  maxRewards: number;
}

interface BrandActions {
  updateBrand: (brand: BrandState) => void;
}

export type BrandSlice = BrandState & BrandActions;

export const initalBrandState: BrandState = {
  description: "",
  minBerries: 0,
  minRewards: 0,
  maxRewards: 0,
};

export const createBrandSlice: StateCreator<BrandSlice, [], [], BrandSlice> = (
  set
) => ({
  ...initalBrandState,
  updateBrand: (brand) => set((state) => ({ ...state, ...brand })),
});
