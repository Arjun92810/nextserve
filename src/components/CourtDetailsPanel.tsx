'use client';

import type { Court } from '@/types/court';

interface CourtDetailsPanelProps {
  court: Court;
  onClose: () => void;
}

export default function CourtDetailsPanel({ court, onClose }: CourtDetailsPanelProps) {
  return (
    <div className="fixed right-0 top-0 h-full w-[350px] bg-gradient-to-b from-[#c5d86d] via-[#b4c455] to-[#93a048] shadow-lg z-[9999] p-6 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-sm text-[#2d321c] hover:text-[#1a1e11] mb-4 float-right transition-colors"
        aria-label="Close"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-2 text-[#2d321c]">{court.name}</h2>
      <p className="text-[#2d321c]/90 mb-2">{court.description}</p>

      {court.contact && (
        <p className="text-sm text-[#2d321c] mb-1">
          Contact:{' '}
          <a
            href={`https://${court.contact}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#1a1e11] transition-colors"
          >
            {court.contact}
          </a>
        </p>
      )}

      <div className="mt-6">
        <button
          className="bg-[#2d321c] text-white px-4 py-2 rounded hover:bg-[#1a1e11] transition-colors shadow-md"
          onClick={() => alert("Booking flow coming soon!")}
        >
          Reserve This Court
        </button>
      </div>
    </div>
  );
}
