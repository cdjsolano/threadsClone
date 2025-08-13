import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { Post } from "../components/Feed/Post";
import "../styles/profile.css"; // 🔹 Estilo propio

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfileAndPosts = async () => {
      // 🔹 Traer datos del perfil
      const { data: profile, error: profileError } = await supabase
        .from("threadUsers")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) console.error(profileError);
      else setProfileData(profile);

      // 🔹 Traer posts del usuario
      const { data: userPosts, error: postsError } = await supabase
        .from("post")
        .select(`
          *,
          threadUsers:user_id (username, avatar_url)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (postsError) console.error(postsError);
      else setPosts(userPosts);

      setLoading(false);
    };

    fetchProfileAndPosts();
  }, [user]);

  if (!user) {
    return <p>No has iniciado sesión.</p>;
  }

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-container">
      {/* 🔹 Encabezado de perfil */}
      <div className="profile-header">
        <img
          src={profileData?.avatar_url || "/default-avatar.png"}
          alt={profileData?.username || "Usuario"}
          className="profile-avatar"
        />
        <div>
          <h2>{profileData?.username || "Usuario"}</h2>
          <p>{profileData?.fullName || ""}</p>
          <small>{user.email}</small>
        </div>
      </div>

      {/* 🔹 Listado de posts */}
      <h3>Mis publicaciones</h3>
      {posts.length === 0 ? (
        <p>No has publicado nada todavía.</p>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              currentUser={user}
              onDelete={() => {
                setPosts((prev) => prev.filter((p) => p.id !== post.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
