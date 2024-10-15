import { createStore } from "zustand";
import { createProfileSlice, ProfileSlice } from "./profileSlice";
import { createEnvironmentSlice, EnvironmentSlice } from "./environmentSlice";
export type EnvironmentStore = ProfileSlice & EnvironmentSlice;

export const createEnvironmentStore = () =>
  createStore<EnvironmentStore>()((...a) => ({
    ...createProfileSlice(...a),
    ...createEnvironmentSlice(...a),
  }));
