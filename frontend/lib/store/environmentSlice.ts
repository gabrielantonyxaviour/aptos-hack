import { StateCreator } from "zustand";
interface Post {
  id: number;
  caption: string;
  comments: any[];
  image: string;
  creator: string;
  status: string;
  isPromotional: boolean;
  likes: string;
  promotedProfile: any;
}

interface Application {}

interface Brand {
  id: number;
  owner: string;
  description: string;
  maxRewards: string;
  minRewards: string;
  minBerries: string;
}
interface EnvironmentState {
  hasProfile: number;
  hasPosts: number;
  posts: Post[];
  applications: Application[];
  brands: Brand[];
}

interface EnvironmentActions {
  setHasProfile: (hasProfile: number) => void;
  setHasPosts: (hasPosts: number) => void;
  setPosts: (posts: Post[]) => void;
  setApplications: (applications: Application[]) => void;
  setBrands: (brands: Brand[]) => void;
  addBrand: (brand: Brand) => void;
  addApplication: (application: Application) => void;
  addPost: (post: Post) => void;
}

export type EnvironmentSlice = EnvironmentState & EnvironmentActions;

export const initalProfileState: EnvironmentState = {
  hasProfile: 0,
  hasPosts: 0,
  posts: [],
  applications: [],
  brands: [],
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
  setPosts: (posts) => set((state) => ({ ...state, posts })),
  setApplications: (applications) =>
    set((state) => ({ ...state, applications })),
  setBrands: (brands) => set((state) => ({ ...state, brands })),
  addBrand: (brand) =>
    set((state) => ({ ...state, brands: [...state.brands, brand] })),
  addApplication: (application) =>
    set((state) => ({
      ...state,
      applications: [...state.applications, application],
    })),
  addPost: (post) =>
    set((state) => ({ ...state, posts: [...state.posts, post] })),
});
