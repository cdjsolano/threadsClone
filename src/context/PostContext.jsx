import { createContext, useState, useContext, useMemo } from "react";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Memoriza el valor del contexto para optimizar rendimiento
  const contextValue = useMemo(() => ({
    selectedPost,
    setSelectedPost,
    // [CAMBIO 1] - Función mejorada para cerrar modal
    closeModal: () => {
      setSelectedPost(null);
    },
    // [CAMBIO 2] - Nueva función para actualizar posts
    updatePost: (updatedPost) => {
      setSelectedPost(prev => {
        // Solo actualiza si es el post seleccionado
        return prev?.id === updatedPost.id ? updatedPost : prev;
      });
    }
  }), [selectedPost]);

  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
};

// Hook personalizado con verificación de contexto (sin cambios)
export const usarPost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usarPost debe usarse dentro de un PostProvider");
  }
  return context;
};