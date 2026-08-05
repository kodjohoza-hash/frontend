const crypto = require('crypto');

/**
 * Générateur ULID — identifiant triable dans le temps (26 caractères
 * base32 Crockford) : 48 bits d'horodatage (10 caractères) + 80 bits
 * aléatoires (16 caractères). Utilisé pour `passenger.id`,
 * `emergency_contact.id`, etc.
 */

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** Encodage de l'horodatage (ms) sur 10 caractères base32. */
const encodeTime = (now) => {
  let t = BigInt(now);
  let out = '';
  for (let i = 0; i < 10; i += 1) {
    out = CROCKFORD[Number(t % 26n)] + out;
    t /= 26n;
  }
  return out;
};

/** Encodage de 80 bits aléatoires sur 16 caractères base32. */
const encodeRandom = () => {
  const bytes = crypto.randomBytes(8);
  let out = '';
  for (let i = 0; i < bytes.length; i += 1) {
    out += CROCKFORD[bytes[i] >> 4];
    out += CROCKFORD[bytes[i] & 0x0f];
  }
  return out;
};

const ulid = () => encodeTime(Date.now()) + encodeRandom();

module.exports = { ulid };
