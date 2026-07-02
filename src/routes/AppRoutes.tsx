import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import PostDetail from "../pages/PostDetail";
import CreatePost from "../pages/CreatePost";
import ProtectedRoute from "../components/ProtectedRoute";

const HIDDEN_ROUTES = ["/login", "/register"];

function AppRoutes() {
  const { pathname } = useLocation();
  const showNavbar = !HIDDEN_ROUTES.includes(pathname);

  return (
    <div className="app-layout">
      {showNavbar && <Navbar />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
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
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default AppRoutes;
