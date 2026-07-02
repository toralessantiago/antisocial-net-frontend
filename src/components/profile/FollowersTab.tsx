import { LuUsers } from "react-icons/lu";

interface Props {
  followers?: string[];
}

export default function FollowersTab({
  followers = [],
}: Props) {
  if (followers.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <LuUsers size={55} className="mb-3 text-secondary" />

          <h5>Todavía no tenés seguidores</h5>

          <p className="text-muted mb-0">
            Cuando otras personas comiencen a seguirte aparecerán acá.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h5 className="mb-3">
        Seguidores ({followers.length})
      </h5>

      {followers.map((follower, index) => (
        <div
          key={index}
          className="card shadow-sm mb-3"
        >
          <div className="card-body d-flex align-items-center">

            <div
              className="rounded-circle bg-secondary me-3"
              style={{
                width: 55,
                height: 55,
              }}
            />

            <div>

              <strong>Usuario</strong>

              <div className="text-muted small">
                ID: {follower}
              </div>

            </div>

          </div>
        </div>
      ))}
    </>
  );
}