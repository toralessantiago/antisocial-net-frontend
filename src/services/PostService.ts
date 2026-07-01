import type { Post } from "../data/Post";

const API_URL = "http://localhost:3001/api/posts";

export async function obtenerPosts(): Promise<Post[]> {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los posts");
    }

    const posts: Post[] = await respuesta.json();

    return posts;
}

export async function obtenerPostPorId(id: string | number): Promise<Post> {
    const respuesta = await fetch(`http://localhost:3001/api/posts/:${id}`);

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener el post");
    }

    const post: Post = await respuesta.json();

    return post;
}

export async function obtenerImagenesDePost(id: string | number): Promise<Post["imageUrls"]> {
    const respuesta = await fetch(`http://localhost:3001/api/postimages/post/:${id}`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las imagenes");
    }

    const imagenes: Post["imageUrls"] = await respuesta.json();

    return imagenes;
}