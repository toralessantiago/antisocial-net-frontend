import { Card, Modal, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import type { Post } from "../data/Post";
import type { User } from "../data/users";
import { obtenerComentarios } from "../services/CommentService";

type CardProps = {
    post: Post;
    user: User;
};

function PostCard({ post, user }: CardProps) {

    const [mostrarModal, setMostrarModal] = useState(false);
    const [cantidadComentarios, setCantidad] = useState(0);
    const navigate = useNavigate();

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

    return (
        <Card
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/post/${post._id}`)}>
            <Card.Body>
                <div className="pd-avatar">
                    {user?.nickname
                        ? user.nickname.charAt(0).toUpperCase()
                        : "?"}
                </div>
                <Card.Title>{user.nickname}</Card.Title>
                <div>
                    {post.images && post.images.length > 0 && (
                        <Card.Img
                            variant="top"
                            src={post.images[0].url}
                            alt="Imagen asociada al post"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMostrarModal(true)
                            }}
                            style={{ maxHeight: '300px', objectFit: 'cover', cursor: 'pointer' }}
                        >
                        </Card.Img>
                    )}
                </div>
                <Card.Text>
                    {post.description}
                </Card.Text>
                <div className="mb-2">
                    {post.tags && post.tags.length > 0 ? (
                        post.tags.map((tag, index) => (
                            <Badge bg="secondary" className="me-1" key={index}>
                                {typeof tag === "object" ? tag.name : tag}
                            </Badge>
                        ))
                    ) : null}
                </div>
                <div className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    Comentarios: {cantidadComentarios}
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
                            style={{ width: '100%', height: 'auto' }}>
                        </img>
                    )}
                </Modal.Body>
            </Modal>
        </Card>
    );
}

export default PostCard;
