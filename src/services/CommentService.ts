import type { Comment } from "../data/comments";


export async function obtenerComentarios(id: string | number): Promise<Comment[]> {
    const respuesta = await fetch(`http://localhost:3000/api/comments/post/${id}`);


    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los comentarios");
    }

    const comentarios = await respuesta.json();
    const data = comentarios.data ?? comentarios;

    if (!Array.isArray(data)) {
        console.error("Respuesta inesperada de /api/users, no es un array:", JSON.stringify(comentarios, null, 2));
    return [];}

    return data;
}
