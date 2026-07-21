import api from '@config/axios';

/**
 * BUS TIX CONNECT — Auth Service
 * API layer for authentication endpoints
 * Ready for Express.js backend integration
 */
const authService = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  register: (data) => {
    return api.post('/auth/register', data);
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  refresh: (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken });
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: (data) => {
    return api.post('/auth/reset-password', data);
  },

  verifyEmail: (data) => {
    return api.post('/auth/verify-email', data);
  },

  resendVerification: (email) => {
    return api.post('/auth/resend-verification', { email });
  },

  getProfile: () => {
    return api.get('/auth/profile');
  },

  updateProfile: (data) => {
    return api.put('/auth/profile', data);
  },

  changePassword: (data) => {
    return api.put('/auth/change-password', data);
  },
};

export default authService;
