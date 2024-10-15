import { StateCreator } from "zustand";

interface EnvironmentState {
  hasProfile: number;
  hasPosts: number;
}

interface EnvironmentActions {
  setHasProfile: (hasProfile: number) => void;
  setHasPosts: (hasPosts: number) => void;
}

export type EnvironmentSlice = EnvironmentState & EnvironmentActions;

export const initalProfileState: EnvironmentState = {
  hasProfile: 0,
  hasPosts: 0,
};

export const createEnvironmentSlice: StateCreator<
  EnvironmentSlice,
  [],
  [],
  EnvironmentSlice
> = (set) => ({
  ...initalProfileState,
  setHasProfile: (value) => set((state) => ({ hasProfile: value })),
  setHasPosts: (value) => set((state) => ({ hasPosts: value })),
});
