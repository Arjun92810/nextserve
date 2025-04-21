'use client';

import type { Court } from '@/types/court';

interface CourtDetailsPanelProps {
  court: Court;
  onClose: () => void;
}

export default function CourtDetailsPanel({ court, onClose }: CourtDetailsPanelProps) {
  return (
    <div className="fixed right-0 top-0 h-full w-[350px] bg-white shadow-lg z-[9999] p-6 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-sm text-gray-500 hover:text-black mb-4 float-right"
        aria-label="Close"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-2">{court.name}</h2>
      <p className="text-gray-700 mb-2">{court.description}</p>

      {court.contact && (
        <p className="text-sm text-green-700 mb-1">
          Contact:{' '}
          <a
            href={`https://${court.contact}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {court.contact}
          </a>
        </p>
      )}

      <div className="mt-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => alert("Booking flow coming soon!")}
        >
          Reserve This Court
        </button>
      </div>
    </div>
  );
}
