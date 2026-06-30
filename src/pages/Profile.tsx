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

import { Link } from "react-router-dom";

import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";

import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Profile() {
  // Datos de prueba
  const user = {
    nickName: "userPrueba",
    bio: "Todavía no escribió una biografía.",
    followers: 15,
    following: 8,
    likes: 42,
    joined: "Junio 2026",
    location: "Buenos Aires",
    verified: false,
    online: true,
    private: false,
  };

  const posts = [
    {
      id: 1,
      description: "Hola 👋",
      comments: 4,
      likes: 15,
      time: "Hace 2 horas",
    },
    {
      id: 2,
      description: "hola x 2😄",
      comments: 2,
      likes: 8,
      time: "Hace 5 horas",
    },
  ];

  const avatars = [avatar1, avatar2, avatar3, avatar4];

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem("avatar");
    return saved !== null ? avatars[Number(saved)] : avatar1;
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container profile-page mt-4">
      {/* ================= TOPBAR ================= */}

      <div className="profile-topbar">
        <Link to="/" className="back-button">
          <LuArrowLeft size={22} />
        </Link>

        <div>
          <h5 className="mb-0">@{user.nickName}</h5>
          <small className="text-muted">{posts.length} publicaciones</small>
        </div>
      </div>

      {/* ================= HEADER ================= */}

      <div className="card profile-header shadow-sm mb-4">
        <div className="profile-banner"></div>

        <div className="profile-body">
          <div className="profile-user">
            {/* Avatar */}

            <div className="profile-avatar-wrapper">
              <img
                src={selectedAvatar}
                alt="Avatar"
                className="profile-avatar"
              />

              <button
                className="profile-avatar-edit"
                onClick={() => setShowAvatarModal(true)}
              >
                <LuCamera />
              </button>
            </div>

            {/* Información */}

            <div className="profile-user-info">
              <h2 className="profile-name d-flex align-items-center gap-2">
                @{user.nickName}
                {user.verified && (
                  <LuBadgeCheck size={22} color="var(--accent)" />
                )}
              </h2>

              <p className="profile-status">
                {user.online ? "🟢 En línea" : "⚫ Desconectado"}
              </p>

              <p className="profile-stats">
                <strong>{posts.length}</strong> publicaciones
                <span className="mx-2">•</span>
                <strong>{user.followers}</strong> seguidores
                <span className="mx-2">•</span>
                <strong>{user.following}</strong> seguidos
              </p>

              <div className="profile-extra-stats">
                <span>
                  <LuHeart className="me-1" />
                  {user.likes} Me gusta recibidos
                </span>
              </div>

              <p className="profile-bio">{user.bio}</p>

              <p className="profile-date">
                <LuCalendar className="me-2" />
                Miembro desde {user.joined}
              </p>

              <p className="profile-location">
                <LuMapPin className="me-2" />
                {user.location}
              </p>

              <p className="profile-location">
                <LuGlobe className="me-2" />
                {user.private ? "Perfil privado" : "Perfil público"}
              </p>
            </div>
          </div>

          {/* Botones */}

          <div className="profile-actions">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowModal(true)}
            >
              <LuPencil className="me-2" />
              Editar perfil
            </button>

            <button className="btn btn-primary" onClick={handleLogout}>
              <LuLogOut className="me-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}

      <ul className="nav nav-tabs profile-tabs mb-4">
        <li className="nav-item">
          <button className="nav-link active">Publicaciones</button>
        </li>

        <li className="nav-item">
          <button className="nav-link" disabled>
            Comentarios
          </button>
        </li>

        <li className="nav-item">
          <button className="nav-link" disabled>
            Multimedia
          </button>
        </li>

        <li className="nav-item">
          <button className="nav-link" disabled>
            ❤️ Me gusta
          </button>
        </li>
      </ul>

      {/* ================= PUBLICACIONES ================= */}

      <h4 className="mb-3">Mis publicaciones</h4>

      {posts.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h2>📝</h2>

            <h5>Todavía no publicaste nada</h5>

            <p className="text-muted">
              Compartí tu primer pensamiento con la comunidad.
            </p>

            <button className="btn btn-primary">Crear publicación</button>
          </div>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <strong>@{user.nickName}</strong>

                  {user.verified && (
                    <LuBadgeCheck size={16} color="var(--accent)" />
                  )}
                </div>

                <small className="post-date">{post.time}</small>
              </div>

              <p className="mt-3 mb-4">{post.description}</p>

              <div className="d-flex justify-content-between align-items-center">
                <div className="post-actions d-flex gap-3">
                  <small>
                    <LuHeart className="me-1" />
                    {post.likes}
                  </small>

                  <small>
                    <LuMessageCircle className="me-1" />
                    {post.comments}
                  </small>
                </div>

                <button className="btn btn-primary btn-sm">Ver más</button>
              </div>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ background: "rgba(0,0,0,.55)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content profile-modal">
                <div className="modal-header">
                  <h5 className="modal-title">Editar perfil</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <img
                      src={selectedAvatar}
                      className="modal-avatar"
                      alt="Avatar"
                    />

                    <button
                      className="btn btn-sm btn-outline-secondary mt-3"
                      onClick={() => {
                        setShowModal(false);
                        setShowAvatarModal(true);
                      }}
                    >
                      Cambiar avatar
                    </button>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre de usuario</label>

                    <input
                      className="form-control"
                      defaultValue={user.nickName}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Biografía</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      defaultValue={user.bio}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ubicación</label>
                    <input
                      className="form-control"
                      defaultValue={user.location}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-primary">Guardar cambios</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showAvatarModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ background: "rgba(0,0,0,.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content profile-modal">
              <div className="modal-header">
                <h5 className="modal-title">Elegí un avatar</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowAvatarModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="avatar-grid">
                  {avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      className={`avatar-option ${
                        selectedAvatar === avatar ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        localStorage.setItem("avatar", index.toString());
                        setShowAvatarModal(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
