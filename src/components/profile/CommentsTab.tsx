import type { Comment } from "../../types/profile";

interface Props {
  comments: Comment[];
}

export default function CommentsTab({ comments }: Props) {
  return (
    <>
      <h4 className="tab-section-title mb-3">Mis comentarios</h4>

      {comments.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h2>💬</h2>
            <h5>Todavía no comentaste nada</h5>
            <p className="text-muted">
              Participá en publicaciones de la comunidad.
            </p>
          </div>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  En:{" "}
                  {comment.post?.description
                    ? comment.post.description.slice(0, 60) +
                      (comment.post.description.length > 60 ? "..." : "")
                    : "Publicación eliminada"}
                </small>
                <small className="post-date">
                  {new Date(comment.createdAt).toLocaleDateString("es-AR")}
                </small>
              </div>
              <p className="mt-3 mb-0">{comment.content}</p>
            </div>
          </div>
        ))
      )}
    </>
  );
}
