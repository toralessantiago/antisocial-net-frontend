import { API_URL } from "./api";

const USERS_URL = `${API_URL}/users`;
const COMMENTS_URL = `${API_URL}/comments`;

export const getCommentsByUser = async (userId: string) => {
  const response = await fetch(`${USERS_URL}/${userId}/comments`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};

export const getCommentsByPost = async (postId: string) => {
  const response = await fetch(`${COMMENTS_URL}/post/${postId}`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json;
};
