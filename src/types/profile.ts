export interface PostImage {
  url: string;
  _id?: string;
}

export interface PostUser {
  _id: string;
  nickname: string;
  email?: string;
}

export interface Post {
  _id: string;
  description: string;
  user: PostUser | string;
  images: PostImage[];
  tags?: any[];
  likes: string[];
  createdAt: string;
}

export interface CommentUser {
  _id: string;
  nickname: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: CommentUser;
  post?: { _id: string; description: string } | null;
  createdAt: string;
}

export interface Profile {
  _id: string;
  fullname: string;
  nickname: string;
  email: string;
  birthDate: string;
  bio: string;
  location: string;
  followers: string[];
  following: string[];
  createdAt: string;
}
