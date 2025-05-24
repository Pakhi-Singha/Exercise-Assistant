import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Trainer API
export const getTrainers = async () => {
  try {
    const response = await api.get('/trainers');
    return response.data;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
};

export const getTrainerById = async (id) => {
  try {
    const response = await api.get(`/trainers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trainer with ID ${id}:`, error);
    throw error;
  }
};

// Booking API
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBookingBySessionId = async (sessionId) => {
  try {
    const response = await api.get(`/bookings/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with session ID ${sessionId}:`, error);
    throw error;
  }
};

export const getUserBookings = async (email) => {
  try {
    const response = await api.get(`/bookings/user/${email}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for user ${email}:`, error);
    throw error;
  }
};

export default api;