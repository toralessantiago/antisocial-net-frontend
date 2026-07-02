import API_URL from "./api";
import type { Comment } from "../data/comments";

export async function obtenerComentarios(id: string): Promise<Comment[]> {
    const respuesta = await fetch(`${API_URL}/comments/post/${id}`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los comentarios");
    }

    const comments: Comment[] = await respuesta.json();

    return comments;
}
