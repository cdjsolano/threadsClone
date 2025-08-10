import { createContext, useState, useContext, useMemo } from "react";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Memoiza el valor del contexto para optimizar rendimiento
  const contextValue = useMemo(() => ({
    selectedPost,
    setSelectedPost,
    // Función adicional para cerrar modal
    closeModal: () => setSelectedPost(null) 
  }), [selectedPost]);

  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
};

// Hook personalizado con verificación de contexto
export const usarPost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usarPost debe usarse dentro de un PostProvider");
  }
  return context;
};