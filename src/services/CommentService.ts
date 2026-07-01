import type { Comment } from "../data/comments";


export async function obtenerComentarios(id: string | number): Promise<Comment[]> {
    const respuesta = await fetch(`http://localhost:3001/api/comments/post/${id}`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los comentarios");
    }

    const comments: Comment[] = await respuesta.json();

    return comments;
}
