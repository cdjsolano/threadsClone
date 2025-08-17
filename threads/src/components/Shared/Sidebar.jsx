// src/components/Layout/Sidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import "../../styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-btn" title="Feed">
        🏠
      </Link>
      <Link to="/profile" className="sidebar-btn" title="Perfil">
        👤
      </Link>
      <Link to="/my-comments" className="sidebar-btn" title="Mis Comentarios">
        💬
      </Link>
      <Link to="/likes" className="sidebar-btn" title="Me gusta recibidos">
        ❤️
      </Link>
      <button
        className="sidebar-btn add-btn"
        title="Nuevo post"
        onClick={() => navigate("/new-post")}
      >
        ➕
      </button>
    </div>
  );
}
