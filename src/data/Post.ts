export type PostImage = {
  _id: string;
  url: string;
};

export type Post = {
  _id: string;
  description: string;
  user: { _id: string; nickname: string; email: string } | string;
  images: PostImage[];
  tags: { _id: string; name: string }[] | string[];
  createdAt: string;
  imageUrls?: string[];
  userId?: string;
};
