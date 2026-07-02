import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import logoImg from "../assets/logo.webp";

function Navbar() {
  const { user, logout } = useContext(UserContext);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <NavLink to="/" className="navbar-brand">
          <img
            src={logoImg}
            alt="Logo"
            height="40"
            style={{ display: "block", objectFit: "contain" }}
          />
          <span>Anti-Social</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/create-post"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
              >
                Crear Post
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
              >
                Mi Perfil
              </NavLink>
              <button className="navbar-link navbar-btn-logout" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
              >
                Iniciar Sesión
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
              >
                Registrarse
              </NavLink>
            </>
          )}

          <button className="navbar-theme-btn" onClick={toggleTheme} title="Cambiar tema">
            {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
