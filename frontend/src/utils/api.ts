import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; username: string; displayName?: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: Record<string, unknown>) => api.put('/users/me', data),
  getJourneyProgress: () => api.get('/users/me/journey'),
  dailyCheckIn: (data: { mood?: string; note?: string }) => api.post('/users/me/checkin', data),
};

// Location API
export const locationApi = {
  getNearby: (params: { lat: number; lng: number; type?: string; radius?: number }) =>
    api.get('/locations/nearby', { params }),
  getById: (id: string) => api.get(`/locations/${id}`),
  checkIn: (id: string, data: { note?: string; mood?: string; qrCodeScanned?: boolean }) =>
    api.post(`/locations/${id}/checkin`, data),
  getReviews: (id: string) => api.get(`/locations/${id}/reviews`),
  addReview: (id: string, data: { rating: number; title?: string; content?: string }) =>
    api.post(`/locations/${id}/reviews`, data),
};

// Reward API
export const rewardApi = {
  getAvailable: () => api.get('/rewards/available'),
  redeem: (id: string, locationId: string) => api.post(`/rewards/${id}/redeem`, { locationId }),
  validateQR: (qrCode: string, locationId: string) =>
    api.post('/rewards/qr/validate', { qrCode, locationId }),
  getHistory: (page?: number, limit?: number) =>
    api.get('/rewards/history', { params: { page, limit } }),
};

// Chat API
export const chatApi = {
  sendMessage: (message: string) => api.post('/chat/message', { message }),
  getHistory: (limit?: number) => api.get('/chat/history', { params: { limit } }),
  clearHistory: () => api.delete('/chat/clear'),
};

export default api;
