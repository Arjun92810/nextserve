import dynamic from 'next/dynamic';

// Dynamically import CourtMap without SSR (required for Leaflet)
const CourtMap = dynamic(() => import('../../../components/CourtMap'), {
  ssr: false,
});

export default function FindCourtPage() {
  return (
  <div className="h-screen w-screen">
      <CourtMap />
    </div>
  )
}
