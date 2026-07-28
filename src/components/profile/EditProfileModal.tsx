import { useState } from "react";
import type { User } from "../../data/users";
import "../styles/components/components.css"; 


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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (field: string, value: string) => {
    if (!value || !value.trim()) {
      if (field === "fullname") return "El nombre es obligatorio";
      if (field === "nickname") return "El usuario es obligatorio";
      if (field === "email") return "El email es obligatorio";
    }
    return "";
  };

  const handleFieldChange = (field: keyof User, value: string) => {
    onChange(field, value);
    if (touched[field as string]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field as string, value) }));
    }
  };

  // onBlur marca el campo como "tocado" y lo valida
  const handleBlur = (field: keyof User, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field as string, value) }));
  };

  const handleSaveClick = () => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    const fullnameErr = validate("fullname", user.fullname || "");
    if (fullnameErr) { newErrors.fullname = fullnameErr; hasError = true; }

    const nicknameErr = validate("nickname", user.nickname || "");
    if (nicknameErr) { newErrors.nickname = nicknameErr; hasError = true; }

    const emailErr = validate("email", user.email || "");
    if (emailErr) { newErrors.email = emailErr; hasError = true; }

    setErrors(newErrors);
    setTouched({ fullname: true, nickname: true, email: true });

    if (hasError) return;

    onSave();
  };

  const getBorderClass = (field: string, value: string) => {
    if (!touched[field]) return "";
    if (errors[field]) return "edit-input-error";
    if (value && value.trim()) return "edit-input-success";
    return "";
  };

  return (
    <div className="modal fade show d-block edit-modal-overlay">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content edit-profile-modal">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold">Editar perfil</h5>
            <button className="btn-close" onClick={onCancel} />
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label text-muted small mb-1">Nombre completo</label>
              <input
                className={`form-control ${getBorderClass("fullname", user.fullname)}`}
                value={user.fullname}
                onChange={(e) => handleFieldChange("fullname", e.target.value)}
                onBlur={(e) => handleBlur("fullname", e.target.value)}
              />
              {errors.fullname && <small className="edit-text-danger">{errors.fullname}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small mb-1">Nombre de usuario</label>
              <input
                className={`form-control ${getBorderClass("nickname", user.nickname)}`}
                value={user.nickname}
                onChange={(e) => handleFieldChange("nickname", e.target.value)}
                onBlur={(e) => handleBlur("nickname", e.target.value)}
              />
              {errors.nickname && <small className="edit-text-danger">{errors.nickname}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small mb-1">Email</label>
              <input
                type="email"
                className={`form-control ${getBorderClass("email", user.email)}`}
                value={user.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
              />
              {errors.email && <small className="edit-text-danger">{errors.email}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                className="form-control"
                value={user.birthDate ? user.birthDate.substring(0, 10) : ""}
                onChange={(e) => onChange("birthDate", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small mb-1">Biografía</label>
              <textarea
                rows={4}
                className="form-control"
                style={{ resize: "none" }}
                maxLength={200}
                value={user.bio || ""}
                onChange={(e) => onChange("bio", e.target.value)}
              />
              <small className="text-muted mt-1 d-block text-end">
                {(user.bio || "").length}/200
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small mb-1">Ubicación</label>
              <input
                className="form-control"
                value={user.location || ""}
                onChange={(e) => onChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer border-top-0 pt-0">
            <button className="edit-btn-cancel" onClick={onCancel}>
              Cancelar
            </button>

            <button className="edit-btn-save" onClick={handleSaveClick}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}