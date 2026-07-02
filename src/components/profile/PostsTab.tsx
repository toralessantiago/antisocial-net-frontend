import PostCard from "./PostCardProfile";
import type { Post, Comment } from "../../types/profile";

interface Props {
  posts: Post[];
  nickname: string;
  currentUserId: string;
  commentsByPost: Record<string, Comment[]>;
  expandedPostId: string | null;
  onLike: (postId: string) => void;
  onToggleComments: (postId: string) => void;
}

export default function PostsTab({
  posts,
  nickname,
  currentUserId,
  commentsByPost,
  expandedPostId,
  onLike,
  onToggleComments,
}: Props) {
  return (
    <>
      {posts.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h2>📝</h2>
            <h5>Todavía no publicaste nada</h5>
            <p className="text-muted">
              Compartí tu primer pensamiento con la comunidad.
            </p>
            <button className="btn btn-primary">Crear publicación</button>
          </div>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            nickname={nickname}
            currentUserId={currentUserId}
            comments={commentsByPost[post._id] || []}
            isExpanded={expandedPostId === post._id}
            onLike={onLike}
            onToggleComments={onToggleComments}
          />
        ))
      )}
    </>
  );
}
