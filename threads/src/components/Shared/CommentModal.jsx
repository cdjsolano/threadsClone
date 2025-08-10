import { useState } from "react";
import { usarPost } from "../../context/PostContext";
import { useAuth } from "../../context/AuthContext";
import {supabase} from "../../../supabaseClient.js";
import { toast } from "react-toastify";
import "../../styles/CommentModal.css"; // Archivo CSS externo

export default function CommentModal() {
  const { selectedPost, setSelectedPost } = usarPost();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedPost) return null;

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      toast.warning("El comentario no puede estar vacío");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: commentError } = await supabase
        .from("comments")
        .insert({
          post_id: selectedPost.id,
          user_id: user.id,
          content: commentText,
        });

      if (commentError) throw commentError;

      const { error: postError } = await supabase
        .from("posts")
        .update({ comments_count: selectedPost.comments_count + 1 })
        .eq("id", selectedPost.id);

      if (postError) throw postError;

      toast.success("Comentario publicado");
      setSelectedPost(null);
      setCommentText("");
    } catch (error) {
      console.error("Error al comentar:", error);
      toast.error("Error al publicar comentario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-modal-overlay">
      <div className="comment-modal-content">
        <div className="comment-modal-header">
          <h2 className="comment-modal-title">Responder a:</h2>
          <button 
            onClick={() => setSelectedPost(null)}
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
            onClick={() => setSelectedPost(null)}
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