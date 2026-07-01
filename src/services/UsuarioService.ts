import type { User } from "../data/users";

const API_URL = "http://localhost:3000/posts";

export async function obtenerUsuarios(): Promise<User[]> {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los usuarios");
    }

    const usuarios: User[] = await respuesta.json();

    return usuarios;
}