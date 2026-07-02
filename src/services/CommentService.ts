import type { Comment } from "../data/comments";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function obtenerComentarios(id: string): Promise<Comment[]> {
  const respuesta = await fetch(`${API_URL}/comments/post/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los comentarios");
  }

  return await respuesta.json();
}