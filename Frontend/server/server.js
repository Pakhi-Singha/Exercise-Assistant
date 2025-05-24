import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://harshakumarsm:admin123@practicecluster.ieexw.mongodb.net/?retryWrites=true&w=majority&appName=PracticeCluster';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Trainer Schema
const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  availability: [{ type: String }],
  rating: { type: Number, default: 4.5 }
}, { timestamps: true });

// Define Booking Schema
const bookingSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  trainerName: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  sessionId: { type: String, required: true, unique: true },
  joinCode: { type: String, required: true },
  status: { type: String, enum: ['pending', 'booked', 'completed', 'cancelled'], default: 'booked' },
  isOneTimeOnly: { type: Boolean, default: true }
}, { timestamps: true });

// Create models
const Trainer = mongoose.model('Trainer', trainerSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Routes

// Get all trainers
app.get('/api/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trainer by ID
app.get('/api/trainers/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get booking by session ID
app.get('/api/bookings/session/:sessionId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ sessionId: req.params.sessionId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by user email
app.get('/api/bookings/user/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});