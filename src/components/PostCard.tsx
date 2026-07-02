import { Card, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { LuHeart } from "react-icons/lu";

import { UserContext } from "../context/UserContext";
import { toggleLike } from "../services/PostService";
import { obtenerComentarios } from "../services/CommentService";

import type { Post } from "../data/Post";
import type { User } from "../data/users";

type CardProps = {
  post: Post;
  user: User;
};

function PostCard({ post, user }: CardProps) {
  const { user: usuarioLogueado } = useContext(UserContext);
  const navigate = useNavigate();

  const [cantidadComentarios, setCantidad] = useState(0);
  const [likes, setLikes] = useState<string[]>(post.likes || []);
  const [isLiking, setIsLiking] = useState(false);

  // Verificamos si el ID del usuario logueado está en el array de likes
  const miId = usuarioLogueado?.id || usuarioLogueado?._id;
  const yaDiLike = likes.includes(miId);

  useEffect(() => {
    async function fetchCantidad() {
      try {
        const comentarios = await obtenerComentarios(post._id);
        setCantidad(comentarios.length);
      } catch (error) {
        setCantidad(0);
      }
    }
    fetchCantidad();
  }, [post._id]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se abra el detalle del post al dar like
    if (!usuarioLogueado || isLiking) return;

    setIsLiking(true);
    try {
      // Actualizamos visualmente primero (Optimistic UI)
      if (yaDiLike) {
        setLikes(likes.filter((id) => id !== miId));
      } else {
        setLikes([...likes, miId]);
      }
      // Impactamos en BD
      await toggleLike(post._id, miId);
    } catch (error) {
      // Si falla, revertimos
      setLikes(post.likes || []);
      console.error("Error al dar like");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/post/${post._id}`)}
      className="shadow-sm"
    >
      <Card.Body>
        <Card.Title className="fw-bold">@{user.nickname}</Card.Title>
        <div>
          {post.images && post.images.length > 0 && (
            <Card.Img
              variant="top"
              src={post.images[0].url}
              alt="Imagen asociada al post"
              className="mt-2 rounded"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          )}
        </div>
        <Card.Text className="mt-3 fs-5">{post.description}</Card.Text>

        <div className="mb-3">
          {post.tags && post.tags.length > 0
            ? post.tags.map((tag, index) => (
                <Badge bg="secondary" className="me-1" key={index}>
                  {typeof tag === "object" ? tag.name : tag}
                </Badge>
              ))
            : null}
        </div>

        <div className="d-flex justify-content-between align-items-center border-top pt-3">
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            {/* Botón de Like mejorado */}
            <button
              onClick={handleLikeClick}
              className="d-flex align-items-center gap-2 border-0 bg-transparent p-0"
              style={{
                color: yaDiLike ? "#dc3545" : "inherit",
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
            >
              {/* El fill depende del estado y el stroke es heredado del color del texto */}
              <LuHeart
                fill={yaDiLike ? "#dc3545" : "none"}
                size={24}
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <span className="fw-bold">{likes.length}</span>
            </button>

            <div className="text-muted" style={{ fontSize: "0.9rem" }}>
              {cantidadComentarios} Comentarios
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PostCard;
