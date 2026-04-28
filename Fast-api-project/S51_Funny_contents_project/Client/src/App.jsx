import { Route,Routes} from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
// import Landingpage from './components/landingpage'
// import Funny from './components/entity'
import Upload from './components/UploadData/Upload'
import About from './components/about/about'
import UserData from './components/ContentFolder/Content'
import Login from './components/Loginfolder/Login'
import Signup from './components/Signupfolder/Signup'
// import Logout from './components/Logoutfolder/Logout'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Update from './components/Updatefolder/Update'

function App() {

  return (
    <>
    <Navbar/>
     <Routes>
      <Route path="/" element={<UserData/>} />
      <Route path="/upload" element={<Upload />}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/update/:id" element={<Update/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path = "/signup" element={<Signup/>}/>
      {/* <Route path='/logout' element={<Logout/>}/> */}
    </Routes>
    <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </> 
  )
}

export default App
