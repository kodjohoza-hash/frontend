const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const env = require('../../../config/env');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');

/**
 * Gestion des fichiers du module Drivers.
 * - Photo de profil   : champ "photo"    (images, sharp → WebP), /uploads/drivers/
 * - Documents         : champ "document" (PDF + images, max 10 Mo), /uploads/drivers/docs/
 */

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 Mo
const PHOTO_WIDTH = 800;
const PHOTO_HEIGHT = 800;
const PHOTO_QUALITY = 82;

const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 Mo
const ACCEPTED_DOC_MIMES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);
const ACCEPTED_PHOTO_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const driversDir = path.join(env.app.uploadDir, 'drivers');
const docsDir = path.join(driversDir, 'docs');

/** Middleware multer : lit un champ "photo" en mémoire (images). */
const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PHOTO_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED_PHOTO_MIMES.has(file.mimetype)) {
      return cb(new ApiError(400, 'Format invalide. Formats acceptés : JPEG, PNG, WEBP.'));
    }
    cb(null, true);
  },
}).single('photo');

/** Middleware multer : lit un champ "document" en mémoire (PDF + images). */
const uploadDocument = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOC_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED_DOC_MIMES.has(file.mimetype)) {
      return cb(new ApiError(400, 'Format invalide. Formats acceptés : PDF, JPEG, PNG, WEBP.'));
    }
    cb(null, true);
  },
}).single('document');

/** Compresse (redimensionne + WebP) un buffer image. */
const compressPhoto = async (buffer) => {
  try {
    return await sharp(buffer)
      .rotate()
      .resize(PHOTO_WIDTH, PHOTO_HEIGHT, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: PHOTO_QUALITY })
      .toBuffer();
  } catch (_err) {
    throw new ApiError(400, 'Fichier image illisible ou corrompu.');
  }
};

/** Extension de fichier dérivée du mimetype (documents). */
const extensionForMime = (mime) => {
  switch (mime) {
    case 'application/pdf':
      return 'pdf';
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'bin';
  }
};

/** Enregistre la photo compressée et retourne l'URL publique relative. */
const savePhoto = async (buffer, chauffeurId) => {
  const compressed = await compressPhoto(buffer);
  fs.mkdirSync(driversDir, { recursive: true });
  const filename = `${(chauffeurId || 'driver').replace(/[^A-Za-z0-9_-]/g, '_')}_${crypto.randomBytes(6).toString('hex')}.webp`;
  fs.writeFileSync(path.join(driversDir, filename), compressed);
  logger.info(`Photo de chauffeur enregistrée : ${filename}`);
  return `/uploads/drivers/${filename}`;
};

/** Enregistre un document et retourne l'URL publique relative. */
const saveDocument = async (buffer, chauffeurId, originalName) => {
  fs.mkdirSync(docsDir, { recursive: true });
  const ext = path.extname(originalName || '').replace(/[^a-zA-Z0-9.]/g, '').slice(0, 8) || '';
  const safeExt = /^\.([a-zA-Z0-9]{1,5})$/.test(ext) ? ext.toLowerCase() : '';
  const filename = `${(chauffeurId || 'driver').replace(/[^A-Za-z0-9_-]/g, '_')}_${crypto.randomBytes(8).toString('hex')}${safeExt}`;
  fs.writeFileSync(path.join(docsDir, filename), buffer);
  logger.info(`Document de chauffeur enregistré : ${filename}`);
  return `/uploads/drivers/docs/${filename}`;
};

/** Supprime un fichier (ignore si absent / hors dossier). */
const deleteFile = (url, dir) => {
  if (!url) return;
  const filename = path.basename(url);
  const file = path.join(dir, filename);
  try {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } catch (err) {
    logger.warn(`Suppression fichier impossible : ${filename}`, { error: err.message });
  }
};

/** Vérifie qu'un URL pointe bien vers le dossier photos (anti path traversal). */
const isDriverPhotoUrl = (url) =>
  typeof url === 'string' && /^\/uploads\/drivers\/[A-Za-z0-9_\-]+\.webp$/.test(url);

/** Vérifie qu'un URL pointe bien vers le dossier documents (anti path traversal). */
const isDriverDocumentUrl = (url) =>
  typeof url === 'string' && /^\/uploads\/drivers\/docs\/[A-Za-z0-9_\-\.]+$/.test(url);

module.exports = {
  uploadPhoto,
  uploadDocument,
  savePhoto,
  saveDocument,
  deleteFile,
  compressPhoto,
  extensionForMime,
  driversDir,
  docsDir,
  isDriverPhotoUrl,
  isDriverDocumentUrl,
  MAX_DOC_BYTES,
};
