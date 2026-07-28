import type { User } from "../data/users";

const API_URL = import.meta.env.VITE_API_URL || "http://import.meta.env.VITE_API_URL:3000/api";

export async function obtenerUsuarios(): Promise<User[]> {
    const respuesta = await fetch(`${API_URL}/users`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los usuarios");
    }

    const usuarios = await respuesta.json();
    const data = usuarios.data;

    if (!Array.isArray(data)) {
        console.error("Respuesta inesperada de /api/users, no es un array:", JSON.stringify(usuarios, null, 2));
    return [];}
    return data;
}

export async function obtenerUserPorId(id: string): Promise<User> {
    const respuesta = await fetch(`${API_URL}/users/${id}`);

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener el user");
    }

    const respuestaJson = await respuesta.json();
    const user: User = respuestaJson.data || respuestaJson;

    return user;
}

export async function updateUser(id: string, data: Partial<User>): Promise<{ data: User }> {
    const respuesta = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el usuario");
    }

    const respuestaJson = await respuesta.json();
    const user: User = respuestaJson.data || respuestaJson;

    return { data: user };
}

export async function followUser(userId: string, targetId: string): Promise<void> {
  const respuesta = await fetch(`${API_URL}/followers/${userId}/${targetId}`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  if (!respuesta.ok) throw new Error("Error al seguir");
}

export async function unfollowUser(userId: string, targetId: string): Promise<void> {
  const respuesta = await fetch(`${API_URL}/followers/${userId}/${targetId}`, { 
    method: "DELETE" 
  });
  if (!respuesta.ok) throw new Error("Error al dejar de seguir");
}