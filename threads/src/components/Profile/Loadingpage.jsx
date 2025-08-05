import React from 'react';
import loadingGif from '../../assets/Threads_logo_header_4x5.gif';
import '../../styles/Loadingpages.css'

export default function LoadingPage() {
  return (
    <div className="loader-container">
      <img src={loadingGif} alt="Cargando..." />
    </div>
  );
}
