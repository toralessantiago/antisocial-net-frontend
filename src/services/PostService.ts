import type { Post } from "../data/Post";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function obtenerPosts(): Promise<Post[]> {
  const respuesta = await fetch(`${API_URL}/posts`);
  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los posts");
  }
  return await respuesta.json();
}

export async function obtenerPostsPorUsuario(userId: string): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts/user/${userId}`);
  if (!response.ok) throw new Error("Error al traer posts");
  return response.json();
}

export async function obtenerPostPorId(id: string): Promise<Post> {
  const respuesta = await fetch(`${API_URL}/posts/${id}`);
  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el post");
  }
  return await respuesta.json();
}

export async function crearPost(datosPost: { description: string; user: string; tags?: string[]; images?: string[] }): Promise<Post> {
  const respuesta = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datosPost)
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => null);
    throw new Error(errorData?.message || "No se pudo crear la publicación");
  }

  return await respuesta.json();
}

// --- LIKES, EDICIÓN Y ELIMINACIÓN ---
export async function toggleLike(postId: string, userId: string): Promise<any> {
  const respuesta = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
  });
  if (!respuesta.ok) throw new Error("Error al procesar el like");
  return await respuesta.json();
}

export async function eliminarPostPorId(id: string): Promise<void> {
  const respuesta = await fetch(`${API_URL}/posts/${id}`, { method: "DELETE" });
  if (!respuesta.ok) throw new Error("No se pudo eliminar la publicación");
}

export async function editarPost(id: string, description: string): Promise<Post> {
  const respuesta = await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description })
  });
  if (!respuesta.ok) throw new Error("No se pudo editar la publicación");
  return await respuesta.json();
}