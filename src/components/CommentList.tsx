import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { eliminarComentarioPorId } from "../services/CommentService";
import { LuTrash2 } from "react-icons/lu";
import type { Comment } from "../data/comments";

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted?: () => void;
}

function CommentList({ comments, onCommentDeleted }: CommentListProps) {
  const { user: usuarioLogueado } = useContext(UserContext)!;

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar este comentario?")) return;
    try {
      await eliminarComentarioPorId(id);
      if (onCommentDeleted) onCommentDeleted();
    } catch (error) {
      alert("Error al borrar comentario.");
    }
  };

  if (comments.length === 0) return <p className="pd-no-comments text-muted">No hay comentarios aún</p>;

  return (
    <ul className="pd-comment-list list-unstyled">
      {comments.map((c) => {
        const autor = typeof c.user === "object" ? c.user : { _id: c.user, nickname: "Usuario" };
        const esMiComentario = Boolean(
          usuarioLogueado && String(usuarioLogueado.id || usuarioLogueado._id) === String(autor._id)
        );

        return (
          <li key={c._id} className="pd-comment-item border-bottom py-3">
            <div className="pd-comment-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <div className="pd-comment-avatar bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center" style={{width: "30px", height: "30px", fontSize: "14px"}}>
                  {autor.nickname ? autor.nickname.charAt(0).toUpperCase() : "?"}
                </div>
                <span className="pd-comment-author fw-bold">@{autor.nickname}</span>
              </div>
              
              {esMiComentario && (
                <button onClick={() => handleDelete(c._id)} className="btn btn-link text-danger p-0" title="Eliminar comentario">
                  <LuTrash2 size={18} />
                </button>
              )}
            </div>
            <p className="pd-comment-content mt-2 mb-0 ms-4 ps-2">{c.content}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default CommentList;