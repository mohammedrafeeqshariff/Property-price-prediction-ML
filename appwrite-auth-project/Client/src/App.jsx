import Signup from './components/Signup/Signup'
import Login from './components/Login/Login.jsx'
import VerifyEmail from './components/Signup/VerifyEmail.jsx';
import {Route, Routes} from 'react-router-dom'

function App() {

  return (
    <>
    <Routes>
      <Route element={<Signup/>} path='/'/>
      <Route element={<Login/>} path='/login'/>
      <Route element={<VerifyEmail/>} path='/verifyEmail/:id'/>
    </Routes>
    </>
  )
}

export default App
