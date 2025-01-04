'use client'

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GridPattern } from '@/components/ui/animated-background';
import { cn } from '@/lib/utils';
import { BookingProvider } from '@/context/BookingContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en" className="dark">
      <head>
        <title>DineEase</title>
        <meta name="description" content="Effortless table reservations with DineEase." />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <BookingProvider>
          <GridPattern
            width={90}
            height={90}
            x={-1}
            y={-1}
            strokeDasharray={'4 2'}
            className={cn(
              '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
            )}
          />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              </motion.div>
            ) : (
              <motion.main
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.main>
            )}
          </AnimatePresence>
        </BookingProvider>
      </body>
    </html>
  );
}
