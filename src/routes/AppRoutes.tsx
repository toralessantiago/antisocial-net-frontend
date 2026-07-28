import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import PostDetail from "../pages/PostDetail";
import CreatePost from "../pages/CreatePost";
import Feed from "../pages/Feed"; 
import ProtectedRoute from "../components/ProtectedRoute";
import UserProfile from "../pages/UserProfile";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
     <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
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

      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
    
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
