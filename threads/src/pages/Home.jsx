import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Importar el hook useAuth
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Feed from '../components/Feed/Feed.jsx';
import '../styles/EstilosGlobal.css';
import '../styles/threads-feed.css';
import { supabase } from '../../supabaseClient.js';

function Home() {
  // Usar el contexto de autenticación
  const { user, loading, loginWithGoogle, logout } = useAuth();

  // Mostrar estado de carga mientras se verifica la sesión
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  // Si no hay usuario, muestra la página de login
  if (!user) {
    return (
      <div className="landpage">
        <div className="card">
          <Auth 
            supabaseClient={supabase} 
            appearance={{ theme: ThemeSupa }} 
            providers={['google']} 
                     
          />
          
        </div>
      </div>
    );
  }

  // Si hay usuario, muestrael feed
  return (
    <div className="containerbkg">
      <div className="logo"></div>
      <div className="home">
        <div className="welcome">
          <Feed />
        </div>
        <div className="footer">
          <button onClick={logout} className="salida">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;