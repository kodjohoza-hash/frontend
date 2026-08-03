const ApiError = require('../utils/ApiError');

/**
 * Gestionnaire d'erreurs centralisé.
 * Réponse uniforme : { success: false, message }
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Erreur interne du serveur.';

  /* Erreurs Sequelize connues */
  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Un enregistrement avec ces valeurs existe déjà.';
  } else if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = err.errors.map((e) => e.message).join('; ');
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 400;
    message = 'Référence invalide (clé étrangère).';
  } else if (err.name === 'MulterError') {
    status = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Fichier trop volumineux (5 Mo maximum).'
        : 'Erreur d\'upload de fichier.';
  }

  if (status >= 500) {
    console.error('✗ Erreur serveur :', err);
  }

  return res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler, ApiError };
