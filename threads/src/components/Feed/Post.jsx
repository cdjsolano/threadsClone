import { memo } from "react";

export const Post = memo(({ post, currentUser }) => {
  const isAuthor = post.user_id === currentUser?.id;

  return (
    <div className="post">
      <div className="post-header">
        <img src={post.user?.avatar_url} alt={post.user?.username} />
        <span>{post.user?.username}</span>
        {isAuthor && <span className="author-badge">Tú</span>}
      </div>
      <p>{post.content}</p>
      <div className="post-actions">
        <button>❤️ {post.likes_count || 0}</button>
        <button>💬 {post.comments_count || 0}</button>
      </div>
    </div>
  );
});