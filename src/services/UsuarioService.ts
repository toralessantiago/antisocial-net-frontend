import API_URL from "./api";
import type { User } from "../data/users";

export async function obtenerUsuarios(): Promise<User[]> {
    const respuesta = await fetch(`${API_URL}/users`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los usuarios");
    }

    const data = await respuesta.json();
    return data.data ?? data;
}

export async function obtenerUserPorId(id: string): Promise<User> {
    const respuesta = await fetch(`${API_URL}/users/${id}`);

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener el user");
    }

    const data = await respuesta.json();
    return data.data ?? data;
}
