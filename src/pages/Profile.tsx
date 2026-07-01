import "../styles/pages/profile.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { getUser, updateUser } from "../services/userService";

import {
  getPostsByUser,
  toggleLike,
  getLikesByUser,
} from "../services/postService";
import {
  getCommentsByUser,
  getCommentsByPost,
} from "../services/commentService";

import {
  LuMapPin,
  LuCalendar,
  LuMessageCircle,
  LuPencil,
  LuLogOut,
  LuArrowLeft,
  LuHeart,
  LuCamera,
} from "react-icons/lu";

import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";

function Profile() {
  const avatars = [avatar1, avatar2, avatar3, avatar4];

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem("avatar");
    return saved !== null ? avatars[Number(saved)] : avatar1;
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [editProfile, setEditProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const [comments, setComments] = useState<any[]>([]);

  const [commentsByPost, setCommentsByPost] = useState<Record<string, any[]>>(
    {},
  );
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "likes">(
    "posts",
  );

  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const loadLikes = async () => {
    try {
      const userLikes = await getLikesByUser(user._id);
      setLikedPosts(userLikes);
    } catch (error) {
      console.error("Error al obtener los likes:", error);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getUser(user._id);
        setProfile(userData.data);
        setEditProfile(userData.data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    const loadPosts = async () => {
      try {
        const userPosts = await getPostsByUser(user._id);
        setPosts(userPosts);

        const commentsMap: Record<string, any[]> = {};
        await Promise.all(
          userPosts.map(async (post: any) => {
            try {
              const postComments = await getCommentsByPost(post._id);
              commentsMap[post._id] = postComments;
            } catch (err) {
              console.error(
                `Error obteniendo comentarios del post ${post._id}:`,
                err,
              );
              commentsMap[post._id] = [];
            }
          }),
        );
        setCommentsByPost(commentsMap);
      } catch (error) {
        console.error("Error al obtener los posts:", error);
      }
    };

    const loadComments = async () => {
      try {
        const userComments = await getCommentsByUser(user._id);
        setComments(userComments);
      } catch (error) {
        console.error("Error al obtener los comentarios:", error);
      }
    };

    if (user) {
      loadProfile();
      loadPosts();
      loadComments();
      loadLikes();
    }
  }, [user]);

  const handleToggleComments = (postId: string) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = async () => {
    try {
      // fullname (minúscula) para que coincida con el modelo/schema del back
      const dataToSend = {
        fullname: editProfile.fullname,
        nickname: editProfile.nickname,
        email: editProfile.email,
        birthDate: editProfile.birthDate,
        bio: editProfile.bio ?? "",
        location: editProfile.location ?? "",
      };

      const json = await updateUser(profile._id, dataToSend);

      setProfile(json.data);
      setEditProfile(json.data);
      setShowModal(false);

      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el perfil");
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const updatedPost = await toggleLike(postId, user._id);
      setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
      await loadLikes(); // 👈 refresca la tab de Me gusta al toque
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  if (!profile || !editProfile) {
    return <h2>Cargando perfil...</h2>;
  }

  const formatJoinDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-AR", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container profile-page mt-4">
      {/* ================= TOPBAR ================= */}
      <div className="profile-topbar">
        <Link to="/" className="back-button">
          <LuArrowLeft size={22} />
        </Link>
        <div>
          <h5 className="mb-0">@{profile.nickname}</h5>
          <small className="text-muted">{posts.length} publicaciones</small>
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <div className="card profile-header shadow-sm mb-4">
        <div className="profile-banner"></div>

        <div className="profile-body">
          <div className="profile-user">
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

            <div className="profile-user-info">
              <h2 className="profile-name d-flex align-items-center gap-2">
                {profile.fullname}
              </h2>

              <p className="text-muted">@{profile.nickname}</p>

              <p className="profile-stats">
                <strong>{posts.length}</strong> publicaciones
                <span className="mx-2">•</span>
                <strong>{profile.followers?.length || 0}</strong> seguidores
                <span className="mx-2">•</span>
                <strong>{profile.following?.length || 0}</strong> seguidos
              </p>

              <div className="profile-extra-stats">
                <span>
                  <LuHeart className="me-1" />
                  {posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)} me
                  gusta recibidos
                </span>
              </div>

              {/* bio y location conectados de verdad */}
              <p className="profile-bio">
                {profile.bio || "Sin biografía todavía"}
              </p>

              <p className="profile-date">
                <LuCalendar className="me-2" />
                Miembro desde {formatJoinDate(profile.createdAt)}
              </p>

              <p className="profile-location">
                <LuMapPin className="me-2" />
                {profile.location || "Ubicación no especificada"}
              </p>

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
        </div>
      </div>

      {/* ================= TABS ================= */}
      <ul className="nav nav-tabs profile-tabs mb-4">
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
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "likes" ? "active" : ""}`}
            onClick={() => setActiveTab("likes")}
          >
            ❤️ Me gusta
          </button>
        </li>
      </ul>

      {/* ================= PUBLICACIONES ================= */}
      {activeTab === "posts" && (
        <>
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
              <div key={post._id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <strong>@{profile.nickname}</strong>
                    </div>
                    <small className="post-date">
                      {new Date(post.createdAt).toLocaleDateString("es-AR")}
                    </small>
                  </div>

                  <p className="mt-3 mb-4">{post.description}</p>
                  {post.images && post.images.length > 0 && (
                    <div className="post-images d-flex gap-2 mb-3 flex-wrap">
                      {post.images.map((img: any, idx: number) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`Imagen ${idx + 1} del post`}
                          className="post-image"
                          style={{ maxWidth: "200px", borderRadius: "8px" }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="post-actions d-flex gap-3">
                      <small
                        role="button"
                        onClick={() => handleLike(post._id)}
                        style={{
                          cursor: "pointer",
                          color: post.likes?.includes(user._id)
                            ? "red"
                            : "inherit",
                        }}
                      >
                        <LuHeart className="me-1" />
                        {post.likes?.length || 0}
                      </small>

                      <small
                        role="button"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleToggleComments(post._id)}
                      >
                        <LuMessageCircle className="me-1" />
                        {commentsByPost[post._id]?.length ?? 0}
                      </small>
                    </div>

                    {expandedPostId === post._id && (
                      <div className="post-comments mt-3 pt-3 border-top">
                        {commentsByPost[post._id]?.length === 0 ? (
                          <p className="text-muted small mb-0">
                            Todavía no hay comentarios.
                          </p>
                        ) : (
                          commentsByPost[post._id]?.map((comment: any) => (
                            <div key={comment._id} className="mb-2">
                              <strong className="small">
                                @{comment.user?.nickname}
                              </strong>
                              <p className="small mb-0">{comment.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === "comments" && (
        <>
          <h4 className="mb-3">Mis comentarios</h4>

          {comments.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <h2>💬</h2>
                <h5>Todavía no comentaste nada</h5>
                <p className="text-muted">
                  Participá en publicaciones de la comunidad.
                </p>
              </div>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      En:{" "}
                      {comment.post?.description
                        ? comment.post.description.slice(0, 60) +
                          (comment.post.description.length > 60 ? "..." : "")
                        : "Publicación eliminada"}
                    </small>
                    <small className="post-date">
                      {new Date(comment.createdAt).toLocaleDateString("es-AR")}
                    </small>
                  </div>
                  <p className="mt-3 mb-0">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === "likes" && (
        <>
          <h4 className="mb-3">Publicaciones que te gustan</h4>

          {likedPosts.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <h2>❤️</h2>
                <h5>Todavía no le diste me gusta a nada</h5>
              </div>
            </div>
          ) : (
            likedPosts.map((post) => (
              <div key={post._id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <strong>@{post.user?.nickname}</strong>
                  <p className="mt-3 mb-0">{post.description}</p>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* MODALES----------------------------------------- */}
      {showModal && (
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
                  <label className="form-label">Nombre completo</label>
                  <input
                    className="form-control"
                    value={editProfile.fullname}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        fullname: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre de usuario</label>
                  <input
                    className="form-control"
                    value={editProfile.nickname}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        nickname: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    value={editProfile.email}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    value={
                      editProfile.birthDate
                        ? editProfile.birthDate.substring(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Biografía</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={editProfile.bio ?? ""}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, bio: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Ubicación</label>
                  <input
                    className="form-control"
                    value={editProfile.location ?? ""}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        location: e.target.value,
                      })
                    }
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
                <button className="btn btn-primary" onClick={handleSave}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
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
                      className={`avatar-option ${selectedAvatar === avatar ? "selected" : ""}`}
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
