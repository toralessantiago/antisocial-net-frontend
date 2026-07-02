import { LuMessageSquare } from "react-icons/lu";
import type { Comment } from "../../data/comments";
import { Link } from "react-router-dom";

interface Props {
  comments?: Comment[];
}

export default function CommentsTab({ comments = [] }: Props) {
  if (comments.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <LuMessageSquare size={55} className="mb-3 text-secondary" />

          <h5>Todavía no hiciste comentarios</h5>

          <p className="text-muted mb-0">
            Cuando comentes publicaciones aparecerán acá.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h5 className="mb-3">
        Comentarios ({comments.length})
      </h5>

      {comments.map((comment) => (
        <Link
          key={comment._id}
          to={`/post/${
            typeof comment.post === "string"
              ? comment.post
              : comment.post._id
          }`}
          className="text-decoration-none text-reset"
        >
          <div className="card shadow-sm mb-3">
            <div className="card-body">

              <div className="d-flex align-items-center mb-2">
                <div className="d-flex flex-column">
                  <strong>{comment.user.fullname}</strong>

                  <small className="text-muted">
                    @{comment.user.nickname}
                  </small>
                </div>
              </div>

              <p className="mb-1">{comment.content}</p>

              <small className="text-muted">
                {new Date(comment.createdAt).toLocaleDateString()}
              </small>

            </div>
          </div>
        </Link>
      ))}
    </>
  );
}