import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "../../styles/CreatePostModal.css";
import {
  Images,
  ImagePlay,
  Smile,
  ChartBarDecreasing,
  MapPin,
  CircleEllipsis,
  FileText,
} from "lucide-react";
import UploadFile from "../Shared/UploadFile";
import EmojiPicker from "emoji-picker-react";

export default function CreatePostModal({ onClose, onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emoji) => {
    setContent((prev) => prev + emoji.emoji); // inserta el emoji en el textarea
    setShowEmojiPicker(false); // cerrar después de seleccionar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!content.trim() && !imageFile && !videoFile) || !user) return;

    setIsSubmitting(true);
    try {
      const { error: userError } = await supabase.from("threadUsers").upsert(
        {
          id: user.id,
          username: user.user_metadata.user_name || user.email.split("@")[0],
          fullName: user.user_metadata.full_name || "",
          userEmail: user.email,
          avatar_url: user.user_metadata.avatar_url || "",
        },
        { onConflict: "id" }
      );
      if (userError) throw userError;

      let finalImageUrl = null;
      let finalVideoUrl = null;

      // Subir imagen si hay
      if (imageFile) {
        const filePath = `imagenes/${Date.now()}-${imageFile.name}`;
        const { error: imgError } = await supabase.storage
          .from("post-media")
          .upload(filePath, imageFile);
        if (imgError) throw imgError;

        const { data } = supabase.storage
          .from("post-media")
          .getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
      }

      // Subir video si hay
      if (videoFile) {
        const filePath = `Videos/${Date.now()}-${videoFile.name}`;
        const { error: vidError } = await supabase.storage
          .from("post-media")
          .upload(filePath, videoFile);
        if (vidError) throw vidError;

        const { data } = supabase.storage
          .from("post-media")
          .getPublicUrl(filePath);
        finalVideoUrl = data.publicUrl;
      }

      const { error } = await supabase.from("post").insert([
        {
          content,
          user_id: user.id,
          image_url: finalImageUrl,
          video_url: finalVideoUrl,
        },
      ]);

      if (error) throw error;

      toast.success("¡Post creado exitosamente!");
      setContent("");
      setImageFile(null);
      setVideoFile(null);
      setImageUrl(null);
      setVideoUrl(null);
      onPostCreated?.();
      onClose();
    } catch (error) {
      toast.error("Error al crear el post");
      console.error("Error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            Cancelar
          </button>
          <h4 className="modal-title">Nuevo Hilo</h4>
          <div className="iconosd">
            <span className="iconOnHeader">
              <FileText />
            </span>
            <span className="iconOnHeader">
              <CircleEllipsis />
            </span>
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
              {user.user_metadata.full_name || user.email}
              <p>{"> Agrega un tema "}</p>
            </span>
          </div>

          <textarea
            placeholder="¿Qué novedades tienes?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "20px";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            disabled={isSubmitting}
            maxLength={500}
            className="modal-post-textarea"
          />

          <div className="extra-actions">
            <UploadFile
              folder="imagenes"
              accept="image/*"
              trigger={<Images />}
              onUpload={(file) => {
                setImageFile(file);
                setImageUrl(URL.createObjectURL(file));
              }}
            />
            <UploadFile
              folder="Videos"
              accept="video/*"
              trigger={<ImagePlay />}
              onUpload={(file) => {
                setVideoFile(file);
                setVideoUrl(URL.createObjectURL(file));
              }}
            />

            {/* 👇 Botón Emoji */}
            <span
              className="iconOnAction"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Smile />
            </span>

            {/* 👇 Ventana flotante del EmojiPicker */}
            {showEmojiPicker && (
              <div className="emoji-picker-popup">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  style={{
                    position: "absolute",
                    width: "220px",
                    height: "400px",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                  theme="dark"
                />
              </div>
            )}

            <span className="iconOnAction">
              <ChartBarDecreasing />
            </span>
            <span className="iconOnAction">
              <MapPin />
            </span>
          </div>

          {imageUrl && (
            <div className="preview">
              <img src={imageUrl} alt="preview" className="preview-img" />
            </div>
          )}
          {videoUrl && (
            <div className="preview">
              <video controls className="preview-video">
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          )}

          <br />
          <div className="modal-form-footer">
            <button
              type="submit"
              disabled={
                (!content.trim() && !imageFile && !videoFile) || isSubmitting
              }
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
