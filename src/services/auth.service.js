import api from '@config/axios';

const authService = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  register: (data) => {
    return api.post('/auth/register', data);
  },

  getProfile: () => {
    return api.get('/auth/profile');
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: (data) => {
    return api.post('/auth/reset-password', data);
  },
};

export default authService;
