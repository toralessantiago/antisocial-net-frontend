import { Card, Modal, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import type { Post } from "../data/Post";
import type { User } from "../data/users";
import { obtenerComentarios } from "../services/CommentService";

type CardProps = {
    post: Post,
    user: User
};


function PostCard({ post, user }: CardProps) {

    const [mostrarModal, setmostrarModal] = useState(false);
    const [cantidadComentarios, setCantidad] = useState(0);

    useEffect(() => {
        async function fetchCantidad() {
            try {
                const comentarios = await obtenerComentarios(post.id);
                setCantidad(comentarios.length);

            } catch (error) {
                setCantidad(0);
            }
        }
        fetchCantidad();
    }, [post.id]);

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{user.nickname}</Card.Title>
                <div>
                    {post.imageUrls && post.imageUrls.length > 0 && (
                        <Card.Img
                            variant="top"
                            src={post.imageUrls[0]}
                            alt="Imagen asociada al post"
                            onClick={() => setmostrarModal(true)}
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
                                {tag}
                            </Badge>
                        ))
                    ) : null}
                </div>
                <div className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    Comentarios: {cantidadComentarios}
                </div>
            </Card.Body>
            <Card.Body>
                <Link to={`/post/${post.id}`} className="btn btn-primary">
                    Ver más
                </Link>
            </Card.Body>

            <Modal
                show={mostrarModal}
                onHide={() => setmostrarModal(false)}
                centered
                size="lg">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className="text-center p-0">
                    <img
                        src={post.imageUrls[0]}
                        alt="Imagen expandida"
                        style={{ width: '100%', height: 'auto' }}>
                    </img>
                </Modal.Body>
            </Modal>
        </Card>
    );
}

export default PostCard;