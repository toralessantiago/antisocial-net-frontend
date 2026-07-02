import { createContext, useState, useEffect } from "react";

export const UserContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser || savedUser === "undefined") {
    return;
  }

  try {
    setUser(JSON.parse(savedUser));
  } catch (error) {
    console.error("Usuario inválido en localStorage:", error);
    localStorage.removeItem("user");
  }
}, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  const updateCurrentUser = (userData: any) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};

  return (
    <UserContext.Provider value={{ user, login, logout, updateCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
