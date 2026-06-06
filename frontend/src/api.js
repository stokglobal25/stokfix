import axios from 'axios';

const isCapacitor = window.location.protocol === 'file:';
const API_BASE = isCapacitor
  ? 'https://clause-with-logistics-rec.trycloudflare.com/api'
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stokfix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('stokfix_token');
      localStorage.removeItem('stokfix_user');
      if (window.location.protocol === 'file:') {
        window.location.hash = '#/';
      } else {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
