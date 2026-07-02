import api from "./api";

export const getCommentsByUser = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/comments`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const getCommentsByPost = async (postId: string) => {
  try {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data; // este endpoint no envuelve en {data}, ya lo sabíamos de antes
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};
