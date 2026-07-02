import { useState } from "react";
import {
  validateProfileForm,
  type ProfileFormErrors,
} from "../../utils/validateProfile";
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
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: keyof ProfileFormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateProfileForm(editProfile);
    setErrors(newErrors);
  };

  const handleSaveClick = () => {
    const newErrors = validateProfileForm(editProfile);
    setErrors(newErrors);
    setTouched({
      fullname: true,
      nickname: true,
      email: true,
      birthDate: true,
      bio: true,
      location: true,
    });

    if (Object.keys(newErrors).length === 0) {
      onSave();
    }
  };

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
                className={`form-control ${touched.fullname && errors.fullname ? "is-invalid" : ""}`}
                value={editProfile.fullname}
                onChange={(e) => onChange({ fullname: e.target.value })}
                onBlur={() => handleBlur("fullname")}
              />
              {touched.fullname && errors.fullname && (
                <div className="invalid-feedback d-block">
                  {errors.fullname}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>
              <input
                className={`form-control ${touched.nickname && errors.nickname ? "is-invalid" : ""}`}
                value={editProfile.nickname}
                onChange={(e) => onChange({ nickname: e.target.value })}
                onBlur={() => handleBlur("nickname")}
              />
              {touched.nickname && errors.nickname && (
                <div className="invalid-feedback d-block">
                  {errors.nickname}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                value={editProfile.email}
                onChange={(e) => onChange({ email: e.target.value })}
                onBlur={() => handleBlur("email")}
              />
              {touched.email && errors.email && (
                <div className="invalid-feedback d-block">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                className={`form-control ${touched.birthDate && errors.birthDate ? "is-invalid" : ""}`}
                value={
                  editProfile.birthDate
                    ? editProfile.birthDate.substring(0, 10)
                    : ""
                }
                onChange={(e) => onChange({ birthDate: e.target.value })}
                onBlur={() => handleBlur("birthDate")}
              />
              {touched.birthDate && errors.birthDate && (
                <div className="invalid-feedback d-block">
                  {errors.birthDate}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Biografía</label>
              <textarea
                rows={4}
                className={`form-control ${touched.bio && errors.bio ? "is-invalid" : ""}`}
                value={editProfile.bio ?? ""}
                onChange={(e) => onChange({ bio: e.target.value })}
                onBlur={() => handleBlur("bio")}
              />
              {touched.bio && errors.bio && (
                <div className="invalid-feedback d-block">{errors.bio}</div>
              )}
              <small className="text-muted">
                {(editProfile.bio ?? "").length}/200
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Ubicación</label>
              <input
                className={`form-control ${touched.location && errors.location ? "is-invalid" : ""}`}
                value={editProfile.location ?? ""}
                onChange={(e) => onChange({ location: e.target.value })}
                onBlur={() => handleBlur("location")}
              />
              {touched.location && errors.location && (
                <div className="invalid-feedback d-block">
                  {errors.location}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSaveClick}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
