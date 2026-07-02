import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  _id: string;
  nickname: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>; // Actualizado a Promise para soportar async/await
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      // 1. Llamada a la API para destruir la sesión real en el servidor.
      // IMPORTANTE: Asegúrate de que esta URL sea la correcta para tu backend.
      await fetch('http://localhost:3000/api/logout', { 
        method: 'POST',
        credentials: 'include', // Obligatorio para que el navegador envíe y borre la cookie de sesión
      });
    } catch (error) {
      console.error("Error al intentar cerrar sesión en el servidor:", error);
    } finally {
      // 2. Limpieza local (se ejecuta siempre, aunque el servidor falle o esté caído)
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}