import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export function usePosts() {
  // [Cambio #1] - Añado estado para distinguir carga inicial
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true); // Nuevo estado

  // [Cambio #2] - Optimizo fetchAllPosts para cache local
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      console.time('Supabase Query'); // Debug de rendimiento
      
      const { data, error } = await supabase
        .from("post")
        .select(`*, threadUsers:user_id (username, fullName, avatar_url)`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // [Cambio #3] - Actualizo cache solo si hay nuevos datos
      setPosts(prev => {
        const newIds = new Set(data?.map(post => post.id));
        const merged = [
          ...(data || []),
          ...prev.filter(post => !newIds.has(post.id))
        ];
        return merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });

    } catch (err) {
      setError(err);
      console.error("Error fetching posts:", err.message);
    } finally {
      setLoading(false);
      setInitialLoad(false); // [Cambio #4] - Marco carga inicial como completa
      console.timeEnd('Supabase Query');
    }
  };

  // [Cambio #5] - Carga inmediata + polling separado (Línea 38-44)
  useEffect(() => {
    fetchAllPosts(); // Carga inicial inmediata

    const interval = setInterval(() => {
      if (!initialLoad) fetchAllPosts(); // Polling solo después de carga inicial
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  // [Cambio #6] - Suscripción optimizada (Línea 46-83)
  useEffect(() => {
    let subscription;

    const setupRealtime = async () => {
      if (subscription) {
        await supabase.removeChannel(subscription);
      }

      // [Cambio #7] - Filtro dinámico basado en última actualización
      const lastPostDate = posts[0]?.created_at || new Date().toISOString();
      
      subscription = supabase
        .channel("posts_changes_optimized")
        .on(
          "postgres_changes",
          { 
            event: "*",
            schema: "public",
            table: "post",
            filter: `created_at=gt.${lastPostDate}` // Filtro dinámico
          },
          (payload) => {
            // [Cambio #8] - Actualización optimista
            if (payload.eventType === "INSERT") {
              setPosts(prev => [payload.new, ...prev]);
            } else if (payload.eventType === "DELETE") {
              setPosts(prev => prev.filter(p => p.id !== payload.old.id));
            }
          }
        )
        .subscribe((status, err) => {
          if (err) console.error("Subscription error:", err);
          console.log("Realtime status:", status);
        });
    };

    // [Cambio #9] - Espero a tener datos iniciales
    if (!initialLoad && posts.length) {
      setupRealtime();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
          .catch(err => console.error("Cleanup error:", err));
      }
    };
  }, [initialLoad, posts]); // [Cambio #10] - Dependencias optimizadas

  const handleDelete = async (postId) => {
    try {
      // [Cambio #11] - Eliminación optimista
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      const { error } = await supabase
        .from("post")
        .delete()
        .eq("id", postId);

      if (error) throw error;
    } catch (err) {
      setError(err);
      console.error("Error deleting post:", err.message);
      fetchAllPosts(); // Recarga si falla
    }
  };

  return { 
    posts, 
    loading: loading && initialLoad, // [Cambio #12] - Loading específico
    error,
    refetch: fetchAllPosts,
    handleDelete
  };
}