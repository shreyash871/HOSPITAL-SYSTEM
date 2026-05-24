const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String, // User ID from auth-service
      required: true,
      index: true,
    },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },

    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String, // e.g. "10:00-10:30"
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    reason: {
      type: String,
      maxlength: 500,
    },
    notes: {
      type: String, // Doctor's notes (after appointment)
    },
    prescription: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent double-booking: unique constraint on doctor + date + slot
appointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);