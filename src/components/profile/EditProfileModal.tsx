import type { Profile } from "../../types/profile";

interface Props {
  editProfile: Profile;
  selectedAvatar: string;
  onChange: (data: Partial<Profile>) => void;
  onChangeAvatarClick: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditProfileModal({
  editProfile,
  selectedAvatar,
  onChange,
  onChangeAvatarClick,
  onCancel,
  onSave,
}: Props) {
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,.55)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content profile-modal">
          <div className="modal-header">
            <h5 className="modal-title">Editar perfil</h5>
            <button className="btn-close" onClick={onCancel} />
          </div>

          <div className="modal-body">
            <div className="text-center mb-4">
              <img src={selectedAvatar} className="modal-avatar" alt="Avatar" />
              <button
                className="btn btn-sm btn-outline-secondary mt-3"
                onClick={onChangeAvatarClick}
              >
                Cambiar avatar
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                className="form-control"
                value={editProfile.fullname}
                onChange={(e) => onChange({ fullname: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>
              <input
                className="form-control"
                value={editProfile.nickname}
                onChange={(e) => onChange({ nickname: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={editProfile.email}
                onChange={(e) => onChange({ email: e.target.value })}
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
                onChange={(e) => onChange({ birthDate: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Biografía</label>
              <textarea
                rows={4}
                className="form-control"
                value={editProfile.bio ?? ""}
                onChange={(e) => onChange({ bio: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ubicación</label>
              <input
                className="form-control"
                value={editProfile.location ?? ""}
                onChange={(e) => onChange({ location: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
