import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './routes/Login'
import Register from './routes/Register'
import Dashboard from "./components/Dashboard";
import Tasks from './routes/Tasks';
import Intro from "./routes/Intro";
import IntroPage from "./components/CreateIntroduction";
import ErrorPage from './components/Error';
import Activity from './routes/Activity';
import GroupList from './routes/GroupList';
import NewGroup from './routes/NewGroup';
import Competitions from './routes/Competitions';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Login} />
          <Route path='/register' Component={Register} />
          <Route path='/tasks' Component={Tasks} />
          <Route path='/dashboard' Component={Dashboard} />
          <Route path='/intro' Component={Intro} />
          <Route path='/create-intro' Component={IntroPage} />
          <Route path='/error' Component={ErrorPage} />
          <Route path='*' element={<ErrorPage errorValue={404}/>} />
          <Route path='/activity' Component={Activity} />
          <Route path='/groups' Component={GroupList} />
          <Route path='/new-group' Component={NewGroup} />
          <Route path='/competitions' Component={Competitions} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
