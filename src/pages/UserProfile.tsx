import "../styles/pages/profile.css";
import { LuArrowLeft } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import { useState, useContext, useEffect, useCallback } from "react";
import { Modal, ListGroup } from "react-bootstrap";

import { UserContext } from "../context/UserContext";
import { obtenerPostsPorUsuario } from "../services/PostService";
import { obtenerComentariosPorUsuario } from "../services/CommentService";
import { obtenerUserPorId } from "../services/UsuarioService";
import FollowButton from "../components/FollowButton";
import { getUserId, normalizeFollowEntry } from "../utils/userHelpers";

import type { Post } from "../data/Post";
import type { Comment } from "../data/comments";
import type { User } from "../data/users";

import avatar1 from "../assets/avatar-1.png";

function UserProfile() {
  const ctx = useContext(UserContext);
  const currentUser = ctx?.user;
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [misPosts, setMisPosts] = useState<Post[]>([]);
  const [misComentarios, setMisComentarios] = useState<Comment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

 // const avatars = [avatar1, avatar2, avatar3, avatar4];
  const [selectedAvatar] = useState(avatar1);

  const reloadProfile = useCallback(async () => {
    if (!id) return;
    const datosUser = await obtenerUserPorId(id);
    setUserProfile(datosUser);
    return datosUser;
  }, [id]);

  useEffect(() => {
    async function cargarDatos() {
      if (!id) return;
      setCargando(true);
      setError("");
      try {
        const datosUser = await reloadProfile();
        const userId = getUserId(datosUser as User) ?? id;

        const [posts, comments] = await Promise.all([
          obtenerPostsPorUsuario(userId),
          obtenerComentariosPorUsuario(userId).catch(() => []),
        ]);

        const postsOrdenados = [...posts].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setMisPosts(postsOrdenados);
        setMisComentarios(comments);
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [id, reloadProfile]);

  const handleFollowChange = async () => {
    await reloadProfile();
  };

  const myId = getUserId(currentUser);
  const profileId = getUserId(userProfile);
  const esMiPerfil = myId && profileId && String(myId) === String(profileId);

  if (cargando && !userProfile) {
    return <div className="text-center mt-5">Cargando perfil...</div>;
  }

  if (error || !userProfile) {
    return <div className="text-center mt-5">{error || "Usuario no encontrado."}</div>;
  }

  const totalLikesRecibidos = misPosts.reduce(
    (acc, p) => acc + (Array.isArray(p.likes) ? p.likes.length : 0),
    0,
  );

  return (
    <div className="container profile-page mt-4">
      <div className="profile-topbar">
        <Link to="/feed" className="back-button">
          <LuArrowLeft size={22} />
        </Link>
        <div className="text-center">
          <h5 className="mb-0">@{userProfile.nickname}</h5>
          <small className="text-muted">{misPosts.length} publicaciones</small>
        </div>
      </div>

      <div className="card profile-header shadow-sm mb-4">
        <div className="profile-banner"></div>
        <div className="profile-body p-3 pt-0 text-start">
          <div className="profile-avatar-wrapper mb-3">
            <img src={selectedAvatar} alt="Avatar" className="profile-avatar" />
          </div>
          <div className="profile-user-info">
            <h2 className="profile-name mb-0">{userProfile.fullname}</h2>
            <p className="profile-handle text-muted mb-3">@{userProfile.nickname}</p>
            <p className="profile-bio mb-3">
              {userProfile.bio || "Todavía no escribió una biografía."}
            </p>

            <div className="profile-follow-stats d-flex gap-4 mb-3 flex-wrap">
              <span>
                <strong>{misPosts.length}</strong>{" "}
                <span className="text-muted">Publicaciones</span>
              </span>
              <button
                type="button"
                className="profile-stat-link border-0 bg-transparent p-0"
                onClick={() => setShowFollowersModal(true)}
              >
                <strong>{userProfile.followers?.length ?? 0}</strong>{" "}
                <span className="text-muted">Seguidores</span>
              </button>
              <button
                type="button"
                className="profile-stat-link border-0 bg-transparent p-0"
                onClick={() => setShowFollowingModal(true)}
              >
                <strong>{userProfile.following?.length ?? 0}</strong>{" "}
                <span className="text-muted">Siguiendo</span>
              </button>
            </div>

            <div className="profile-extra-stats text-muted mb-3">
              <strong>{totalLikesRecibidos}</strong> Me gusta recibidos
            </div>

            {!esMiPerfil && profileId && (
              <div className="profile-actions">
                <FollowButton
                  targetUserId={profileId}
                  onFollowChange={handleFollowChange}
                />
              </div>
            )}
            {esMiPerfil && (
              <Link to="/profile" className="btn btn-outline-secondary btn-sm">
                Ir a mi perfil
              </Link>
            )}
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs profile-tabs mb-4 justify-content-center">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Publicaciones
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            Comentarios
          </button>
        </li>
      </ul>

      {cargando ? (
        <div className="text-center py-5">Cargando...</div>
      ) : activeTab === "posts" ? (
        misPosts.length === 0 ? (
          <p className="text-center">No hay publicaciones.</p>
        ) : (
          misPosts.map((post) => (
            <div key={post._id} className="card shadow-sm mb-3">
              <div className="card-body">
                <p>{post.description}</p>
                <Link to={`/post/${post._id}`} className="btn btn-primary btn-sm">
                  Ver más
                </Link>
              </div>
            </div>
          ))
        )
      ) : misComentarios.length === 0 ? (
        <p className="text-center">No ha hecho comentarios aún.</p>
      ) : (
        misComentarios.map((c) => (
          <div key={c._id} className="card shadow-sm mb-3">
            <div className="card-body">
              <p className="mb-1">
                <em>"{c.content}"</em>
              </p>
              <Link
                to={`/post/${typeof c.post === "string" ? c.post : c.post._id}`}
                className="btn btn-outline-primary btn-sm"
              >
                Ver publicación
              </Link>
            </div>
          </div>
        ))
      )}

      <Modal
        show={showFollowersModal}
        onHide={() => setShowFollowersModal(false)}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Seguidores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userProfile.followers && userProfile.followers.length > 0 ? (
            <ListGroup variant="flush">
              {userProfile.followers.map((follower, idx) => {
                const entry = normalizeFollowEntry(follower);
                return (
                  <ListGroup.Item
                    key={entry.id || idx}
                    className="d-flex align-items-center gap-2 px-0 border-0 mb-2"
                  >
                    <div
                      className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center"
                      style={{ width: 40, height: 40 }}
                    >
                      {entry.nickname?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <Link
                      to={`/users/${entry.id}`}
                      className="text-decoration-none text-body"
                      onClick={() => setShowFollowersModal(false)}
                    >
                      <strong className="d-block">{entry.fullname || "Usuario"}</strong>
                      <span className="text-muted small">@{entry.nickname || "usuario"}</span>
                    </Link>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            <p className="text-muted text-center my-3">Sin seguidores todavía.</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showFollowingModal}
        onHide={() => setShowFollowingModal(false)}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Siguiendo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userProfile.following && userProfile.following.length > 0 ? (
            <ListGroup variant="flush">
              {userProfile.following.map((followed, idx) => {
                const entry = normalizeFollowEntry(followed);
                return (
                  <ListGroup.Item
                    key={entry.id || idx}
                    className="d-flex align-items-center gap-2 px-0 border-0 mb-2"
                  >
                    <div
                      className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center"
                      style={{ width: 40, height: 40 }}
                    >
                      {entry.nickname?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <Link
                      to={`/users/${entry.id}`}
                      className="text-decoration-none text-body"
                      onClick={() => setShowFollowingModal(false)}
                    >
                      <strong className="d-block">{entry.fullname || "Usuario"}</strong>
                      <span className="text-muted small">@{entry.nickname || "usuario"}</span>
                    </Link>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            <p className="text-muted text-center my-3">No sigue a nadie todavía.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserProfile;
