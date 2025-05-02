'use client';

export default function DebugPage() {
  return (
    <div className="p-4">
      <h1>Debug Environment Variables</h1>
      <pre>
        NEXT_PUBLIC_SITE_URL: {process.env.NEXT_PUBLIC_SITE_URL}
      </pre>
    </div>
  );
} 