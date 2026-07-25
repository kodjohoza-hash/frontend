import { ROLE_PERMISSIONS } from '@utils/permissions';
import { ROLES } from '@utils/roles';

let registeredUsers = [];

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

/** Map URL role keys to store role constants */
const URL_ROLE_MAP = {
  client: ROLES.CLIENT,
  company: ROLES.COMPANY_ADMIN,
  counter: ROLES.COUNTER_AGENT,
  'super-admin': ROLES.SUPER_ADMIN,
};

/**
 * Find a user matching both email AND role.
 * This enforces role isolation — each auth space only searches its own user pool.
 */
function findUserByRole(email, roleHint) {
  const storeRole = URL_ROLE_MAP[roleHint] || roleHint;
  const allUsers = [...MOCK_USERS, ...registeredUsers];
  return allUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === storeRole
  );
}

export function findUserByEmail(email) {
  return [...MOCK_USERS, ...registeredUsers].find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserById(id) {
  return [...MOCK_USERS, ...registeredUsers].find((u) => u.id === id);
}

export async function mockLogin({ email, password, roleHint }) {
  await delay(500 + Math.random() * 400);

  if (roleHint) {
    const user = findUserByRole(email, roleHint);
    if (!user) {
      errorResponse('Aucun compte trouvé pour cet espace. Vérifiez votre rôle et vos identifiants.', 404);
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

  // Fallback: search all users (for backwards compatibility)
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

export async function mockRegisterCompany(data) {
  await delay(600 + Math.random() * 400);

  const existing = findUserByEmail(data.email);
  if (existing) {
    errorResponse('Un compte existe déjà avec cet email.', 409);
  }

  const newUser = {
    id: 'usr_cmp_' + Math.random().toString(36).slice(2, 8),
    email: data.email,
    password: data.password,
    firstName: data.managerFirstName,
    lastName: data.managerLastName,
    phone: data.phone,
    role: ROLES.COMPANY_ADMIN,
    companyName: data.companyName,
    address: data.address,
    city: data.city,
    country: data.country,
    rccm: data.rccm,
    taxpayerNumber: data.taxpayerNumber,
    website: data.website || null,
    description: data.description || null,
    avatar: null,
    emailVerified: false,
    status: 'pending_validation',
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(newUser);

  return {
    data: {
      user: buildUserResponse(newUser),
      message: 'Votre demande de création de compte a été enregistrée. En attente de validation.',
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
