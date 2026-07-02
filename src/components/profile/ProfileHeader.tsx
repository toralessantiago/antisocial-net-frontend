import {
  LuMapPin,
  LuCalendar,
  LuPencil,
  LuLogOut,
  LuCamera,
  LuHeart,
  LuBadgeCheck,
} from "react-icons/lu";

import type { User } from "../../data/users";
import type { Post } from "../../data/Post";

interface Props {
  user: User;
  posts: Post[];
  selectedAvatar: string;

  onEditProfile: () => void;
  onAvatarClick: () => void;
  onLogout: () => void;

  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

function formatJoinDate(date?: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileHeader({
  user,
  posts,
  selectedAvatar,
  onEditProfile,
  onAvatarClick,
  onLogout,
  onFollowersClick,
  onFollowingClick,
}: Props) {
  const totalLikes = posts.reduce(
    (acc, post) => acc + (post.likes?.length || 0),
    0,
  );

  return (
    <div className="card profile-header shadow-sm mb-4">
      {/* Portada */}
      <div className="profile-banner"></div>

      {/* Forzamos text-start y desarmamos cualquier flex central externo */}
      <div className="profile-body p-3 pt-0 text-start" style={{ display: 'block' }}>
        
        {/* Contenedor del Avatar: me-auto y align-self forzarán que se quede pegado a la izquierda */}
        <div className="d-flex justify-content-start w-100 position-relative mb-3" style={{ textAlign: 'left' }}>
          <div className="profile-avatar-wrapper me-auto" style={{ margin: '0', alignSelf: 'flex-start' }}>
            <img src={selectedAvatar} alt="Avatar" className="profile-avatar" />
            <button className="profile-avatar-edit" onClick={onAvatarClick}>
              <LuCamera />
            </button>
          </div>
        </div>

        {/* Información del usuario (Alineada a la izquierda) */}
        <div className="profile-user-info text-start">
          <h2 className="profile-name d-flex align-items-center gap-2 mb-0 justify-content-start">
            {user.fullname}
            {user.verified && <LuBadgeCheck size={22} color="var(--accent)" />}
          </h2>

          <p className="profile-handle text-muted mb-3">@{user.nickname}</p>

          {user.bio && <p className="profile-bio mb-3">{user.bio}</p>}

          <div className="profile-meta d-flex flex-wrap gap-3 mb-3 text-muted justify-content-start">
            {user.location && (
              <span className="meta-item d-flex align-items-center gap-1">
                <LuMapPin />
                {user.location}
              </span>
            )}

            {"createdAt" in user && (user as any).createdAt && (
              <span className="meta-item d-flex align-items-center gap-1">
                <LuCalendar />
                Se unió en {formatJoinDate((user as any).createdAt)}
              </span>
            )}
          </div>

          <div className="profile-follow-stats d-flex gap-4 mb-3 justify-content-start">
            <span>
              <strong>{posts.length}</strong> <span className="text-muted">Publicaciones</span>
            </span>

            <button
              type="button"
              className="profile-stat-link border-0 bg-transparent p-0"
              onClick={onFollowersClick}
            >
              <strong>{user.followers?.length || 0}</strong> <span className="text-muted">Seguidores</span>
            </button>

            <button
              type="button"
              className="profile-stat-link border-0 bg-transparent p-0"
              onClick={onFollowingClick}
            >
              <strong>{user.following?.length || 0}</strong> <span className="text-muted">Siguiendo</span>
            </button>
          </div>

          {/* Likes bien pegados al ícono */}
          <div className="profile-extra-stats d-flex align-items-center gap-1 text-muted mb-4 justify-content-start">
            <LuHeart size={18} />
            <span><strong>{totalLikes}</strong> Me gusta recibidos</span>
          </div>

          {/* Botones abajo de todo el bloque de info */}
          <div className="profile-actions d-flex gap-2 border-top pt-3 mt-3 w-100">
            <button className="btn btn-outline-secondary flex-grow-1" onClick={onEditProfile}>
              <LuPencil className="me-2" />
              Editar perfil
            </button>
            <button className="btn btn-primary flex-grow-1" onClick={onLogout}>
              <LuLogOut className="me-2" />
              Cerrar sesión
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}