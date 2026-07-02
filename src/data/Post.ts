export type Post = {
  _id: string; 
  description: string;
  user: {
    _id: string;
    nickname: string;
    email: string;
  };
  images: {
    url: string;
    _id: string;
  }[];
  tags: {
    _id: string;
    name: string;
  }[];
};