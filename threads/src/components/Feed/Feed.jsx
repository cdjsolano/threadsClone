import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../Shared/usePosts";
import { Post } from "./Post";
import { useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export function Feed() {
  const { user } = useAuth();
  const { posts, loading, error, refetch } = usePosts();

  // Suscripción a cambios en tiempo real
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
  
  if (loading) return <div className="loading">Cargando posts...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
 
  return (
    <div className="feed">
      
      {posts?.length === 0 ? (
        <p>No hay posts. ¡Sé el primero en publicar! 🚀</p>
      ) : (
        posts?.map((post) => (
          <Post 
            key={post.id} 
            post={post} 
            currentUser={user}
            onDelete={refetch} // Para refrescar al eliminar
          />
        ))
      )}
    </div>
  );
}

export default Feed;
