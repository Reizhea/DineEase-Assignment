'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BookingDetails from '@/components/booking/booking-details'
import TimeSelection from '@/components/booking/time-selection'
import TableSelection from '@/components/booking/table-selection'
import BookingSidebar from '@/components/booking/booking-sidebar'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    name: '',
    contact: '',
    date: '',
    guests: '',
    time: '',
    table: ''
  })
  const router = useRouter()

  const handleDetailsSubmit = (data: any) => {
    setBookingData({ ...bookingData, ...data })
    setStep(2)
  }

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time })
    setStep(3)
  }

  const handleTableSelect = (table: string) => {
    const finalBookingData = { ...bookingData, table };
    setBookingData(finalBookingData);
    router.push(`/summary?bookingData=${encodeURIComponent(JSON.stringify(finalBookingData))}`);
  };
  
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      if (step === 3) {
        setBookingData({ ...bookingData, time: '', table: '' })
      }
    } else {
      router.push('/')
    }
  }

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl glass-effect">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:space-x-10">
            <BookingSidebar step={step} bookingData={bookingData} onBack={handleBack} />
            <div className="md:w-2/3 flex flex-col h-[500px]">
              <div className="flex-grow overflow-y-auto mb-4">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="details"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <BookingDetails onSubmit={handleDetailsSubmit} initialData={bookingData} />
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div
                      key="time"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <TimeSelection 
                        date={bookingData.date} 
                        onSelect={handleTimeSelect}
                      />
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div
                      key="table"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <TableSelection 
                        time={bookingData.time}
                        guests={bookingData.guests}
                        date={bookingData.date}
                        onSelect={handleTableSelect}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

