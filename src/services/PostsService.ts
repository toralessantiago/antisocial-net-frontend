import api from "./api";

export const getPosts = async () => {
  try {
    const response = await api.get("/posts");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const getPostById = async (id: string) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const createPost = async (post: any) => {
  try {
    const response = await api.post("/posts", post);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const updatePost = async (id: string, post: any) => {
  try {
    const response = await api.put(`/posts/${id}`, post);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const getPostsByUser = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const toggleLike = async (postId: string, userId: string) => {
  try {
    const response = await api.patch(`/posts/${postId}/like`, { userId });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const getLikesByUser = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/likes`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};
