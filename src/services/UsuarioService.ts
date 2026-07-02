import type { User } from "../data/users";

const API_URL = "http://localhost:3000/api";

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