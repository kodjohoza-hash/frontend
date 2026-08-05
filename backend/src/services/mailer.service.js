const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Structure d'envoi d'email.
 * - En dev sans SMTP configuré : les emails sont journalisés (pas d'envoi).
 * - SMTP renseigné : envoi réel via nodemailer.
 */
const isConfigured = () => Boolean(env.smtp.host && env.smtp.user && env.smtp.password);

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.password },
  });
  return transporter;
};

/**
 * Envoie un email. Retourne true si réellement envoyé, false si journalisé.
 * @param {{to: string, subject: string, html?: string, text?: string, attachments?: Array<{filename: string, content: Buffer}>}} options
 */
const sendMail = async ({ to, subject, html, text, attachments }) => {
  if (!isConfigured()) {
    logger.info(`[MAIL-DEV] to=${to} subject="${subject}"`, { html: html?.slice(0, 500), attachments: attachments?.length || 0 });
    return false;
  }
  try {
    await getTransporter().sendMail({
      from: `"Bus Tix Connect" <${env.smtp.from}>`,
      to,
      subject,
      html,
      text,
      attachments,
    });
    logger.info(`Email envoyé à ${to} — "${subject}"`);
    return true;
  } catch (err) {
    logger.error(`Échec envoi email à ${to}`, { subject, error: err.message });
    return false;
  }
};

module.exports = { sendMail, isConfigured };
