const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const env = require('../../../config/env');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');

/**
 * Gestion des documents administratifs d'une compagnie (module Companies).
 * - Upload en mémoire (multer) : PDF + images, max 10 Mo.
 * - Fichiers stockés dans <uploadDir>/companies/docs/ sous /uploads/companies/docs.
 */

const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 Mo

const ACCEPTED_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const docsDir = path.join(env.app.uploadDir, 'companies', 'docs');

/** Middleware multer : lit un champ "document" en mémoire (max 10 Mo). */
const uploadDocument = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOC_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED_MIMES.has(file.mimetype)) {
      return cb(new ApiError(400, 'Format invalide. Formats acceptés : PDF, JPEG, PNG, WEBP.'));
    }
    cb(null, true);
  },
}).single('document');

/** Extension de fichier dérivée du mimetype. */
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

/** Enregistre un document et retourne le chemin relatif stocké. */
const saveDocument = async (buffer, compagnieId, originalName) => {
  fs.mkdirSync(docsDir, { recursive: true });
  const ext = path.extname(originalName || '').replace(/[^a-zA-Z0-9.]/g, '').slice(0, 8) || `.${extensionForMime('bin')}`;
  const safeExt = /^\.([a-zA-Z0-9]{1,5})$/.test(ext) ? ext.toLowerCase() : '';
  const filename = `${(compagnieId || 'company').replace(/[^A-Za-z0-9_-]/g, '_')}_${crypto.randomBytes(8).toString('hex')}${safeExt}`;
  fs.writeFileSync(path.join(docsDir, filename), buffer);
  logger.info(`Document enregistré : ${filename}`);
  return `/uploads/companies/docs/${filename}`;
};

/** Supprime un fichier document (ignore si absent / hors dossier). */
const deleteDocumentFile = (url) => {
  if (!url) return;
  const filename = path.basename(url);
  const file = path.join(docsDir, filename);
  try {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } catch (err) {
    logger.warn(`Suppression document impossible : ${filename}`, { error: err.message });
  }
};

/** Vérifie qu'un URL pointe bien vers le dossier docs (anti path traversal). */
const isDocumentUrl = (url) =>
  typeof url === 'string' && /^\/uploads\/companies\/docs\/[A-Za-z0-9_\-\.]+$/.test(url);

module.exports = {
  uploadDocument,
  saveDocument,
  deleteDocumentFile,
  extensionForMime,
  docsDir,
  isDocumentUrl,
  MAX_DOC_BYTES,
};
