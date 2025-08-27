import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "../styles/FollowingPage.css";
import { ArrowLeft } from "lucide-react"

export default function FollowingPage() {
    const { user } = useAuth();
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const loadFollowing = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from("follows")
                .select("following_id, threadUsers:following_id (id, username, avatar_url)")
                .eq("follower_id", user.id);

            if (error) {
                console.error("Error cargando seguidos:", error);
            } else {
                setFollowing(data.map((f) => f.threadUsers));
            }
        };

        loadFollowing();
    }, [user]);

    return (
        <div className="following-container">
            <button className="back-button" onClick={() => navigate("/home")}>
                <ArrowLeft />
            </button>
            <h1 className="following-title">Usuarios que sigo</h1>
            <ul className="following-list">
                {following.map((u) => (
                    <li key={u.id} className="following-item">
                        <img
                            src={u.avatar_url || "/default-avatar.png"}
                            alt={u.username}
                            className="following-avatar"
                        />
                        <span className="following-name">{u.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
