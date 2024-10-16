import { StateCreator } from "zustand";

interface ProfileState {
  username: string;
  name: string;
  bio: string;
  image: string;
  following: number;
  followers: number;
  niches: number[];
  preferences: number[];
  balance: string;
  humanness_nullifier: string;
}
interface ProfileActions {
  updateProfile: (profile: ProfileState) => void;
}

export type ProfileSlice = ProfileState & ProfileActions;

export const initalProfileState: ProfileState = {
  username: "",
  name: "",
  bio: "",
  image: "",
  following: 0,
  followers: 0,
  niches: [],
  preferences: [],
  balance: "",
  humanness_nullifier: "",
};

export const createProfileSlice: StateCreator<
  ProfileSlice,
  [],
  [],
  ProfileSlice
> = (set) => ({
  ...initalProfileState,
  updateProfile: (profile) => set((state) => ({ ...state, ...profile })),
});
