'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Dynamically import CourtMap without SSR (required for Leaflet)
const DynamicCourtMap = dynamic(() => import('@/components/CourtMap'), {
  ssr: false,
  loading: () => <div className="h-[calc(100vh-4rem)] bg-gray-100 animate-pulse" />
});

export default function CourtPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Tennis Courts
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location or court name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-[calc(100vh-12rem)]">
        <DynamicCourtMap searchQuery={searchQuery} />
      </div>
    </main>
  );
} 