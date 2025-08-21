import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../Shared/usePosts";
import { Post } from "./Post";
import Crearpost from "./Crearpost";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorMessage from "../../UI/ErrorMessage";
import { useEffect, useRef } from "react";
import "../../styles/threads-feed.css"

export function Feed() {
  const { user } = useAuth();
  const { posts, setPosts, loading, error, refetch } = usePosts();

  if (loading) return <LoadingSpinner message="Cargando posts..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="feed-container" ref={feedRef} >
      {user && <Crearpost onPostSuccess={refetch} />}
      {posts?.length === 0 ? (
        <div className="emptyFeed">
          <img src="/empty-state.svg" alt="No hay posts" />
          <p>¡El feed está vacío! <button onClick={refetch}>Recargar</button></p>
        </div>
      ) : (
        <div className="postsList">
          {posts?.map((post) => (
            <Post
              key={`${post.id}_${post.created_at}`}
              post={post}
              currentUser={user}
              onDelete={refetch}
              // 🔹 Callback para incrementar contador de comentarios
              onCommentAdded={(postId) => {
                setPosts(prev =>
                  prev.map(p =>
                    p.id === postId
                      ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                      : p
                  )
                );
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;
