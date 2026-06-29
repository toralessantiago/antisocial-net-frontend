const API_URL = "http://localhost:3000";

// GET/tags
export const getTags = async (): Promise<string[]> => {
    const response = await fetch(`${API_URL}/tags`);
    if (!response.ok) throw new Error("Error al cargar etiquetas");
    return response.json();
};

// POST/posts
export interface CreatePostData{
    description: string;
    userId: number;
    tags: string[];
}

export const createPost = async (postData: CreatePostData) => {
    const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error("No se pudo crear la publicación");
    return response.json(); 
};

// POST/postimages
export const createPostImage = async (url: string, postId: number) => {
    const response = await fetch(`${API_URL}/postimages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, postId }),
    });
    if (!response.ok) throw new Error("Error al subir la imagen");
    return response.json();
};