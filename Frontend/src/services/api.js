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

// Remove booking API

export default api;