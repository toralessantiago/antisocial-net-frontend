import "../styles/pages/profile.css";
import { LuArrowLeft } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";

import { UserContext } from "../context/UserContext";
import { obtenerPostsPorUsuario } from "../services/PostService";
import { obtenerComentariosPorUsuario } from "../services/CommentService";
import { updateUser } from "../services/UsuarioService";
import { normalizeFollowEntry } from "../utils/userHelpers";

import type { Post } from "../data/Post";
import type { Comment } from "../data/comments";

import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";

import ProfileHeader from "../components/profile/ProfileHeader";

function Profile() {
  const {
    user: currentUser,
    logout,
    updateCurrentUser,
    refreshCurrentUser,
  } = useContext(UserContext)!;
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

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const [editFormData, setEditFormData] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [profileTouched, setProfileTouched] = useState(false);

  useEffect(() => {
    refreshCurrentUser?.().catch(() => {});
  }, []);

  useEffect(() => {
    async function cargarDatos() {
      if (!currentUser) return;
      try {
        setCargando(true);
        const userId = currentUser.id || currentUser._id || "";

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
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGuardarCambios = async () => {
    if (!currentUser) return;

    setProfileTouched(true);
    if (!editFormData.fullname.trim()) {
      setProfileError("El nombre completo es obligatorio.");
      return;
    }

    setIsUpdating(true);
    setProfileError("");
    try {
      const userId = currentUser.id || currentUser._id || "";
      const respuesta = await updateUser(userId, editFormData);

      const usuarioActualizado = {
        ...currentUser,
        ...respuesta.data,
      };

      updateCurrentUser(usuarioActualizado);
      setShowModal(false);
    } catch (error: any) {
      setProfileError(error.message || "Hubo un error al guardar los cambios.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!currentUser)
    return <div className="text-center mt-5">Cargando perfil...</div>;

  return (
    <div className="container profile-page mt-4">
      <div className="profile-topbar">
        <Link to="/" className="back-button">
          <LuArrowLeft size={22} />
        </Link>
        <div className="text-center">
          <h5 className="mb-0">@{currentUser.nickname}</h5>
          <small className="text-muted">{misPosts.length} publicaciones</small>
        </div>
      </div>

      <ProfileHeader
        user={currentUser}
        posts={misPosts}
        selectedAvatar={selectedAvatar}
        onEditProfile={() => {
          setEditFormData({
            fullname: currentUser.fullname || "",
            bio: currentUser.bio || "",
            location: currentUser.location || "",
          });
          setProfileError("");
          setProfileTouched(false);
          setShowModal(true);
        }}
        onAvatarClick={() => setShowAvatarModal(true)}
        onLogout={handleLogout}
        onFollowersClick={() => setShowFollowersModal(true)}
        onFollowingClick={() => setShowFollowingModal(true)}
      />

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
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-primary btn-sm"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))
        )
      ) : misComentarios.length === 0 ? (
        <p className="text-center">No has hecho comentarios aún.</p>
      ) : (
        misComentarios.map((c) => (
          <div key={c._id} className="card shadow-sm mb-3">
            <div className="card-body">
              <p className="mb-1">
                <em>"{c.content}"</em>
              </p>
              <Link
                to={`/post/${typeof c.post === "string" ? c.post : c.post?._id}`}
                className="btn btn-outline-success btn-sm mt-2"
              >
                Ver publicación
              </Link>
            </div>
          </div>
        ))
      )}

      {/* MODAL: SEGUIDORES */}
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
          {currentUser.followers && currentUser.followers.length > 0 ? (
            <ListGroup variant="flush">
              {currentUser.followers.map((follower: unknown, idx: number) => {
                const entry = normalizeFollowEntry(follower);
                return (
                  <ListGroup.Item
                    key={entry.id || idx}
                    className="d-flex align-items-center gap-2 px-0 border-bottom-0 mb-2"
                  >
                    <div
                      className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      {entry.nickname
                        ? entry.nickname.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div className="flex-grow-1">
                      <Link
                        to={`/users/${entry.id}`}
                        className="text-decoration-none text-body"
                        onClick={() => setShowFollowersModal(false)}
                      >
                        <strong className="d-block">
                          {entry.fullname || "Usuario"}
                        </strong>
                        <span
                          className="text-muted"
                          style={{ fontSize: "14px" }}
                        >
                          @{entry.nickname || "usuario"}
                        </span>
                      </Link>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            <p className="text-muted text-center my-3">
              Aún no tenés seguidores.
            </p>
          )}
        </Modal.Body>
      </Modal>

      {/* MODAL: SEGUIDOS */}
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
          {currentUser.following && currentUser.following.length > 0 ? (
            <ListGroup variant="flush">
              {currentUser.following.map((followed: unknown, idx: number) => {
                const entry = normalizeFollowEntry(followed);
                return (
                  <ListGroup.Item
                    key={entry.id || idx}
                    className="d-flex align-items-center gap-2 px-0 border-bottom-0 mb-2"
                  >
                    <div
                      className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      {entry.nickname
                        ? entry.nickname.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div className="flex-grow-1">
                      <Link
                        to={`/users/${entry.id}`}
                        className="text-decoration-none text-body"
                        onClick={() => setShowFollowingModal(false)}
                      >
                        <strong className="d-block">
                          {entry.fullname || "Usuario"}
                        </strong>
                        <span
                          className="text-muted"
                          style={{ fontSize: "14px" }}
                        >
                          @{entry.nickname || "usuario"}
                        </span>
                      </Link>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            <p className="text-muted text-center my-3">
              No seguís a nadie todavía.
            </p>
          )}
        </Modal.Body>
      </Modal>

      {/* MODAL: EDITAR PERFIL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                className={
                  profileTouched && !editFormData.fullname.trim()
                    ? "input-error"
                    : profileTouched && editFormData.fullname.trim()
                    ? "input-success"
                    : ""
                }
                value={editFormData.fullname}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, fullname: e.target.value });
                  if (profileTouched) {
                    setProfileError(
                      e.target.value.trim() ? "" : "El nombre completo es obligatorio."
                    );
                  }
                }}
                onBlur={() => {
                  setProfileTouched(true);
                  if (!editFormData.fullname.trim()) {
                    setProfileError("El nombre completo es obligatorio.");
                  }
                }}
              />
              {profileTouched && !editFormData.fullname.trim() && (
                <small className="text-danger mt-1 d-block">
                  El nombre completo es obligatorio.
                </small>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Biografía</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                style={{ resize: "none" }}
                value={editFormData.bio}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, bio: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.location}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, location: e.target.value })
                }
              />
            </Form.Group>

            {profileError && (
              <div className="text-danger text-center mb-2">{profileError}</div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button
            className="btn-rounded btn-rounded-secondary"
            onClick={() => setShowModal(false)}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            className="btn-rounded btn-rounded-primary"
            onClick={handleGuardarCambios}
            disabled={isUpdating}
          >
            {isUpdating ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL: SELECCIONAR AVATAR */}
      <Modal
        show={showAvatarModal}
        onHide={() => setShowAvatarModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center gap-3">
          {avatars.map((av, index) => (
            <img
              key={index}
              src={av}
              alt={`Avatar ${index + 1}`}
              style={{
                width: "60px",
                cursor: "pointer",
                border:
                  selectedAvatar === av ? "3px solid var(--accent)" : "none",
                borderRadius: "50%",
              }}
              onClick={() => {
                setSelectedAvatar(av);
                localStorage.setItem("avatar", index.toString());
                setShowAvatarModal(false);
              }}
            />
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;