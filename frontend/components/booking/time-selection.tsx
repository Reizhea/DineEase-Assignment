'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface TimeSelectionProps {
  date: string;
  onSelect: (time: string) => void;
}

export default function TimeSelection({ date, onSelect }: TimeSelectionProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00',
  ];

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col h-full"
    >
      <h2 className="text-3xl font-bold tracking-wide mb-4">Select Time</h2>
      <p className="text-lg text-muted-foreground mb-4">Date: {date}</p>

      <div className="flex-grow overflow-y-auto mb-4 space-y-4 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {timeSlots.map((time) => (
            <motion.div key={time} variants={itemVariants}>
              <Button
                variant={selectedTime === time ? 'default' : 'outline'}
                onClick={() => setSelectedTime(time)}
                className={`w-full h-12 ${
                  selectedTime === time
                    ? 'bg-white text-black'
                    : 'bg-white/5 border-white/20 hover:bg-white hover:text-black'
                } transition-colors duration-300`}
              >
                {time}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        variants={itemVariants}
        className="sticky bottom-0 py-4"
      >
        <Button
          onClick={() => selectedTime && onSelect(selectedTime)}
          disabled={!selectedTime}
          className="w-full h-12 bg-white text-black rounded-md transition-colors duration-300 hover:bg-gray-100"
        >
          Confirm Time
        </Button>
      </motion.div>
    </motion.div>
  );
}