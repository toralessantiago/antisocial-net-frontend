interface Props {
  avatars: string[];
  selectedAvatar: string;
  onSelect: (avatar: string, index: number) => void;
  onClose: () => void;
}

export default function AvatarModal({
  avatars,
  selectedAvatar,
  onSelect,
  onClose,
}: Props) {
  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,.55)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content profile-modal">

          <div className="modal-header">
            <h5 className="modal-title">
              Elegí tu avatar
            </h5>

            <button
              className="btn-close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">

            <div className="row g-3">

              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className="col-6 text-center"
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className={`img-fluid rounded-circle profile-avatar-option ${
                      selectedAvatar === avatar ? "selected" : ""
                    }`}
                    onClick={() => onSelect(avatar, index)}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      cursor: "pointer",
                      border:
                        selectedAvatar === avatar
                          ? "4px solid var(--accent)"
                          : "3px solid transparent",
                      transition: ".2s",
                    }}
                  />
                </div>
              ))}

            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cerrar
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}