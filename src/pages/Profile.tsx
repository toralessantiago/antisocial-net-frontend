import "../styles/pages/profile.css";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { LuArrowLeft } from "react-icons/lu";

import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";

import { useProfileData } from "../hooks/useProfileData";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import PostsTab from "../components/profile/PostsTab";
import CommentsTab from "../components/profile/CommentsTab";
import LikesTab from "../components/profile/LikesTab";
import EditProfileModal from "../components/profile/EditProfileModal";
import AvatarModal from "../components/profile/AvatarModal";

type Tab = "posts" | "comments" | "likes";

function Profile() {
  const avatars = [avatar1, avatar2, avatar3, avatar4];

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem("avatar");
    return saved !== null ? avatars[Number(saved)] : avatar1;
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const userId = user?._id ?? user?.id;

  const {
    profile,
    editProfile,
    setEditProfile,
    posts,
    comments,
    commentsByPost,
    likedPosts,
    saveProfile,
    likePost,
  } = useProfileData(userId);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = async () => {
    if (!editProfile) return;
    try {
      await saveProfile({
        fullname: editProfile.fullname,
        nickname: editProfile.nickname,
        email: editProfile.email,
        birthDate: editProfile.birthDate,
        bio: editProfile.bio ?? "",
        location: editProfile.location ?? "",
      });
      setShowModal(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el perfil");
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleToggleComments = (postId: string) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  if (!profile || !editProfile) {
    return <h2>Cargando perfil...</h2>;
  }

  return (
    <div className="container profile-page mt-4">
      <div className="profile-topbar">
        <Link to="/" className="back-button">
          <LuArrowLeft size={22} />
        </Link>
        <div>
          <h5 className="mb-0">@{profile.nickname}</h5>
          <small className="text-muted">{posts.length} publicaciones</small>
        </div>
      </div>

      <ProfileHeader
        profile={profile}
        posts={posts}
        selectedAvatar={selectedAvatar}
        onEditClick={() => setShowModal(true)}
        onAvatarClick={() => setShowAvatarModal(true)}
        onLogout={handleLogout}
      />

      <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "posts" && (
        <PostsTab
          posts={posts}
          nickname={profile.nickname}
          currentUserId={userId}
          commentsByPost={commentsByPost}
          expandedPostId={expandedPostId}
          onLike={handleLike}
          onToggleComments={handleToggleComments}
        />
      )}

      {activeTab === "comments" && <CommentsTab comments={comments} />}
      {activeTab === "likes" && <LikesTab likedPosts={likedPosts} />}

      {showModal && (
        <EditProfileModal
          editProfile={editProfile}
          selectedAvatar={selectedAvatar}
          onChange={(data) => setEditProfile({ ...editProfile, ...data })}
          onChangeAvatarClick={() => {
            setShowModal(false);
            setShowAvatarModal(true);
          }}
          onCancel={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showAvatarModal && (
        <AvatarModal
          avatars={avatars}
          selectedAvatar={selectedAvatar}
          onSelect={(avatar, index) => {
            setSelectedAvatar(avatar);
            localStorage.setItem("avatar", index.toString());
            setShowAvatarModal(false);
          }}
          onClose={() => setShowAvatarModal(false)}
        />
      )}
    </div>
  );
}

export default Profile;
