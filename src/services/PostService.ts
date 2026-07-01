import API_URL from "./api";
import type { Post } from "../data/Post";

export async function obtenerPosts(): Promise<Post[]> {
    const respuesta = await fetch(`${API_URL}/posts`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los posts");
    }

    return respuesta.json();
}

export async function obtenerPostPorId(id: string): Promise<Post> {
    const respuesta = await fetch(`${API_URL}/posts/${id}`);

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener el post");
    }

    return respuesta.json();
}
