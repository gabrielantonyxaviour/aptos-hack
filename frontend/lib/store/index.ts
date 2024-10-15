import { createStore } from "zustand";
import { createProfileSlice, ProfileSlice } from "./profileSlice";
import { createEnvironmentSlice, EnvironmentSlice } from "./environmentSlice";
import { BrandSlice, createBrandSlice } from "./brandSlice";
import { createPostsSlice, PostsSlice } from "./postsSlice";
export type EnvironmentStore = ProfileSlice &
  EnvironmentSlice &
  BrandSlice &
  PostsSlice;

export const createEnvironmentStore = () =>
  createStore<EnvironmentStore>()((...a) => ({
    ...createProfileSlice(...a),
    ...createEnvironmentSlice(...a),
    ...createBrandSlice(...a),
    ...createPostsSlice(...a),
  }));
