import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="relative min-h-screen">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/tennis-background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold text-black no-underline">
                NextServe
              </Link>
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-black no-underline hover:text-gray-700">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-black no-underline hover:text-gray-700">
                  Profile
                </Link>
                <Link to="/sign-in" className="text-black no-underline hover:text-gray-700">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center px-4 mt-20">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl font-bold text-black mb-4">
              Ace Your Game Here
            </h1>
            <p className="text-2xl text-black mb-8">
              Play More, Connect More, Grow Together.
            </p>
            <Link
              to="/get-started"
              className="text-black no-underline hover:text-gray-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* What You Can Do Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-black mb-12">
            What You Can Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Find a Coach</h3>
              <p className="text-lg text-black">
                Search experienced tennis coaches by skill and location.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Meet Partners</h3>
              <p className="text-lg text-black">
                Connect with players nearby based on your skill level.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Locate Courts</h3>
              <p className="text-lg text-black">
                Find and play on courts near you with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-black mb-8">About NextServe</h2>
          <div className="max-w-3xl">
            <p className="text-lg text-black mb-6">
              NextServe is revolutionizing the way tennis enthusiasts in North Jersey access courts, 
              connect with fellow players, and enhance their skills through coaching options. Our platform 
              aims to build a strong community of players, increase court availability, and offer coaching 
              services to elevate the overall tennis experience.
            </p>
            <p className="text-lg text-black">
              At NextServe, we are dedicated to providing a seamless tennis experience by offering a 
              user-friendly platform that simplifies court reservations, player networking, and coaching 
              arrangements. Our goal is to ensure every tennis enthusiast has the opportunity to enjoy 
              the sport to the fullest.
            </p>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-black mb-4">Join the NextServe Community</h2>
          <p className="text-lg text-black">
            Discover your next tennis partner, improve your game with top coaches, and explore the best courts around you.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8">
        <div className="max-w-7xl mx-auto px-4 text-black">
          © 2025 NextServe.
        </div>
      </footer>
    </div>
  );
} 