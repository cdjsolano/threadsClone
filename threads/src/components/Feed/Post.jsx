import { memo } from "react";
import { supabase } from "../../../supabaseClient";
import { toast } from 'react-toastify';
import { usarPost } from "../../context/PostContext"; // ← nuevo import
import '../../styles/threads-feed.css'


export const Post = memo(({ post, currentUser, onDelete }) => {
  const isAuthor = post.user_id === currentUser?.id;
  const { setSelectedPost } = usarPost(); // ← para abrir modal de comentarios

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este post?')) return;
    
    try {
      const { error } = await supabase
        .from('post')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      
      toast.success('Post eliminado correctamente');
      onDelete?.();
      
    } catch (error) {
      console.error('Error al eliminar el post:', error.message);
      toast.error('Error al eliminar el post');
    }
  };

  // Función para formatear tiempo relativo
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="post">
      <div className="post-header">
        <img 
          src={post.threadUsers?.avatar_url || '/default-avatar.png'} 
          alt={post.threadUsers?.username} 
          className="post-avatar"
        />
        <div className="post-user-info">
          <span className="post-username">
            {post.threadUsers?.username || 'Usuario'}
          </span>
          <span className="post-time">
            {getTimeAgo(post.created_at)}
          </span>
          {isAuthor && (
            <button 
              onClick={handleDelete}
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

      <div className="post-actions">
        <button className="post-action">
          <span className="emoji">🤍</span>
          {post.likes_count || 0}
        </button>

        {/* Botón de comentar que abre modal */}
        <button 
          className="post-action"
          onClick={() => setSelectedPost(post)} // ← aquí guardamos el post a comentar
        >
          <span className="emoji">💬</span>
          {post.comments_count || 0}
        </button>

        <button className="post-action">
          <span className="emoji">🔄</span>
        </button>
        <button className="post-action">
           <span className="emoji">
             <img src="../src/assets/Share.png" className="imgshared"/>
           </span>
        </button>
      </div>
    </div>
  );
});
