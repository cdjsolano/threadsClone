import { Link, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../supabaseClient';
import '../../styles/post-detail.css';

export default function CommentForm({ postId, posts }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [post] = posts

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
    <div className="comment-form">
      <Link
                    to={`/post/${post.id}`}
                    style={{ textDecoration: "none", color: "inherit", width: "400px" }}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder=' comentar..'/>
      </Link>
    </div>
  );
}
