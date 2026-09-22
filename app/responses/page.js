'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare, Phone, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';

export default function ResponsesPage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNumber, setShowNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchResponses() {
      try {
        const res = await api.getMyResponses(user._id);
        setResponses(res.data || []);
      } catch (err) {
        console.error('Failed to fetch responses:', err);
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated && user) fetchResponses();
  }, [isAuthenticated, user]);

  const handleShowNumber = async (belongsTo) => {
    try {
      const res = await api.getNumber(belongsTo);
      setPhoneNumber(res.data.number || res.data);
      setShowNumber(true);
    } catch (err) {
      console.error('Failed to get number:', err);
    }
  };

  const statusBadge = (response) => {
    if (response === 'Yes') return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Approved</span>;
    if (response === 'No') return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Rejected</span>;
    return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">In Review</span>;
  };

  if (authLoading) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Responses</h1>
        <p className="text-gray-500">Track your claims and responses</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : responses.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No responses yet</h3>
          <p className="text-gray-400 mt-1">Claim an item from the feed to see your responses here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((resp, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-400">Item ID: {resp.itemId}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatRelativeTime(resp.createdAt)}</p>
                </div>
                {statusBadge(resp.response)}
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase">Question</span>
                  <p className="text-gray-700">{resp.question}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase">Your Answer</span>
                  <p className="text-gray-700">{resp.answer}</p>
                </div>
              </div>
              {resp.response === 'Yes' && (
                <button
                  onClick={() => handleShowNumber(resp.belongsTo)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Show Contact Number
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Phone number modal */}
      {showNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNumber(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
            <button onClick={() => setShowNumber(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Number</h3>
            <p className="text-2xl font-bold text-primary-600">{phoneNumber}</p>
            <p className="text-sm text-gray-400 mt-2">Please contact the owner to arrange pickup</p>
          </div>
        </div>
      )}
    </div>
  );
}
