import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Spinner } from "react-bootstrap";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const ctx = useContext(UserContext);

  if (!ctx || ctx.cargandoCtx) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return ctx.user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;