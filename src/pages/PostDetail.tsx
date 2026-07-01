import "../styles/pages/postDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { obtenerPostPorId } from "../services/PostService";
import { obtenerUserPorId } from "../services/UsuarioService";
import { obtenerComentarios } from "../services/CommentService";
import type { Post } from "../data/Post";
import type { User } from "../data/users";
import type { Comment } from "../data/comments";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [comentarios, setComentarios] = useState<Comment[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setmostrarModal] = useState(false);

  useEffect(() => {
    async function cargarPostDetail() {
      try {
        setCargando(true);

        const datosPost = await obtenerPostPorId(id!);
        setPost(datosPost);

        const [datosUser, datosComment] = await Promise.all([
          obtenerUserPorId(datosPost?.userId!),
          obtenerComentarios(id!)
        ])

        setUser(datosUser);
        setComentarios(datosComment);
      } catch (error) {
        console.error("Error al cargar mensaje", error);
      } finally {
        setCargando(false);
      }
    }
    if (id) cargarPostDetail();

  }, [id]
  );

  if (cargando) return <Spinner animation="border" />;



  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="post-detail-content">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center me-2" style={{ width: '40px', height: '40px' }}>
                {user?.nickname ? user.nickname.charAt(0).toUpperCase() : "?"}
              </div>
              <h5 className="mb-0 text-muted">
                @{user ? user.nickname : "Usuario desconocido"}
              </h5>
            </div>
            <h1>{post?.description}</h1>
            <Card>
              {post?.imageUrls && post.imageUrls.length > 0 && (
                <Card.Img
                  variant="top"
                  src={post.imageUrls[0]}
                  alt="Imagen asociada al post"
                  onClick={() => setmostrarModal(true)}
                  style={{ maxHeight: '300px', objectFit: 'cover', cursor: 'pointer' }}
                >
                </Card.Img>
              )}
            </Card>
          </div>
          <h3>Tags</h3>
          <div className="mb-4">
            {post?.tags && post.tags.length > 0 ? (
              post.tags.map((tag: any, index: number) => (
                <span key={index} className="badge bg-primary me-2">
                  {tag.name || tag} 
                </span>
              ))
            ) : (
              <span className="text-muted">Sin tags</span>
            )}
          </div>

          <h3>Comentarios</h3>
          <CommentList postId={id} />

          <div className="mt-4">
            <CommentForm postId={id} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PostDetail;