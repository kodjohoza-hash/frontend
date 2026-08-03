const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const env = require('../../../config/env');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');

/**
 * Gestion des photos de profil (module Files).
 * - Upload en mémoire (multer) avec validation mimetype + taille.
 * - Compression via sharp : redimensionnement + conversion WebP.
 * - Fichiers stockés dans <uploadDir>/users/, servis sous /uploads/users.
 */

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 Mo
const PHOTO_WIDTH = 512; // taille max côté largeur
const PHOTO_HEIGHT = 512; // taille max côté hauteur
const PHOTO_QUALITY = 80;

const ACCEPTED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const usersDir = path.join(env.app.uploadDir, 'users');

/** Middleware multer : lit un champ "photo" en mémoire (max 5 Mo, images). */
const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PHOTO_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED_MIMES.has(file.mimetype)) {
      return cb(new ApiError(400, 'Format invalide. Formats acceptés : JPEG, PNG, WEBP.'));
    }
    cb(null, true);
  },
}).single('photo');

/** Compresse (redimensionne + WebP) un buffer image. */
const compressPhoto = async (buffer) => {
  try {
    return await sharp(buffer)
      .rotate() // respecte l'orientation EXIF
      .resize(PHOTO_WIDTH, PHOTO_HEIGHT, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: PHOTO_QUALITY })
      .toBuffer();
  } catch (_err) {
    throw new ApiError(400, 'Fichier image illisible ou corrompu.');
  }
};

/** Enregistre la photo compressée et retourne l'URL publique relative. */
const savePhoto = async (buffer, matricule) => {
  const compressed = await compressPhoto(buffer);
  fs.mkdirSync(usersDir, { recursive: true });
  const filename = `${(matricule || 'user').replace(/[^A-Za-z0-9_-]/g, '_')}_${crypto.randomBytes(6).toString('hex')}.webp`;
  fs.writeFileSync(path.join(usersDir, filename), compressed);
  logger.info(`Photo enregistrée : ${filename}`);
  return `/uploads/users/${filename}`;
};

/** Supprime un fichier photo (ignore si absent / hors dossier). */
const deletePhoto = (url) => {
  if (!url) return;
  const filename = path.basename(url);
  const file = path.join(usersDir, filename);
  try {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } catch (err) {
    logger.warn(`Suppression photo impossible : ${filename}`, { error: err.message });
  }
};

/** Vérifie qu'un URL pointe bien vers le dossier users (anti path traversal). */
const isUserPhotoUrl = (url) =>
  typeof url === 'string' && /^\/uploads\/users\/[A-Za-z0-9_\-]+\.(webp|jpe?g|png)$/.test(url);

module.exports = { uploadPhoto, savePhoto, deletePhoto, compressPhoto, usersDir, isUserPhotoUrl };
