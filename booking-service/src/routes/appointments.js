const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper: notify the notification service
const sendNotification = async (type, data) => {
  try {
    await axios.post(`${process.env.NOTIFICATION_URL}/notify`, { type, data });
  } catch (e) {
    console.error('Notification failed:', e.message);
  }
};

// ─── POST /appointments  (patient only) ───────────────────────
router.post(
  '/',
  protect,
  authorize('patient'),
  [
    body('doctorId').notEmpty(),
    body('date').isISO8601().withMessage('Valid date required'),
    body('timeSlot').notEmpty(),
    body('reason').optional().isLength({ max: 500 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { doctorId, date, timeSlot, reason } = req.body;

      const appointment = await Appointment.create({
        patientId: req.user.id,
        patientName: req.user.name,
        patientEmail: req.user.email,
        doctorId,
        date: new Date(date),
        timeSlot,
        reason,
      });

      await appointment.populate('doctorId', 'name specialization');

      // Notify patient + doctor
      sendNotification('APPOINTMENT_BOOKED', {
        patientEmail: req.user.email,
        patientName: req.user.name,
        doctorName: appointment.doctorId.name,
        date,
        timeSlot,
      });

      res.status(201).json({ success: true, appointment });
    } catch (err) {
      if (err.code === 11000)
        return res.status(409).json({ success: false, message: 'Slot already booked' });
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── GET /appointments/my  (patient: own appointments) ────────
router.get('/my', protect, authorize('patient'), async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user.id })
    .populate('doctorId', 'name specialization fee')
    .sort({ date: -1 });
  res.json({ success: true, count: appointments.length, appointments });
});

// ─── GET /appointments/doctor  (doctor: their appointments) ───
router.get('/doctor', protect, authorize('doctor'), async (req, res) => {
  const appointments = await Appointment.find({ 'doctorId.userId': req.user.id })
    .sort({ date: 1 });
  res.json({ success: true, appointments });
});

// ─── PATCH /appointments/:id/status  (doctor/admin) ───────────
router.patch('/:id/status', protect, authorize('doctor', 'admin'), async (req, res) => {
  const { status, notes, prescription } = req.body;
  const allowed = ['confirmed', 'cancelled', 'completed'];

  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });

  const appt = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status, notes, prescription },
    { new: true }
  ).populate('doctorId', 'name');

  if (!appt)
    return res.status(404).json({ success: false, message: 'Appointment not found' });

  sendNotification('STATUS_CHANGED', {
    patientEmail: appt.patientEmail,
    status,
    doctorName: appt.doctorId.name,
    date: appt.date,
  });

  res.json({ success: true, appointment: appt });
});

// ─── DELETE /appointments/:id  (patient cancels own) ──────────
router.delete('/:id', protect, authorize('patient'), async (req, res) => {
  const appt = await Appointment.findOne({ _id: req.params.id, patientId: req.user.id });
  if (!appt)
    return res.status(404).json({ success: false, message: 'Not found or not yours' });

  if (appt.status === 'completed')
    return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });

  await appt.deleteOne();
  res.json({ success: true, message: 'Appointment cancelled' });
});

// ─── GET /appointments  (admin: all) ──────────────────────────
router.get('/', protect, authorize('admin'), async (req, res) => {
  const { status, date } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (date) filter.date = { $gte: new Date(date), $lt: new Date(date + 'T23:59:59') };

  const appointments = await Appointment.find(filter)
    .populate('doctorId', 'name specialization')
    .sort({ date: -1 });
  res.json({ success: true, count: appointments.length, appointments });
});

module.exports = router;