/**
 * Génération de références / identifiants courts (style `PAY-AB1C2D3`).
 */
const pad = (n, len = 4) => String(n).padStart(len, '0');

const rand = (len = 4) =>
  Math.random()
    .toString(36)
    .replace(/[^a-z0-9]/g, '')
    .toUpperCase()
    .slice(0, len);

/** Référence lisible (ex: SUB-2026-001) */
const ref = (prefix, sequence) => `${prefix}-${sequence}`;

/** Référence aléatoire unique (ex: PAY-8F2K9X) */
const uniqueRef = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}${rand(3)}`;

/** ID char fixed-length (ex: AGT0001) */
const fixedId = (prefix, n) => `${prefix}${pad(n)}`;

/** Date au format YYYY-MM-DD depuis un Date */
const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Jours restants entre aujourd'hui et une date (>= 0) */
const daysRemaining = (dateFin) => {
  const fin = new Date(`${dateFin}T23:59:59`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((fin - today) / 86400000));
};

module.exports = { pad, rand, ref, uniqueRef, fixedId, isoDate, daysRemaining };
