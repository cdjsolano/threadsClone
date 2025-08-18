import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "../../styles/CreatePostModal.css";
import { Images, ImagePlay, Smile, ChartBarDecreasing, MapPin, CircleEllipsis, FileText } from 'lucide-react';

export default function CreatePostModal({ onClose, onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      // 🔹 Guardar/actualizar datos del usuario en threadUsers
      const { error: userError } = await supabase.from("threadUsers").upsert(
        {
          id: user.id,
          username:
            user.user_metadata.user_name || user.email.split("@")[0],
          fullName: user.user_metadata.full_name || "",
          userEmail: user.email,
          avatar_url: user.user_metadata.avatar_url || "",
        },
        { onConflict: "id" }
      );

      if (userError) throw userError;

      // 🔹 Insertar el nuevo post
      const { error } = await supabase
        .from("post")
        .insert([{ content, user_id: user.id }]);

      if (error) throw error;

      toast.success("¡Post creado exitosamente!");
      setContent("");
      onPostCreated?.(); // Notificar al feed
      onClose(); // 🔹 Cerrar modal tras publicar
    } catch (error) {
      toast.error("Error al crear el post");
      console.error("Error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // 🔹 Evita que se cierre al hacer click dentro
      >
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            Cancelar
          </button>
          <h4 className="modal-title">Nuevo Hilo</h4>
          <div className="iconosd">
            <span className="iconOnHeader"><FileText/></span>
            <span className="iconOnHeader"><CircleEllipsis /></span>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="modal-post-form">
          <div className="modal-post-header">
            <img
              src={user.user_metadata.avatar_url || "/default-avatar.png"}
              alt={user.user_metadata.user_name}
              className="post-avatar"
            />
            <span className="post-username">
              {user.user_metadata.full_name || user.email}<p>{"> Agrega un tema "}</p>
            </span>
          </div>
          <textarea
            placeholder="¿Qué novedades tienes?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "20px";         // 🔹 Resetear altura
              e.target.style.height = `${e.target.scrollHeight}px`; // 🔹 Ajustar a contenido
            }}
            disabled={isSubmitting}
            maxLength={500}
            className="modal-post-textarea"
          />
          <div className="extra-actions">
            <span className="iconOnAction"><Images /></span>
            <span className="iconOnAction"><ImagePlay /></span>
            <span className="iconOnAction"><Smile /></span>
            <span className="iconOnAction"><ChartBarDecreasing /></span>
            <span className="iconOnAction"><MapPin /></span>
          </div>
          <br />
          <div className="agregaHilo">
           <img
              src={user.user_metadata.avatar_url || "/default-avatar.png"}
              alt={user.user_metadata.user_name}
              className="hilo-avatar"
            />
          <p className="agre-hilo-text">Agregar a hilo</p>
          </div>
          <br />
          <div className="modal-form-footer">
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
