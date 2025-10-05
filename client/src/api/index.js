// In client/src/api/index.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend URL
});

// Interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default api;