import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../Shared/usePosts";
import { Post } from "./Post";
import { useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import Crearpost from "./crearPost";
import '../../styles/threads-feed.css'

export function Feed() {
  const { user } = useAuth();
  const { posts, loading, error, refetch } = usePosts();

  // Suscripción a cambios en tiempo real (ya bien implementado)
  useEffect(() => {
    const channel = supabase
      .channel('realtime-posts')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'post' 
        },
        () => refetch()
      )
      .subscribe();

    return () => channel.unsubscribe();
  }, [refetch]);
  
  if (loading) return <div className="loading-spinner">Cargando posts...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <div className="feed-container">
      {/* Sección de creación - Manteniendo tu lógica existente */}
      {user && <Crearpost onPostSuccess={refetch}/>}

      {/* Listado de posts - Sin cambios en tu lógica */}
      {posts?.length === 0 ? (
        <div className="empty-feed-message">
          <p>No hay posts. ¡Sé el primero en publicar! 🚀</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts?.map((post) => (
            <Post 
              key={post.id} 
              post={post} 
              currentUser={user}
              onDelete={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;