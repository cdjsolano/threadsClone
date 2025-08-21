import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorMessage from "../../UI/ErrorMessage";
import "../../styles/MyComments.css";

export default function MyComments() {
  const { user } = useAuth();
  const [postsWithComments, setPostsWithComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔹 Traer los posts del usuario con sus comentarios
        const { data: postsData, error: postsError } = await supabase
          .from("post")
           .select(`
            id,
            content,
            created_at,
            comments (
              id,
              content,
              created_at,
              user_id,
              threadUsers:user_id (fullName, avatar_url)
            ),
            threadUsers:user_id (fullName, avatar_url)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;

        setPostsWithComments(postsData || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return "ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (loading) return <LoadingSpinner message="Cargando tus comentarios..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="my-comments-container">
      <h4>Hilos</h4>
      {postsWithComments.length === 0 ? (
        <p>No hay comentarios en tus publicaciones.</p>
      ) : (
        postsWithComments.map((post) => (
          <div key={post.id} className="post-comments-group">
            {/* 🔹 Encabezado con el post original */}
            <div className="original-post">
              
              <span><img src={post.threadUsers?.avatar_url || "/default-avatar.png"} alt="" className="post-avatar"/></span>
              <span>{post.threadUsers?.fullName || "Usuario"}</span> <br /> 
              <p><strong> Tu publicación: </strong> </p><span>{post.content}</span>
              <span className="post-time">{getTimeAgo(post.created_at)}</span>
            </div>
            <h4><p>Comentarios</p></h4>

            {/* 🔹 Lista de comentarios */}
            {post.comments?.length > 0 ? (
              <ul className="comments-list">
                {post.comments.map((comment) => (
                  <li key={comment.id} className="comment-item">
                    
                    <img
                      src={comment.threadUsers?.avatar_url || "/default-avatar.png"}
                      alt={comment.threadUsers?.fullName}
                      className="post-avatar"
                    />
                    <div>
                      
                      <strong>{comment.threadUsers?.fullName || "Usuario"}</strong>
                      <span className="post-time">{getTimeAgo(comment.created_at)}</span>
                      <p>{comment.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-comments">Aún no hay comentarios en esta publicación.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}