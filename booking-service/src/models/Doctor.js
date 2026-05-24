const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // auth-service user ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    specialization: {
      type: String,
      required: true,
      enum: ['General', 'Cardiology', 'Dermatology', 'Neurology',
             'Orthopedics', 'Pediatrics', 'Gynecology', 'ENT'],
    },
    availableDays: {
      type: [String],
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    timeSlots: {
      type: [String], // ["09:00-09:30", "09:30-10:00", ...]
      default: [],
    },
    fee: { type: Number, default: 500 },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);