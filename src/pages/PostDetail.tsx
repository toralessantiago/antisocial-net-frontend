import "../styles/pages/postDetail.css";

import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import { UserContext } from "../context/UserContext";

import { obtenerPostPorId } from "../services/PostService";
import { obtenerUserPorId } from "../services/UsuarioService";
import { obtenerComentarios } from "../services/CommentService";

import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

import type { Post } from "../data/Post";
import type { User } from "../data/users";
import type { Comment } from "../data/comments";

function PostDetail() {
  const { id } = useParams();
  const { user: usuarioLogueado } = useContext(UserContext);

  const [post, setPost] = useState<Post | null>(null);
  const [autor, setAutor] = useState<User | null>(null);
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

        const datosPost = await obtenerPostPorId(id!);
        setPost(datosPost);

        if (typeof datosPost.user === "object") {
          const datosAutor = await obtenerUserPorId(datosPost.user._id);
          setAutor(datosAutor);
        }

        const comentarios = await obtenerComentarios(id!);
        setComentarios(comentarios);
      } catch (err) {
        console.error("Error al cargar el post:", err);
        setError("No se pudo cargar la publicación.");
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
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) return null;

  const tagList =
    Array.isArray(post.tags) && post.tags.length > 0
      ? post.tags.map((tag) =>
          typeof tag === "object" ? tag.name : tag
        )
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

          {post.images.length > 0 && (
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
              {tagList.map((tag, index) => (
                <span key={index} className="pd-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <hr className="pd-divider" />

          <h3 className="pd-section-title">Comentarios</h3>

          <CommentList comments={comentarios} />

          {usuarioLogueado ? (
            <CommentForm
              postId={id!}
              onCommentAdded={handleCommentAdded}
            />
          ) : (
            <p className="pd-login-hint">
              Iniciá sesión para comentar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;