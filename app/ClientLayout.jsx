'use client';

import { useState } from 'react';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostItemModal from '@/components/PostItemModal';

export default function ClientLayout({ children }) {
  const [postModalOpen, setPostModalOpen] = useState(false);

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar onPostItem={() => setPostModalOpen(true)} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <PostItemModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />
      </ToastProvider>
    </AuthProvider>
  );
}
