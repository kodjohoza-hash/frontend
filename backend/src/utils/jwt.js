const jwt = require('jsonwebtoken');
const env = require('../config/env');

/** Signe un access token (durée courte, secret dédié). */
const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.accessExpiresIn });

/** Signe un refresh token (durée longue, secret séparé). */
const signRefreshToken = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

/** Vérifie un access token — retourne le payload ou null. */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (_err) {
    return null;
  }
};

/** Vérifie un refresh token — retourne le payload ou null. */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.refreshSecret);
  } catch (_err) {
    return null;
  }
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
