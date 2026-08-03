const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const env = require('../../../config/env');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');

/**
 * Gestion des logos de compagnie (module Companies).
 * - Upload en mémoire (multer) avec validation mimetype + taille.
 * - Compression via sharp : redimensionnement + conversion WebP.
 * - Fichiers stockés dans <uploadDir>/companies/, servis sous /uploads/companies.
 */

const MAX_LOGO_BYTES = 5 * 1024 * 1024; // 5 Mo
const LOGO_WIDTH = 512; // taille max côté largeur
const LOGO_HEIGHT = 512; // taille max côté hauteur
const LOGO_QUALITY = 80;

const ACCEPTED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const companiesDir = path.join(env.app.uploadDir, 'companies');

/** Middleware multer : lit un champ "logo" en mémoire (max 5 Mo, images). */
const uploadLogo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_LOGO_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED_MIMES.has(file.mimetype)) {
      return cb(new ApiError(400, 'Format invalide. Formats acceptés : JPEG, PNG, WEBP.'));
    }
    cb(null, true);
  },
}).single('logo');

/** Compresse (redimensionne + WebP) un buffer image. */
const compressLogo = async (buffer) => {
  try {
    return await sharp(buffer)
      .rotate() // respecte l'orientation EXIF
      .resize(LOGO_WIDTH, LOGO_HEIGHT, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: LOGO_QUALITY })
      .toBuffer();
  } catch (_err) {
    throw new ApiError(400, 'Fichier image illisible ou corrompu.');
  }
};

/** Enregistre le logo compressé et retourne l'URL publique relative. */
const saveLogo = async (buffer, compagnieId) => {
  const compressed = await compressLogo(buffer);
  fs.mkdirSync(companiesDir, { recursive: true });
  const filename = `${(compagnieId || 'company').replace(/[^A-Za-z0-9_-]/g, '_')}_${crypto.randomBytes(6).toString('hex')}.webp`;
  fs.writeFileSync(path.join(companiesDir, filename), compressed);
  logger.info(`Logo enregistré : ${filename}`);
  return `/uploads/companies/${filename}`;
};

/** Supprime un fichier logo (ignore si absent / hors dossier). */
const deleteLogo = (url) => {
  if (!url) return;
  const filename = path.basename(url);
  const file = path.join(companiesDir, filename);
  try {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } catch (err) {
    logger.warn(`Suppression logo impossible : ${filename}`, { error: err.message });
  }
};

/** Vérifie qu'un URL pointe bien vers le dossier companies (anti path traversal). */
const isCompanyLogoUrl = (url) =>
  typeof url === 'string' && /^\/uploads\/companies\/[A-Za-z0-9_\-]+\.webp$/.test(url);

module.exports = { uploadLogo, saveLogo, deleteLogo, compressLogo, companiesDir, isCompanyLogoUrl };
