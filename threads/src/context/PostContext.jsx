import { createContext, useState, useContext } from "react";


const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null); // Datos del post a comentar

  return (
    <PostContext.Provider value={{ selectedPost, setSelectedPost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usarPost = () => useContext(PostContext);