import "../styles/pages/postDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Spinner, Modal, Button, Form } from "react-bootstrap";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import FollowButton from "../components/FollowButton";
import { UserContext } from "../context/UserContext";
import {
  obtenerPostPorId,
  eliminarPostPorId,
  editarPost,
  toggleLike,
} from "../services/PostService";
import { obtenerUserPorId } from "../services/UsuarioService";
import { obtenerComentarios } from "../services/CommentService";

import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

import type { Post } from "../data/Post";
import type { User } from "../data/users";
import type { Comment as AppComment } from "../data/comments";
import { getUserId, isUserInLikes } from "../utils/userHelpers";

function PostDetail() {
  const { id } = useParams();
  const ctx = useContext(UserContext);
  const usuarioLogueado = ctx?.user;
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [autor, setAutor] = useState<User | null>(null);
  const [comentarios, setComentarios] = useState<AppComment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // --- ESTADOS PARA LIKES ---
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Estados para modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editDescription, setEditDescription] = useState("");

  const esMiPost = Boolean(
    usuarioLogueado &&
    autor &&
    String(usuarioLogueado.id || usuarioLogueado._id) ===
      String(autor.id || autor._id),
  );

  useEffect(() => {
    if (!id) return;
    async function cargarPostDetail() {
      try {
        setCargando(true);
        const datosPost = await obtenerPostPorId(id!);
        setPost(datosPost);
        setEditDescription(datosPost.description);

        if (typeof datosPost.user === "object") {
          const datosAutor = await obtenerUserPorId(datosPost.user._id);
          setAutor(datosAutor);
        } else {
          const datosAutor = await obtenerUserPorId(datosPost.user);
          setAutor(datosAutor);
        }

        const comentarios = await obtenerComentarios(id!);
        setComentarios(comentarios);
      } catch (err) {
        setError("No se pudo cargar la publicación.");
      } finally {
        setCargando(false);
      }
    }
    cargarPostDetail();
  }, [id, refreshKey]);

  useEffect(() => {
    if (post) {
      setLikesCount(post.likes?.length || 0);
      const userId = getUserId(
        usuarioLogueado as { id?: string; _id?: string } | null,
      );
      setIsLiked(isUserInLikes(post.likes, userId));
    }
  }, [post, usuarioLogueado]);

  // --- MANEJADOR DE LIKES (OPTIMISTIC UI) ---
  const handleLikeClick = async () => {
    if (!usuarioLogueado || !post) return;

    const userId = getUserId(
      usuarioLogueado as { id?: string; _id?: string },
    );
    if (!userId) return;

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const updated = await toggleLike(post._id, userId);
      if (updated?.likes) {
        setLikesCount(updated.likes.length);
        setIsLiked(isUserInLikes(updated.likes, userId));
        setPost((prev) => (prev ? { ...prev, likes: updated.likes } : prev));
      }
    } catch (error) {
      console.error("Error al dar like:", error);
      setIsLiked(isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const handleEliminarPost = async () => {
    try {
      await eliminarPostPorId(post!._id);
      navigate("/");
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const handleEditarPost = async () => {
    try {
      await editarPost(post!._id, editDescription);
      setShowEditModal(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      alert("Error al editar");
    }
  };

  if (cargando)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <div className="text-center mt-5">{error}</div>;
  if (!post) return null;

  return (
    <div className="pd-layout">
      <div className="pd-right-container">
        <div className="pd-right w-100 mx-auto" style={{ maxWidth: "600px" }}>
          <div className="pd-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              {" "}
              {/* Cambiado gap-2 por gap-3 para un poco más de aire */}
              <div className="d-flex align-items-center gap-2">
                <div className="pd-avatar">
                  {autor?.nickname
                    ? autor.nickname.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div
                  onClick={() => navigate(`/users/${autor?.id || autor?._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="pd-author fw-bold">
                    @{autor?.nickname ?? "Usuario"}
                  </span>
                  <time
                    className="pd-date d-block text-muted"
                    style={{ fontSize: "12px" }}
                  >
                    {new Date(post.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
              {autor && (
                <div onClick={(e) => e.stopPropagation()}>
                  <FollowButton targetUserId={autor._id || autor.id} />
                </div>
              )}
            </div>

            {esMiPost && (
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                >
                  <LuPencil />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <LuTrash2 />
                </Button>
              </div>
            )}
          </div>

          <p className="pd-description mt-3 fs-5">{post.description}</p>

          {post.images && post.images.length > 0 && (
            <div className="pd-images mb-3">
              {post.images.map((img) => (
                <img
                  key={img._id}
                  src={img.url}
                  alt="Post"
                  className="img-fluid rounded w-100"
                  style={{ objectFit: "cover", maxHeight: "500px" }}
                />
              ))}
            </div>
          )}

          <div
            className="d-flex align-items-center gap-2 user-select-none mb-3"
            onClick={handleLikeClick}
            style={{ cursor: "pointer", width: "fit-content" }}
          >
            {isLiked ? (
              <BsHeartFill size={24} className="text-danger" />
            ) : (
              <BsHeart size={24} />
            )}
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: isLiked ? "600" : "400",
              }}
            >
              {likesCount}
            </span>
          </div>

          <hr className="pd-divider" />
          <h3 className="pd-section-title">Comentarios</h3>

          <CommentList
            comments={comentarios}
            onCommentDeleted={() => setRefreshKey((prev) => prev + 1)}
          />

          {usuarioLogueado ? (
            <CommentForm
              postId={id!}
              onCommentAdded={() => setRefreshKey((prev) => prev + 1)}
            />
          ) : (
            <p className="pd-login-hint text-muted font-italic mt-3">
              Iniciá sesión para comentar.
            </p>
          )}
        </div>
      </div>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar publicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={4}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditarPost}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar publicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que querés borrar esto? No se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarPost}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostDetail;
