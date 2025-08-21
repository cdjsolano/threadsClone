import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      console.time('Supabase Query');
      
      const { data, error } = await supabase
        .from("post")
        .select(`*, threadUsers:user_id (username, fullName, avatar_url)`)
        .order("created_at", { ascending: false });

      if (error) throw error;

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
      setInitialLoad(false);
      console.timeEnd('Supabase Query');
    }
  };

  useEffect(() => {
    fetchAllPosts();

    const interval = setInterval(() => {
      if (!initialLoad) fetchAllPosts();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let subscription;

    const setupRealtime = async () => {
      if (subscription) {
        await supabase.removeChannel(subscription);
      }

      const lastPostDate = posts[0]?.created_at || new Date().toISOString();
      
      subscription = supabase
        .channel("posts_changes_optimized")
        .on(
          "postgres_changes",
          { 
            event: "*",
            schema: "public",
            table: "post",
            filter: `created_at=gt.${lastPostDate}`
          },
          (payload) => {
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

    if (!initialLoad && posts.length) {
      setupRealtime();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
          .catch(err => console.error("Cleanup error:", err));
      }
    };
  }, [initialLoad, posts]);

  // 🔹 Nueva suscripción realtime para comments
  useEffect(() => {
    const commentSub = supabase
      .channel("comments_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          const postId = payload.new.post_id;
          setPosts(prev =>
            prev.map(p =>
              p.id === postId
                ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                : p
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentSub);
    };
  }, []);

  const handleDelete = async (postId) => {
    try {
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      const { error } = await supabase
        .from("post")
        .delete()
        .eq("id", postId);

      if (error) throw error;
    } catch (err) {
      setError(err);
      console.error("Error deleting post:", err.message);
      fetchAllPosts();
    }
  };

  return { 
    posts,
    setPosts, // 🔹 Lo exponemos para poder actualizar contador desde Feed.jsx
    loading: loading && initialLoad,
    error,
    refetch: fetchAllPosts,
    handleDelete
  };
}
