import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import GoogleAuth from './GoogleAuth';

const Login = () => {
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
        dispatch(login({ email: data.email, password: data.password }));
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl text-black font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label htmlFor="email" className="block bg-white text-gray-700">Email</label>
                <input
                type="text"
                id="email"
                className="w-full px-3 py-2 border bg-white border-gray-300 rounded mt-1"
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
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input
                type="password"
                id="password"
                className="w-full bg-white px-3 py-2 border border-gray-300 rounded mt-1"
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
                {loading ? 'Logging in...' : 'Submit'}
            </button>
            </form>
            <div className="mt-4 text-center">
            <GoogleAuth />
            </div>
            <div className="mt-4 text-center">
            <NavLink to="/forgot-password" className="text-blue-500 hover:underline">
                Forgot password?
            </NavLink>
            </div>
            <div className="mt-2 text-center">
            <NavLink to="/signup" className="text-blue-500 hover:underline">
                Don't have an account?
            </NavLink>
            </div>
        </div>
        </div>
    );
};

export default Login;
