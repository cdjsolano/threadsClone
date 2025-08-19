import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingGif from '../../assets/Threads_logo_header_4x5.gif';
import '../../styles/Loadingpages.css';

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // 🔹 Redirige al Login
    }, 4000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loader-container">
      <img src={loadingGif} alt="Cargando..." />
    </div>
  );
}
