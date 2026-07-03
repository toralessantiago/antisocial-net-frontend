import { Card, Modal, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { BsHeart, BsHeartFill, BsChatText } from "react-icons/bs";
import FollowButton from "../components/FollowButton";

import type { Post } from "../data/Post";
import type { User } from "../data/users";
import { obtenerComentarios } from "../services/CommentService";
import { toggleLike } from "../services/PostService";
import { UserContext } from "../context/UserContext";

import "../styles/postCard.css";

type CardProps = {
  post: Post;
  user: User;
};

function PostCard({ post, user }: CardProps) {
  const { user: currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [cantidadComentarios, setCantidad] = useState(0);

  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(
    currentUser ? post.likes?.includes(currentUser.id) : false,
  );

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
    e.stopPropagation();
    if (!currentUser) return;

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await toggleLike(post._id, currentUser.id);
    } catch (error) {
      console.error("Error al dar like:", error);
      setIsLiked(isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

 return (
    <Card
      className="post-card-twitter shadow-sm"
      onClick={() => navigate(`/post/${post._id}`)}
    >
      <Card.Body className="post-card-body">
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="pd-avatar" style={{ margin: 0 }}>
              {user?.nickname ? user.nickname.charAt(0).toUpperCase() : "?"}
            </div>
            <span className="fw-bold" style={{ fontSize: "1.1rem" }}>
              {user.nickname}
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <FollowButton targetUserId={user._id || user.id} />
          </div>
        </Card.Title>

        <Card.Text className="post-text" style={{ whiteSpace: "pre-wrap" }}>
          {post.description}
        </Card.Text>

        {post.images && post.images.length > 0 && (
          <div className="post-media-container">
            <img
              src={post.images[0].url}
              alt="Imagen asociada al post"
              className="post-image"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarModal(true);
              }}
            />
          </div>
        )}

        <div className="mb-2">
          {post.tags && post.tags.length > 0
            ? post.tags.map((tag, index) => (
                <Badge bg="secondary" className="me-1" key={index}>
                  {typeof tag === "object" ? tag.name : tag}
                </Badge>
              ))
            : null}
        </div>

        <div className="d-flex align-items-center mt-3 gap-4 user-select-none text-muted">
          <div
            className="d-flex align-items-center gap-2"
            onClick={handleLikeClick}
            style={{ cursor: "pointer" }}
            title={isLiked ? "Ya no me gusta" : "Me gusta"}
          >
            {isLiked ? (
              <BsHeartFill size={20} className="text-danger" />
            ) : (
              <BsHeart size={20} />
            )}
            <span style={{ fontSize: "1rem", fontWeight: isLiked ? "600" : "400" }}>
              {likesCount}
            </span>
          </div>

          <div
            className="d-flex align-items-center gap-2"
            title="Ver comentarios"
          >
            <BsChatText size={20} />
            <span style={{ fontSize: "1rem" }}>{cantidadComentarios}</span>
          </div>
        </div>
      </Card.Body>

      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton />
        <Modal.Body className="text-center p-0">
          {post.images && post.images.length > 0 && (
            <img
              src={post.images[0].url}
              alt="Imagen expandida"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default PostCard;