import type { Comment } from "../data/comments";
const API_URL = "http://localhost:3001/api/comments";

export async function obtenerPosts(): Promise<Comment[]> {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los comentarios");
    }

    const comments: Comment[] = await respuesta.json();

    return comments;
}