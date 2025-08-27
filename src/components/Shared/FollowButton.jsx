import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx"; 
import "../../styles/FollowButton.css";

export default function FollowButton({ targetUserId }) {
  const { user, isFollowing, followUser, unfollowUser, loginWithGoogle } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollow = async () => {
      if (user && targetUserId && user.id !== targetUserId) {
        setLoading(true);
        const result = await isFollowing(targetUserId);
        setFollowing(result);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkFollow();
  }, [user, targetUserId, isFollowing]);

  const handleClick = async () => {
    if (!user) {
      await loginWithGoogle();
      return;
    }

    setLoading(true);

    if (following) {
      await unfollowUser(targetUserId);
      setFollowing(false);
    } else {
      await followUser(targetUserId);
      setFollowing(true);
    }

    setLoading(false);
  };

  if (!user || user.id === targetUserId) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`follow-btn ${following ? "unfollow" : "follow"}`}
    >
      {loading ? "..." : following ? "Siguiendo" : "Seguir"}
    </button>
  );
}
