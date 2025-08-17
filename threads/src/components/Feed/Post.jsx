import { memo, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom"; // 🔹 Nuevo import para navegación
import { supabase } from "../../../supabaseClient";
import { toast } from "react-toastify";
import { usarPost } from "../../context/PostContext";
import "../../styles/threads-feed.css";

export const Post = memo(({ post, currentUser, onDelete, onCommentAdded }) => {
  const isAuthor = post.user_id === currentUser?.id;
  const { selectedPost, setSelectedPost } = usarPost();
  const displayPost = selectedPost?.id === post.id ? selectedPost : post;

  // 🔹 Estado local para el like (solo para UI, no persiste entre recargas)
  const [hasLiked, setHasLiked] = useState(false);
  // 🔹 Estado local para el contador (para respuesta inmediata)
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count || 0);

  const handleLike = async () => {
    try {
      // 🔹 Calculamos el nuevo valor del contador
      const newLikesCount = hasLiked ? localLikesCount - 1 : localLikesCount + 1;

      // 🔹 Actualización optimista de la UI
      setHasLiked(!hasLiked);
      setLocalLikesCount(newLikesCount);

      // 🔹 Actualización en Supabase
      const { error } = await supabase
        .from("post")
        .update({ likes_count: newLikesCount })
        .eq("id", post.id);

      if (error) throw error;

      // 🔹 Actualizamos el contexto si es necesario
      if (selectedPost?.id === post.id) {
        setSelectedPost({ ...selectedPost, likes_count: newLikesCount });
      }

      toast.success(hasLiked ? "Like removido" : "¡Me gusta añadido!");
    } catch (error) {
      // 🔹 Revertimos en caso de error
      setHasLiked(hasLiked);
      setLocalLikesCount(localLikesCount);
      console.error("Error al actualizar like:", error.message);
      toast.error("Error al actualizar like");
    }
  };

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

  console.log("Post renderizado con id:", post.id);

  return (
    <div className="post">
      {/* 🔹 Envolvemos el header y el contenido en <Link> para ir al detalle */}
      <Link
        to={`/post/${post.id}`}
        style={{ textDecoration: "none", color: "inherit", width: "400px" }}
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
            e.preventDefault();
            handleLike();
          }}
          // 🔹 Estilo condicional para el botón de like
          style={{
            color: hasLiked ? 'red' : 'inherit',
            cursor: currentUser ? 'pointer' : 'not-allowed' // 🔹 Deshabilitar si no hay usuario
          }}
          disabled={!currentUser} // 🔹 Deshabilitar botón si no hay usuario logueado
          title={!currentUser ? "Inicia sesión para dar like" : ""}
        >
          {/* 🔹 Cambiamos el emoji basado en hasLiked */}
          <span className="emoji">{hasLiked ? <Heart className="heart liked" />
            : <Heart className="heart" />}</span>
          {/* 🔹 Usamos el contador local para respuesta inmediata */}
          {localLikesCount}
        </button>

        <button
          className="post-action"
          onClick={(e) => {
            e.preventDefault(); // Evita navegación
            setSelectedPost(post);
          }}
          aria-label="Añadir comentario"
        >
          <span className="emoji"><img src="../src/assets/Comments.png" className="imgshared" /></span>
          {displayPost.commentsCount || 0}
        </button>

        <button
          className="post-action"
          onClick={(e) => {
            e.preventDefault();
            console.log("Repost post:", post.id);
          }}
        >
          <span className="emoji">
            <img src="../src/assets/Repost.png" className="imgshared" />
          </span>
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

