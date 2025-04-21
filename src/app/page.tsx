'use client';

import Hero from '@/components/Hero';
import Features from '@/components/Features';
import About from '@/components/About';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <About />
    </main>
  );
} 