const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const tables = require('../config/tables');

router.post('/createBooking', async (req, res) => {
  try {
    const { date, time, guestCount, name, contact, tableNumber } = req.body;

    const existingBooking = await Booking.findOne({ date, time, tableNumber, name });
    if (existingBooking) {
      return res.status(400).json({ message: 'Booking already exists' });
    }

    const newBooking = new Booking({ date, time, guestCount, name, contact, tableNumber });
    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error in /createBooking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

router.get('/getBookedTables', async (req, res) => {
  try {
    const { date, time } = req.query;

    const bookings = await Booking.find({ date, time }).select('tableNumber -_id');
    const bookedTableNumbers = bookings.map((b) => b.tableNumber);

    res.status(200).json({
      allTables: tables,
      bookedTables: bookedTableNumbers,
    });
  } catch (error) {
    console.error('Error fetching booked tables:', error.message);
    res.status(500).json({ message: 'Error fetching booked tables', error: error.message });
  }
});

router.get('/getBooking', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const bookings = await Booking.find({ date });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error in /getBooking:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

router.delete('/deleteBooking/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
  } catch (error) {
    console.error('Error in /deleteBooking:', error);
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Backend is awake and running!' });
});

module.exports = router;
