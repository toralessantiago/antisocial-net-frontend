import type { Comment } from "../data/comments";

const API_URL = import.meta.env.VITE_API_URL || "http://import.meta.env.VITE_API_URL:3000/api";

export async function obtenerComentarios(id: string): Promise<Comment[]> {
  const respuesta = await fetch(`${API_URL}/comments/post/${id}`);
  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los comentarios");
  }
  return await respuesta.json();
}

export async function obtenerComentariosPorUsuario(userId: string): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/comments/user/${userId}`);
  if (!response.ok) {
    throw new Error("Error al traer comentarios del usuario");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function crearComentario(texto: string, userId: string, postId: string): Promise<Comment> {
  const respuesta = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: texto,
      user: userId,
      post: postId
    }),
  });
  
  if (!respuesta.ok) {
    throw new Error('Error en la solicitud: ' + respuesta.statusText);
  }
  
  const data = await respuesta.json();
  const comentario: Comment = data.data ?? data;

  return comentario;
}

export async function eliminarComentarioPorId(id: string): Promise<void> {
  const respuesta = await fetch(`${API_URL}/comments/${id}`, { method: "DELETE" });
  if (!respuesta.ok) throw new Error("No se pudo eliminar el comentario");
}