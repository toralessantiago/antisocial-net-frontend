import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

import CommentCard from "./CommentCard";
import { obtenerComentarios } from "../services/CommentService";
import type { Comment } from "../data/comments";


type CommentListProps = {
    postId: string | number;
};

export function CommentList({ postId }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarComentarios() {
            try {

                const comentariosObtenidos = await obtenerComentarios(postId);
                setComments(comentariosObtenidos);

            } catch (error) {
                setError("Ocurrió un error al cargar los comentarios.");
            } finally {
                setCargando(false);
            }
        }

        cargarComentarios();
    }, []);

    if (cargando) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p className="mt-3">Cargando comentarios...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">

            <Row className="justify-content-center">
                {comments.map((comment) => {
                    const autorComment = comment.user  || {
                        _id: "desconocido",
                        fullname: "",
                        nickname: "Usuario desconocido",
                        email: ""
                    };;
                    return (
                        <Col key={comment._id} xs={12} className="mb-4">
                            <CommentCard comment={comment} user={autorComment} />
                        </Col>
                    )
                })}
            </Row>
        </Container>
    );
}
