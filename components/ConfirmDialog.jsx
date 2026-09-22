'use client';

import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${danger ? 'bg-red-100' : 'bg-primary-100'}`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-600' : 'text-primary-600'}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
