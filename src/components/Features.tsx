'use client';

import Link from 'next/link';
import { MapPinIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Features() {
  const features = [
    {
      icon: <AcademicCapIcon className="h-12 w-12 text-blue-600" />,
      title: 'Find a Coach',
      description: 'Connect with experienced tennis coaches in your area.',
      href: '/coach'
    },
    {
      icon: <UserGroupIcon className="h-12 w-12 text-blue-600" />,
      title: 'Meet Partners',
      description: 'Find tennis partners that match your skill level.',
      href: '/partners'
    },
    {
      icon: <MapPinIcon className="h-12 w-12 text-blue-600" />,
      title: 'Find Courts',
      description: 'Easily find and book tennis courts near you.',
      href: '/court'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Play Tennis
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            NextServe provides all the tools you need to enjoy tennis to the fullest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
