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
        .select("*, user:profiles(*)") // Relación con la tabla profiles
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refetch: fetchPosts };
}