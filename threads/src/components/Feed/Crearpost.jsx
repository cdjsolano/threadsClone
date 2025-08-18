// CreatePost.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CreatePostModal from "../Shared/CreatePostModal"; // 🔹 Importamos el modal real
import "../../styles/threads-feed.css";

export function Crearpost({ onPostCreated }) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Si no hay usuario, no mostramos nada
  if (!user) return null;

  return (
    <div>
      {/* 🔹 Área estilo Threads que dispara el modal */}
      <div
        className="create-post-trigger"
        onClick={() => setIsModalOpen(true)} // Abrir modal al hacer click
      >
        <img
          src={user.user_metadata.avatar_url || "/default-avatar.png"}
          alt={user.user_metadata.user_name}
          className="post-avatar"
        />
        <div className="trigger-content">
          <span className="trigger-placeholder">¿Qué estás pensando?</span>
        </div>
        <button className="fake-submit">Publicar</button>
      </div>

      {/* 🔹 Modal real con la lógica de crear posts */}
      {isModalOpen && (
        <CreatePostModal
          onClose={() => setIsModalOpen(false)}
          onPostCreated={onPostCreated}
        />
      )}
    </div>
  );
}

export default Crearpost;

