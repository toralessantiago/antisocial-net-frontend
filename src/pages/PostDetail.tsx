import "../styles/pages/postDetail.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { obtenerImagenesDePost, obtenerPostPorId } from "../services/PostService";
import { obtenerUsuarios } from "../services/UsuarioService";
import { obtenerComentarios } from "../services/CommentService";
import type { Post } from "../data/Post";
import type { User } from "../data/users";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  //const post: Post = obtenerPosts().find((p: Post) => p.id === Number(id));






  return (
    <Container>
    <div className="container mt-5">
      <h1>Detalle de Publicación</h1>

      <p>Post seleccionado</p>
    </div>
    </Container>
  );
}

export default PostDetail;