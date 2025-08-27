import { useState, useEffect } from 'react'
import './App.css'
import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from '../src/pages/Home'
import { AuthProvider } from '../src/context/AuthContext'
import Loadingpage from './components/Shared/Loadingpage'
import { PostProvider } from './context/PostContext'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import CommentModal from './components/Shared/CommentModal'
import Sidebar from './components/Shared/Sidebar'
import MyComments from './components/Shared/MyComments'
import NuevoPost from './pages/NuevoPost'
import Login from './components/Shared/Login'
import FollowingPage from './pages/FollowingPage'
import "react-toastify/dist/ReactToastify.css";



function App() {
  const [count, setCount] = useState(0)
  const [showLoader, setShowLoader] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Mostrar el loader por 3 segundos
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);



  return (

    <>
      <AuthProvider>
        <PostProvider>
          {location.pathname !== "/" && location.pathname !== "/login" && <Sidebar />}
          <Routes>
            <Route path="/" element={<Loadingpage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/mycomments" element={<MyComments />} />
            <Route path="/nuevopost" element={<NuevoPost />} />
            <Route path="/following" element={<FollowingPage />} />
          </Routes>
          <CommentModal />
        </PostProvider>
      </AuthProvider>
    </>
  );
}

export default App