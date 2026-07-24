export interface User {
  id: string;
  _id?: string;

  fullname: string;
  nickname: string;
  email: string;
  birthDate: string;

  bio?: string;
  location?: string;
  verified?: boolean;

  followers?: (string | Pick<User, "id" | "_id" | "nickname" | "fullname">)[];
  following?: (string | Pick<User, "id" | "_id" | "nickname" | "fullname">)[];

  createdAt?: string;
}