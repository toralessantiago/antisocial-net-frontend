import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import PostDetail from "../pages/PostDetail";
import CreatePost from "../pages/CreatePost";
import Feed from "../pages/Feed"; 
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/post/:id" element={<PostDetail />} />

      {/* --- Rutas Protegidas --- */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Corrección: Ahora crear un post requiere estar logueado */}
      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;