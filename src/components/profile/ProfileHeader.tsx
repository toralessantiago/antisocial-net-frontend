import {
  LuMapPin,
  LuCalendar,
  LuPencil,
  LuLogOut,
  LuCamera,
  LuHeart,
} from "react-icons/lu";
import type { Profile, Post } from "../../types/profile";
import { toSentenceCase } from "../../utils/textFormat";

interface Props {
  profile: Profile;
  posts: Post[];
  selectedAvatar: string;
  onEditClick: () => void;
  onAvatarClick: () => void;
  onLogout: () => void;
}

function formatJoinDate(date: string) {
  return new Date(date).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileHeader({
  profile,
  posts,
  selectedAvatar,
  onEditClick,
  onAvatarClick,
  onLogout,
}: Props) {
  const likesReceived = posts.reduce(
    (sum, p) => sum + (p.likes?.length || 0),
    0,
  );

  return (
    <div className="card profile-header shadow-sm mb-4">
      <div className="profile-banner"></div>

      <div className="profile-body">
        <div className="profile-avatar-wrapper">
          <img src={selectedAvatar} alt="Avatar" className="profile-avatar" />
          <button className="profile-avatar-edit" onClick={onAvatarClick}>
            <LuCamera />
          </button>
        </div>

        <div className="profile-actions">
          <button className="btn btn-outline-secondary" onClick={onEditClick}>
            <LuPencil className="me-2" />
            Editar perfil
          </button>
          <button className="btn btn-primary" onClick={onLogout}>
            <LuLogOut className="me-2" />
            Cerrar sesión
          </button>
        </div>

        <div className="profile-user-info">
          <h2 className="profile-name">{toSentenceCase(profile.fullname)}</h2>
          <p className="profile-handle">@{profile.nickname}</p>

          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          <div className="profile-meta">
            {profile.location && (
              <span className="meta-item">
                <LuMapPin />
                {profile.location}
              </span>
            )}
            <span className="meta-item">
              <LuCalendar />
              Se unió en {formatJoinDate(profile.createdAt)}
            </span>
          </div>

          <div className="profile-follow-stats">
            <span>
              <strong>{profile.following?.length || 0}</strong> Siguiendo
            </span>
            <span>
              <strong>{profile.followers?.length || 0}</strong> Seguidores
            </span>
          </div>

          <div className="profile-extra-stats">
            <LuHeart />
            {likesReceived} me gusta recibidos
          </div>
        </div>
      </div>
    </div>
  );
}
