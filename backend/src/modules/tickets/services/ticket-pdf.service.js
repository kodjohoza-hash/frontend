const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const env = require('../../../config/env');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { isCompanyLogoUrl } = require('../../companies/services/logo.service');

/**
 * Service PDF du module TICKETS (Étape 3).
 * Génère un billet de voyage professionnel au format A4 :
 *   - bandeau avec le logo / nom / couleur de la compagnie ;
 *   - trajet (ville départ → ville arrivée, date & heure, quai) ;
 *   - informations du passager (nom, siège, référence, prix) ;
 *   - QR code intégré (payload sécurisé BTC:<id>:<token>:<version>) ;
 *   - code-barres lisible + statut du billet.
 */

const MARGIN = 36;
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const CONTENT_W = PAGE_W - MARGIN * 2;

const DEFAULT_COLOR = '#1E88E5';
const INK = '#1B2430';
const MUTED = '#6B7280';

const STATUT_LABELS = {
  valide: 'Valide',
  utilise: 'Utilisé',
  expire: 'Expiré',
  annule: 'Annulé',
  rembourse: 'Remboursé',
  impaye: 'Impayé',
  inconnu: 'Inconnu',
};

const STATUT_COLORS = {
  valide: '#16A34A',
  utilise: '#2563EB',
  expire: '#DC2626',
  annule: '#DC2626',
  rembourse: '#D97706',
  impaye: '#D97706',
  inconnu: '#6B7280',
};

const formatMoney = (value) => `${Number(value).toLocaleString('fr-FR')} XAF`;

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const formatDateTime = (datePart, timePart) => {
  const parts = [];
  if (datePart) parts.push(formatDate(datePart));
  if (timePart) parts.push(String(timePart).slice(0, 5));
  return parts.join(' à ');
};

const hexColor = (value, fallback) =>
  typeof value === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : fallback;

const initials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/** Image PNG du QR code d'un billet (payload sécurisé : id + token + version). */
const qrPng = async (ticket) => {
  const payload = `BTC:${ticket.id}:${ticket.token}:${ticket.qr_version || 1}`;
  return QRCode.toBuffer(payload, { type: 'png', width: 220, errorCorrectionLevel: 'M', margin: 1 });
};

/** Logo de la compagnie converti en PNG (pdfkit ne lit pas le WebP). */
const logoPng = async (logoUrl) => {
  if (!isCompanyLogoUrl(logoUrl)) return null;
  const file = path.join(env.app.uploadDir, logoUrl.replace(/^\/uploads\//, ''));
  if (!fs.existsSync(file)) return null;
  try {
    return await sharp(file).resize(96, 96, { fit: 'contain' }).png().toBuffer();
  } catch (err) {
    logger.warn(`[pdf] logo illisible : ${logoUrl}`, { error: err.message });
    return null;
  }
};

const collectStream = (doc) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

/** Construit le buffer PDF du billet. */
const buildPdfBuffer = async ({ ticket }) => {
  if (!ticket?.token) throw new ApiError(409, 'QR code indisponible : impossible de générer le billet PDF.');
  if (!ticket.depart) throw new ApiError(409, 'Voyage indisponible : impossible de générer le billet PDF.');

  const compagnie = ticket.depart.compagnie;
  const trajet = ticket.depart.trajet;
  const from = trajet?.villeDepart?.nom ?? '—';
  const to = trajet?.villeArrivee?.nom ?? '—';
  const passager =
    ticket.nom_passager ||
    (ticket.client ? `${ticket.client.prenom} ${ticket.client.nom}`.trim() : '—');
  const bus = ticket.depart.bus;
  const color = hexColor(compagnie?.couleur, DEFAULT_COLOR);
  const statut = ticket.statut || 'valide';
  const statutLabel = (STATUT_LABELS[statut] || statut).toUpperCase();
  const statutColor = hexColor(STATUT_COLORS[statut], '#6B7280');
  const emisLe = new Date().toLocaleString('fr-FR');

  const [qr, logo] = await Promise.all([qrPng(ticket), logoPng(compagnie?.logo)]);

  const doc = new PDFDocument({
    size: 'A4',
    margin: MARGIN,
    info: {
      Title: `Billet ${ticket.reference}`,
      Author: compagnie?.nom || 'Bus Tix Connect',
      Subject: 'Billet électronique de voyage',
      Creator: 'Bus Tix Connect',
      CreationDate: new Date(),
    },
  });
  const pdf = collectStream(doc);

  /* ── Bandeau d'en-tête ── */
  doc.rect(0, 0, PAGE_W, 100).fill(color);
  if (logo) {
    doc.image(logo, MARGIN, 22, { width: 56, height: 56 });
  } else {
    doc.opacity(0.18);
    doc.roundedRect(MARGIN, 22, 56, 56, 10).fill('#FFFFFF');
    doc.opacity(1);
    doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text(initials(compagnie?.nom) || 'BTC', MARGIN, 40, { width: 56, align: 'center', lineBreak: false });
  }
  doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold').text(compagnie?.nom || 'Compagnie de transport', MARGIN + 72, 30, { lineBreak: false });
  doc.fillColor('rgba(255,255,255,0.85)').fontSize(10).font('Helvetica').text('Billet électronique de voyage', MARGIN + 72, 52, { lineBreak: false });
  doc.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold').text('BILLET DE VOYAGE', PAGE_W - MARGIN, 30, { width: 230, align: 'right', lineBreak: false });
  doc.fontSize(11).font('Helvetica').text(ticket.reference, PAGE_W - MARGIN, 64, { width: 230, align: 'right', lineBreak: false });

  /* ── Trajet ── */
  let y = 132;
  doc.fillColor(INK).fontSize(24).font('Helvetica-Bold');
  doc.text(from, MARGIN, y, { lineBreak: false });
  doc.fillColor(color).text('→', MARGIN + 250, y, { width: 30, align: 'center', lineBreak: false });
  doc.fillColor(INK).text(to, MARGIN + 280, y, { lineBreak: false });

  doc.roundedRect(PAGE_W - MARGIN - 150, y - 20, 150, 26, 13).fill(statutColor);
  doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text(statutLabel, PAGE_W - MARGIN - 150, y - 13, { width: 150, align: 'center', lineBreak: false });

  y += 30;
  doc.fillColor(MUTED).fontSize(10).font('Helvetica').text(
    `${formatDateTime(ticket.depart.date_depart, ticket.depart.heure_depart)} · Quai ${ticket.depart.quai || '—'}`,
    MARGIN,
    y,
    { lineBreak: false }
  );

  /* ── Séparateur ── */
  y += 20;
  doc.moveTo(MARGIN, y).lineTo(PAGE_W - MARGIN, y).strokeColor('#E5E7EB').lineWidth(1).stroke();
  y += 16;

  /* ── Grille d'informations (2 colonnes) ── */
  const colW = CONTENT_W / 2 - 18;
  const col2X = MARGIN + CONTENT_W / 2;

  const drawField = (x, label, value, startY, { valueSize = 12, w = colW } = {}) => {
    doc.fillColor(MUTED).fontSize(9).font('Helvetica-Bold').text(String(label).toUpperCase(), x, startY, { width: w, lineBreak: false });
    const ly = startY + 14;
    doc.fillColor(INK).fontSize(valueSize).font('Helvetica-Bold').text(String(value), x, ly, { width: w });
    return ly + doc.heightOfString(String(value), { width: w }) + 6;
  };

  let yLeft = y;
  yLeft = drawField(MARGIN, 'Passager', passager, yLeft);
  yLeft = drawField(MARGIN, 'Siège', ticket.siege, yLeft);
  yLeft = drawField(MARGIN, 'Référence', ticket.reference, yLeft);
  yLeft = drawField(MARGIN, 'Prix', formatMoney(ticket.prix), yLeft, { valueSize: 15 });

  let yRight = y;
  yRight = drawField(col2X, 'Voyage', ticket.depart.code || '—', yRight);
  yRight = drawField(col2X, 'Départ', formatDateTime(ticket.depart.date_depart, ticket.depart.heure_depart), yRight);
  yRight = drawField(col2X, 'Arrivée', formatDateTime(ticket.depart.date_arrivee, ticket.depart.heure_arrivee), yRight);
  yRight = drawField(col2X, 'Bus', bus ? `${bus.immatriculation} · ${bus.classe || bus.type_bus || ''}`.replace(/·\s*$/, '') : '—', yRight);

  y = Math.max(yLeft, yRight) + 8;

  /* ── Zone QR code + vérification ── */
  const boxH = 150;
  doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 10).fill('#F3F4F6');
  if (qr) {
    doc.image(qr, MARGIN + 24, y + 16, { width: 118, height: 118 });
  }
  const qrX = MARGIN + 160;
  doc.fillColor(INK).fontSize(12).font('Helvetica-Bold').text('Présentez ce QR code au contrôleur', qrX, y + 18, { lineBreak: false });
  doc.fillColor(MUTED).fontSize(9.5).font('Helvetica').text(
    'Ce QR code contient uniquement l\u2019identifiant du billet, le jeton sécurisé et la version. Il est vérifié au scan et ne peut être réutilisé.',
    qrX,
    y + 38,
    { width: CONTENT_W - qrX - 24 - MARGIN, lineBreak: true }
  );
  doc.fillColor(INK).fontSize(9).font('Helvetica-Bold').text('VALIDITÉ', qrX, y + 96, { lineBreak: false });
  doc.fillColor(MUTED).fontSize(10).font('Helvetica').text(
    ticket.validite_jusqua ? formatDateTime(ticket.validite_jusqua, null) : '—',
    qrX,
    y + 110,
    { lineBreak: false }
  );
  doc.fillColor(color).fontSize(10).font('Helvetica-Bold').text('ÉMIS LE', PAGE_W - MARGIN, y + 96, { width: 200, align: 'right', lineBreak: false });
  doc.fillColor(MUTED).fontSize(10).font('Helvetica').text(emisLe, PAGE_W - MARGIN, y + 110, { width: 200, align: 'right', lineBreak: false });
  y += boxH + 14;

  /* ── Code-barres ── */
  doc.fillColor(MUTED).fontSize(9).font('Helvetica-Bold').text('CODE-BARRES', MARGIN, y, { lineBreak: false });
  y += 14;
  doc.fillColor(INK).fontSize(13).font('Courier-Bold').text(ticket.code_barre || '—', MARGIN, y, { lineBreak: false });

  /* ── Pied de page ── */
  const contact = [compagnie?.telephone, compagnie?.email, compagnie?.adresse].filter(Boolean).join(' · ');
  doc.moveTo(MARGIN, PAGE_H - 64).lineTo(PAGE_W - MARGIN, PAGE_H - 64).strokeColor('#E5E7EB').lineWidth(1).stroke();
  doc.fillColor(MUTED).fontSize(8.5).font('Helvetica').text(
    `${compagnie?.nom || 'Compagnie de transport'}${contact ? ` — ${contact}` : ''}`,
    MARGIN,
    PAGE_H - 54,
    { lineBreak: false }
  );
  doc.fillColor('#9CA3AF').fontSize(8).font('Helvetica').text(
    `Document généré par Bus Tix Connect · ${ticket.reference} · Vérifiable par scan du QR code au contrôle.`,
    MARGIN,
    PAGE_H - 38,
    { lineBreak: false }
  );

  doc.end();
  return pdf;
};

/** Enveloppe HTML simple pour l'email du billet. */
const buildTicketEmailHtml = ({ ticket }) => {
  const compagnie = ticket.depart?.compagnie;
  const trajet = ticket.depart?.trajet;
  const from = trajet?.villeDepart?.nom ?? '—';
  const to = trajet?.villeArrivee?.nom ?? '—';
  const passager =
    ticket.nom_passager ||
    (ticket.client ? `${ticket.client.prenom} ${ticket.client.nom}`.trim() : '—');
  const rows = [
    ['Référence', ticket.reference],
    ['Passager', passager],
    ['Siège', ticket.siege],
    ['Trajet', `${from} → ${to}`],
    ['Départ', formatDateTime(ticket.depart?.date_depart, ticket.depart?.heure_depart)],
    ['Arrivée', formatDateTime(ticket.depart?.date_arrivee, ticket.depart?.heure_arrivee)],
    ['Quai', ticket.depart?.quai || '—'],
    ['Prix', formatMoney(ticket.prix)],
  ];
  const rowHtml = rows.map(([k, v]) => `<tr><td style="padding:6px 10px;color:#6B7280;font-weight:600;">${k}</td><td style="padding:6px 10px;">${v}</td></tr>`).join('');
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
  <div style="background:${hexColor(compagnie?.couleur, DEFAULT_COLOR)};padding:16px 24px;">
    <h2 style="margin:0;color:#fff;">Billet de voyage</h2>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">${compagnie?.nom || 'Bus Tix Connect'} — ${ticket.reference}</p>
  </div>
  <div style="padding:24px;">
    <p>Bonjour <strong>${passager}</strong>,</p>
    <p>Votre billet électronique est disponible en pièce jointe (PDF). Vous pouvez le présenter directement à bord, le QR code sera vérifié au scan.</p>
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">${rowHtml}</table>
    <p style="margin-top:20px;color:#6B7280;font-size:12px;">Merci d\u2019avoir choisi ${compagnie?.nom || 'nos services'}. Bon voyage !</p>
  </div>
</div>`;
};

module.exports = { buildPdfBuffer, buildTicketEmailHtml, qrPng };
