import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { crearComentario } from "../services/CommentService";


interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { user } = useContext(UserContext)!;
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    const userId = user?._id ?? user?.id;

    if (!userId) {
      setError("Tenes que iniciar sesion para comentar");
      return;
    }


    try {
      setSending(true);
      setError("");
      console.log("Usuario completo:", user);
      console.log("ID:", user?._id ?? user?.id);

      await crearComentario(content, userId, postId);

      setContent("");
      
      onCommentAdded();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al comentar";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pd-comment-form">
      {error && <p className="pd-comment-error">{error}</p>}
      <textarea
        className="form-control pd-comment-input"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError("");
        }}
        placeholder="Escribí un comentario..."
        rows={3}
        required
      />
      <button
        type="submit"
        className="btn-app pd-comment-btn"
        disabled={sending || !content.trim()}
      >
        {sending ? "Enviando..." : "Comentar"}
      </button>
    </form>
  );
}

export default CommentForm;
