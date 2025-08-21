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
  // 🔹 [NUEVO] Estados para info del autor del post y del usuario que comenta
  const [postAuthor, setPostAuthor] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  // [FIX 1] - Manejo del scroll al montar/desmontar
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🔹 [NUEVO] Cargar info del autor del post desde Supabase
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!selectedPost) return;

      // Obtener info del autor del post
      const { data: authorData, error: authorError } = await supabase
        .from("threadUsers")
        .select("fullName, avatar_url")
        .eq("id", selectedPost.user_id)
        .single();

      if (!authorError) setPostAuthor(authorData);

      // Obtener info del usuario logueado (quien comenta)
      const { data: currentData, error: currentError } = await supabase
        .from("threadUsers")
        .select("fullName, avatar_url")
        .eq("id", user.id)
        .single();

      if (!currentError) setCurrentUserData(currentData);
    };

    fetchAuthorData();
  }, [selectedPost, user]);

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
      const updatedPost = {
        ...selectedPost,
        commentsCount: (selectedPost.commentsCount || 0) + 1,
      };

      setSelectedPost(updatedPost);

      const { error: commentError } = await supabase
        .from("comments")
        .insert({
          post_id: selectedPost.id,
          user_id: user.id,
          content: commentText,
        });

      if (commentError) throw commentError;

      const { error: postError } = await supabase
        .from("post")
        .update({ commentsCount: updatedPost.commentsCount })
        .eq("id", selectedPost.id);

      if (postError) throw postError;

      toast.success("Comentario publicado");
      closeModal();
    } catch (error) {
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
            onClick={closeModal}
            className="comment-modal-close-btn"
          >
            ✕
          </button>
        </div>

        {/* 🔹 Autor del post */}
        {postAuthor && (
          <div className="comment-modal-user-info">
            <img
              src={postAuthor.avatar_url || "/default-avatar.png"}
              alt={postAuthor.fullName}
              className="avatar"
            />
            <span>{postAuthor.fullName}</span>
          </div>
        )}

        <p className="comment-modal-post-content">
          {selectedPost.content}
        </p>

        {/* 🔹 Usuario que comenta */}
        {currentUserData && (
          <div className="comment-modal-user-info">
            <img
              src={currentUserData.avatar_url || "/default-avatar.png"}
              alt={currentUserData.fullName}
              className="avatar"
            />
            <span>{currentUserData.fullName} <p>{"  > Añade un tema.."}</p></span>
          </div>
        )}

        <textarea
          className="comment-modal-textarea"
          placeholder={`Responde a ${postAuthor?.fullName || "este usuario"}...`}
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="comment-modal-actions">
          <button
            onClick={closeModal}
            className="comment-modal-cancel-btn"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`comment-modal-submit-btn ${
              isSubmitting ? "comment-modal-submit-btn--loading" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
