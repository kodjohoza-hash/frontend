const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/** Hache un mot de passe en clair. */
const hashPassword = async (plain) => bcrypt.hash(plain, SALT_ROUNDS);

/** Compare un mot de passe en clair avec un hash. */
const comparePassword = async (plain, hash) => bcrypt.compare(plain, hash);

module.exports = { hashPassword, comparePassword };
