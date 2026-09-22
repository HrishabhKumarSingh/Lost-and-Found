'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, Lock, Search, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Login failed. Please check your credentials.';
      addToast(typeof msg === 'string' ? msg : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-primary-300 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-0.5"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            <button
              type="button"
              onClick={async () => {
                setEmail('demo@example.com');
                setPassword('password123');
                setLoading(true);
                try {
                  await login('demo@example.com', 'password123');
                  addToast('Signed in as Demo User!', 'success');
                } catch (err) {
                  addToast('Demo sign-in failed', 'error');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full py-2.5 bg-primary-50 text-primary-700 font-medium text-sm rounded-xl hover:bg-primary-100 border border-primary-200 transition-colors flex items-center justify-center gap-2"
            >
              Quick Sign In with Demo Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
