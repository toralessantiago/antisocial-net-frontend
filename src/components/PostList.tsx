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
          obtenerUsuarios(),
        ]);

        const postsOrdenados = [...postsObtenidos].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(postsOrdenados); 
        setUsuarios(usuariosObtenidos);
      } catch {
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
    <Container fluid className="py-4">
  <Row className="justify-content-center">
    <Col xs={12} md={8} lg={6} xl={5}>
      <h2 className="text-center mb-4">Inicio</h2>

      {posts.map((post) => {
        const userId =
          typeof post.user === "object" ? post.user._id : post.user;

        const autorPost =
          usuarios.find((u) => u._id === userId || u.id === userId) ??
          ({
            _id: userId,
            id: userId,
            fullname: "",
            nickname: "Usuario desconocido",
            email: "",
            birthDate: "",
          } as User);

        return (
          <div key={post._id} className="mb-4">
            <PostCard post={post} user={autorPost} />
          </div>
        );
      })}
    </Col>
  </Row>
</Container>
  );
}