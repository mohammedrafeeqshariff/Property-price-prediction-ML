'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/services/api';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setError('');
      const res = await api.post('/auth/login', data);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar">
      <div className="w-full max-w-md p-8 glass-panel space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-textMain">GymAdmin</h1>
          <p className="text-textMuted mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-primary outline-none"
              placeholder="admin@gym.com"
            />
            {errors.email && <p className="text-danger text-sm mt-1">{String(errors.email.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-primary outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-danger text-sm mt-1">{String(errors.password.message)}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white p-2.5 rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
