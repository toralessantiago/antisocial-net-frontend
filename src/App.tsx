import { useEffect, useState } from "react";
import Navbar from "./components/Navbar"; 
import AppRoutes from "./routes/AppRoutes";
import "./styles/layout/navbar.css";
import "./styles/layout/footer.css";
import { FaMoon, FaSun } from "react-icons/fa";

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
      <Navbar />
      <AppRoutes />
    </>
  );
}

export default App;