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
