import api from "./api";

export const getUser = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    const json = response.data;

    json.data = {
      ...json.data,
      _id: json.data._id ?? json.data.id,
    };

    return json;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    const json = response.data;

    json.data = {
      ...json.data,
      _id: json.data._id ?? json.data.id,
    };

    return json;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    );
  }
};
