import { useState } from 'react'
import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from '../src/pages/Home'

function App() {

 const [count, setCount] = useState(0)


  return (
    
    <>

    <Routes>

      <Route path="/" element={<Home />} />


    </Routes>
    </>
  )
}

export default App