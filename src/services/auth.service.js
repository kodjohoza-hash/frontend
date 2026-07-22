import { mockLogin, mockRegister, mockLogout, mockGetProfile, mockForgotPassword, mockResetPassword, mockVerifyEmail, mockResendVerification } from '@mock/authService';

/**
 * BUS TIX CONNECT — Mock Auth Service
 * Drop-in replacement for the real authService.
 * Returns the same { data: ... } shape so useAuth hook works unchanged.
 *
 * When the real Express.js backend is ready, swap this file for the original
 * auth.service.js that uses axios — no other changes needed.
 */
const authService = {
  login: (credentials) => mockLogin(credentials),

  register: (data) => mockRegister(data),

  logout: () => mockLogout(),

  refresh: (refreshToken) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock_token_' + Date.now().toString(36),
            refreshToken: 'mock_refresh_' + Date.now().toString(36),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          },
        });
      }, 200);
    }),

  forgotPassword: (email) => mockForgotPassword(email),

  resetPassword: (data) => mockResetPassword(data),

  verifyEmail: (data) => mockVerifyEmail(data),

  resendVerification: (email) => mockResendVerification(email),

  getProfile: () => mockGetProfile(),

  updateProfile: (data) =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ data }), 300);
    }),

  changePassword: (data) =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ data: { message: 'Mot de passe modifié.' } }), 300);
    }),
};

export default authService;
