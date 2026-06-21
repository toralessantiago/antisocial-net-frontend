import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { users } from "../data/users";

function Login() {
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const usuario = users.find(
      (user) => user.nickName === nickName
    );

    if (!usuario) {
      setError("Usuario no encontrado");
      return;
    }

    if (password !== "123456") {
      setError("Contraseña incorrecta");
      return;
    }

    login(usuario);

    navigate("/profile");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow">
            <div className="card-body">

              <h2 className="text-center mb-4">
                Iniciar Sesión
              </h2>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">
                    Nickname
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={nickName}
                    onChange={(e) =>
                      setNickName(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Ingresar
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;