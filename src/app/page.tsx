'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CoopIcon, ProfileIcon } from '@/components/Icons';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isLogin
            ? { email: formData.email, password: formData.password }
            : formData
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-6 sm:gap-8 lg:grid-cols-2">
        <section className="hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-sm lg:block">
          <div className="mb-8 inline-flex rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm">
            <CoopIcon size={34} />
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
            Poultry Farm Manager
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Track production, health, feed, medications, and financials in one premium dashboard.
          </p>
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm">
              Real-time farm analytics and performance overview
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm">
              Structured records with export-ready farm data
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm">
              Clean, readable interface optimized for daily use
            </div>
          </div>
        </section>

        <section className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8 sm:shadow-md">
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 lg:hidden">
            <div className="mb-3 inline-flex rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3 text-emerald-700 shadow-sm">
              <CoopIcon size={20} />
            </div>
            <p className="mb-1 text-xl font-bold text-slate-900">Poultry Farm Manager</p>
            <p className="text-sm font-medium text-slate-600">Your complete farm management solution</p>
          </div>

          <div className="mb-8 flex items-center gap-4 sm:mb-10">
            <span className="inline-flex rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3 text-emerald-700">
              <ProfileIcon size={24} />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {isLogin ? 'Welcome back' : 'Join us'}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {isLogin ? 'Access your farm dashboard' : 'Start your farm journey'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 font-semibold text-white shadow-md transition duration-300 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg active:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processing...
              </span>
            ) : isLogin ? 'Sign in' : 'Create Account'}
          </button>
        </form>

          <div className="mt-8 flex items-center gap-3 sm:mt-10">
            <div className="flex-1 border-t border-slate-200"></div>
            <p className="text-sm text-slate-600">or</p>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div className="mt-8 text-center">
          <p className="text-sm text-slate-700">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', name: '' });
              }}
              className="font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        </section>
      </div>
    </div>
  );
}


