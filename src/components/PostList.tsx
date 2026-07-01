import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

import PostCard from "./PostCard";
import { obtenerPosts } from "../services/PostService";
import { obtenerUsuarios } from "../services/UsuarioService";
import type { Post } from "../data/Post";
import type { User } from "../data/users";

export function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarPosts() {
            try {
                const [postsObtenidos, usuariosObtenidos] = await Promise.all([
                    obtenerPosts(),
                    obtenerUsuarios()
                ]);

                setPosts(postsObtenidos);
                setUsuarios(usuariosObtenidos);

            } catch (error) {
                setError("Ocurrió un error al cargar los posts.");
            } finally {
                setCargando(false);
            }
        }

        cargarPosts();
    }, []);

    if (cargando) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p className="mt-3">Cargando posts...</p>
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
            <h1 className="mb-4">Home</h1>

            <Row className="justify-content-center">
                {posts.map((post) => {
                    const autorPost = usuarios.find(u => u.id === post.userId) || {
                        id: post.userId,
                        nickname: "Usuario desconocido"
                    }
                    return (
                        <Col key={post.id} xs={12} className="mb-4">
                            <PostCard post={post} user={autorPost} />
                        </Col>
                    )
                })}
            </Row>
        </Container>
    );
}
