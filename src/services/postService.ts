import { API_URL } from "./api";

const POSTS_URL = `${API_URL}/posts`;
const USERS_URL = `${API_URL}/users`;

export const getPosts = async () => {
  const response = await fetch(POSTS_URL);

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};

export const getPostById = async (id: string) => {
  const response = await fetch(`${POSTS_URL}/${id}`);

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};

export const createPost = async (post: any) => {
  const response = await fetch(POSTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};

export const updatePost = async (id: string, post: any) => {
  const response = await fetch(`${POSTS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};

export const deletePost = async (id: string) => {
  const response = await fetch(`${POSTS_URL}/${id}`, {
    method: "DELETE",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};

export const getPostsByUser = async (userId: string) => {
  const response = await fetch(`${USERS_URL}/${userId}/posts`);

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};

export const toggleLike = async (postId: string, userId: string) => {
  const response = await fetch(`${POSTS_URL}/${postId}/like`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};

export const getLikesByUser = async (userId: string) => {
  const response = await fetch(`${USERS_URL}/${userId}/likes`);

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  return json.data;
};
