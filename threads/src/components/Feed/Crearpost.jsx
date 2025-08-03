import React, { useState } from 'react';
import { createPost } from '../../Supabase/services/postService';
import Feed from './Feed';
import { useAuth } from "../../context/AuthContext"; // Importa el contexto
import { supabase } from "../../../supabaseClient"; // Asegúrate de que la ruta es correcta

export function Crearpost({ onPostCreated }) { // Recibe callback para refrescar posts
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Usa el contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return; // Valida contenido y usuario

    setIsLoading(true);
    const { error } = await supabase
      .from("posts")
      .insert([{ content, user_id: user.id }]); // Usa user.id del contexto

    setIsLoading(false);
    
    if (error) {
      console.error("Error al crear el post:", error.message);
      // Aquí podrías añadir un toast de error (ej: react-toastify)
    } else {
      setContent(""); // Limpia el textarea
      onPostCreated?.(); // Llama al callback para refrescar el feed
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crear-post">
      <textarea
        placeholder="¿Qué está pasando?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading} // Deshabilita durante el envío
      />
      <button type="submit" disabled={!content.trim() || isLoading}>
        {isLoading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}

export default Crearpost;