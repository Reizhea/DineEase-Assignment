'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import Link from 'next/link';

interface Booking {
  _id: string;
  name: string;
  contact: string;
  tableNumber: number;
  time: string;
  guestCount: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState('');
  const [displayedBookings, setDisplayedBookings] = useState<Booking[]>([]);
  const [showBookings, setShowBookings] = useState(false);

  const ADMIN_PASSWORD = 'admin';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      console.error('Incorrect admin password');
    }
  };

  const handleGetBookings = async () => {
    try {
      if (!selectedDate) {
        setError('Please select a date.');
        console.error('Date is not selected');
        return;
      }
  
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getBooking?date=${formattedDate}`
      );
  
      if (response.ok) {
        const data = await response.json();
        setDisplayedBookings(data.bookings || []);
        setShowBookings(true);
        setError('');
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch bookings:', errorText);
        setDisplayedBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Error fetching bookings.');
    }
  };
  

  const handleDeleteBooking = async (id: string) => {
    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteBooking/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setDisplayedBookings((prev) => prev.filter((booking) => booking._id !== id));
      } else {
        const errorText = await response.text();
        console.error('Failed to delete booking:', errorText);
        setError('Failed to delete booking.');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
          <div className="space-y-4">
            <FloatingLabelInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              onClick={handleLogin}
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
          Back to Home
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="flex justify-center items-center space-x-4 mb-6">
        <DatePicker date={selectedDate} setDate={setSelectedDate} />
        <Button
          onClick={handleGetBookings}
          className="bg-white text-black hover:bg-gray-100 h-12 px-6 rounded-md transition-all duration-300"
        >
          Get Bookings
        </Button>
      </div>

      {showBookings && (
        <div>
          <h2 className="text-center text-xl font-bold mb-4">
            Bookings for {selectedDate?.toISOString().split('T')[0] || 'Selected Date'}
          </h2>
          <div className="bg-background p-4 rounded-md">
            {displayedBookings.length === 0 ? (
              <p className="text-center text-muted-foreground">No bookings found.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">Name</th>
                    <th className="border-b py-2">Contact</th>
                    <th className="border-b py-2">Table</th>
                    <th className="border-b py-2">Time</th>
                    <th className="border-b py-2">Guests</th>
                    <th className="border-b py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="border-b py-2 px-4">{booking.name}</td>
                      <td className="border-b py-2 px-4">{booking.contact}</td>
                      <td className="border-b py-2 px-4">Table {booking.tableNumber}</td>
                      <td className="border-b py-2 px-4">{booking.time}</td>
                      <td className="border-b py-2 px-4">{booking.guestCount}</td>
                      <td className="border-b py-2 px-4">
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-500 border-red-500 hover:bg-red-100"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
