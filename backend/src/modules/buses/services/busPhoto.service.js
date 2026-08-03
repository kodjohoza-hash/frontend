const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const env = require('../../../config/env');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');

/**
 * Gestion des photos de bus (module Buses).
 * - Upload en mémoire (multer) avec validation mimetype + taille.
 * - Compression via sharp : redimensionnement + conversion WebP.
 * - Fichiers stockés dans <uploadDir>/buses/, servis sous /uploads/buses.
 */

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 Mo
const PHOTO_WIDTH = 1200; // taille max côté largeur
const PHOTO_HEIGHT = 800; // taille max côté hauteur
const PHOTO_QUALITY = 82;

const ACCEPTED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const busesDir = path.join(env.app.uploadDir, 'buses');

/** Middleware multer : lit un champ "photo" en mémoire (max 8 Mo, images). */
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
const savePhoto = async (buffer, busId) => {
  const compressed = await compressPhoto(buffer);
  fs.mkdirSync(busesDir, { recursive: true });
  const filename = `${(busId || 'bus').replace(/[^A-Za-z0-9_-]/g, '_')}_${crypto.randomBytes(6).toString('hex')}.webp`;
  fs.writeFileSync(path.join(busesDir, filename), compressed);
  logger.info(`Photo de bus enregistrée : ${filename}`);
  return `/uploads/buses/${filename}`;
};

/** Supprime un fichier photo (ignore si absent / hors dossier). */
const deletePhoto = (url) => {
  if (!url) return;
  const filename = path.basename(url);
  const file = path.join(busesDir, filename);
  try {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } catch (err) {
    logger.warn(`Suppression photo impossible : ${filename}`, { error: err.message });
  }
};

/** Vérifie qu'un URL pointe bien vers le dossier buses (anti path traversal). */
const isBusPhotoUrl = (url) =>
  typeof url === 'string' && /^\/uploads\/buses\/[A-Za-z0-9_\-]+\.(webp|jpe?g|png)$/.test(url);

module.exports = { uploadPhoto, savePhoto, deletePhoto, compressPhoto, busesDir, isBusPhotoUrl };
