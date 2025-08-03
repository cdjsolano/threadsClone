import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export function Crearpost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
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
      <textarea
        placeholder="¿Qué estás pensando?"
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
