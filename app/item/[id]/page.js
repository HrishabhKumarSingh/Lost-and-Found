'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Trash2, Edit3, RefreshCw, CheckCircle, XCircle, Send, ChevronLeft, X } from 'lucide-react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { useToast } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatRelativeTime } from '@/lib/utils';

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [item, setItem] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editQuestion, setEditQuestion] = useState('');
  const [editType, setEditType] = useState('Lost');

  const isOwner = user && item && item.createdBy === user._id;
  const alreadyAnswered = answers.some((a) => a.givenBy === user?._id);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await api.getItem(id);
        const itemData = res.data.Item?.[0] || res.data.Item || res.data;
        setItem(itemData);
        setAnswers(res.data.Answers || []);
        setEditName(itemData.name || '');
        setEditDesc(itemData.description || '');
        setEditQuestion(itemData.question || '');
        setEditType(itemData.type || 'Lost');
      } catch (err) {
        console.error('Failed to fetch item:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.deleteItem(id);
      addToast('Item deleted', 'success');
      router.push('/my-listings');
    } catch (err) {
      addToast('Failed to delete item', 'error');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', editName);
      formData.append('description', editDesc);
      formData.append('question', editQuestion);
      formData.append('type', editType);
      formData.append('createdBy', item.createdBy);
      if (item.itemPictures) {
        formData.append('olditemPictures', JSON.stringify(item.itemPictures));
      }
      await api.editItem(formData);
      addToast('Item updated', 'success');
      setShowEdit(false);
      window.location.reload();
    } catch (err) {
      addToast('Failed to update item', 'error');
    }
  };

  const handleReactivate = async () => {
    try {
      await api.activateItem(id);
      addToast('Item reactivated', 'success');
      window.location.reload();
    } catch (err) {
      addToast('Failed to reactivate item', 'error');
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) { addToast('Please enter your answer', 'error'); return; }
    setSubmitting(true);
    try {
      await api.submitAnswer({
        itemId: id,
        question: item.question,
        answer,
        givenBy: user._id,
        belongsTo: item.createdBy,
      });
      addToast('Answer submitted!', 'success');
      setShowClaim(false);
      setAnswer('');
      window.location.reload();
    } catch (err) {
      addToast('Failed to submit answer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModerate = async (messageId, response) => {
    try {
      await api.confirmResponse(messageId, response);
      addToast(response === 'Yes' ? 'Answer approved' : 'Answer rejected', 'success');
      window.location.reload();
    } catch (err) {
      addToast('Failed to moderate', 'error');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Item not found</h2>
        <button onClick={() => router.push('/feed')} className="mt-4 text-primary-600 hover:underline">Back to Feed</button>
      </div>
    );
  }

  const isLost = item.type === 'Lost';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image carousel */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {item.itemPictures && item.itemPictures.length > 0 ? (
            <Carousel showThumbs={false} showStatus={false} infiniteLoop className="item-carousel">
              {item.itemPictures.map((pic, i) => (
                <div key={i} className="h-80">
                  <img
                    src={
                      pic.img?.startsWith('http')
                        ? pic.img
                        : `https://lost-and-found-system.s3.amazonaws.com/${pic.img}`
                    }
                    alt={item.name}
                    className="w-full h-full object-contain bg-gray-50"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="h-80 flex items-center justify-center bg-gray-50 text-gray-300">
              No images
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${isLost ? 'bg-red-500' : 'bg-emerald-500'}`}>
              {item.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {item.status ? 'Active' : 'Inactive'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{item.name}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
          <p className="text-sm text-gray-400 mb-6">Posted {formatRelativeTime(item.createdAt)}</p>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              {!item.status && (
                <button onClick={handleReactivate} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors">
                  <RefreshCw className="w-4 h-4" /> Reactivate
                </button>
              )}
            </div>
          )}

          {/* Claim button for non-owners */}
          {!isOwner && isAuthenticated && (
            <button
              onClick={() => setShowClaim(true)}
              disabled={alreadyAnswered}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {alreadyAnswered ? 'Already Submitted' : isLost ? 'I Found This' : 'This is Mine'}
            </button>
          )}

          {/* Answers (owner only) */}
          {isOwner && answers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Responses ({answers.length})</h3>
              <div className="space-y-3">
                {answers.map((a, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Answer: <span className="text-gray-800 font-medium">{a.answer}</span></p>
                    <p className="text-xs text-gray-400 mb-3">{formatRelativeTime(a.createdAt)}</p>
                    {a.response === 'Moderation' ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleModerate(a._id, 'Yes')} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleModerate(a._id, 'No')} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${a.response === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.response === 'Yes' ? 'Approved' : 'Rejected'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        danger
      />

      {/* Claim modal */}
      {showClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowClaim(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <button onClick={() => setShowClaim(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Question</h3>
            <p className="text-gray-600 mb-4 p-3 bg-primary-50 rounded-xl text-sm">{item.question}</p>
            <form onSubmit={handleClaimSubmit}>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEdit(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowEdit(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Item</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
                <input type="text" value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <button type="submit" className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
