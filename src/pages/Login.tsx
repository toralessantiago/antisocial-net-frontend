import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaAt, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/pages/auth.css";

const API_URL = "http://localhost:3001/api/users"; 

function Login() {
  const [nickname, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTouched({ nickname: true, password: true });

    if (!nickname || !password) {
      setError("Completa todos los campos");
      return;
    }

    if (password !== "123456") {
      setError("Usuario o contraseña incorrecta");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor. Ver detalle: ' + response.status);
      }

      const jsonResponse = await response.json();
      const usersArray = jsonResponse.data;
      
      const usuario = usersArray.find((user: any) => user.nickname === nickname);

      if (!usuario) {
        setError("Usuario o contraseña incorrecta");
        setIsLoading(false);
        return;
      }

      login(usuario);
      navigate("/profile");

    } catch (err) {
      console.error('Error inesperado:', err);
      setError("No se pudo conectar con el servidor. Intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBorderClass = (name: string, value: string) => {
    if (!touched[name]) return "";
    if (error) return "input-error";
    return value ? "input-success" : "";
  };

  return (
    <div className="register-layout">
      <div className="register-left">
        <h1>¡Hola de nuevo!</h1>
        <p>Inicia sesión para enterarte de lo que suben tus amigos.</p>
      </div>

      <div className="register-right-container">
        <div className="register-right">
          <h2 className="auth-title">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <div className="nickname-wrapper">
                <span className="nickname-prefix"><FaAt /></span>
                <input
                  type="text"
                  className={`form-control nickname-input ${getBorderClass("nickname", nickname)}`}
                  value={nickname}
                  onChange={(e) => {
                    setNickName(e.target.value);
                    if (error) setError("");
                  }}
                  onBlur={() => setTouched((p) => ({ ...p, nickname: true }))}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${getBorderClass("password", password)}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && <small className="text-danger text-center">{error}</small>}

            <button type="submit" className="btn-app w-100" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;