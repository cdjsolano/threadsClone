import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("post")
        .select(`*, threadUsers:user_id (username, fullName, avatar_url)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err);
      console.error("Error fetching posts:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Polling cada 120 segundos (backup)
  useEffect(() => {
    const interval = setInterval(fetchAllPosts, 120000);
    return () => clearInterval(interval);
  }, []);

  // 2. Suscripción realtime (versión corregida)
  useEffect(() => {
    let subscription;

    const setupRealtime = async () => {
      // Limpiar suscripción existente
      if (subscription) {
        await supabase.removeChannel(subscription);
      }

      subscription = supabase
        .channel("posts_changes_unique") // Nombre único
        .on(
          "postgres_changes",
          { 
            event: "*", 
            schema: "public", 
            table: "post",
            filter: `created_at=gt.${new Date(Date.now() - 30000).toISOString()}` // Backticks
          },
          (payload) => {
            console.log("Cambio detectado:", payload);
            fetchAllPosts();
          }
        )
        .subscribe((status, err) => {
          if (err) {
            console.error("Error en suscripción:", err);
            return;
          }
          console.log("Estado:", status); // DEBUG: "SUBSCRIBED", "CLOSED", etc.
        });
    };

    setupRealtime();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
          .then(() => console.log("Suscripción limpiada"))
          .catch(console.error);
      }
    };
  }, []);

  const handleDelete = async (postId) => {
    try {
      const { error } = await supabase
        .from("post")
        .delete()
        .eq("id", postId);

      if (error) throw error;
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError(err);
      console.error("Error deleting post:", err.message);
    }
  };

  return { 
    posts, 
    loading, 
    error, 
    refetch: fetchAllPosts,
    handleDelete 
  };
}