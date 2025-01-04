'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SummaryPage() {
  const [bookingData, setBookingData] = useState<any>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false); 
  const searchParams = useSearchParams();
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const bookingDataParam = searchParams.get('bookingData');
    if (bookingDataParam) {
      const parsedData = JSON.parse(decodeURIComponent(bookingDataParam));
      setBookingData(parsedData);

      if (!hasSubmitted.current) {
        confirmBooking(parsedData);
        hasSubmitted.current = true;
      }
    }
  }, [searchParams]);

  const confirmBooking = async (data: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createBooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          contact: data.contact,
          date: data.date,
          time: data.time,
          guestCount: data.guests,
          tableNumber: data.table.split(' ')[1],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsBookingConfirmed(true);
      } else {
        console.error('Failed to create booking:', await response.text());
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <Card className="max-w-md w-full glass-effect shadow-lg">
        <CardHeader className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.svg
              className="mx-auto h-16 w-16 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}
              />
              <motion.path
                d="M22 4L12 14.01l-3-3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 50 }}
              />
            </motion.svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CardTitle className="text-3xl font-bold tracking-wide">Booking Confirmed</CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
            <motion.div variants={itemVariants} className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{bookingData?.name || 'N/A'}</span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Contact</span>
              <span className="font-medium">{bookingData?.contact || 'N/A'}</span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{bookingData?.date || 'N/A'}</span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{bookingData?.time || 'N/A'}</span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-medium">{bookingData?.guests || 'N/A'}</span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Table</span>
              <span className="font-medium">{bookingData?.table || 'N/A'}</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/" className="block">
              <button className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-md transition-all duration-300 hover:scale-105">
                Return to Home
              </button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
