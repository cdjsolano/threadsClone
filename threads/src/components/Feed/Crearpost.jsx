import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/threads-feed.css'

export function Crearpost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {

      const { error: userError } = await supabase
        .from('threadUsers')
        .upsert(
          {
            id: user.id,
            username: user.user_metadata.user_name || user.email.split('@')[0],
            fullName: user.user_metadata.full_name || '',
            userEmail: user.email,
            avatar_url: user.user_metadata.avatar_url || ''
          },
          { onConflict: 'id' }
        );

      if (userError) throw userError;


      const { error } = await supabase
        .from('post')
        .insert([{ 
          content, 
          user_id: user.id
        }]);

      if (error) throw error;
      
      toast.success('¡Post creado exitosamente!');
      setContent('');
      onPostCreated?.(); // Notificar al componente padre
    } catch (error) {
      toast.error('Error al crear el post');
      console.error('Error:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="create-post-form">
      <div className="post-header">
        <img 
          src={user.user_metadata.avatar_url || '/default-avatar.png'} 
          alt={user.user_metadata.user_name} 
          className="post-avatar"
        />
        </div>

      <textarea
        placeholder="¿Qué novedades tienes?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        maxLength={500}
      />
      <div className="form-footer">
        <span className="char-counter">{content.length}/500</span>
        <button 
          type="submit" 
          disabled={!content.trim() || isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  );
}

export default Crearpost
