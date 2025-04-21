'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen w-full font-['Helvetica_Neue',sans-serif]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/background.png"
          alt="Tennis court background"
          fill
          className="object-cover brightness-75"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight tracking-tight"
            >
              Ace Your Game Here
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl text-white/90 mb-12 font-light tracking-wide"
            >
              Play More, Connect More, Grow Together.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              <Link
                href="/signup"
                className="bg-[#0077CC] text-white px-12 py-4 rounded-full text-xl font-medium hover:bg-[#0066B3] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
