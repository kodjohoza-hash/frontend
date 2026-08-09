/**
 * BUS TIX CONNECT — Contrôle des billets (Module 15)
 * Adaptateurs + constantes UI branchés sur l'API réelle.
 * Aucune donnée mock : tout provient du backend.
 */

/* ── Libellés de statut (badges UI) ────────────────────────────── */
export const ticketStatusLabels = {
  valid: { label: 'Valide', icon: 'bi-check-circle-fill', color: '#10B981' },
  used: { label: 'Déjà utilisé', icon: 'bi-clock-history', color: '#F59E0B' },
  expired: { label: 'Expiré', icon: 'bi-hourglass-split', color: '#6B7280' },
  cancelled: { label: 'Annulé', icon: 'bi-x-circle-fill', color: '#EF4444' },
  refunded: { label: 'Remboursé', icon: 'bi-arrow-return-left', color: '#8B5CF6' },
  unpaid: { label: 'Non payé', icon: 'bi-credit-card', color: '#F97316' },
  unknown: { label: 'Inconnu', icon: 'bi-question-circle', color: '#6B7280' },
  boarded: { label: 'Embarqué', icon: 'bi-person-check', color: '#10B981' },
  refused: { label: 'Refusé', icon: 'bi-person-x', color: '#EF4444' },
  wrong_company: { label: 'Hors compagnie', icon: 'bi-building-x', color: '#DC2626' },
  invalid: { label: 'QR invalide', icon: 'bi-question-circle', color: '#6B7280' },
};

/* ── Statut billet (base) → statut UI ──────────────────────────── */
const STATUT_TO_STATUS = {
  valide: 'valid',
  utilise: 'used',
  expire: 'expired',
  annule: 'cancelled',
  rembourse: 'refunded',
  impaye: 'unpaid',
  inconnu: 'unknown',
};

export const mapStatutToStatus = (statut) => STATUT_TO_STATUS[statut] || 'unknown';

/* ── Code de résultat (verify / check-in) → statut UI ──────────── */
const CODE_TO_STATUS = {
  VALID: 'valid',
  ALREADY_USED: 'used',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  EXPIRED: 'expired',
  UNPAID: 'unpaid',
  INVALID: 'unknown',
  WRONG_COMPANY: 'wrong_company',
};

export const mapCodeToStatus = (code) => CODE_TO_STATUS[code] || 'unknown';

/* ── Helpers de formatage (remplacent l'ancien mock) ───────────── */
export const formatCurrency = (amount) =>
  `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(amount) || 0)} XAF`;

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

export const formatTime = (value) => {
  if (!value) return '—';
  const str = String(value);
  return str.length >= 5 ? str.slice(0, 5) : str;
};

export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return formatDateTime(value).slice(0, 10);
};

const initials = (name) => {
  const parts = String(name || '').split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts.map((w) => w[0]).join('').toUpperCase().slice(0, 2);
};

/* ── Adaptateur billet API → structure UI ──────────────────────── */
/**
 * Convertit un billet sérialisé par le backend (GET /tickets/verify,
 * GET /tickets/:id, liste, …) en la structure attendue par les composants.
 * Le billet correspond à UN passager et UN siège : le contact d'urgence
 * n'est JAMAIS inclus (jamais affiché comme second passager).
 */
export const mapApiTicket = (b) => {
  if (!b) return null;
  const dep = b.depart || {};
  const comp = dep.compagnie || {};
  const compagnie = b.compagnie || {};
  const paxName = b.passengerName || b.clientName || b.nomPassager || '';
  const paxPhone = b.passenger?.phone || b.client?.phone || '—';
  const paxEmail = b.passenger?.email || b.client?.email || '';
  const companyName = comp.nom || compagnie.nom || '—';
  const seat = b.siege || '—';

  return {
    id: b.id,
    reference: b.reference,
    qrCode: b.reference,
    barcode: b.codeBarre || b.reference,
    passenger: {
      name: paxName || 'Passager',
      phone: paxPhone,
      email: paxEmail,
      initials: initials(paxName),
    },
    company: {
      name: companyName,
      color: comp.couleur || '#0B1D51',
      logo: initials(companyName) || '?',
    },
    trip: {
      from: dep.villeDepart || '—',
      to: dep.villeArrivee || '—',
      date: formatDate(dep.dateDepart),
      time: formatTime(dep.heureDepart),
      duration: '—',
    },
    bus: {
      plate: dep.bus?.immatriculation || '—',
      model: dep.bus?.typeBus || '',
      seat,
    },
    amount: Number(b.prix) || 0,
    payment: {
      method: '',
      status: b.reservation?.statut === 'payee' ? 'paid' : 'pending',
      amount: Number(b.prix) || 0,
    },
    status: mapStatutToStatus(b.statut),
    statut: b.statut,
    verifiedAt: b.verifieLe || null,
    verifiedBy: b.verifiePar?.name || null,
    reservation: b.reservation || null,
    client: b.client || null,
    depart: b.depart || null,
  };
};

/* ── Extraction du jeton depuis une saisie / un QR ─────────────── */
/**
 * Accepte :
 *   - le payload QR complet : BTC:<ticket_id>:<token>:<version>
 *   - le jeton seul         : 48 caractères hexadécimaux
 * Retourne le jeton (ou null si non interprétable).
 */
export const extractToken = (input) => {
  const raw = String(input || '').trim();
  if (!raw) return null;
  const qr = raw.match(/^BTC:([A-Za-z0-9]{12,15}):([A-Fa-f0-9]{48}):(\d+)$/);
  if (qr) return qr[2];
  if (/^[A-Fa-f0-9]{48}$/.test(raw)) return raw;
  return null;
};

/* ── Retour sensoriel (son + vibration) ────────────────────────── */
export const playSound = (type) => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;
    if (type === 'success') {
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'error') {
      osc.frequency.value = 280;
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.frequency.value = 660;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    /* silencieux */
  }
};

export const vibrateDevice = (pattern = 50) => {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* silencieux */
  }
};
