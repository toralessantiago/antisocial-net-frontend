import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { PostList } from "../components/PostList";
import "../styles/pages/home.css";

function Home() {
  return (
    <Container>
    <div className="container mt-5">
      <h1>UnaHur Anti-Social Net</h1>

      <p>Página de inicio</p>


      <div className="d-flex gap-2">
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>

        <Link to="/register" className="btn btn-success">
          Registro
        </Link>
      </div>

      <PostList />
      
    </div>
    </Container>
  );
}

export default Home;
