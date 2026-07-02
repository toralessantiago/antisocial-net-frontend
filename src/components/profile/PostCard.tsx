import { LuHeart, LuMessageCircle } from "react-icons/lu";
import type { Post, Comment } from "../../types/profile";

interface Props {
  post: Post;
  nickname: string;
  currentUserId: string;
  comments: Comment[];
  isExpanded: boolean;
  onLike: (postId: string) => void;
  onToggleComments: (postId: string) => void;
}

export default function PostCard({
  post,
  nickname,
  currentUserId,
  comments,
  isExpanded,
  onLike,
  onToggleComments,
}: Props) {
  const liked = post.likes?.includes(currentUserId);

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <strong>@{nickname}</strong>
          <small className="post-date">
            {new Date(post.createdAt).toLocaleDateString("es-AR")}
          </small>
        </div>

        <p className="mt-3 mb-4">{post.description}</p>

        {post.images?.length > 0 && (
          <div className="post-images d-flex gap-2 mb-3 flex-wrap">
            {post.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Imagen ${idx + 1} del post`}
                className="post-image"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            ))}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <div className="post-actions d-flex gap-3">
            <small
              role="button"
              style={{ cursor: "pointer", color: liked ? "red" : "inherit" }}
              onClick={() => onLike(post._id)}
            >
              <LuHeart className="me-1" />
              {post.likes?.length || 0}
            </small>
            <small
              role="button"
              style={{ cursor: "pointer" }}
              onClick={() => onToggleComments(post._id)}
            >
              <LuMessageCircle className="me-1" />
              {comments.length}
            </small>
          </div>
        </div>

        {isExpanded && (
          <div className="post-comments mt-3 pt-3 border-top">
            {comments.length === 0 ? (
              <p className="text-muted small mb-0">
                Todavía no hay comentarios.
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="mb-2">
                  <strong className="small">@{comment.user?.nickname}</strong>
                  <p className="small mb-0">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
