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

  followers?: string[];
  following?: string[];

  createdAt?: string;
}