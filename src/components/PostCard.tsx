import { Card, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";

import type { Post } from "../data/Post";
import type { User } from "../data/users";

type CardProps = {
    post: Post;
    user: User;
};

function PostCard({ post, user }: CardProps) {
    const [mostrarModal, setMostrarModal] = useState(false);

    const primeraImagen = post.images && post.images.length > 0
        ? post.images[0].url
        : null;

    return (
        <Card>
            <Card.Body>
                <Card.Title>@{user.nickname}</Card.Title>
                {primeraImagen && (
                    <Card.Img
                        variant="top"
                        src={primeraImagen}
                        alt="Imagen asociada al post"
                        onClick={() => setMostrarModal(true)}
                        style={{ maxHeight: "300px", objectFit: "cover", cursor: "pointer" }}
                    />
                )}
                <Card.Text>{post.description}</Card.Text>
            </Card.Body>
            <Card.Body>
                <Link to={`/post/${post._id}`} className="btn btn-primary">
                    Ver más
                </Link>
            </Card.Body>

            <Modal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton />
                <Modal.Body className="text-center p-0">
                    {primeraImagen && (
                        <img
                            src={primeraImagen}
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
