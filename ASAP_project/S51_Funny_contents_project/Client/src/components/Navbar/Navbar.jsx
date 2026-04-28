import './navbar.css';
import logo from './Meemos_transparent.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';


const Navbar = () => {
  const  navigate = useNavigate()
  const signedInCookie = Cookies.get('name')

  const handleEnterLogin = ()=>{
    if(!signedInCookie){
      navigate('/login')
    }
    else{
      toast.error("Already signedIn")
    }
  }

  const handleEnterSignup = ()=>{
    if(!signedInCookie){
      navigate('/signup')
    }
    else{
      toast.error("Already signedIn")
    }
  }

  const handleEnterLogout = () => {
    if (signedInCookie) {
      Cookies.remove('name');
      Cookies.remove('authToken')
      toast.success("Logged out successfully");
      navigate('/'); 
    } else {
      toast.error("You are not logged in");
    }
  };

  const handleEnterUpload = () =>{
    if (signedInCookie){
      navigate("/upload")
    }else {
      toast.error("signup or login to upload");
    }
  }

  return (
    <div className='nav_container'>
      <NavLink to='/'><img className="logo" src={logo} alt="LOGO" /></NavLink>
      <div className='buttons'>
        <h2 style={{ textDecoration: 'none', cursor:"pointer" }} onClick={handleEnterUpload}>Upload</h2>
        <NavLink to="/" style={{ textDecoration: 'none' }} ><h2><IoHome className='home_icon'/>Home</h2></NavLink>       
        <NavLink to="/About" style={{ textDecoration: 'none' }} ><h2>About</h2></NavLink>
        <h2 style={{ textDecoration: 'none', cursor:"pointer" }} onClick={handleEnterSignup}>Signup</h2>
        <h2 style={{ textDecoration: 'none', cursor:"pointer" }} onClick={handleEnterLogin}>Login</h2>
        <h2 style={{ textDecoration: 'none', cursor:"pointer" }} onClick={handleEnterLogout}>Logout</h2>
        <h2>{signedInCookie && signedInCookie != undefined && (<h3 style={{ color: "black", display:"flex" , alignItems:"center", gap:"5px" }} ><CgProfile style={{fontSize:"30px"}}/> {signedInCookie}</h3>)}</h2>
      </div>
    </div>
  );
};

export default Navbar;
