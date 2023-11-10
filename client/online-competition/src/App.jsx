import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './routes/Login'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Login} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
