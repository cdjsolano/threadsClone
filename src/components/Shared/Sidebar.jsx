import { House, MessageSquare, Plus, Heart, UserRound, LogOut } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import "../../styles/SideBar.css";
import { useAuth } from '../../context/AuthContext';
import logothreads from '../../assets/Threads_icon.png';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, loading, loginWithGoogle, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // redirigir al login
  };

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="sidebar desktop-sidebar">
        <Link to="/home" className="sidebar-btn" title="Feed">
        <div className='logo'>
          <img src={logothreads} alt="Logo threads" />
        </div>
        </Link>

        <Link to="/home" className="sidebar-btn" title="Feed">
          <House className="icon" />
        </Link>
        <Link to="/MyComments" className="sidebar-btn" title="Mis Comentarios">
          <MessageSquare className='icon flipped' />
        </Link>

        <button
          className="sidebar-btn"
          title="Nuevo post"
          onClick={() => navigate("/NuevoPost")}
        >
          <Plus className='add-btn' />
        </button>

        <Link to="/likes" className="sidebar-btn" title="Me gusta recibidos">
          <Heart className="icon" />
        </Link>
        <Link to="/profile" className="sidebar-btn" title="Perfil">
          <UserRound className="icon" />
        </Link>
        
        {/* Botón de logout con texto (solo visible en desktop) */}
        <div className="footer">
          <button onClick={handleLogout} className="salida">
            Log Out
          </button>
        </div>
      </div>

      {/* Sidebar para móvil */}
      <div className="mobile-sidebar">
        <Link to="/home" className="sidebar-btn" title="Feed">
          <House className="icon" />
        </Link>
        <Link to="/MyComments" className="sidebar-btn" title="Mis Comentarios">
          <MessageSquare className='icon flipped' />
        </Link>

        <button
          className="sidebar-btn"
          title="Nuevo post"
          onClick={() => navigate("/NuevoPost")}
        >
          <Plus className='add-btn' />
        </button>

        <Link to="/likes" className="sidebar-btn" title="Me gusta recibidos">
          <Heart className="icon" />
        </Link>
        <Link to="/profile" className="sidebar-btn" title="Perfil">
          <UserRound className="icon" />
        </Link>
        
        {/* Botón de logout como icono (solo visible en móvil) */}
        <button 
          className="sidebar-btn" 
          title="Cerrar sesión"
          onClick={handleLogout}
        >
          <LogOut className="icon" />
        </button>
      </div>
    </>
  );
}