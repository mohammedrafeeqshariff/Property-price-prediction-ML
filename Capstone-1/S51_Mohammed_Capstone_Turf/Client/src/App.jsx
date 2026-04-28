import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { account } from './components/appwriteConfig';
import { setUser } from './features/auth/authSlice';
import API from './services/api';

// Page Imports
import Start from './components/Start';
import Signup from './components/Signup';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import UserConsole from './components/userConsole/UserConsole';
import MyBookings from './components/MyBookings';
import OwnerConsole from './components/ownerConsole/OwnerConsole';
import SelectedTurf from './components/SelectedTurf';
import AiChatBot from './components/AiChatBot';
import Profile from './components/Profile';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const appwriteUser = await account.get();
        if (appwriteUser) {
          // 1. Get a fresh JWT from Appwrite
          const jwtResponse = await account.createJWT();
          const token = jwtResponse.jwt;
          localStorage.setItem('token', token);

          // 2. Fetch profile from MongoDB
          const response = await API.get('/auth/me');
          if (response.data.success) {
            dispatch(setUser(response.data.user));
          } else {
            // Appwrite session exists but MongoDB user doesn't or sync failed
            await account.deleteSession('current');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        // Appwrite account.get() throws a 401 code if no session exists
        localStorage.removeItem('token');
      }
    };
    checkSession();
  }, [dispatch]);

  return (
    <div className="App bg-[#0B0E14] min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/userHome" element={<PrivateRoute><UserConsole /></PrivateRoute>} />
        <Route path="/myBookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/ownerHome" element={<PrivateRoute><OwnerConsole /></PrivateRoute>} />
        <Route path="/selectedTurf/:id" element={<PrivateRoute><SelectedTurf /></PrivateRoute>} />
        <Route path="/AiChatBot" element={<PrivateRoute><AiChatBot /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
