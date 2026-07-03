import { createContext, useState, useEffect } from "react";
import { obtenerUserPorId } from "../services/UsuarioService";

export const UserContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [cargandoCtx, setCargandoCtx] = useState(true);

  useEffect(() => {
    async function verificarSesion() {
      const savedUser = localStorage.getItem("user");

      if (!savedUser || savedUser === "undefined") {
        setCargandoCtx(false);
        return;
      }

      try {
        const localData = JSON.parse(savedUser);
        const idUsuario = localData.id || localData._id;

        if (idUsuario) {
          const datosActualizados = await obtenerUserPorId(idUsuario);

          const userNormalizado = {
            ...datosActualizados,
            id: datosActualizados._id || datosActualizados.id,
          };

          setUser(userNormalizado);
          localStorage.setItem("user", JSON.stringify(userNormalizado));
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
  }, []);

  const login = (userData: any) => {
    const userNormalizado = { ...userData, id: userData._id || userData.id };
    setUser(userNormalizado);
    localStorage.setItem("user", JSON.stringify(userNormalizado));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateCurrentUser = (userData: any) => {
    const userNormalizado = { ...userData, id: userData._id || userData.id };
    setUser(userNormalizado);
    localStorage.setItem("user", JSON.stringify(userNormalizado));
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, updateCurrentUser, cargandoCtx }}
    >
      {children}
    </UserContext.Provider>
  );
};
