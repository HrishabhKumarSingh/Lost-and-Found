'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Package } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import ItemCard from '@/components/ItemCard';

export default function MyListingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await api.getMyListings(user._id);
        setItems((res.data || []).reverse());
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated && user) fetchListings();
  }, [isAuthenticated, user]);

  if (authLoading) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
        <p className="text-gray-500">Items you have posted</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No listings yet</h3>
          <p className="text-gray-400 mt-1">Post an item to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} showStatus />
          ))}
        </div>
      )}
    </div>
  );
}
