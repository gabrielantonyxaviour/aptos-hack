interface Profile {
  username: string;
  name: string;
  bio: string;
  image: string;
  following: number;
  followers: number;
  tags: string[];
}

export interface Post {
  id: number;
  caption: string;
  comments: any[];
  image: string;
  creator: string;
  status: string;
  isPromotional: boolean;
  likes: number;
  promotedProfile: any;
}

export interface Brand {
  id: number;
  owner: string;
  description: string;
  maxRewards: string;
  minRewards: string;
  minBerries: string;
}
