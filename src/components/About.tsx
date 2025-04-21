'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#c5d86d] via-[#b4c455] to-[#93a048]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold text-[#2d321c] mb-8 text-center"
          >
            About NextServe
          </motion.h2>
          <div className="space-y-6 text-lg">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 text-[#2d321c]/90"
            >
              NextServe is revolutionizing the way tennis enthusiasts in North Jersey access courts, 
              connect with fellow players, and enhance their skills through coaching options. Our platform 
              aims to build a strong community of players, increase court availability, and offer coaching 
              services to elevate the overall tennis experience.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[#2d321c]/90"
            >
              At NextServe, we are dedicated to providing a seamless tennis experience by offering a 
              user-friendly platform that simplifies court reservations, player networking, and coaching 
              arrangements. Our goal is to ensure every tennis enthusiast has the opportunity to enjoy 
              the sport to the fullest.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
