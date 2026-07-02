import "../styles/pages/profile.css";

import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import { LuArrowLeft } from "react-icons/lu";

import { UserContext } from "../context/UserContext";

import { obtenerPostsPorUsuario } from "../services/PostService";
import { obtenerComentariosPorUsuario } from "../services/CommentService";
import { updateUser } from "../services/UsuarioService";

import type { User } from "../data/users";
import type { Post } from "../data/Post";
import type { Comment } from "../data/comments";

import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";

import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import PostCard from "../components/PostCard";
import CommentsTab from "../components/profile/CommentsTab";
import FollowersTab from "../components/profile/FollowersTab";
import FollowingTab from "../components/profile/FollowingTab";
import EditProfileModal from "../components/profile/EditProfileModal";
import AvatarModal from "../components/profile/AvatarModal";

type Tab = "posts" | "comments" | "followers" | "following";

export default function Profile() {
  const {
    user: currentUser,
    logout,
    updateCurrentUser,
  } = useContext(UserContext);

  const navigate = useNavigate();

  const { toast, showToast, hideToast } = useToast();

  const avatars = [avatar1, avatar2, avatar3, avatar4];

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem("avatar");
    return saved !== null ? avatars[Number(saved)] : avatar1;
  });

  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const [misPosts, setMisPosts] = useState<Post[]>([]);
  const [misComentarios, setMisComentarios] = useState<Comment[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [editProfile, setEditProfile] = useState<User | null>(currentUser);
  const [profile, setProfile] = useState<User | null>(currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    setProfile(currentUser);
    setEditProfile(currentUser);

    async function cargarDatos() {
      try {
        setLoading(true);

        const id = currentUser._id ?? currentUser.id;

        const [posts, comentarios] = await Promise.all([
          obtenerPostsPorUsuario(id),
          obtenerComentariosPorUsuario(id).catch(() => []),
        ]);

        setMisPosts(posts);
        setMisComentarios(comentarios);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    if (!editProfile) return;

    try {
      const id = editProfile._id ?? editProfile.id;

      const response = await updateUser(id, {
        fullname: editProfile.fullname,
        nickname: editProfile.nickname,
        email: editProfile.email,
        birthDate: editProfile.birthDate,
        bio: editProfile.bio,
        location: editProfile.location,
      });

      const updatedUser = response.data;

      setProfile(updatedUser);
      setEditProfile(updatedUser);

      updateCurrentUser(updatedUser);
      setShowModal(false);

      showToast("Perfil actualizado correctamente", "success");
    } catch (error: any) {
      showToast(error.message || "No se pudo actualizar el perfil", "error");
    }
  };

  const handleAvatarChange = (avatar: string, index: number) => {
    setSelectedAvatar(avatar);
    localStorage.setItem("avatar", index.toString());
    setShowAvatarModal(false);
  };

  if (!profile || !editProfile) {
    return <div className="text-center mt-5">Cargando perfil...</div>;
  }

  return (
    <div className="container profile-page mt-4">
      <div className="profile-topbar">
        <Link to="/" className="back-button">
          <LuArrowLeft size={22} />
        </Link>

        <div className="text-center">
          <h5 className="mb-0">@{profile.nickname}</h5>
          <small className="text-muted">{misPosts.length} publicaciones</small>
        </div>
      </div>

      <ProfileHeader
        user={profile}
        posts={misPosts}
        selectedAvatar={selectedAvatar}
        onEditProfile={() => setShowModal(true)}
        onAvatarClick={() => setShowAvatarModal(true)}
        onLogout={handleLogout}
        onFollowersClick={() => setActiveTab("followers")}
        onFollowingClick={() => setActiveTab("following")}
      />

      <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="text-center py-5">Cargando perfil...</div>
      ) : (
        <>
          {activeTab === "posts" &&
            (misPosts.length === 0 ? (
              <div className="text-center py-5">
                Todavía no hiciste publicaciones.
              </div>
            ) : (
              misPosts.map((post) => (
                <PostCard key={post._id} post={post} user={currentUser} />
              ))
            ))}

          {activeTab === "comments" && (
            <CommentsTab comments={misComentarios} />
          )}

          {activeTab === "followers" && (
            <FollowersTab followers={profile.followers ?? []} />
          )}

          {activeTab === "following" && (
            <FollowingTab following={profile.following ?? []} />
          )}
        </>
      )}

      {showModal && editProfile && (
        <EditProfileModal
          user={editProfile}
          onChange={(field, value) =>
            setEditProfile((prev) =>
              prev ? { ...prev, [field]: value } : prev,
            )
          }
          onCancel={() => setShowModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {showAvatarModal && (
        <AvatarModal
          avatars={avatars}
          selectedAvatar={selectedAvatar}
          onSelect={handleAvatarChange}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
