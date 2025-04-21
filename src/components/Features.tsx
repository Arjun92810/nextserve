'use client';

import { AcademicCapIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const features = [
  {
    icon: AcademicCapIcon,
    title: 'Find a Coach',
    description: 'Connect with experienced tennis coaches in your area.',
    href: '/coach'
  },
  {
    icon: UserGroupIcon,
    title: 'Meet Partners',
    description: 'Find tennis partners that match your skill level.',
    href: '/partners'
  },
  {
    icon: MapPinIcon,
    title: 'Find Courts',
    description: 'Easily find and book tennis courts near you.',
    href: '/court'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Play Tennis
          </h2>
          <p className="text-xl text-gray-600">
            NextServe provides all the tools you need to enjoy tennis to the fullest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link 
              key={feature.title} 
              href={feature.href}
              className="group p-8 bg-gradient-to-b from-[#c5d86d] via-[#b4c455] to-[#93a048] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#2d321c]/10 p-4 rounded-xl mb-6 group-hover:bg-[#2d321c]/20 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-[#2d321c]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#2d321c] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#2d321c]/90">
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
