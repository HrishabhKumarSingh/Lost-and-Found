'use client';

import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { formatRelativeTime, truncateText } from '@/lib/utils';

export default function ItemCard({ item, showStatus = false }) {
  const isLost = item.type === 'Lost';

  return (
    <Link href={`/item/${item._id}`}>
      <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {item.itemPictures && item.itemPictures.length > 0 ? (
            <img
              src={
                item.itemPictures[0].img?.startsWith('http')
                  ? item.itemPictures[0].img
                  : `https://lost-and-found-system.s3.amazonaws.com/${item.itemPictures[0].img}`
              }
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <MapPin className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
              isLost ? 'bg-red-500' : 'bg-emerald-500'
            }`}>
              {item.type}
            </span>
          </div>
          {showStatus && (
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                item.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {item.status ? 'Active' : 'Inactive'}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-gray-500 text-sm mb-3">
            {truncateText(item.description, 80)}
          </p>
          <div className="flex items-center text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {formatRelativeTime(item.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}
