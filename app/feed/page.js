'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, SearchX } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import ItemCard from '@/components/ItemCard';

export default function FeedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await api.getItems();
        setItems((res.data.postitems || []).reverse());
      } catch (err) {
        console.error('Failed to fetch items:', err);
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      fetchItems();
      const onPosted = () => fetchItems();
      window.addEventListener('itemPosted', onPosted);
      return () => window.removeEventListener('itemPosted', onPosted);
    }
  }, [isAuthenticated]);

  const filtered = items.filter((item) => {
    if (filter !== 'All' && item.type !== filter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (authLoading) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feed</h1>
        <p className="text-gray-500">Browse lost and found items in your community</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {['All', 'Lost', 'Found'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === f
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <SearchX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No items found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
