export type Comment = {
  _id: string;
  content: string;
  postId: string;
  user: {
    _id: string;
    nickname: string;
    fullname: string;
    email: string;
  };
  visible: boolean;
  createdAt: string;
}