import { memo } from "react";
import { supabase } from "../../../supabaseClient";
import { toast } from 'react-toastify'; // Opcional: para notificaciones

export const Post = memo(({ post, currentUser, onDelete }) => {
  const isAuthor = post.user_id === currentUser?.id;

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este post?')) return;
    
    try {
      const { error } = await supabase
        .from('post')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      
      // Notificar éxito
      toast.success('Post eliminado correctamente');
      
      // Refrescar la lista de posts
      onDelete?.();
      
    } catch (error) {
      console.error('Error al eliminar el post:', error.message);
      toast.error('Error al eliminar el post');
    }
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
          <span className="post-username">{post.threadUsers?.username}</span>
          {isAuthor && (
            <button 
              onClick={handleDelete}
              className="delete-button"
              aria-label="Eliminar post"
              title="Eliminar post"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <button className="post-action">
          ❤️ {post.likes_count || 0}
        </button>
        <button className="post-action">
          💬 {post.comments_count || 0}
        </button>
      </div>
    </div>
  );
});