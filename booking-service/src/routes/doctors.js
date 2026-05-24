const express = require('express');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── GET /doctors  (public) ────────────────────────────────────
router.get('/', async (req, res) => {
  const { specialization } = req.query;
  const filter = { isActive: true };
  if (specialization) filter.specialization = specialization;

  const doctors = await Doctor.find(filter).select('-userId');
  res.json({ success: true, count: doctors.length, doctors });
});

// ─── GET /doctors/:id/slots  (check available slots for a date) ─
router.get('/:id/slots', async (req, res) => {
  const { date } = req.query;
  if (!date)
    return res.status(400).json({ success: false, message: 'Date query param required' });

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor)
    return res.status(404).json({ success: false, message: 'Doctor not found' });

  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  if (!doctor.availableDays.includes(dayName))
    return res.json({ success: true, availableSlots: [], message: 'Doctor not available on this day' });

  // Get already-booked slots
  const booked = await Appointment.find({
    doctorId: req.params.id,
    date: { $gte: new Date(date), $lt: new Date(date + 'T23:59:59') },
    status: { $ne: 'cancelled' },
  }).select('timeSlot');

  const bookedSlots = booked.map(a => a.timeSlot);
  const availableSlots = doctor.timeSlots.filter(s => !bookedSlots.includes(s));

  res.json({ success: true, availableSlots, bookedSlots });
});

// ─── POST /doctors  (admin registers a doctor profile) ─────────
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { userId, name, email, specialization, availableDays, timeSlots, fee } = req.body;
  const doctor = await Doctor.create({ userId, name, email, specialization, availableDays, timeSlots, fee });
  res.status(201).json({ success: true, doctor });
});

module.exports = router;