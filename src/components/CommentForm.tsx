import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

type CommentFormProps = {
    postId: string | undefined;
};

export default function CommentForm({ postId }: CommentFormProps) {
    const [contenido, setContenido] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contenido.trim() || !postId) return;

        try {
            setEnviando(true);
            setError("");

            const respuesta = await fetch(`http://localhost:3000/api/comments/post/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: contenido,
                    postId: Number(postId),
                    userId: 1 // Aca iria id de usuario loggeado
                }),
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo publicar el comentario");
            }

            setContenido("");
            
            window.location.reload(); 

        } catch (error) {
            setError("Error al enviar el comentario.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="border p-3 rounded bg-light">
            <h5>Hacer un comentario</h5>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Escribe tu comentario aquí..."
                    disabled={enviando}
                />
            </Form.Group>
            
            <Button variant="primary" type="submit" disabled={!contenido.trim() || enviando}>
                {enviando ? "Enviando..." : "Comentar"}
            </Button>
        </Form>
    );
}