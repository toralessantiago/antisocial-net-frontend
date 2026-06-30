import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/pages/auth.css";

const API_URL = "http://localhost:3001/api/users";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    day: "",
    month: "",
    year: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const [monthQuery, setMonthQuery] = useState("");
  const [monthOpen, setMonthOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const monthRef = useRef<HTMLDivElement>(null);

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const currentYear = new Date().getFullYear();
  const minYear = 1926;
  const maxYear = currentYear - 13;

  const fullnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const usernameRegex = /^[a-zA-Z0-9._]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const filteredMonths = months.filter((m) =>
    m.toLowerCase().includes(monthQuery.toLowerCase()),
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(e.target as Node)) {
        setMonthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isValidDate = (d: number, m: number, y: number) => {
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  };

  const validateField = (name: string, value: string): string => {
    let message = "";

    switch (name) {
      case "fullname":
        if (!value) message = "Ingresa tu nombre";
        else if (value.length < 5) message = "Mínimo 5 caracteres";
        else if (value.length > 30) message = "Máximo 30 caracteres";
        else if (!fullnameRegex.test(value)) message = "Solo letras";
        break;

      case "username":
        if (!value) message = "Ingresa usuario";
        else if (value.length < 5) message = "Mínimo 5 caracteres";
        else if (value.length > 20) message = "Máximo 20 caracteres";
        else if (!usernameRegex.test(value))
          message = "Solo letras, números . _";
        break;

      case "email":
        if (!value) message = "Ingresa email";
        else if (!emailRegex.test(value)) message = "Email inválido";
        break;

      case "password":
        if (!value) message = "Ingresa contraseña";
        else if (value.length < 6) message = "Mínimo 6 caracteres";
        else if (value.length > 20) message = "Máximo 20 caracteres";
        break;

      case "day":
        if (!value) message = "Día requerido";
        else if (!/^\d{1,2}$/.test(value)) message = "Máx 2 números";
        else if (+value < 1 || +value > 31) message = "Día inválido";
        break;

      case "month":
        if (!value) message = "Mes requerido";
        break;

      case "year":
        if (!value) message = "Año requerido";
        else if (!/^\d{4}$/.test(value)) message = "Máx 4 números";
        else if (+value < minYear || +value > maxYear)
          message = "Fecha inválida";
        break;
    }

    setErrors((p) => ({ ...p, [name]: message }));
    return message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "day") newValue = value.replace(/\D/g, "").slice(0, 2);
    if (name === "year") newValue = value.replace(/\D/g, "").slice(0, 4);

    setForm((p) => ({ ...p, [name]: newValue }));
    validateField(name, newValue);
    if (serverError) setServerError("");
  };

  const getBorderClass = (name: string) => {
    if (!touched[name]) return "";
    if (errors[name]) return "input-error";
    if (form[name as keyof typeof form]) return "input-success";
    return "";
  };

  const selectMonth = (index: number) => {
    const monthName = months[index];
    setForm((p) => ({ ...p, month: String(index + 1) }));
    setMonthQuery(monthName);
    setMonthOpen(false);
    setActiveIndex(index);
    setTouched((p) => ({ ...p, month: true }));
    setErrors((p) => ({ ...p, month: "" }));
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!monthOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredMonths.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredMonths[activeIndex];
      if (selected) {
        const index = months.indexOf(selected);
        selectMonth(index);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    let currentErrors: Record<string, string> = {};
    let hasEmptyFields = false;

    Object.entries(form).forEach(([key, value]) => {
      const errorMsg = validateField(key, value);
      if (errorMsg) currentErrors[key] = errorMsg;
      if (!value) hasEmptyFields = true;
    });

    const d = Number(form.day);
    const m = Number(form.month);
    const y = Number(form.year);

    if (form.day && form.month && form.year && !isValidDate(d, m, y)) {
      setErrors((p) => ({ ...p, day: "Fecha inválida" }));
      return;
    }

    if (hasEmptyFields || Object.values(currentErrors).some(Boolean)) return;

    setIsLoading(true);

    try {
      const payload = {
        fullname: form.fullname,
        nickname: form.username,
        email: form.email,
        password: form.password,
        birthDate: `${form.year}-${form.month.padStart(2, "0")}-${form.day.padStart(2, "0")}`,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = {
            message: "Error en la solicitud: " + response.statusText,
          };
        }
        throw new Error(
          errorData.error || errorData.message || "No se pudo crear el usuario",
        );
      }

      setSuccess("Registro exitoso. Redirigiendo...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.error("Error del servidor:", error);
      setServerError(error.message || "Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayMonth = monthOpen
    ? monthQuery
    : form.month
      ? months[Number(form.month) - 1]
      : monthQuery;

  return (
    <div className="register-layout">
      <div className="register-left">
        <h1>Únete a la comunidad</h1>
        <p>Regístrate para ver contenido de tus amigos.</p>
      </div>

      <div className="register-right-container">
        <div className="register-right">
          <h2 className="auth-title">Crear cuenta</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                name="fullname"
                className={`form-control ${getBorderClass("fullname")}`}
                value={form.fullname}
                onChange={handleChange}
                onBlur={() => setTouched((p) => ({ ...p, fullname: true }))}
                disabled={isLoading}
              />
              {errors.fullname && (
                <small className="text-danger">{errors.fullname}</small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Usuario</label>
              <input
                name="username"
                className={`form-control ${getBorderClass("username")}`}
                value={form.username}
                onChange={handleChange}
                onBlur={() => setTouched((p) => ({ ...p, username: true }))}
                disabled={isLoading}
              />
              {errors.username && (
                <small className="text-danger">{errors.username}</small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                name="email"
                className={`form-control ${getBorderClass("email")}`}
                value={form.email}
                onChange={handleChange}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                disabled={isLoading}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="password-wrapper">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${getBorderClass("password")}`}
                  value={form.password}
                  onChange={handleChange}
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
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de nacimiento</label>
              <div className="birthdate-row">
                <input
                  name="day"
                  placeholder="Día"
                  className={`form-control ${getBorderClass("day")}`}
                  value={form.day}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, day: true }))}
                  disabled={isLoading}
                />

                <div
                  ref={monthRef}
                  className="position-relative month-input-container"
                >
                  <input
                    placeholder="Mes"
                    className={`form-control ${getBorderClass("month")}`}
                    value={displayMonth}
                    onChange={(e) => {
                      setMonthQuery(e.target.value);
                      setMonthOpen(true);
                      setActiveIndex(0);
                    }}
                    onFocus={() => setMonthOpen(true)}
                    onKeyDown={handleMonthKeyDown}
                    disabled={isLoading}
                  />

                  {monthOpen && (
                    <div className="custom-select-dropdown glass">
                      <div className="custom-select-scroll">
                        {filteredMonths.map((m, i) => (
                          <div
                            key={m}
                            className={`custom-select-item ${i === activeIndex ? "active" : ""}`}
                            onMouseDown={() => selectMonth(months.indexOf(m))}
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  name="year"
                  placeholder="Año"
                  className={`form-control ${getBorderClass("year")}`}
                  value={form.year}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, year: true }))}
                  disabled={isLoading}
                />
              </div>
              {errors.month && (
                <small className="text-danger">{errors.month}</small>
              )}
              {errors.day && (
                <small className="text-danger">{errors.day}</small>
              )}
              {errors.year && (
                <small className="text-danger">{errors.year}</small>
              )}
            </div>

            {serverError && (
              <div className="text-danger text-center mb-2">{serverError}</div>
            )}
            {success && (
              <div className="text-success text-center mb-2">{success}</div>
            )}

            <button
              type="submit"
              className="btn-app w-100"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Registrarte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
