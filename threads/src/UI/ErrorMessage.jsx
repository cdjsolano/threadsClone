import React from 'react';
import '../UI/ErrorMessage.css'; // Archivo CSS modular

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Algo salió mal</h3>
      <p className="error-message">{error?.message || "Error desconocido"}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="error-retry-btn"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}