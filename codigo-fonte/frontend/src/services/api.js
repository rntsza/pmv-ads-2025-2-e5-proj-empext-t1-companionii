import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  config => {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        console.error('Error parsing auth token:', e);
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // TODO: sem refresh token por enquanto
        // const raw = localStorage.getItem('auth-storage');
        // if (raw) {
        //   const parsed = JSON.parse(raw);
        //   const refreshToken = parsed?.state?.refreshToken;
        //   if (refreshToken) {
        //     const resp = await api.post('/auth/refresh', { refreshToken });
        //     const { token, refreshToken: newRefreshToken } = resp.data;
        //     parsed.state.token = token;
        //     parsed.state.refreshToken = newRefreshToken;
        //     localStorage.setItem('auth-storage', JSON.stringify(parsed));
        //     originalRequest.headers.Authorization = `Bearer ${token}`;
        //     return api(originalRequest);
        //   }
        // }
      } catch {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const handleApiError = error => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || data?.error || 'An error occurred';
    switch (status) {
      case 400:
        throw new Error(message || 'Invalid request data');
      case 401:
        throw new Error('Invalid credentials');
      case 403:
        throw new Error('Access denied');
      case 404:
        throw new Error('Resource not found');
      case 409:
        throw new Error(message || 'Resource already exists');
      case 422:
        throw new Error(message || 'Validation failed');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(message || 'Something went wrong');
    }
  } else if (error.request) {
    throw new Error('Network error. Please check your connection.');
  } else {
    throw new Error(error.message || 'Something went wrong');
  }
};
