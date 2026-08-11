/**
 * Tendances & séries agrégées (Module 18) :
 * revenus, réservations, voyages, billets, abonnements, performances par agence/guichet.
 * Chaque fonction n'exécute que des requêtes COUNT/SUM/GROUP BY.
 */

const {
  dateClause,
  reservationScope,
  departScope,
  paymentSource,
  buildWhere,
  q,
  qall,
  num,
  CONFIRMED,
  REFUNDED,
  taux,
} = require('./statistics.repository');

/** Date du paiement retenue pour les filtres de période. */
const PAIEMENT_DATE = 'COALESCE(p.paiement_le, p.cree_le)';

/* ══════════════════════════════════════════════════════════════
   Revenus (tous rôles) — uniquement les paiements CONFIRMÉS.
   ══════════════════════════════════════════════════════════════ */

const revenueSummary = async ({ scope = {}, filters = {} } = {}) => {
  const src = paymentSource(scope);
  const dc = dateClause(PAIEMENT_DATE, filters);

  const [totals, parJour, parMois, parMethode, parCategorie, remboursements] = await Promise.all([
    (async () => {
      const { where, params } = buildWhere([src.scope, dc]);
      return q(
        `SELECT COUNT(*) AS nb,
                COALESCE(SUM(CASE WHEN ${CONFIRMED} THEN p.montant ELSE 0 END), 0) AS encaisse,
                SUM(CASE WHEN ${CONFIRMED} THEN 1 ELSE 0 END) AS nbEncaissements,
                COALESCE(SUM(CASE WHEN ${REFUNDED} THEN p.remboursement ELSE 0 END), 0) AS rembourse,
                SUM(CASE WHEN ${REFUNDED} THEN 1 ELSE 0 END) AS nbRemboursements
         ${src.from} ${where}`,
        params
      );
    })(),
    (async () => {
      const { where, params } = buildWhere([src.scope, dc]);
      return qall(
        `SELECT DATE(${PAIEMENT_DATE}) AS jour,
                COUNT(*) AS nb,
                COALESCE(SUM(p.montant), 0) AS total
         ${src.from} ${buildWhere([src.scope, dc, { sql: CONFIRMED }]).where}
         GROUP BY jour ORDER BY jour`,
        buildWhere([src.scope, dc, { sql: CONFIRMED }]).params
      );
    })(),
    (async () => {
      const { where, params } = buildWhere([src.scope, dc]);
      return qall(
        `SELECT DATE_FORMAT(${PAIEMENT_DATE}, '%Y-%m') AS mois,
                COUNT(*) AS nb,
                COALESCE(SUM(p.montant), 0) AS total
         ${src.from} ${buildWhere([src.scope, dc, { sql: CONFIRMED }]).where}
         GROUP BY mois ORDER BY mois`,
        buildWhere([src.scope, dc, { sql: CONFIRMED }]).params
      );
    })(),
    (async () => {
      const { where, params } = buildWhere([src.scope, dc]);
      return qall(
        `SELECT p.methode,
                COUNT(*) AS nb,
                COALESCE(SUM(p.montant), 0) AS total
         ${src.from} ${buildWhere([src.scope, dc, { sql: CONFIRMED }]).where}
         GROUP BY p.methode ORDER BY total DESC`,
        buildWhere([src.scope, dc, { sql: CONFIRMED }]).params
      );
    })(),
    (async () => {
      const { where, params } = buildWhere([src.scope, dc]);
      return qall(
        `SELECT p.categorie,
                COUNT(*) AS nb,
                COALESCE(SUM(p.montant), 0) AS total
         ${src.from} ${buildWhere([src.scope, dc, { sql: CONFIRMED }]).where}
         GROUP BY p.categorie ORDER BY total DESC`,
        buildWhere([src.scope, dc, { sql: CONFIRMED }]).params
      );
    })(),
    (async () => {
      return q(
        `SELECT COUNT(*) AS nb,
                COALESCE(SUM(p.remboursement), 0) AS montant
         ${src.from} ${buildWhere([src.scope, dc, { sql: REFUNDED }]).where}`,
        buildWhere([src.scope, dc, { sql: REFUNDED }]).params
      );
    })(),
  ]);

  const data = {
    devise: 'XAF',
    encaisse: num(totals.encaisse),
    nbEncaissements: num(totals.nbEncaissements),
    rembourse: num(totals.rembourse),
    nbRemboursements: num(totals.nbRemboursements),
    net: num(totals.encaisse) - num(totals.rembourse),
    nbEnregistrements: num(totals.nb),
    parJour: parJour.map((r) => ({ jour: r.jour, nb: num(r.nb), total: num(r.total) })),
    parMois: parMois.map((r) => ({ mois: r.mois, nb: num(r.nb), total: num(r.total) })),
    parMethode: parMethode.map((r) => ({ methode: r.methode, nb: num(r.nb), total: num(r.total) })),
    parCategorie: parCategorie.map((r) => ({ categorie: r.categorie, nb: num(r.nb), total: num(r.total) })),
  };

  /* Revenus abonnements : réservés au Super Admin (ledger SaaS). */
  if (!scope.clientId && !scope.compagnieId && !scope.guichetId && !scope.agentId && !scope.agenceId) {
    const dcSub = dateClause('pa.date', filters);
    const payeClause = { sql: "pa.statut = 'paye'" };
    const sub = buildWhere([dcSub, payeClause]);
    const [subTotals, subParMois, subParCompagnie] = await Promise.all([
      q(`SELECT COUNT(*) AS nb, COALESCE(SUM(pa.montant), 0) AS montant
         FROM paiement_abonnement pa ${sub.where}`, sub.params),
      qall(
        `SELECT DATE_FORMAT(pa.date, '%Y-%m') AS mois, COUNT(*) AS nb, COALESCE(SUM(pa.montant), 0) AS total
         FROM paiement_abonnement pa ${sub.where}
         GROUP BY mois ORDER BY mois`,
        sub.params
      ),
      qall(
        `SELECT pa.compagnie_id, c.nom, COUNT(*) AS nb, COALESCE(SUM(pa.montant), 0) AS total
         FROM paiement_abonnement pa LEFT JOIN compagnie c ON c.id = pa.compagnie_id
          ${sub.where}
         GROUP BY pa.compagnie_id, c.nom ORDER BY total DESC LIMIT 10`,
        sub.params
      ),
    ]);
    data.abonnements = {
      nb: num(subTotals.nb),
      montant: num(subTotals.montant),
      parMois: subParMois.map((r) => ({ mois: r.mois, nb: num(r.nb), total: num(r.total) })),
      parCompagnie: subParCompagnie.map((r) => ({ compagnieId: r.compagnie_id, nom: r.nom, nb: num(r.nb), total: num(r.total) })),
    };
  }

  return data;
};

/* ══════════════════════════════════════════════════════════════
   Réservations (tous rôles)
   ══════════════════════════════════════════════════════════════ */

const bookingsSummary = async ({ scope = {}, filters = {} } = {}) => {
  const rScope = reservationScope(scope);
  const dc = dateClause('r.date_creation', filters);
  const { where, params } = buildWhere([rScope, dc]);

  const [totals, parJour, parStatut] = await Promise.all([
    q(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(r.nb_places), 0) AS places,
              SUM(CASE WHEN r.statut = 'payee' THEN 1 ELSE 0 END) AS payees,
              SUM(CASE WHEN r.statut = 'confirmee' THEN 1 ELSE 0 END) AS confirmees,
              SUM(CASE WHEN r.statut = 'annulee' THEN 1 ELSE 0 END) AS annulees,
              SUM(CASE WHEN r.statut = 'expiree' THEN 1 ELSE 0 END) AS expirees,
              SUM(CASE WHEN r.statut IN ('en_attente', 'partiellement_payee') THEN 1 ELSE 0 END) AS enAttente,
              COALESCE(SUM(CASE WHEN r.statut IN ('confirmee', 'payee', 'partiellement_payee') THEN r.montant ELSE 0 END), 0) AS montant
       FROM reservation r ${where}`,
      params
    ),
    qall(
      `SELECT DATE(r.date_creation) AS jour,
              COUNT(*) AS nb,
              COALESCE(SUM(r.nb_places), 0) AS places,
              COALESCE(SUM(CASE WHEN r.statut IN ('confirmee', 'payee', 'partiellement_payee') THEN r.montant ELSE 0 END), 0) AS total
       FROM reservation r ${where}
       GROUP BY jour ORDER BY jour`,
      params
    ),
    qall(
      `SELECT r.statut, COUNT(*) AS nb FROM reservation r ${where} GROUP BY r.statut ORDER BY nb DESC`,
      params
    ),
  ]);

  return {
    total: num(totals.total),
    places: num(totals.places),
    payees: num(totals.payees),
    confirmees: num(totals.confirmees),
    annulees: num(totals.annulees),
    expirees: num(totals.expirees),
    enAttente: num(totals.enAttente),
    montant: num(totals.montant),
    parJour: parJour.map((r) => ({ jour: r.jour, nb: num(r.nb), places: num(r.places), total: num(r.total) })),
    parStatut: parStatut.map((r) => ({ statut: r.statut, nb: num(r.nb) })),
  };
};

/* ══════════════════════════════════════════════════════════════
   Voyages (super_admin / company_admin / counter_agent)
   ══════════════════════════════════════════════════════════════ */

const tripsSummary = async ({ scope = {}, filters = {} } = {}) => {
  const dScope = departScope(scope);
  const dc = dateClause('d.date_depart', filters);
  const { where, params } = buildWhere([dScope, dc]);

  const [totals, parJour, parStatut] = await Promise.all([
    q(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN d.statut = 'programme' THEN 1 ELSE 0 END) AS programme,
              SUM(CASE WHEN d.statut = 'embarquement' THEN 1 ELSE 0 END) AS embarquement,
              SUM(CASE WHEN d.statut = 'en_cours' THEN 1 ELSE 0 END) AS enCours,
              SUM(CASE WHEN d.statut = 'termine' THEN 1 ELSE 0 END) AS termines,
              SUM(CASE WHEN d.statut = 'annule' THEN 1 ELSE 0 END) AS annules,
              SUM(CASE WHEN d.statut = 'retarde' THEN 1 ELSE 0 END) AS retardes,
              COALESCE(SUM(d.places_total), 0) AS placesTotal,
              COALESCE(SUM(d.places_total - d.places_dispo), 0) AS placesVendues
       FROM depart d ${where}`,
      params
    ),
    qall(
      `SELECT d.date_depart AS jour,
              COUNT(*) AS nb,
              COALESCE(SUM(d.places_total - d.places_dispo), 0) AS vendues,
              COALESCE(SUM(d.places_total), 0) AS placesTotal
       FROM depart d ${where}
       GROUP BY jour ORDER BY jour`,
      params
    ),
    qall(
      `SELECT d.statut, COUNT(*) AS nb FROM depart d ${where} GROUP BY d.statut ORDER BY nb DESC`,
      params
    ),
  ]);

  return {
    total: num(totals.total),
    programme: num(totals.programme),
    embarquement: num(totals.embarquement),
    enCours: num(totals.enCours),
    termines: num(totals.termines),
    annules: num(totals.annules),
    retardes: num(totals.retardes),
    placesTotal: num(totals.placesTotal),
    placesVendues: num(totals.placesVendues),
    tauxRemplissage: taux(num(totals.placesVendues), num(totals.placesTotal)),
    parJour: parJour.map((r) => ({ jour: r.jour, nb: num(r.nb), vendues: num(r.vendues), placesTotal: num(r.placesTotal) })),
    parStatut: parStatut.map((r) => ({ statut: r.statut, nb: num(r.nb) })),
  };
};

/* ══════════════════════════════════════════════════════════════
   Billets (tous rôles)
   ══════════════════════════════════════════════════════════════ */

const ticketsSummary = async ({ scope = {}, filters = {} } = {}) => {
  const isClient = Boolean(scope.clientId);
  const rScope = reservationScope(scope);
  const dc = dateClause('b.cree_le', filters);

  const from = isClient ? 'FROM billet b' : 'FROM billet b JOIN reservation r ON r.id = b.reservation_id';
  const sc = isClient ? { sql: 'b.client_id = :clientId', params: { clientId: scope.clientId } } : rScope;
  const { where, params } = buildWhere([sc, dc]);

  const [totals, parJour, parStatut] = await Promise.all([
    q(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN b.statut = 'valide' THEN 1 ELSE 0 END) AS valides,
              SUM(CASE WHEN b.statut = 'utilise' THEN 1 ELSE 0 END) AS utilises,
              SUM(CASE WHEN b.statut = 'annule' THEN 1 ELSE 0 END) AS annules,
              SUM(CASE WHEN b.statut = 'rembourse' THEN 1 ELSE 0 END) AS rembourses,
              SUM(CASE WHEN b.statut = 'expire' THEN 1 ELSE 0 END) AS expires,
              COALESCE(SUM(CASE WHEN b.statut IN ('valide', 'utilise') THEN b.prix ELSE 0 END), 0) AS montant
       ${from} ${where}`,
      params
    ),
    qall(
      `SELECT DATE(b.cree_le) AS jour,
              COUNT(*) AS nb,
              COALESCE(SUM(CASE WHEN b.statut IN ('valide', 'utilise') THEN b.prix ELSE 0 END), 0) AS total
       ${from} ${where}
       GROUP BY jour ORDER BY jour`,
      params
    ),
    qall(`SELECT b.statut, COUNT(*) AS nb ${from} ${where} GROUP BY b.statut ORDER BY nb DESC`, params),
  ]);

  return {
    total: num(totals.total),
    valides: num(totals.valides),
    utilises: num(totals.utilises),
    annules: num(totals.annules),
    rembourses: num(totals.rembourses),
    expires: num(totals.expires),
    montant: num(totals.montant),
    parJour: parJour.map((r) => ({ jour: r.jour, nb: num(r.nb), total: num(r.total) })),
    parStatut: parStatut.map((r) => ({ statut: r.statut, nb: num(r.nb) })),
  };
};

/* ══════════════════════════════════════════════════════════════
   Abonnements (Super Admin uniquement)
   ══════════════════════════════════════════════════════════════ */

const subscriptionsSummary = async ({ filters = {} } = {}) => {
  const [parStatut, expirations, parCompagnie] = await Promise.all([
    qall(
      `SELECT ac.statut, COUNT(*) AS nb
       FROM abonnement_compagnie ac
       GROUP BY ac.statut ORDER BY nb DESC`
    ),
    (async () => {
      const dc = dateClause('ac.date_fin', filters);
      const { where, params } = buildWhere([dc]);
      return qall(
        `SELECT ac.compagnie_id, c.nom, ac.date_fin
         FROM abonnement_compagnie ac LEFT JOIN compagnie c ON c.id = ac.compagnie_id
          ${where} AND ac.statut IN ('actif', 'en_retard')
         ORDER BY ac.date_fin ASC LIMIT 10`,
        params
      );
    })(),
    qall(
      `SELECT ac.compagnie_id, c.nom, ac.statut, ac.date_debut, ac.date_fin
       FROM abonnement_compagnie ac LEFT JOIN compagnie c ON c.id = ac.compagnie_id
       ORDER BY ac.date_fin ASC`
    ),
  ]);

  const byStatut = {};
  let total = 0;
  parStatut.forEach((r) => {
    byStatut[r.statut] = num(r.nb);
    total += num(r.nb);
  });

  return {
    total,
    parStatut: byStatut,
    prochainesExpirations: expirations.map((r) => ({
      compagnieId: r.compagnie_id,
      nom: r.nom,
      dateFin: r.date_fin,
    })),
    compagnies: parCompagnie.map((r) => ({
      compagnieId: r.compagnie_id,
      nom: r.nom,
      statut: r.statut,
      dateDebut: r.date_debut,
      dateFin: r.date_fin,
    })),
  };
};

/* ══════════════════════════════════════════════════════════════
   Performances (Super Admin / Company Admin)
   ══════════════════════════════════════════════════════════════ */

const performances = async ({ compagnieId, filters = {} } = {}) => {
  const agencesSub = '(SELECT id FROM agence WHERE compagnie_id = :compagnieId)';
  const guichetsSub = `(SELECT id FROM guichet WHERE agence_id IN ${agencesSub})`;

  const [agences, resByAgence, paiementsByAgence, remplissageByAgence, guichets, resByGuichet, paiementsByGuichet] =
    await Promise.all([
      qall(`SELECT id, nom FROM agence WHERE compagnie_id = :compagnieId ORDER BY nom`, { compagnieId }),
      (async () => {
        const dc = dateClause('r.date_creation', filters);
        const agenceClause = { sql: `r.agence_id IN ${agencesSub}`, params: { compagnieId } };
        const { where, params } = buildWhere([dc, agenceClause]);
        return qall(
          `SELECT r.agence_id,
                  COUNT(*) AS reservations,
                  COALESCE(SUM(r.nb_places), 0) AS places,
                  SUM(CASE WHEN r.statut IN ('confirmee', 'payee', 'partiellement_payee') THEN 1 ELSE 0 END) AS actives
           FROM reservation r ${where}
           GROUP BY r.agence_id`,
          params
        );
      })(),
      (async () => {
        const dc = dateClause(PAIEMENT_DATE, filters);
        const agenceClause = { sql: `r.agence_id IN ${agencesSub}`, params: { compagnieId } };
        const { where, params } = buildWhere([dc, agenceClause, { sql: CONFIRMED }]);
        return qall(
          `SELECT r.agence_id,
                  COUNT(*) AS nb,
                  COALESCE(SUM(p.montant), 0) AS ca
           FROM paiement p JOIN reservation r ON r.id = p.reservation_id ${where}
           GROUP BY r.agence_id`,
          params
        );
      })(),
      (async () => {
        const dc = dateClause('d.date_depart', filters);
        const agenceClause = { sql: `d.agence_id IN ${agencesSub}`, params: { compagnieId } };
        const { where, params } = buildWhere([dc, agenceClause]);
        return qall(
          `SELECT d.agence_id,
                  COALESCE(SUM(d.places_total), 0) AS placesTotal,
                  COALESCE(SUM(d.places_total - d.places_dispo), 0) AS vendues
           FROM depart d ${where}
           GROUP BY d.agence_id`,
          params
        );
      })(),
      qall(`SELECT id, nom, agence_id FROM guichet WHERE agence_id IN ${agencesSub} ORDER BY nom`, { compagnieId }),
      (async () => {
        const dc = dateClause('r.date_creation', filters);
        const guichetClause = { sql: `r.guichet_id IN ${guichetsSub}`, params: { compagnieId } };
        const { where, params } = buildWhere([dc, guichetClause]);
        return qall(
          `SELECT r.guichet_id,
                  COUNT(*) AS reservations,
                  COALESCE(SUM(r.nb_places), 0) AS places
           FROM reservation r ${where}
           GROUP BY r.guichet_id`,
          params
        );
      })(),
      (async () => {
        const dc = dateClause(PAIEMENT_DATE, filters);
        const guichetClause = { sql: `r.guichet_id IN ${guichetsSub}`, params: { compagnieId } };
        const { where, params } = buildWhere([dc, guichetClause, { sql: CONFIRMED }]);
        return qall(
          `SELECT r.guichet_id,
                  COUNT(*) AS nb,
                  COALESCE(SUM(p.montant), 0) AS ca
           FROM paiement p JOIN reservation r ON r.id = p.reservation_id ${where}
           GROUP BY r.guichet_id`,
          params
        );
      })(),
    ]);

  const mapBy = (rows, key) => {
    const m = {};
    rows.forEach((r) => {
      m[r[key]] = r;
    });
    return m;
  };

  const resA = mapBy(resByAgence, 'agence_id');
  const payA = mapBy(paiementsByAgence, 'agence_id');
  const occA = mapBy(remplissageByAgence, 'agence_id');
  const resG = mapBy(resByGuichet, 'guichet_id');
  const payG = mapBy(paiementsByGuichet, 'guichet_id');

  return {
    agences: agences.map((a) => {
      const res = resA[a.id] || {};
      const pay = payA[a.id] || {};
      const occ = occA[a.id] || {};
      return {
        agenceId: a.id,
        nom: a.nom,
        reservations: num(res.reservations),
        places: num(res.places),
        actives: num(res.actives),
        paiements: num(pay.nb),
        ca: num(pay.ca),
        placesTotal: num(occ.placesTotal),
        placesVendues: num(occ.vendues),
        tauxRemplissage: taux(num(occ.vendues), num(occ.placesTotal)),
      };
    }),
    guichets: guichets.map((g) => {
      const res = resG[g.id] || {};
      const pay = payG[g.id] || {};
      return {
        guichetId: g.id,
        nom: g.nom,
        agenceId: g.agence_id,
        reservations: num(res.reservations),
        places: num(res.places),
        paiements: num(pay.nb),
        ca: num(pay.ca),
      };
    }),
  };
};

module.exports = {
  revenueSummary,
  bookingsSummary,
  tripsSummary,
  ticketsSummary,
  subscriptionsSummary,
  performances,
};
