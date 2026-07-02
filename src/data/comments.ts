export type Comment = {
  _id: string;
  content: string;
  user: { _id: string; nickname: string } | string;
  post: string;
  createdAt: string;
};
