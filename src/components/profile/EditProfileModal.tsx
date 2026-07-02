import type { User } from "../../data/users";

interface Props {
  user: User;
  onChange: (field: keyof User, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditProfileModal({
  user,
  onChange,
  onCancel,
  onSave,
}: Props) {
  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,.55)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content profile-modal">
          <div className="modal-header">
            <h5 className="modal-title">Editar perfil</h5>

            <button className="btn-close" onClick={onCancel} />
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>

              <input
                className="form-control"
                value={user.fullname}
                onChange={(e) => onChange("fullname", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>

              <input
                className="form-control"
                value={user.nickname}
                onChange={(e) => onChange("nickname", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>

              <input
                type="email"
                className="form-control"
                value={user.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha de nacimiento</label>

              <input
                type="date"
                className="form-control"
                value={user.birthDate ? user.birthDate.substring(0, 10) : ""}
                onChange={(e) => onChange("birthDate", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Biografía</label>

              <textarea
                rows={4}
                className="form-control"
                maxLength={200}
                value={user.bio || ""}
                onChange={(e) => onChange("bio", e.target.value)}
              />

              <small className="text-muted">
                {(user.bio || "").length}/200
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Ubicación</label>

              <input
                className="form-control"
                value={user.location || ""}
                onChange={(e) => onChange("location", e.target.value)}
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
