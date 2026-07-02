import type { Post } from "../../types/profile";

interface Props {
  likedPosts: Post[];
}

export default function LikesTab({ likedPosts }: Props) {
  return (
    <>
      <h4 className="tab-section-title mb-3">Publicaciones que te gustan</h4>

      {likedPosts.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h2>❤️</h2>
            <h5>Todavía no le diste me gusta a nada</h5>
          </div>
        </div>
      ) : (
        likedPosts.map((post) => (
          <div key={post._id} className="card shadow-sm mb-3">
            <div className="card-body">
              <strong className="nickname-text">
                @{typeof post.user === "object" ? post.user.nickname : ""}
              </strong>
              <p className="mt-3 mb-0">{post.description}</p>
            </div>
          </div>
        ))
      )}
    </>
  );
}
