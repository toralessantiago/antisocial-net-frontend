import { API_URL } from "./api";

const USERS_URL = `${API_URL}/users`;

export const getUser = async (id: string) => {
  const response = await fetch(`${USERS_URL}/${id}`);

  const json = await response.json();

  console.log("Status:", response.status);
  console.log("Respuesta:", json);

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  json.data = {
    ...json.data,
    _id: json.data._id ?? json.data.id,
  };

  return json;
};

export const updateUser = async (id: string, data: any) => {
  console.log("Enviando:", data);

  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  console.log("Status:", response.status);
  console.log("Respuesta:", json);

  if (!response.ok) {
    throw new Error(json.error || json.message);
  }

  json.data = {
    ...json.data,
    _id: json.data._id ?? json.data.id,
  };

  return json;
};
