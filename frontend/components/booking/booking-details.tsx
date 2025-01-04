'use client'

import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { motion } from 'framer-motion';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { format, parse } from 'date-fns';

interface BookingDetailsProps {
  onSubmit: (data: any) => void;
  initialData: {
    name: string;
    contact: string;
    date: string;
    guests: string;
  };
}

export default function BookingDetails({ onSubmit, initialData }: BookingDetailsProps) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData.name,
      contact: initialData.contact,
      date: initialData.date ? parse(initialData.date, 'yyyy-MM-dd', new Date()) : undefined,
      guests: initialData.guests,
    },
  });

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleFormSubmit = (data: any) => {
    const formattedData = {
      ...data,
      date: data.date ? format(data.date, 'yyyy-MM-dd') : '',
      guests: parseInt(data.guests, 10),
    };
    onSubmit(formattedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <h2 className="text-3xl font-bold tracking-wide mb-6">Personal Details</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-grow">
        <div className="space-y-6 flex-grow">
          {/* Name Field */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <FloatingLabelInput
                  label="Full Name"
                  id="name"
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
            <Controller
              name="contact"
              control={control}
              rules={{
                required: 'Contact is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Contact must be a valid 10-digit number',
                },
              }}
              render={({ field }) => (
                <FloatingLabelInput
                  label="Contact Number"
                  id="contact"
                  type="tel"
                  error={errors.contact?.message}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field }) => (
                <DatePicker
                  date={field.value}
                  setDate={(date) => field.onChange(date)}
                  error={errors.date?.message}
                />
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <Controller
              name="guests"
              control={control}
              rules={{
                required: 'Number of guests is required',
                min: { value: 1, message: 'Minimum 1 guest required' },
                max: { value: 10, message: 'Maximum 10 guests allowed' },
              }}
              render={({ field }) => (
                <FloatingLabelInput
                  label="Number of Guests"
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  error={errors.guests?.message}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              )}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Button
            type="submit"
            className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-md transition-colors duration-300"
          >
            Next: Select Time
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
