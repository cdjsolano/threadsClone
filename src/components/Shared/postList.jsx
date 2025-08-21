import React from 'react';

const PostCard = ({ user, newPost }) => {
  const { content, created_at } = newPost;

  return (
    <div style={{ border: '1px solid #ccc', marginBottom: '12px', padding: '12px' }}>
      <div style={{ fontWeight: 'bold' }}>{user.user_metadata?.name || 'Usuario anónimo'}</div>
      <div>{content}</div>
      <small style={{ color: 'gray' }}>{new Date(created_at).toLocaleString()}</small>
    </div>
  );
};

export default PostCard;