/**
 * Dashboards agrégés par rôle (Module 18).
 * Chaque fonction exécute uniquement des requêtes COUNT/SUM/GROUP BY parallèles.
 */

const {
  dateClause,
  reservationScope,
  departScope,
  buildWhere,
  q,
  num,
  CONFIRMED,
  REFUNDED,
  taux,
} = require('./statistics.repository');

const DEPART_COUNTS = `
  SUM(CASE WHEN d.statut = 'programme' THEN 1 ELSE 0 END) AS programme,
  SUM(CASE WHEN d.statut = 'embarquement' THEN 1 ELSE 0 END) AS embarquement,
  SUM(CASE WHEN d.statut = 'en_cours' THEN 1 ELSE 0 END) AS enCours,
  SUM(CASE WHEN d.statut = 'termine' THEN 1 ELSE 0 END) AS termines,
  SUM(CASE WHEN d.statut = 'annule' THEN 1 ELSE 0 END) AS annules`;

const RESERVATION_ACTIVE = "r.statut IN ('confirmee', 'payee', 'partiellement_payee')";

/* ══════════════════════════════════════════════════════════════
   Dashboard global (Super Admin)
   ══════════════════════════════════════════════════════════════ */

const platformDashboard = async ({ filters = {} } = {}) => {
  const [compagnies, agences, guichets, clients, abonnements, departures, reservations, billets, paiements, abonnementRevenu, remboursements] =
    await Promise.all([
      q(`SELECT COUNT(*) AS total,
                SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) AS actives,
                SUM(CASE WHEN statut = 'suspendu' THEN 1 ELSE 0 END) AS suspendues
           FROM compagnie`),
      q(`SELECT COUNT(*) AS total,
                SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) AS actives
           FROM agence`),
      q(`SELECT COUNT(*) AS total,
                SUM(CASE WHEN statut = 'ouvert' THEN 1 ELSE 0 END) AS ouverts
           FROM guichet`),
      q(`SELECT COUNT(*) AS total,
                SUM(CASE WHEN statut IN ('actif', 'vip') THEN 1 ELSE 0 END) AS actifs
           FROM client`),
      q(`SELECT SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) AS actifs,
                SUM(CASE WHEN statut = 'en_retard' THEN 1 ELSE 0 END) AS enRetard,
                SUM(CASE WHEN statut = 'expire' THEN 1 ELSE 0 END) AS expires,
                SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) AS enAttente,
                SUM(CASE WHEN statut = 'suspendu' THEN 1 ELSE 0 END) AS suspendus
           FROM abonnement_compagnie`),
      (async () => {
        const dc = dateClause('d.date_depart', filters);
        const { where, params } = buildWhere([dc]);
        return q(
          `SELECT COUNT(*) AS total, ${DEPART_COUNTS},
                  COALESCE(SUM(d.places_total), 0) AS placesTotal,
                  COALESCE(SUM(d.places_total - d.places_dispo), 0) AS placesVendues
           FROM depart d ${where}`,
          params
        );
      })(),
      (async () => {
        const dc = dateClause('r.date_creation', filters);
        const { where, params } = buildWhere([dc]);
        return q(
          `SELECT COUNT(*) AS total,
                  COALESCE(SUM(r.nb_places), 0) AS places,
                  SUM(CASE WHEN ${RESERVATION_ACTIVE} THEN 1 ELSE 0 END) AS actives,
                  SUM(CASE WHEN r.statut = 'annulee' THEN 1 ELSE 0 END) AS annulees
           FROM reservation r ${where}`,
          params
        );
      })(),
      (async () => {
        const dc = dateClause('b.cree_le', filters);
        const { where, params } = buildWhere([dc]);
        return q(
          `SELECT COUNT(*) AS total,
                  SUM(CASE WHEN b.statut = 'utilise' THEN 1 ELSE 0 END) AS utilises,
                  SUM(CASE WHEN b.statut = 'valide' THEN 1 ELSE 0 END) AS valides,
                  COALESCE(SUM(CASE WHEN b.statut IN ('valide', 'utilise') THEN b.prix ELSE 0 END), 0) AS montant
           FROM billet b ${where}`,
          params
        );
      })(),
      (async () => {
        const dc = dateClause('COALESCE(p.paiement_le, p.cree_le)', filters);
        const { where, params } = buildWhere([dc, { sql: CONFIRMED }]);
        return q(
          `SELECT COUNT(*) AS nb, COALESCE(SUM(p.montant), 0) AS montant
           FROM paiement p ${where}`,
          params
        );
      })(),
      (async () => {
        const dc = dateClause('pa.date', filters);
        const { where, params } = buildWhere([dc, { sql: "pa.statut = 'paye'" }]);
        return q(
          `SELECT COUNT(*) AS nb, COALESCE(SUM(pa.montant), 0) AS montant
           FROM paiement_abonnement_compagnie pa ${where}`,
          params
        );
      })(),
      (async () => {
        const dc = dateClause('COALESCE(p.paiement_le, p.cree_le)', filters);
        const { where, params } = buildWhere([dc, { sql: REFUNDED }]);
        return q(
          `SELECT COUNT(*) AS nb, COALESCE(SUM(p.remboursement), 0) AS montant
           FROM paiement p ${where}`,
          params
        );
      })(),
    ]);

  const revTransactions = num(paiements.montant);
  const revAbonnements = num(abonnementRevenu.montant);
  const remb = num(remboursements.montant);

  return {
    compagnies: { total: num(compagnies.total), actives: num(compagnies.actives), suspendues: num(compagnies.suspendues) },
    agences: { total: num(agences.total), actives: num(agences.actives) },
    guichets: { total: num(guichets.total), ouverts: num(guichets.ouverts) },
    clients: { total: num(clients.total), actifs: num(clients.actifs) },
    abonnements: {
      actifs: num(abonnements.actifs),
      enRetard: num(abonnements.enRetard),
      expires: num(abonnements.expires),
      enAttente: num(abonnements.enAttente),
      suspendus: num(abonnements.suspendus),
    },
    voyages: {
      total: num(departures.total),
      programme: num(departures.programme),
      embarquement: num(departures.embarquement),
      enCours: num(departures.enCours),
      termines: num(departures.termines),
      annules: num(departures.annules),
      placesTotal: num(departures.placesTotal),
      placesVendues: num(departures.placesVendues),
      tauxRemplissage: taux(num(departures.placesVendues), num(departures.placesTotal)),
    },
    reservations: {
      total: num(reservations.total),
      places: num(reservations.places),
      actives: num(reservations.actives),
      annulees: num(reservations.annulees),
    },
    billets: {
      total: num(billets.total),
      utilises: num(billets.utilises),
      valides: num(billets.valides),
      montant: num(billets.montant),
    },
    paiements: { nb: num(paiements.nb), montant: revTransactions },
    revenu: {
      transactions: { nb: num(paiements.nb), montant: revTransactions },
      abonnements: { nb: num(abonnementRevenu.nb), montant: revAbonnements },
      remboursements: { nb: num(remboursements.nb), montant: remb },
      net: revTransactions + revAbonnements - remb,
    },
  };
};

/* ══════════════════════════════════════════════════════════════
   Dashboard compagnie (Company Admin)
   ══════════════════════════════════════════════════════════════ */

const companyDashboard = async ({ compagnieId, filters = {} } = {}) => {
  const rScope = reservationScope({ compagnieId });
  const dScope = departScope({ compagnieId });

  const [voyages, reservations, billets, paiements, remboursements, compteurs] = await Promise.all([
    (async () => {
      const dc = dateClause('d.date_depart', filters);
      const { where, params } = buildWhere([dScope, dc]);
      return q(
        `SELECT COUNT(*) AS total, ${DEPART_COUNTS},
                SUM(CASE WHEN d.statut = 'retarde' THEN 1 ELSE 0 END) AS retardes,
                COALESCE(SUM(d.places_total), 0) AS placesTotal,
                COALESCE(SUM(d.places_total - d.places_dispo), 0) AS placesVendues
         FROM depart d ${where}`,
        params
      );
    })(),
    (async () => {
      const dc = dateClause('r.date_creation', filters);
      const { where, params } = buildWhere([rScope, dc]);
      return q(
        `SELECT COUNT(*) AS total,
                COALESCE(SUM(r.nb_places), 0) AS places,
                SUM(CASE WHEN r.statut = 'payee' THEN 1 ELSE 0 END) AS payees,
                SUM(CASE WHEN r.statut = 'confirmee' THEN 1 ELSE 0 END) AS confirmees,
                SUM(CASE WHEN ${RESERVATION_ACTIVE} THEN 1 ELSE 0 END) AS actives,
                SUM(CASE WHEN r.statut = 'annulee' THEN 1 ELSE 0 END) AS annulees,
                COALESCE(SUM(CASE WHEN ${RESERVATION_ACTIVE} THEN r.montant ELSE 0 END), 0) AS montant
         FROM reservation r ${where}`,
        params
      );
    })(),
    (async () => {
      const dc = dateClause('b.cree_le', filters);
      const { where, params } = buildWhere([rScope, dc]);
      return q(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN b.statut = 'utilise' THEN 1 ELSE 0 END) AS utilises,
                SUM(CASE WHEN b.statut = 'valide' THEN 1 ELSE 0 END) AS valides,
                SUM(CASE WHEN b.statut = 'annule' THEN 1 ELSE 0 END) AS annules,
                COALESCE(SUM(CASE WHEN b.statut IN ('valide', 'utilise') THEN b.prix ELSE 0 END), 0) AS montant
         FROM billet b JOIN reservation r ON r.id = b.reservation_id ${where}`,
        params
      );
    })(),
    (async () => {
      const dc = dateClause('COALESCE(p.paiement_le, p.cree_le)', filters);
      const { where, params } = buildWhere([rScope, dc]);
      return q(
        `SELECT COUNT(*) AS nb, COALESCE(SUM(p.montant), 0) AS montant
         FROM paiement p JOIN reservation r ON r.id = p.reservation_id ${where} AND ${CONFIRMED}`,
        params
      );
    })(),
    (async () => {
      const dc = dateClause('COALESCE(p.paiement_le, p.cree_le)', filters);
      const { where, params } = buildWhere([rScope, dc]);
      return q(
        `SELECT COUNT(*) AS nb, COALESCE(SUM(p.remboursement), 0) AS montant
         FROM paiement p JOIN reservation r ON r.id = p.reservation_id ${where} AND ${REFUNDED}`,
        params
      );
    })(),
    (async () => {
      const [agences, guichets] = await Promise.all([
        q(`SELECT COUNT(*) AS total FROM agence WHERE compagnie_id = :compagnieId AND statut = 'actif'`, { compagnieId }),
        q(`SELECT COUNT(*) AS total FROM guichet WHERE agence_id IN (SELECT id FROM agence WHERE compagnie_id = :compagnieId)`, {
          compagnieId,
        }),
      ]);
      return { agences: num(agences.total), guichets: num(guichets.total) };
    })(),
  ]);

  return {
    compagnie: { id: compagnieId },
    agences: compteurs.agences,
    guichets: compteurs.guichets,
    voyages: {
      total: num(voyages.total),
      programme: num(voyages.programme),
      embarquement: num(voyages.embarquement),
      enCours: num(voyages.enCours),
      termines: num(voyages.termines),
      annules: num(voyages.annules),
      retardes: num(voyages.retardes),
      placesTotal: num(voyages.placesTotal),
      placesVendues: num(voyages.placesVendues),
      tauxRemplissage: taux(num(voyages.placesVendues), num(voyages.placesTotal)),
    },
    reservations: {
      total: num(reservations.total),
      places: num(reservations.places),
      payees: num(reservations.payees),
      confirmees: num(reservations.confirmees),
      actives: num(reservations.actives),
      annulees: num(reservations.annulees),
      montant: num(reservations.montant),
    },
    billets: {
      total: num(billets.total),
      utilises: num(billets.utilises),
      valides: num(billets.valides),
      annules: num(billets.annules),
      montant: num(billets.montant),
    },
    paiements: {
      nb: num(paiements.nb),
      montant: num(paiements.montant),
      remboursements: { nb: num(remboursements.nb), montant: num(remboursements.montant) },
      net: num(paiements.montant) - num(remboursements.montant),
    },
  };
};

/* ══════════════════════════════════════════════════════════════
   Dashboard guichet (Counter Agent)
   ══════════════════════════════════════════════════════════════ */

const counterDashboard = async ({ scope, filters = {}, today } = {}) => {
  const rScope = reservationScope(scope);
  const dScope = departScope(scope);
  const tdcR = dateClause('r2.date_creation', { dateDebut: today, dateFin: today });
  const tdcB = dateClause('b2.cree_le', { dateDebut: today, dateFin: today });
  const tdcP = dateClause('COALESCE(p2.paiement_le, p2.cree_le)', { dateDebut: today, dateFin: today });
  const rScopeSub = reservationScope(scope);
  if (rScopeSub.sql) rScopeSub.sql = rScopeSub.sql.replaceAll('r.', 'r2.');
  const tdcP3 = dateClause('COALESCE(p3.paiement_le, p3.cree_le)', { dateDebut: today, dateFin: today });
  const rScope3 = reservationScope(scope);
  if (rScope3.sql) rScope3.sql = rScope3.sql.replaceAll('r.', 'r3.');

  const [reservations, billets, paiements, voyages, clientsServis] = await Promise.all([
    (async () => {
      const dc = dateClause('r.date_creation', filters);
      const td = buildWhere([rScopeSub, tdcR]);
      const { where, params } = buildWhere([rScope, dc]);
      return q(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN ${RESERVATION_ACTIVE} THEN 1 ELSE 0 END) AS actives,
                SUM(CASE WHEN r.statut = 'annulee' THEN 1 ELSE 0 END) AS annulees,
                COALESCE(SUM(r.montant), 0) AS montant,
                 (SELECT COUNT(*) FROM reservation r2 ${td.where}) AS aujourdhui
         FROM reservation r ${where}`,
        { ...params, ...td.params }
      );
    })(),
    (async () => {
      const dc = dateClause('b.cree_le', filters);
      const tb = buildWhere([rScopeSub, tdcB]);
      const { where, params } = buildWhere([rScope, dc]);
      return q(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN b.statut = 'utilise' THEN 1 ELSE 0 END) AS utilises,
                COALESCE(SUM(CASE WHEN b.statut IN ('valide', 'utilise') THEN b.prix ELSE 0 END), 0) AS montant,
                 (SELECT COUNT(*) FROM billet b2 JOIN reservation r2 ON r2.id = b2.reservation_id ${tb.where}) AS aujourdhui
         FROM billet b JOIN reservation r ON r.id = b.reservation_id ${where}`,
        { ...params, ...tb.params }
      );
    })(),
    (async () => {
      const dc = dateClause('COALESCE(p.paiement_le, p.cree_le)', filters);
      const tp = buildWhere([rScopeSub, tdcP]);
      const tp3 = buildWhere([rScope3, tdcP3]);
      const { where, params } = buildWhere([rScope, dc]);
      return q(
        `SELECT COUNT(*) AS nb,
                COALESCE(SUM(p.montant), 0) AS montant,
                (SELECT COUNT(*) FROM paiement p2 JOIN reservation r2 ON r2.id = p2.reservation_id ${tp.where} AND ${CONFIRMED.replaceAll('p.', 'p2.')}) AS aujourdhui,
                 (SELECT COALESCE(SUM(p3.montant), 0) FROM paiement p3 JOIN reservation r3 ON r3.id = p3.reservation_id ${tp3.where} AND ${CONFIRMED.replaceAll('p.', 'p3.')}) AS montantAujourdhui
         FROM paiement p JOIN reservation r ON r.id = p.reservation_id ${where} AND ${CONFIRMED}`,
        { ...params, ...tp.params, ...tp3.params }
      );
    })(),
    (async () => {
      const dc = dateClause('d.date_depart', { dateDebut: today, dateFin: today });
      const { where, params } = buildWhere([dScope, dc]);
      return q(
        `SELECT COUNT(*) AS total, ${DEPART_COUNTS} FROM depart d ${where}`,
        params
      );
    })(),
    (async () => {
      const dc = dateClause('r.date_creation', filters);
      const { where, params } = buildWhere([rScope, dc]);
      return q(`SELECT COUNT(DISTINCT r.client_id) AS total FROM reservation r ${where}`, params);
    })(),
  ]);

  return {
    reservations: {
      total: num(reservations.total),
      aujourdhui: num(reservations.aujourdhui),
      actives: num(reservations.actives),
      annulees: num(reservations.annulees),
      montant: num(reservations.montant),
    },
    billets: {
      total: num(billets.total),
      aujourdhui: num(billets.aujourdhui),
      utilises: num(billets.utilises),
      montant: num(billets.montant),
    },
    paiements: {
      nb: num(paiements.nb),
      aujourdhui: num(paiements.aujourdhui),
      montant: num(paiements.montant),
      montantAujourdhui: num(paiements.montantAujourdhui),
    },
    voyages: {
      total: num(voyages.total),
      programme: num(voyages.programme),
      embarquement: num(voyages.embarquement),
      enCours: num(voyages.enCours),
      termines: num(voyages.termines),
      annules: num(voyages.annules),
    },
    clientsServis: num(clientsServis.total),
  };
};

/* ══════════════════════════════════════════════════════════════
   Dashboard client
   ══════════════════════════════════════════════════════════════ */

const clientDashboard = async ({ clientId, filters = {}, today } = {}) => {
  const rScope = reservationScope({ clientId });
  const dcR = dateClause('r.date_creation', filters);
  const dcB = dateClause('b.cree_le', filters);
  const clientClause = { sql: 'b.client_id = :clientId', params: { clientId } };

  const [reservations, billets, voyagesAvenir, depenses] = await Promise.all([
    (async () => {
      const { where, params } = buildWhere([rScope, dcR]);
      return q(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN r.statut = 'payee' THEN 1 ELSE 0 END) AS payees,
                SUM(CASE WHEN r.statut = 'confirmee' THEN 1 ELSE 0 END) AS confirmees,
                SUM(CASE WHEN r.statut = 'annulee' THEN 1 ELSE 0 END) AS annulees,
                SUM(CASE WHEN ${RESERVATION_ACTIVE} AND d.date_depart >= :today THEN 1 ELSE 0 END) AS aVenir
         FROM reservation r JOIN depart d ON d.id = r.depart_id ${where}`,
        { ...params, today }
      );
    })(),
    (async () => {
      const { where, params } = buildWhere([clientClause, dcB]);
      return q(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN b.statut = 'utilise' THEN 1 ELSE 0 END) AS effectues,
                SUM(CASE WHEN b.statut = 'valide' THEN 1 ELSE 0 END) AS valides,
                SUM(CASE WHEN b.statut = 'annule' THEN 1 ELSE 0 END) AS annules,
                SUM(CASE WHEN b.statut = 'rembourse' THEN 1 ELSE 0 END) AS rembourses
         FROM billet b ${where}`,
        params
      );
    })(),
    (async () => {
      const { where, params } = buildWhere([rScope]);
      return q(
        `SELECT COUNT(DISTINCT r.depart_id) AS total, MIN(d.date_depart) AS prochain
         FROM reservation r JOIN depart d ON d.id = r.depart_id
          ${where} AND ${RESERVATION_ACTIVE} AND d.date_depart >= :today`,
        { ...params, today }
      );
    })(),
    (async () => {
      const { where, params } = buildWhere([clientClause, dcB]);
      return q(
        `SELECT COALESCE(SUM(CASE WHEN b.statut IN ('valide', 'utilise') THEN b.prix ELSE 0 END), 0) AS total
         FROM billet b ${where}`,
        params
      );
    })(),
  ]);

  return {
    reservations: {
      total: num(reservations.total),
      payees: num(reservations.payees),
      confirmees: num(reservations.confirmees),
      annulees: num(reservations.annulees),
      aVenir: num(reservations.aVenir),
    },
    billets: {
      total: num(billets.total),
      effectues: num(billets.effectues),
      valides: num(billets.valides),
      annules: num(billets.annules),
      rembourses: num(billets.rembourses),
    },
    voyages: {
      effectues: num(billets.effectues),
      aVenir: num(voyagesAvenir.total),
      prochain: voyagesAvenir.prochain,
    },
    depenses: num(depenses.total),
  };
};

module.exports = { platformDashboard, companyDashboard, counterDashboard, clientDashboard };
