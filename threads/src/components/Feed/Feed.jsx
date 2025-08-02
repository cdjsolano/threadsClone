import React, { useEffect, useState } from 'react';
import { fetchAllPosts } from '../../Supabase/services/postService.js';
import PostCard from '../Shared/postList';
import Crearpost from './Crearpost.jsx';
import { supabase } from '../../../supabaseClient.js';


const Feed = (actualUser, newPost) => {
  const [posts, setPosts] = useState([]);
  const [userActual, setuseractual] = useState('')
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  
      useEffect(() => {
          async function obtenerUsuario() {
              const { data, error } = await supabase.auth.getUser();
  
              if (error) {
                  console.error("Error al obtener usuario:", error.message);
              } else {
                  console.log("Usuario:", data.user);
                  const user = data.user;
                  setUsuario(user);
                  
              }
          }
  
        obtenerUsuario();
      }, []);

 const getPosts = async () => {
  try {
    const data = await fetchAllPosts(newPost);
    setPosts(data || []);
    setuseractual(usuario)
  } catch (err) {
    console.error('Error cargando publicaciones:', err.message);
    setPosts(newPost);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    console.log(newPost)
    setPosts((prev) => [newPost, ...prev]);
    console.log([posts])
  };

  if (loading) return <p>Cargando publicaciones...</p>;

  return (
    <div>
      <h1>Para ti</h1>
      <Crearpost onPostCreated={handlePostCreated} actualUser={[userActual]} />
      {posts.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} user="usuario.user_metadata.name" newPost={post} />)
      )}
    </div>
  );
};

export default Feed;
