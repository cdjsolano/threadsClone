import React, { useState } from 'react';
import { createPost } from '../../Supabase/services/postService';
import Feed from './Feed';

const Crearpost = ({ actualUser, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
 

  const handlePost = async () => {
    if (!actualUser) {
    console.error('Usuario no logueado');
    return;
  }
    console.log(content)
    
    if (!content.trim()) return;
    setLoading(true);
    try {
      const newPost = await createPost(content);
      setContent('');
      if (onPostCreated) onPostCreated(newPost); // Recargar feed
    } catch (error) {
      console.error('Error al crear post:', error.message);
    } finally {
      setLoading(false);
    }
    <Feed newPost={content}></Feed>
  };
  

  return (
    <div className="create-post">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="¿Qué estás pensando?"
        rows={4}
      />
      <br />
      <button onClick={handlePost} disabled={loading}>
        {loading ? 'Publicando...' : 'Publicar'}
      </button>
    </div>
  );
};

export default Crearpost;
