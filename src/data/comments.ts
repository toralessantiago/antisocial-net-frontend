export type Comment = {
  _id: string;
  content: string;
  user: {
    _id: string;
    nickname: string;
    fullname: string;
    email: string;
  };
  post: string | { _id: string };
  visible: boolean;
  createdAt: string;

};