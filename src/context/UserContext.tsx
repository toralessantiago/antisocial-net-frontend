import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "../data/users";
import { obtenerUserPorId } from "../services/UsuarioService";
import { normalizeUserFromApi } from "../utils/userHelpers";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type UserContextValue = {
  user: User | null;
  cargandoCtx: boolean;
  login: (userData: User | Record<string, unknown>) => void;
  logout: () => Promise<void>;
  updateCurrentUser: (userData: User | Record<string, unknown>) => void;
  refreshCurrentUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextValue | null>(null);

function toStoredUser(userData: User | Record<string, unknown>): User {
  return normalizeUserFromApi(userData as Record<string, unknown>) as User;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cargandoCtx, setCargandoCtx] = useState(true);

  const persistUser = useCallback((userData: User | Record<string, unknown>) => {
    const userNormalizado = toStoredUser(userData);
    setUser(userNormalizado);
    localStorage.setItem("user", JSON.stringify(userNormalizado));
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    const id = user?.id || user?._id;
    if (!id) return;
    const datosActualizados = await obtenerUserPorId(id);
    persistUser(datosActualizados);
  }, [user?.id, user?._id, persistUser]);

  useEffect(() => {
    async function verificarSesion() {
      const savedUser = localStorage.getItem("user");

      if (!savedUser || savedUser === "undefined") {
        setCargandoCtx(false);
        return;
      }

      try {
        const localData = JSON.parse(savedUser) as Record<string, unknown>;
        const idUsuario = (localData.id || localData._id) as string | undefined;

        if (idUsuario) {
          const datosActualizados = await obtenerUserPorId(idUsuario);
          persistUser(datosActualizados);
        }
      } catch (error) {
        console.error("Error al refrescar usuario desde la BD:", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setCargandoCtx(false);
      }
    }

    verificarSesion();
  }, [persistUser]);

  const login = useCallback(
    (userData: User | Record<string, unknown>) => {
      persistUser(userData);
    },
    [persistUser],
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* sesión puede ser solo localStorage */
    }
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const updateCurrentUser = useCallback(
    (userData: User | Record<string, unknown>) => {
      persistUser(userData);
    },
    [persistUser],
  );

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        updateCurrentUser,
        refreshCurrentUser,
        cargandoCtx,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/** @deprecated Usar UserProvider — alias por compatibilidad */
export const AuthProvider = UserProvider;
