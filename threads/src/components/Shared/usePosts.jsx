import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("post")
        .select(`*, 
          threadUsers:user_id (username, fullName, avatar_url)`) // Relación con la tabla profiles
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []); // Asegura array vacío si es null
    } catch (err) {
      setError(err);
      console.error("Error fetching posts:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("post")
        .delete()
        .eq("id", postId);

      if (error) throw error;
      
      // Actualizar el estado local eliminando el post
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
    } catch (err) {
      setError(err);
      console.error("Error deleting post:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

     const subscription = supabase
      .channel("posts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post"
        },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { posts, loading, error, refetch: fetchPosts };
}