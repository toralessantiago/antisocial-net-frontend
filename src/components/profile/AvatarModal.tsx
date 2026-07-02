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
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,.55)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content profile-modal">
          <div className="modal-header">
            <h5 className="modal-title">Elegí un avatar</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="avatar-grid">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  className={`avatar-option ${selectedAvatar === avatar ? "selected" : ""}`}
                  onClick={() => onSelect(avatar, index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
