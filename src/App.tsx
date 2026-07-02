import { useEffect, useState } from "react";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; // 1. Importa tu componente Footer
import AppRoutes from "./routes/AppRoutes";
import "./styles/layout/navbar.css";
import "./styles/layout/footer.css";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <Navbar />

      <main style={{ flex: 1 }}>
        <AppRoutes />
      </main>

      <Footer />
      
    </div>
  );
}

export default App;