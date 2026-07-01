import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import API_URL from "../services/api";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import type { Post } from "../data/Post";
import type { Comment } from "../data/comments";
import "../styles/pages/postDetail.css";

function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState<Post | null>(null);
  const [comentarios, setComentarios] = useState<Comment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function cargarPostDetail() {
      try {
        setCargando(true);
        setError("");

        const postRes = await fetch(`${API_URL}/posts/${id}`);
        if (!postRes.ok) throw new Error("Post no encontrado");
        const postData: Post = await postRes.json();
        setPost(postData);

        const commentsRes = await fetch(`${API_URL}/comments/post/${id}`);
        if (commentsRes.ok) {
          const commentsData: Comment[] = await commentsRes.json();
          setComentarios(commentsData);
        }
      } catch (err) {
        console.error("Error al cargar post:", err);
        setError("No se pudo cargar la publicación");
      } finally {
        setCargando(false);
      }
    }

    cargarPostDetail();
  }, [id, refreshKey]);

  const handleCommentAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (cargando) {
    return (
      <div className="pd-container">
        <div className="pd-loading">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-container">
        <div className="pd-error">{error}</div>
      </div>
    );
  }

  if (!post) return null;

  const autor =
    typeof post.user === "object" ? post.user : null;
  const tagList =
    Array.isArray(post.tags) && post.tags.length > 0
      ? post.tags.map((t) => (typeof t === "object" ? t.name : t))
      : [];

  return (
    <div className="pd-layout">
      <div className="pd-left">
        <h1>Detalle</h1>
        <p>Publicación de @{autor?.nickname ?? "desconocido"}</p>
      </div>

      <div className="pd-right-container">
        <div className="pd-right">
          <div className="pd-header">
            <div className="pd-avatar">
              {autor?.nickname
                ? autor.nickname.charAt(0).toUpperCase()
                : "?"}
            </div>
            <div>
              <span className="pd-author">
                @{autor?.nickname ?? "Usuario desconocido"}
              </span>
              <time className="pd-date">
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>

          <p className="pd-description">{post.description}</p>

          {post.images && post.images.length > 0 && (
            <div className="pd-images">
              {post.images.map((img) => (
                <img
                  key={img._id}
                  src={img.url}
                  alt="Imagen del post"
                  className="pd-image"
                />
              ))}
            </div>
          )}

          {tagList.length > 0 && (
            <div className="pd-tags">
              {tagList.map((name, i) => (
                <span key={i} className="pd-tag">
                  {name}
                </span>
              ))}
            </div>
          )}

          <hr className="pd-divider" />

          <h3 className="pd-section-title">Comentarios</h3>
          <CommentList comments={comentarios} />

          {user ? (
            <CommentForm postId={id!} onCommentAdded={handleCommentAdded} />
          ) : (
            <p className="pd-login-hint">Iniciá sesión para comentar</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
