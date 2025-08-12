import { useState, useEffect } from "react";
import { usarPost } from "../../context/PostContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../../supabaseClient.js";
import { toast } from "react-toastify";
import "../../styles/CommentModal.css";

export default function CommentModal() {
  const { selectedPost, setSelectedPost } = usarPost();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [FIX 1] - Manejo del scroll al montar/desmontar
  useEffect(() => {
       return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const closeModal = () => {
    setSelectedPost(null);
    setCommentText("");
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("comment-modal-overlay")) {
      closeModal();
    }
  };

  if (!selectedPost) return null;

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      toast.warning("El comentario no puede estar vacío");
      return;
    }

    setIsSubmitting(true);

    try {
      // [FIX 2] - Actualización optimista completa
      const updatedPost = {
        ...selectedPost,
        commentsCount: (selectedPost.commentsCount || 0) + 1
      };
      
      // Actualización inmediata en contexto
      setSelectedPost(updatedPost);

      // 1. Insertar comentario
      const { error: commentError } = await supabase
        .from("comments")
        .insert({
          post_id: selectedPost.id,
          user_id: user.id,
          content: commentText,
        });

      if (commentError) throw commentError;

      // 2. Actualizar contador en DB
      const { error: postError } = await supabase
        .from("post")
        .update({ commentsCount: updatedPost.commentsCount })
        .eq("id", selectedPost.id);

      if (postError) throw postError;

      toast.success("Comentario publicado");
      closeModal();
    } catch (error) {
      // [FIX 3] - Revertir cambios en caso de error
      setSelectedPost(selectedPost);
      console.error("Error al comentar:", error);
      toast.error("Error al publicar comentario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-modal-overlay" onClick={handleClickOutside}>
      <div 
        className="comment-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="comment-modal-header">
          <h2 className="comment-modal-title">Responder a:</h2>
          <button 
            onClick={closeModal} // [CAMBIO 8] - Usar función de cierre
            className="comment-modal-close-btn"
          >
            ✕
          </button>
        </div>

        <p className="comment-modal-post-content">
          {selectedPost.content}
        </p>

        <textarea
          className="comment-modal-textarea"
          placeholder="Escribe tu comentario..."
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="comment-modal-actions">
          <button
            onClick={closeModal} // [CAMBIO 9] - Usar función de cierre
            className="comment-modal-cancel-btn"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`comment-modal-submit-btn ${isSubmitting ? 'comment-modal-submit-btn--loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}