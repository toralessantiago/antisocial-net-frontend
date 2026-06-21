import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: any) => {

  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;