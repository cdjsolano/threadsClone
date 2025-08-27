import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
   // Verificar si el usuario actual sigue a otro
  const isFollowing = async (targetUserId) => {
    if (!user) return false;
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (error) {
      console.error('Error checking follow:', error);
      return false;
    }
    return !!data;
  };

  // Seguir usuario
  const followUser = async (targetUserId) => {
    if (!user) return;
    const { error } = await supabase.from('follows').insert([
      { follower_id: user.id, following_id: targetUserId }
    ]);

    if (error) console.error('Error following user:', error);
  };

  // Dejar de seguir usuario
  const unfollowUser = async (targetUserId) => {
    if (!user) return;
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);

    if (error) console.error('Error unfollowing user:', error);
  };

  // lista de usuarios seguidos.

  const fetchFollowings = async (profileUserId) => {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following_id,
        threadsUsers(username, avatar_url)
      `)
      .eq('follower_id', profileUserId);

    if (error) {
      console.error('Error fetching followings:', error);
      return [];
    }
    return data;
  };

  const getFollowingCount = async (userId) => {
  if (!userId) return 0;
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (error) {
    console.error('Error al contar seguidos:', error);
    return 0;
  }
  return count;
};

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
    isFollowing,      
    followUser,       
    unfollowUser,     
    fetchFollowings,
    getFollowingCount,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}