import { memo } from "react";
import { Link } from "react-router-dom"; // 🔹 Nuevo import para navegación
import { supabase } from "../../../supabaseClient";
import { toast } from "react-toastify";
import { usarPost } from "../../context/PostContext";
import "../../styles/threads-feed.css";

export const Post = memo(({ post, currentUser, onDelete, onCommentAdded }) => {
  const isAuthor = post.user_id === currentUser?.id;
  const { selectedPost, setSelectedPost } = usarPost();
  const displayPost = selectedPost?.id === post.id ? selectedPost : post;

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este post?")) return;

    try {
      const { error } = await supabase.from("post").delete().eq("id", post.id);
      if (error) throw error;

      toast.success("Post eliminado correctamente");
      onDelete?.();
    } catch (error) {
      console.error("Error al eliminar el post:", error.message);
      toast.error("Error al eliminar el post");
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return "ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="post">
      {/* 🔹 Envolvemos el header y el contenido en <Link> para ir al detalle */}
      <Link
        to={`/post/${post.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="post-header">
          <img
            src={post.threadUsers?.avatar_url || "/default-avatar.png"}
            alt={post.threadUsers?.username}
            className="post-avatar"
          />
          <div className="post-user-info">
            <span className="post-username">
              {post.threadUsers?.username || "Usuario"}
            </span>
            <span className="post-time">{getTimeAgo(post.created_at)}</span>
            {isAuthor && (
              <button
                onClick={(e) => {
                  e.preventDefault(); // 🔹 Evita que el click en este botón dispare la navegación
                  handleDelete();
                }}
                className="delete-button"
                aria-label="Eliminar post"
                title="Eliminar post"
              >
                ⋯
              </button>
            )}
          </div>
        </div>

        <div className="post-content">
          <p>{post.content}</p>
        </div>
      </Link>

      {/* 🔹 Acciones que NO deben redirigir */}
      <div className="post-actions">
        <button
          className="post-action"
          onClick={(e) => {
            e.preventDefault(); // Evita navegación accidental
            console.log("Like post:", post.id);
          }}
        >
          <span className="emoji">🤍</span>
          {post.likes_count || 0}
        </button>

        <button
          className="post-action"
          onClick={(e) => {
            e.preventDefault(); // Evita navegación
            setSelectedPost(post);
          }}
          aria-label="Añadir comentario"
        >
          <span className="emoji">💬</span>
          {displayPost.commentsCount || 0}
        </button>

        <button
          className="post-action"
          onClick={(e) => {
            e.preventDefault();
            console.log("Repost post:", post.id);
          }}
        >
          <span className="emoji">🔄</span>
        </button>

        <button
          className="post-action"
          onClick={(e) => {
            e.preventDefault();
            console.log("Share post:", post.id);
          }}
        >
          <span className="emoji">
            <img src="../src/assets/Share.png" className="imgshared" />
          </span>
        </button>
      </div>
    </div>
  );
});

