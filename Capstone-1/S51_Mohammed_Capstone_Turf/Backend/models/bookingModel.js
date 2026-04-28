const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'turfUpload',
    required: true
  },
  userId: {
    type: String, // Appwrite User ID
    required: true
  },
  bookingDate: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  timeSlot: {
    start: {
      type: String, // Format: HH:mm
      required: true
    },
    end: {
      type: String, // Format: HH:mm
      required: true
    }
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, { timestamps: true });

// Prevent duplicate bookings for the same turf, date, and slot
bookingSchema.index({ turfId: 1, bookingDate: 1, 'timeSlot.start': 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
