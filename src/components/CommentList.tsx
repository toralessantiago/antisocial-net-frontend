import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

import CommentCard from "./CommentCard";
import { obtenerComentarios } from "../services/CommentService";
import { obtenerUsuarios } from "../services/UsuarioService";
import type { Comment } from "../data/comments";
import type { User } from "../data/users";


type CommentListProps = {
    postId: string | number;
};

export function CommentList({ postId }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarComentarios() {
            try {

                const [comentariosObtenidos, usuariosObtenidos] = await Promise.all([
                    obtenerComentarios(postId),
                    obtenerUsuarios()
                ]);

                setComments(comentariosObtenidos);
                setUsuarios(usuariosObtenidos);

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
                    const userId = comment.userId;
                    const autorComment = usuarios.find(u => String(u._id) === String(userId)) || {
                        _id: userId ?? "desconocido",
                        fullname: "",
                        nickname: "Usuario desconocido",
                        email: ""
                    };
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
