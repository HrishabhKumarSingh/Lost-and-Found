'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, User, Mail, Phone, Lock, Search, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function SignupPage() {
  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', number: '', password: '', cpassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstname || !form.lastname || !form.email || !form.number || !form.password || !form.cpassword) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    if (form.password !== form.cpassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.signup(form);
      if (res.data === 'Done' || res.data?.message === 'Done') {
        addToast('Account created successfully! Please sign in.', 'success');
        router.push('/login');
      } else {
        const msg = res.data?.message || res.data || 'Signup failed';
        addToast(typeof msg === 'string' ? msg : 'Signup failed', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Signup failed. Please try again.';
      addToast(typeof msg === 'string' ? msg : 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputField = (label, field, type, icon, placeholder, toggleAction, isVisible) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">{icon}</div>
        <input
          type={toggleAction ? (isVisible ? 'text' : 'password') : type}
          value={form[field]}
          onChange={update(field)}
          placeholder={placeholder}
          className={`w-full pl-10 ${toggleAction ? 'pr-10' : 'pr-4'} py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
        />
        {toggleAction && (
          <button
            type="button"
            onClick={toggleAction}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-0.5"
            tabIndex={-1}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-primary-300 mt-1">Join the Lost & Found community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {inputField('First Name', 'firstname', 'text', <User className="w-4 h-4" />, 'John')}
              {inputField('Last Name', 'lastname', 'text', <User className="w-4 h-4" />, 'Doe')}
            </div>
            {inputField('Email', 'email', 'email', <Mail className="w-4 h-4" />, 'you@example.com')}
            {inputField('Phone Number', 'number', 'tel', <Phone className="w-4 h-4" />, '+91 9876543210')}
            {inputField('Password', 'password', 'password', <Lock className="w-4 h-4" />, '••••••••', () => setShowPassword(!showPassword), showPassword)}
            {inputField('Confirm Password', 'cpassword', 'password', <Lock className="w-4 h-4" />, '••••••••', () => setShowCPassword(!showCPassword), showCPassword)}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
