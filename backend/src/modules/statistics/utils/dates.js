/**
 * Utilitaires de dates pour le module Statistiques.
 * Toutes les bornes de période sont calculées dans le fuseau Africa/Douala (UTC+1,
 * sans heure d'été). Les dates échangées sont des chaînes 'YYYY-MM-DD'.
 */

const TZ = 'Africa/Douala';

const fmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Date courante (aujourd'hui) en Africa/Douala → 'YYYY-MM-DD'. */
const today = () => fmt.format(new Date());

/** 'YYYY-MM-DD' → Date (minuit UTC, uniquement pour l'arithmétique). */
const parse = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

/** Date → 'YYYY-MM-DD' (à partir d'une date UTC minuit). */
const toIso = (dt) => dt.toISOString().slice(0, 10);

/** Ajoute (ou soustrait) n jours à une date 'YYYY-MM-DD'. */
const addDays = (s, n) => toIso(new Date(parse(s).getTime() + n * 86400000));

/** Premier jour du mois d'une date 'YYYY-MM-DD'. */
const firstOfMonth = (s) => `${s.slice(0, 7)}-01`;

/** Dernier jour du mois précédent d'une date 'YYYY-MM-DD'. */
const lastOfPreviousMonth = (s) => {
  const [y, m] = s.split('-').map(Number);
  const firstOfThisMonth = new Date(Date.UTC(y, m - 1, 1));
  return toIso(new Date(firstOfThisMonth.getTime() - 1));
};

/** Premier jour du mois précédent d'une date 'YYYY-MM-DD'. */
const firstOfPreviousMonth = (s) => {
  const [y, m] = s.split('-').map(Number);
  return `${y}-${String(m - 1).padStart(2, '0')}-01`;
};

const firstOfYear = (s) => `${s.slice(0, 4)}-01-01`;

/**
 * Résout les bornes [dateDebut, dateFin] d'une période demandée.
 * @param {object} params { periode, dateDebut, dateFin }
 * @returns {{ periode, dateDebut: string|null, dateFin: string|null }}
 */
const resolvePeriod = ({ periode = 'all', dateDebut = null, dateFin = null } = {}) => {
  const jour = today();

  if (dateDebut) {
    const fin = dateFin || jour;
    return { periode: 'custom', dateDebut, dateFin: fin < dateDebut ? dateDebut : fin };
  }

  switch (periode) {
    case 'today':
      return { periode, dateDebut: jour, dateFin: jour };
    case 'yesterday':
      return { periode, dateDebut: addDays(jour, -1), dateFin: addDays(jour, -1) };
    case '7d':
      return { periode, dateDebut: addDays(jour, -6), dateFin: jour };
    case '30d':
      return { periode, dateDebut: addDays(jour, -29), dateFin: jour };
    case 'this_month':
      return { periode, dateDebut: firstOfMonth(jour), dateFin: jour };
    case 'last_month':
      return { periode, dateDebut: firstOfPreviousMonth(jour), dateFin: lastOfPreviousMonth(jour) };
    case 'this_year':
      return { periode, dateDebut: firstOfYear(jour), dateFin: jour };
    case 'all':
    default:
      return { periode, dateDebut: null, dateFin: null };
  }
};

module.exports = { resolvePeriod, today, addDays };
