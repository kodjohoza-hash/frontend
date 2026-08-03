const crypto = require('crypto');

/**
 * Génère un jeton opaque (hex) — utilisé pour la vérification d'email
 * et la réinitialisation de mot de passe.
 */
const generateOpaqueToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

/**
 * Hash SHA-256 d'un jeton. Seul le hash est stocké en base : un vol de
 * base de données ne permet pas de réutiliser les jetons.
 */
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { generateOpaqueToken, hashToken };
