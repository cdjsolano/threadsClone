import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import "../styles/post-detail.css";


export default function PostDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");

    // 🔹 Cargar post y comentarios
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Obtener post
                const { data: postData, error: postError } = await supabase
                    .from("post")
                    .select(`*, threadUsers:user_id (fullName, avatar_url)`)
                    .eq("id", id)
                    .single();

                if (postError) throw postError;
                setPost(postData);

                // Obtener comentarios
                const { data: commentsData, error: commentsError } = await supabase
                    .from("comments")
                    .select(`*, threadUsers:user_id (fullName, avatar_url)`)
                    .eq("post_id", id)
                    .order("created_at", { ascending: true });

                if (commentsError) throw commentsError;
                setComments(commentsData || []);
            } catch (err) {
                console.error("Error cargando datos:", err.message);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // 🔹 Suscripción realtime para comentarios nuevos
    useEffect(() => {
        const channel = supabase
            .channel("comments_realtime")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "comments", filter: `post_id=eq.${id}` },
                (payload) => {
                    setComments((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return "ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

    // 🔹 Manejar envío de nuevo comentario
    const handleSubmitComment = async () => {
        if (!user) {
            alert("Debes iniciar sesión para comentar");
            return;
        }
        if (!newComment.trim()) return;

        const { error } = await supabase.from("comments").insert({
            content: newComment,
            post_id: id,
            user_id: user.id,
            username: user.profile?.username || user.email
        });

        if (error) {
            console.error("Error al enviar comentario:", error.message);
        } else {
            setNewComment("");
        }
    };

    if (loading) return <LoadingSpinner message="Cargando post..." />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div className="post-detail-container">
            {/* 🔹 Botón para volver */}
            <button className="back-button" onClick={() => navigate("/")}>
                ← 
            </button>
            {post && (
                <div className="post-detail">
                    <div className="post-header">
                        <img
                            src={post.threadUsers?.avatar_url || "/default-avatar.png"}
                            alt={post.threadUsers?.username}
                            className="post-avatar"
                        />
                        <div className="post-user-info">
                            <span className="post-username">{post.threadUsers?.fullName}</span>
                            <span className="post-time">{getTimeAgo(post.created_at)}</span>
                           
                        </div>
                    </div>
                    <div className="post-content-detail"> 
                        <p>{post.content}</p> 
                    </div>
                </div>
            )}

            {/* Lista de comentarios */}
            <div className="comments-section">
                <h3>Comentarios ({comments.length})</h3>
                {comments.length === 0 && <p>No hay comentarios aún.</p>}
                {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <img
                            src={comment.threadUsers?.avatar_url || "/default-avatar.png"}
                            alt={comment.threadUsers?.fullName}
                            className="post-avatar"
                        />
                        <strong>{comment.threadUsers?.fullName || "Usuario"}</strong><span className="post-time">{getTimeAgo(comment.created_at)}</span>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>

            {/* Formulario para nuevo comentario */}
            <div className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                />
                <button onClick={handleSubmitComment}>Comentar</button>
            </div>
        </div>
    );
}
