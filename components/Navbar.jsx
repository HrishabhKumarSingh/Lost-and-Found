'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Plus, LogOut, Package, MessageSquare, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar({ onPostItem }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout, loading } = useAuth();
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/signup') return null;

  const navLink = (href, label, icon) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">LostFound</span>
          </Link>

          {!loading && (
            <>
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                {isAuthenticated ? (
                  <>
                    {navLink('/feed', 'Feed', <LayoutGrid className="w-4 h-4" />)}
                    {navLink('/my-listings', 'My Listings', <Package className="w-4 h-4" />)}
                    {navLink('/responses', 'Responses', <MessageSquare className="w-4 h-4" />)}
                    <button
                      onClick={onPostItem}
                      className="flex items-center gap-2 ml-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Post Item
                    </button>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 ml-2 px-3 py-2 text-gray-500 hover:text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                      Log in
                    </Link>
                    <Link href="/signup" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                      Sign up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2 space-y-1">
            {isAuthenticated ? (
              <>
                {navLink('/feed', 'Feed', <LayoutGrid className="w-4 h-4" />)}
                {navLink('/my-listings', 'My Listings', <Package className="w-4 h-4" />)}
                {navLink('/responses', 'Responses', <MessageSquare className="w-4 h-4" />)}
                <button
                  onClick={() => { onPostItem?.(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Post Item
                </button>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
                <Link href="/signup" className="block px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
