const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const tables = require('../config/tables');

// Create a new booking
router.post('/createBooking', async (req, res) => {
  try {
    const { date, time, guestCount, name, contact, tableNumber } = req.body;

    // Check if the table is already booked
    const existingBooking = await Booking.findOne({ date, time, tableNumber });
    if (existingBooking) {
      return res.status(400).json({ message: 'Table already booked' });
    }

    // Create the booking
    const newBooking = new Booking({ date, time, guestCount, name, contact, tableNumber });
    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get all booked tables for a specific date and time
router.get('/getBookedTables', async (req, res) => {
    try {
      const { date, time } = req.query;
  
      // Fetch already booked tables for the given date and time
      const bookedTables = await Booking.find({ date, time }).select('tableNumber -_id');
      const bookedTableNumbers = bookedTables.map((b) => b.tableNumber);
  
      res.status(200).json({
        allTables: tables,
        bookedTables: bookedTableNumbers,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching booked tables', error: error.message });
    }
  });

// Get all bookings for a specific date
router.get('/getBooking', async (req, res) => {
  try {
    const { date } = req.query;

    // Fetch bookings for the specified date
    const bookings = await Booking.find({ date });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Delete a booking by ID
router.delete('/deleteBooking/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the booking
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

module.exports = router;
