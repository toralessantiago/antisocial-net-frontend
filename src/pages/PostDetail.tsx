import "../styles/pages/postDetail.css";

import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

import { obtenerPostPorId } from "../services/PostService";
import { obtenerUserPorId } from "../services/UsuarioService";

import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

import type { Post } from "../data/Post";
import type { User } from "../data/users";
import type { Comment } from "../data/comments";

import { UserContext } from "../context/UserContext";
import API_URL from "../services/api";

function PostDetail() {
  const { id } = useParams();
  const { user: usuarioLogueado } = useContext(UserContext);

  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [comentarios, setComentarios] = useState<Comment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function cargarPostDetail() {
      if (!id) return;

      try {
        setCargando(true);
        setError("");

        const datosPost = await obtenerPostPorId(id);
        setPost(datosPost);

        const datosUser = await obtenerUserPorId(datosPost.user._id);
        setUser(datosUser);

        const commentsRes = await fetch(`${API_URL}/comments/post/${id}`);

        if (commentsRes.ok) {
          const commentsData: Comment[] = await commentsRes.json();
          setComentarios(commentsData);
        }
      } catch (err) {
        console.error(err);
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
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) return null;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="post-detail-content">
            <div className="d-flex align-items-center mb-3">
              <div
                className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center me-2"
                style={{ width: "40px", height: "40px" }}
              >
                {user?.nickname
                  ? user.nickname.charAt(0).toUpperCase()
                  : "?"}
              </div>

              <h5 className="mb-0 text-muted">
                @{user?.fullname || "Usuario desconocido"}
              </h5>
            </div>

            <h1>{post.description}</h1>

            <Card>
              {post.images && post.images.length > 0 && (
                <Card.Img
                  variant="top"
                  src={post.images[0].url}
                  alt="Imagen asociada al post"
                  onClick={() => setMostrarModal(true)}
                  style={{
                    maxHeight: "300px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              )}
            </Card>
          </div>

          <h3 className="mt-4">Tags</h3>

          <div className="mb-4">
            {post.tags && post.tags.length > 0 ? (
              post.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="badge bg-primary me-2"
                >
                  {tag.name || tag}
                </span>
              ))
            ) : (
              <span className="text-muted">Sin tags</span>
            )}
          </div>

          <h3>Comentarios</h3>

          <CommentList comments={comentarios} />

          <div className="mt-4">
            {usuarioLogueado ? (
              <CommentForm
                postId={id!}
                onCommentAdded={handleCommentAdded}
              />
            ) : (
              <p>Iniciá sesión para comentar.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PostDetail;