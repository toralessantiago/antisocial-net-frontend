import { Link } from "react-router-dom";
import "../styles/pages/home.css"; // Compartimos el mismo CSS de layout

function NotFound() {
  return (
    <div className="home-layout not-found-layout">
      <div className="home-left">
        <img 
          src="/path/to/tu/imagen_principal_unaHur.png" 
          alt="UnaHur Net - Conectate" 
          className="home-image"
        />
        <h1>UnaHur Anti-Social Net</h1>
        <p>Parece que te perdiste en el campus...</p>
      </div>

      <div className="home-right-container">
        <div className="home-right auth-card text-center">
          <h1 className="error-code">404</h1>
          <h2 className="auth-title mt-4">Página no encontrada</h2>
          <p className="text-muted mb-5">
            La ruta que buscas no existe o fue eliminada de la red social.
          </p>
          
          <Link to="/" className="btn-app text-decoration-none d-flex justify-content-center align-items-center">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;