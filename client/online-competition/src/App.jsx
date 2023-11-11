import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './routes/Login'
import Register from './routes/Register'
import Dashboard from "./components/Dashboard";
import Intro from "./routes/Intro";
import IntroPage from "./components/CreateIntroduction";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Login} />
          <Route path='/register' Component={Register} />
          <Route path='/dashboard' Component={ Dashboard} />
          <Route path='/intro' Component={ Intro} />
          <Route path='/create-intro' Component={IntroPage} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
