'use client';

import Link from 'next/link';

export default function About() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            About NextServe
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            NextServe is revolutionizing how tennis enthusiasts connect with courts, coaches, and fellow players. 
            Our platform makes it easy to find and book tennis courts, connect with qualified coaches, 
            and meet players at your skill level.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Join Our Community
          </Link>
        </div>
      </div>
    </section>
  );
}
