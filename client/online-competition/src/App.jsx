import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './routes/Login'
import Register from './routes/Register'
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Login} />
          <Route path='/register' Component={Register} />
          <Route path='/dashboard' Component={ Dashboard} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
