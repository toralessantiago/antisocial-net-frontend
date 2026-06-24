import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { users } from "../data/users";
import { FaAt, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/pages/auth.css";

function Login() {
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setTouched({ nickName: true, password: true });

    if (!nickName || !password) {
      setError("Completa todos los campos");
      return;
    }

    const usuario = users.find((user) => user.nickName === nickName);
    const passwordCorrecta = password === "123456";

    if (!usuario || !passwordCorrecta) {
      setError("Usuario o contraseña incorrecta");
      return;
    }

    login(usuario);
    navigate("/profile");
  };

  // Mismos bordes condicionales: Solo verde si es correcto y completado
  const getBorderClass = (name: string, value: string) => {
    if (!touched[name]) return "";
    if (error) return "input-error"; // Si hay error global de login, se marcan en rojo
    return value ? "input-success" : "";
  };

  return (
    <div className="register-layout">
      {/* Columna Izquierda con el mismo diseño del Register */}
      <div className="register-left">
        <h1>¡Hola de nuevo!</h1>
        <p>Inicia sesión para enterarte de lo que suben tus amigos.</p>
      </div>

      {/* Contenedor Derecho translúcido con tus variables globales */}
      <div className="register-right-container">
        <div className="register-right">
          <h2 className="auth-title">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* USUARIO */}
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <div className="username-wrapper">
                <span className="username-prefix">
                  <FaAt />
                </span>
                <input
                  type="text"
                  className={`form-control username-input ${getBorderClass("nickName", nickName)}`}
                  value={nickName}
                  onChange={(e) => {
                    setNickName(e.target.value);
                    if (error) setError(""); // Limpia el error al escribir
                  }}
                  onBlur={() => setTouched((p) => ({ ...p, nickName: true }))}
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${getBorderClass("password", password)}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(""); // Limpia el error al escribir
                  }}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* ERROR GLOBAL DE AUTENTICACIÓN */}
            {error && <small className="text-danger text-center">{error}</small>}

            <button type="submit" className="btn-app w-100">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;