import { House, MessageSquare, Plus, Heart, UserRound } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import "../../styles/SideBar.css";
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, loading, loginWithGoogle, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // redirigir al login
  };

  return (
    <div className="sidebar">
      <div className='logo'>
        <picture><img src="/src/assets/Threads_icon.png" alt="Logo threads" /></picture>

      </div>


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
      <div className="footer">
        <button onClick={handleLogout} className="salida">
          Log Out
        </button>
      </div>

    </div>
  );
}
