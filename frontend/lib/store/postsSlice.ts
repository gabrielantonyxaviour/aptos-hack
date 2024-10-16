import { StateCreator } from "zustand";
import { Post } from "../type";

interface PostsState {
  posts: Post[];
}

interface PostsActions {
  updatePosts: (posts: PostsState) => void;
}

export type PostsSlice = PostsState & PostsActions;

export const initalPostsState: PostsState = {
  posts: [],
};

export const createPostsSlice: StateCreator<PostsSlice, [], [], PostsSlice> = (
  set
) => ({
  ...initalPostsState,
  updatePosts: (posts) => set((state) => ({ ...state, ...posts })),
});
