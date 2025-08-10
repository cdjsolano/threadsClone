import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../Shared/usePosts";
import { Post } from "./Post";
import Crearpost from "./crearPost";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorMessage from "../../UI/ErrorMessage";

export function Feed() {
  const { user } = useAuth();
  const { posts, loading, error, refetch } = usePosts(); // Nota: loadMore y hasMore también pueden eliminarse si ya no se usan

  if (loading) return <LoadingSpinner message="Cargando posts..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="feed-container">
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
              key={`${post.id}_${post.created_at}`} // Key única compuesta (recomendado)
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