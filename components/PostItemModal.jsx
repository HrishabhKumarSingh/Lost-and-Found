'use client';

import { useState, useRef } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from './Toast';

export default function PostItemModal({ open, onClose }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('Lost');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const { addToast } = useToast();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !question) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('question', question);
      formData.append('type', type);
      formData.append('createdBy', user?._id || 'user_demo_1');
      images.forEach((img) => formData.append('itemPictures', img));

      await api.postItem(formData, (progressEvent) => {
        if (progressEvent.total) {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });

      addToast('Item posted successfully!', 'success');
      resetForm();
      onClose();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('itemPosted'));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to post item';
      addToast(typeof msg === 'string' ? msg : 'Failed to post item', 'error');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setName(''); setDescription(''); setQuestion('');
    setType('Lost'); setImages([]); setPreviews([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">Post an Item</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {['Lost', 'Found'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  type === t
                    ? t === 'Lost' ? 'bg-red-500 text-white shadow-sm' : 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t === 'Lost' ? 'I Lost It' : 'I Found It'}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Blue Backpack"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item in detail..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What color is the zipper?"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-400">This helps verify the rightful owner</p>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload photos</p>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {loading && progress > 0 && (
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</>
            ) : (
              'Post Item'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
