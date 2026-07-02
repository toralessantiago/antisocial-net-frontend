export type User = {
  _id: string;
  fullname: string;
  nickname: string;
  email: string;
  birthDate?: string;
}

export const users: User[] = [];
