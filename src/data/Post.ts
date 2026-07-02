export type PostImage = {
  _id: string;
  url: string;
};

export type PostTag = {
  _id: string;
  name: string;
};

export type Post = {
  _id: string;
  description: string;
  user:
    | {
        _id: string;
        nickname: string;
        email: string;
      }
    | string;

  images: PostImage[];

  tags: PostTag[] | string[];

  createdAt: string;

  imageUrls?: string[];
  userId?: string;
  
  // Agregamos estas dos propiedades opcionales para que no de error
  likes?: any[];
  comments?: any[];
};