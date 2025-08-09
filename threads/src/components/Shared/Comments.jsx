import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../supabaseClient';
import '../../styles/threads-feed.css';

export default function CommentForm({ postId }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');

  const submitComment = async () => {
    if (!user) return;

    await supabase.from('comments').insert({
      content,
      post_id: postId,
      user_id: user.id,
      username: user.profile?.username
    });

    setContent('');
  };

  return (
    <div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={submitComment}>Comentar</button>
    </div>
  );
}
