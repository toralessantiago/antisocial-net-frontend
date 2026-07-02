import type { Post } from "../data/Post";

const API_URL = "http://localhost:3000/api";

export async function obtenerPosts(): Promise<Post[]> {
  const respuesta = await fetch(`${API_URL}/posts`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los posts");
  }

  return await respuesta.json();
}

export async function obtenerPostPorId(id: string): Promise<Post> {
  const respuesta = await fetch(`${API_URL}/posts/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el post");
  }

  return await respuesta.json();
}