'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Table {
  number: number;
}

interface TableSelectionProps {
  time: string;
  guests: string;
  date: string;
  onSelect: (table: string) => void;
}

export default function TableSelection({ time, guests, date, onSelect }: TableSelectionProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [bookedTables, setBookedTables] = useState<number[]>([]);

  useEffect(() => {
    const fetchTablesData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getBookedTables?date=${date}&time=${time}`
        );

        if (response.ok) {
          const data = await response.json();

          setTables(data.allTables);
          setBookedTables(data.bookedTables);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch table data:', errorText);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchTablesData();
  }, [time]);

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-3xl font-bold tracking-wide mb-6">Select Table</h2>
      <div className="space-y-2 mb-6">
        <p className="text-lg text-muted-foreground">Time: {time}</p>
        <p className="text-lg text-muted-foreground">Guests: {guests}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {tables.map((table: Table) => {
          const isBooked = bookedTables.includes(table.number);

          return (
            <motion.div key={table.number} variants={itemVariants}>
              <Button
                variant={selectedTable === `Table ${table.number}` ? 'default' : 'outline'}
                disabled={isBooked}
                onClick={() => !isBooked && setSelectedTable(`Table ${table.number}`)}
                className={`w-full h-12 ${
                  isBooked
                    ? 'text-white cursor-not-allowed'
                    : selectedTable === `Table ${table.number}`
                    ? 'bg-white text-black'
                    : 'bg-white/5 border-white/20 hover:bg-white hover:text-black'
                } transition-colors duration-300`}
              >
                Table {table.number}
              </Button>
            </motion.div>
          );
        })}
      </div>
      <motion.div variants={itemVariants}>
        <Button
          onClick={() => selectedTable && onSelect(selectedTable)}
          disabled={!selectedTable}
          className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-md transition-colors duration-300"
        >
          Confirm Table
        </Button>
      </motion.div>
    </motion.div>
  );
}
