import { LuUserPlus } from "react-icons/lu";

interface Props {
  following?: string[];
}

export default function FollowingTab({
  following = [],
}: Props) {
  if (following.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <LuUserPlus size={55} className="mb-3 text-secondary" />

          <h5>Todavía no seguís a nadie</h5>

          <p className="text-muted mb-0">
            Cuando empieces a seguir personas aparecerán acá.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h5 className="mb-3">
        Siguiendo ({following.length})
      </h5>

      {following.map((followedUser, index) => (
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
                ID: {followedUser}
              </div>

            </div>

          </div>
        </div>
      ))}
    </>
  );
}