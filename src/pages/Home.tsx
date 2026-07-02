import { Link, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "../styles/pages/home.css";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function Home() {
  const { user } = useContext(UserContext);
  
  if (user) {
    return <Navigate to="/feed" />;
  }

  return (
    <Container className="mt-5 text-center">
      <h1>UnaHur Anti-Social Net</h1>
      <p>Bienvenido a la red social oficial de la universidad.</p>

      <div className="d-flex justify-content-center gap-2 mt-4">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/register" className="btn btn-success">Registro</Link>
      </div>
    </Container>
  );
}

export default Home;