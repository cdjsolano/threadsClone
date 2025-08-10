import { useState, useEffect } from 'react'
import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from '../src/pages/Home'
import { AuthProvider } from '../src/context/AuthContext'
import Loadingpage from './components/Profile/Loadingpage'
import { PostProvider } from './context/PostContext'
import Profile from './pages/Profile'
import CommentModal from './components/Shared/CommentModal'

function App() {
  const [count, setCount] = useState(0)
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Mostrar el loader por 3 segundos
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);



  return (


    <AuthProvider>
      <PostProvider>
      
        {showLoader ? (
          <Loadingpage /> // Muestra el gif
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Profile" element={<Profile />} />
            {/* Agrega otras rutas si las tienes */}
          </Routes>
        )}

        <CommentModal />
      </PostProvider>
    </AuthProvider>


  );
}

export default App