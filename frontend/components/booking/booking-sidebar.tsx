'use client'

import { CheckCircle, User, Clock, Table } from 'lucide-react'
import { motion } from 'framer-motion'

interface BookingSidebarProps {
  step: number
  bookingData: {
    name: string
    date: string
    guests: string
    time: string
    table: string
  }
  onBack: () => void
}

export default function BookingSidebar({ step, bookingData, onBack }: BookingSidebarProps) {
  const steps = [
    { icon: User, label: 'Personal Details', data: `${bookingData.name} - ${bookingData.guests} guests` },
    { icon: Clock, label: 'Time Selection', data: `${bookingData.date} at ${bookingData.time}` },
    { icon: Table, label: 'Table Selection', data: bookingData.table },
  ]

  const getBackButtonText = () => {
    switch(step) {
      case 1:
        return '← Home'
      case 2:
        return '← Change Personal Details'
      case 3:
        return '← Change Time'
      default:
        return '← Back'
    }
  }

  return (
    <div className="w-full md:w-64 space-y-4 flex flex-col">
      <div className="space-y-1">
        <h3 className="font-medium">Booking Progress</h3>
        <p className="text-sm text-muted-foreground">Complete all steps to confirm your reservation</p>
      </div>
      
      <div className="space-y-4 flex-grow">
        {steps.map((s, index) => (
          <motion.div
            key={s.label}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`p-2 rounded-full ${step > index + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {step > index + 1 ? <CheckCircle size={20} /> : <s.icon size={20} />}
            </div>
            <div>
              <p className={`font-medium ${step === index + 1 ? "text-primary" : ""}`}>{s.label}</p>
              {step > index + 1 && (
                <p className="text-sm text-muted-foreground">
                  {s.data}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <button
  onClick={onBack}
  className="text-primary bg-transparent border-none cursor-pointer text-left pb-4"
>
  {getBackButtonText()}
</button>
    </div>
  )
}

