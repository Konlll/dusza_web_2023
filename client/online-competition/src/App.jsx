import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import AssignTasks from './routes/AssignTasks';
import AssignGroups from './routes/AssignGroups';
import Game from './routes/Game';
import Header from './components/Header';
import { roleContext } from './custom_hooks/roleContext';
import { useEffect, useState } from 'react';
import About from './routes/About';
import Results from './routes/Results';
import Settings from './routes/Settings'

function App() {

  const [role, setRole] = useState("")

  useEffect(() => {
    fetch('/api/settings', {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("access_token")}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        document.title = data.title
      })
      .catch(error => console.log(error))
  }, [])

  return (
    <>
      <BrowserRouter>
        <roleContext.Provider value={{ role, setRole }}>
          <Header />
          <Routes>
            <Route path='/' Component={Login} />
            <Route path='/register' element={<Protected roles={["ADMIN"]}><Register /></Protected>} />
            <Route path='/tasks' element={<Protected roles={["TEACHER"]}><Tasks /></Protected>} />
            <Route path='/dashboard' element={<Protected roles={["ADMIN", "TEACHER", "JUDGE", "STUDENT"]}><Dashboard /></Protected>} />
            <Route path='/intro' element={<Protected roles={["ADMIN", "STUDENT"]}><Intro /></Protected>} />
            <Route path='/create-intro' element={<Protected roles={["ADMIN"]}><IntroPage /></Protected>} />
            <Route path='/error' Component={ErrorPage} />
            <Route path='*' element={<ErrorPage errorValue={404} />} />
            <Route path='/activity' element={<Protected roles={["ADMIN"]}><Activity /></Protected>} />
            <Route path='/groups' element={<Protected roles={["ADMIN"]}><GroupList /></Protected>} />
            <Route path='/new-group' element={<Protected roles={["ADMIN"]}><NewGroup /></Protected>} />
            <Route path='/competitions/:id/tasks' element={<Protected roles={["JUDGE"]}><AssignTasks /></Protected>} />
            <Route path='/competitions/:id/groups' element={<Protected roles={["JUDGE"]}><AssignGroups /></Protected>} />
            <Route path='/competitions/:id/results' element={<Protected roles={["JUDGE"]}><Results /></Protected>} />
            <Route path='/competitions' element={<Protected roles={["JUDGE"]}><Competitions /></Protected>} />
            <Route path='/about' Component={About} />
            <Route path='/game' element={<Protected roles={["STUDENT"]}><Game /></Protected>} />
            <Route path='/settings' element={<Protected roles={["ADMIN"]}><Settings /></Protected>} />
          </Routes>
        </roleContext.Provider>
      </BrowserRouter>
    </>
  )
}

const Protected = ({ children, roles }) => {
  if (!localStorage.getItem("access_token") || !roles.includes(localStorage.getItem("role"))) {
    return <Navigate to="/" replace />;
  } else {
    return children;
  }
}

export default App
