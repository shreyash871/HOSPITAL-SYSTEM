const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/appointments', appointmentRoutes);
app.use('/doctors', doctorRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'booking-service', status: 'running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Booking service on port ${PORT}`));