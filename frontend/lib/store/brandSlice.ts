import { StateCreator } from "zustand";

interface BrandState {
  brandDescription: string;
  minBerries: number;
  minRewards: number;
  maxRewards: number;
}

interface BrandActions {
  updateBrand: (brand: BrandState) => void;
}

export type BrandSlice = BrandState & BrandActions;

export const initalBrandState: BrandState = {
  brandDescription: "",
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
