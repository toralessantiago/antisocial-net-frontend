import { Link } from "react-router-dom";
import "../styles/pages/home.css";
function Home() {
  return (
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
    </div>
  );
}

export default Home;
