'use client';

import { useState } from 'react';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import PostItemModal from '@/components/PostItemModal';

export default function ClientLayout({ children }) {
  const [postModalOpen, setPostModalOpen] = useState(false);

  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar onPostItem={() => setPostModalOpen(true)} />
        <main className="min-h-screen">{children}</main>
        <PostItemModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />
      </ToastProvider>
    </AuthProvider>
  );
}
