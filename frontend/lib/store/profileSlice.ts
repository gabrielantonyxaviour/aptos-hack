import { create, StateCreator } from "zustand";

interface ProfileState {
  username: string;
  name: string;
  bio: string;
  image: string;
  following: number;
  followers: number;
  tags: string[];
}

interface ProfileActions {
  update: (profile: ProfileState) => void;
}

export type ProfileSlice = ProfileState & ProfileActions;

type SetFunction = (
  partial: ProfileState | ((state: ProfileState) => ProfileState),
  replace?: boolean
) => void;

export const initalProfileState: ProfileState = {
  username: "",
  name: "",
  bio: "",
  image: "",
  following: 0,
  followers: 0,
  tags: [],
};

export const createProfileSlice: StateCreator<
  ProfileSlice,
  [],
  [],
  ProfileSlice
> = (set) => ({
  ...initalProfileState,
  update: (profile) => set((state) => ({ ...state, ...profile })),
});
