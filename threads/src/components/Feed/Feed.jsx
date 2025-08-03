import { useAuth } from "../../context/AuthContext"; // Importa el contexto
import { usePosts } from "../Shared/usePost"; // Custom hook para fetch de posts
import { Post } from "./Post";

export function Feed() {
  const { user } = useAuth(); // Usuario desde contexto (¡elimina el useState innecesario!)
  const { posts, loading, error, refetch } = usePosts(); // Lógica reutilizable

  if (loading) return <div className="loading">Cargando posts...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="feed">
      {posts?.length === 0 ? (
        <p>No hay posts. ¡Sé el primero en publicar! 🚀</p>
      ) : (
        posts?.map((post) => (
          <Post key={post.id} post={post} currentUser={user} />
        ))
      )}
    </div>
  );
}
export default Feed;
