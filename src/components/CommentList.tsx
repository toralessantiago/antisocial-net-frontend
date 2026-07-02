import type { Comment } from "../data/comments";

interface CommentListProps {
  comments: Comment[];
}

function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="pd-no-comments">No hay comentarios aún</p>;
  }

  return (
    <ul className="pd-comment-list">
      {comments.map((c) => {
        const autor = c.user;

        return (
          <li key={c._id} className="pd-comment-item">
            <div className="pd-comment-header">
              <div className="pd-comment-avatar">
                {autor.nickname
                  ? autor.nickname.charAt(0).toUpperCase()
                  : "?"}
              </div>

              <span className="pd-comment-author">
                @{autor.nickname}
              </span>
            </div>

            <p className="pd-comment-content">
              {c.content}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export default CommentList;