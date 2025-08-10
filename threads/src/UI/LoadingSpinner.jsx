import React from 'react';
import '../ui/LoadingSpinner.css'; // Archivo CSS modular

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="loading-spinner-container">
      <div className="spinner">
        <div className="spinner-sector spinner-sector-top"></div>
        <div className="spinner-sector spinner-sector-left"></div>
        <div className="spinner-blade"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}