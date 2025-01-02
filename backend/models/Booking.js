const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    guestCount: { type: Number, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    tableNumber: { type: Number, required: true }, // Add tableNumber
  }, { timestamps: true });
  
  module.exports = mongoose.model('Booking', bookingSchema);
  