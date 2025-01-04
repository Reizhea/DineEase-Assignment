'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/health`
        );
        if (response.ok) {
          console.log('Backend is awake:', await response.json());
        } else {
          console.error('Failed to ping backend:', await response.text());
        }
      } catch (error) {
        console.error('Error pinging backend:', error);
      }
    };

    pingBackend();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* GitHub Link */}
      <Link
        href="https://github.com/Reizhea/DineEase"
        target="_blank"
        className="absolute top-4 left-4 transition-transform hover:scale-105"
      >
        <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20">
          <Github className="h-6 w-6" />
        </Button>
      </Link>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8 max-w-6xl"
      >
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold tracking-wide leading-tight text-shadow"
        >
          ELEVATE YOUR DINING
          <br />
          EXPERIENCE
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Indulge in culinary excellence with our effortless reservation system.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link href="/booking">
            <Button
              className="h-12 px-8 text-base font-medium bg-white text-black hover:bg-white/90 rounded-md transition-all duration-300 hover:scale-105"
            >
              BOOK NOW
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom Right Note */}
      <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
        The server may take a moment to initialize on the first request.
      </div>
    </div>
  );
}
