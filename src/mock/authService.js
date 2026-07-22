import { ROLE_PERMISSIONS } from '@utils/permissions';
import { getRoleDashboard } from '@utils/roles';

let registeredUsers = [];

export function findUserByEmail(email) {
  return [...MOCK_USERS, ...registeredUsers].find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserById(id) {
  return [...MOCK_USERS, ...registeredUsers].find((u) => u.id === id);
}

import MOCK_USERS from './users';

function generateToken() {
  return 'mock_token_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateRefreshToken() {
  return 'mock_refresh_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function buildUserResponse(user) {
  const { password, ...safeUser } = user;
  return {
    ...safeUser,
    permissions: ROLE_PERMISSIONS[user.role] || [],
  };
}

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorResponse(message, status = 400) {
  const err = new Error(message);
  err.response = { data: { message }, status };
  err.status = status;
  throw err;
}

export async function mockLogin({ email, password }) {
  await delay(500 + Math.random() * 400);

  const user = findUserByEmail(email);
  if (!user) {
    errorResponse('Compte introuvable. Aucun compte ne correspond à cet email.', 404);
  }

  if (user.password !== password) {
    errorResponse('Mot de passe incorrect. Veuillez réessayer.', 401);
  }

  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  return {
    data: {
      user: buildUserResponse(user),
      token: generateToken(),
      refreshToken: generateRefreshToken(),
      expiresAt,
      message: 'Connexion réussie',
    },
  };
}

export async function mockRegister(data) {
  await delay(600 + Math.random() * 400);

  const existing = findUserByEmail(data.email);
  if (existing) {
    errorResponse('Un compte existe déjà avec cet email.', 409);
  }

  const newUser = {
    id: 'usr_mock_' + Math.random().toString(36).slice(2, 8),
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: 'client',
    country: data.country || 'CM',
    city: data.city || 'Douala',
    avatar: null,
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(newUser);

  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  return {
    data: {
      user: buildUserResponse(newUser),
      token: generateToken(),
      refreshToken: generateRefreshToken(),
      expiresAt,
      message: 'Compte créé avec succès',
    },
  };
}

export async function mockLogout() {
  await delay(200);
  return { data: { message: 'Déconnexion réussie' } };
}

export async function mockGetProfile() {
  await delay(300);

  try {
    const raw = localStorage.getItem('btc-auth');
    if (!raw) errorResponse('Session expirée', 401);
    const parsed = JSON.parse(raw);
    const userId = parsed?.state?.user?.id;
    if (!userId) errorResponse('Session expirée', 401);

    const user = findUserById(userId);
    if (!user) errorResponse('Utilisateur introuvable', 404);

    return { data: buildUserResponse(user) };
  } catch {
    errorResponse('Session expirée', 401);
  }
}

export async function mockForgotPassword(email) {
  await delay(500);
  const user = findUserByEmail(email);
  if (!user) {
    errorResponse('Aucun compte ne correspond à cet email.', 404);
  }
  return { data: { message: 'Email de réinitialisation envoyé.' } };
}

export async function mockResetPassword(data) {
  await delay(500);
  return { data: { message: 'Mot de passe réinitialisé avec succès.' } };
}

export async function mockVerifyEmail(data) {
  await delay(400);
  return { data: { message: 'Email vérifié avec succès.' } };
}

export async function mockResendVerification(email) {
  await delay(400);
  return { data: { message: 'Email de vérification renvoyé.' } };
}
