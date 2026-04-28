import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import GoogleAuth from './GoogleAuth';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
        if (user?.role === 'owner') navigate('/ownerHome');
        else navigate('/userHome');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = (data) => {
    dispatch(signup({ 
        email: data.email, 
        password: data.password, 
        name: data.name, 
        role: data.role 
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your name"
              {...register('name', { required: 'Name is mandatory' })}
            />
            {errors.name && <p className="text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="text"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              placeholder="Enter email"
              {...register('email', {
                required: 'Email is mandatory',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email pattern'
                }
              })}
            />
            {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">I am a...</label>
            <select
              id="role"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1 bg-white"
              {...register('role', { required: 'Role is mandatory' })}
            >
              <option value="user">Player / User</option>
              <option value="owner">Turf Owner</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              placeholder="Enter password"
              {...register('password', {
                required: 'Password is mandatory',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
            />
            {errors.password && <p className="text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
          >
            {loading ? 'Creating Account...' : 'Submit'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <GoogleAuth />
        </div>
        <NavLink to="/login" className="block text-center text-blue-500 mt-4">Already a user? Login</NavLink>
      </div>
    </div>
  );
};

export default Signup;
