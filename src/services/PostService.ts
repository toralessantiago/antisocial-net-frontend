import type { Post } from "../data/Post";

const API_URL = "http://localhost:3001/posts";

export async function obtenerPosts(): Promise<Post[]> {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los posts");
    }

    const posts: Post[] = await respuesta.json();

    return posts;
}