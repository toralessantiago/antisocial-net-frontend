import "../styles/pages/profile.css";
import {
  LuMapPin,
  LuCalendar,
  LuMessageCircle,
  LuPencil,
  LuLogOut,
  LuArrowLeft,
  LuBadgeCheck,
  LuHeart,
  LuGlobe,
  LuCamera,
} from "react-icons/lu";

import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

import { obtenerPostsPorUsuario } from "../services/PostService";
import { obtenerComentariosPorUsuario } from "../services/CommentService";
import type { Post } from "../data/Post";
import type { Comment } from "../data/comments";

import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";

function Profile() {
  const { user: currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [misPosts, setMisPosts] = useState<Post[]>([]);
  const [misComentarios, setMisComentarios] = useState<Comment[]>([]);
  const [cargando, setCargando] = useState(true);

  const avatars = [avatar1, avatar2, avatar3, avatar4];
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem("avatar");
    return saved !== null ? avatars[Number(saved)] : avatar1;
  });

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      if (!currentUser) return;
      try {
        setCargando(true);
        const userId = currentUser.id;
        
        const [posts, comments] = await Promise.all([
          obtenerPostsPorUsuario(userId),
          obtenerComentariosPorUsuario(userId).catch(() => []) 
        ]);

        // === LÓGICA DE ORDENAMIENTO AGREGADA AQUÍ ===
        const postsOrdenados = [...posts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // ============================================

        console.log("Comentarios:", comments);
        console.log("UserId:", userId);
        console.log(currentUser);
        setMisPosts(postsOrdenados); // Usamos el array ordenado
        setMisComentarios(comments);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [currentUser]);

  const handleLogout = () => { logout(); navigate("/login"); };

  if (!currentUser) return <div className="text-center mt-5">Cargando perfil...</div>;

  const totalLikesRecibidos = misPosts.reduce((acc, p) => acc + (Array.isArray(p.likes) ? p.likes.length : 0), 0);

  return (
    <div className="container profile-page mt-4">
      <div className="profile-topbar">
        <Link to="/" className="back-button"><LuArrowLeft size={22} /></Link>
        <div className="text-center">
          <h5 className="mb-0">@{currentUser.nickname}</h5>
          <small className="text-muted">{misPosts.length} publicaciones</small>
        </div>
      </div>

      <div className="card profile-header shadow-sm mb-4">
        <div className="profile-banner"></div>
        <div className="profile-body">
          <div className="profile-user flex-column align-items-center text-center">
            <div className="profile-avatar-wrapper mb-3">
              <img src={selectedAvatar} alt="Avatar" className="profile-avatar" />
              <button className="profile-avatar-edit" onClick={() => setShowAvatarModal(true)}><LuCamera /></button>
            </div>
            <div className="profile-user-info w-100">
              <h2 className="profile-name d-flex justify-content-center align-items-center gap-2">
                @{currentUser.nickname} {currentUser.verified && <LuBadgeCheck size={22} color="var(--accent)" />}
              </h2>
              <p className="profile-stats justify-content-center">
                <strong>{misPosts.length}</strong> publicaciones • <strong>{currentUser.followers?.length || 0}</strong> seguidores
              </p>
              <div className="profile-extra-stats justify-content-center mb-3">
                <span><LuHeart className="me-1" /> {totalLikesRecibidos} Me gusta recibidos</span>
              </div>
              <p className="profile-bio mx-auto" style={{ maxWidth: "500px" }}>{currentUser.bio || "Todavía no escribió una biografía."}</p>
            </div>
          </div>
          <div className="profile-actions justify-content-center mt-4">
            <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}><LuPencil className="me-2" /> Editar perfil</button>
            <button className="btn btn-primary" onClick={handleLogout}><LuLogOut className="me-2" /> Cerrar sesión</button>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs profile-tabs mb-4 justify-content-center">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>Publicaciones</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "comments" ? "active" : ""}`} onClick={() => setActiveTab("comments")}>Comentarios</button>
        </li>
      </ul>

      {cargando ? <div className="text-center py-5">Cargando...</div> : (
        activeTab === "posts" ? (
          misPosts.length === 0 ? <p className="text-center">No hay publicaciones.</p> : misPosts.map(post => (
            <div key={post._id} className="card shadow-sm mb-3">
              <div className="card-body">
                <p>{post.description}</p>
                <Link to={`/post/${post._id}`} className="btn btn-primary btn-sm">Ver más</Link>
              </div>
            </div>
          ))
        ) : (
          misComentarios.length === 0 ? <p className="text-center">No has hecho comentarios aún.</p> : misComentarios.map(c => (
            <div key={c._id} className="card shadow-sm mb-3">
              <div className="card-body">
                <p className="mb-1"><em>"{c.content}"</em></p>
                <Link to={`/post/${typeof c.post === 'string' ? c.post : c.post._id}`} className="btn btn-outline-primary btn-sm">Ver publicación</Link>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}

export default Profile;