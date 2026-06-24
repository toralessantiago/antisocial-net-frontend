import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import AppRoutes from "./routes/AppRoutes";
import "./styles/layout/navbar.css";
import "./styles/layout/footer.css";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "light" || saved === "dark") {
      return saved;
    }

    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className={`position-fixed top-0 end-0 m-3 d-flex align-items-center justify-content-center ${
          theme === "dark" ? "btn btn-light" : "btn btn-dark"
        }`}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          padding: 0,
          zIndex: 1000,
        }}
      >
        {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      <AppRoutes />
    </>
  );
}

export default App;
