import { useState } from 'react'
import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from '../src/pages/Home'
import { AuthProvider } from '../src/context/AuthContext'

function App() {

 const [count, setCount] = useState(0)


  return (
    
    
   <AuthProvider>
    <Routes>

      <Route path="/" element={<Home />} />


    </Routes>
    </AuthProvider>
  
    
  );
}

export default App