import type { Post } from "../data/Post";

const API_URL = "http://localhost:3000/api";

export async function obtenerPosts(): Promise<Post[]> {
  const respuesta = await fetch(`${API_URL}/posts`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los posts");
  }

  return await respuesta.json();
}

export async function obtenerPostsPorUsuario(userId: string): Promise<Post[]> {
  const response = await fetch(`http://localhost:3000/api/posts/user/${userId}`);
  if (!response.ok) throw new Error("Error al traer posts");
  return response.json();
}

export async function obtenerComentariosPorUsuario(userId: string): Promise<Comment[]> {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  
  const respuesta = await fetch(`${baseUrl}/comments/user/${userId}`); 

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los comentarios del usuario");
  }

  const data = await respuesta.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function obtenerPostPorId(id: string): Promise<Post> {
  const respuesta = await fetch(`${API_URL}/posts/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el post");
  }

  return await respuesta.json();
}