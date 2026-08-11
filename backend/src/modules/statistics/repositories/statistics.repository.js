/**
 * Repository du module Statistiques.
 * Toutes les métriques sont calculées par agrégation SQL (COUNT/SUM/GROUP BY)
 * directement en base — aucun chargement de lignes en mémoire (pas de N+1).
 * L'isolation entre rôles est réalisée ICI, jamais côté frontend.
 */

const { sequelize } = require('../../../models');
const { QueryTypes } = require('sequelize');

/* ══════════════════════════════════════════════════════════════
   Helpers de construction SQL
   ══════════════════════════════════════════════════════════════ */

/** Clause de dates sur une colonne DATE : dateDebut/dateFin (bornes incluses). */
const dateClause = (col, { dateDebut = null, dateFin = null } = {}) => {
  const parts = [];
  const params = {};
  if (dateDebut) {
    parts.push(`DATE(${col}) >= :dateDebut`);
    params.dateDebut = dateDebut;
  }
  if (dateFin) {
    parts.push(`DATE(${col}) <= :dateFin`);
    params.dateFin = dateFin;
  }
  return { sql: parts.join(' AND '), params };
};

/** Périmètre d'accès appliqué à la table reservation (alias r). */
const reservationScope = (scope = {}) => {
  if (scope.clientId) {
    return { sql: 'r.client_id = :clientId', params: { clientId: scope.clientId } };
  }
  if (scope.compagnieId) {
    return {
      sql: 'r.agence_id IN (SELECT id FROM agence WHERE compagnie_id = :compagnieId)',
      params: { compagnieId: scope.compagnieId },
    };
  }
  if (scope.guichetId) {
    return { sql: 'r.guichet_id = :guichetId', params: { guichetId: scope.guichetId } };
  }
  if (scope.agentId) {
    return { sql: 'r.agent_id = :agentId', params: { agentId: scope.agentId } };
  }
  if (scope.agenceId) {
    return { sql: 'r.agence_id = :agenceId', params: { agenceId: scope.agenceId } };
  }
  return { sql: '', params: {} };
};

/** Périmètre d'accès appliqué à la table depart (alias d). */
const departScope = (scope = {}) => {
  if (scope.compagnieId) {
    return { sql: 'd.compagnie_id = :compagnieId', params: { compagnieId: scope.compagnieId } };
  }
  if (scope.agenceId) {
    return { sql: 'd.agence_id = :agenceId', params: { agenceId: scope.agenceId } };
  }
  return { sql: '', params: {} };
};

/**
 * Source de la requête paiement selon le périmètre.
 * Pour un client : filtre direct sur p.client_id (aucun JOIN nécessaire).
 * Sinon : JOIN reservation pour appliquer le périmètre (compagnie/agence/guichet/agent).
 */
const paymentSource = (scope = {}) => {
  if (scope.clientId) {
    return {
      from: 'FROM paiement p',
      scope: { sql: 'p.client_id = :clientId', params: { clientId: scope.clientId } },
    };
  }
  return {
    from: 'FROM paiement p JOIN reservation r ON r.id = p.reservation_id',
    scope: reservationScope(scope),
  };
};

/** Assemble les clauses en WHERE + params fusionnés. */
const buildWhere = (clauses) => {
  const parts = clauses.map((c) => c.sql).filter(Boolean);
  const params = clauses.reduce((acc, c) => ({ ...acc, ...c.params }), {});
  return {
    where: parts.length ? `WHERE ${parts.join(' AND ')}` : '',
    params,
  };
};

const q = async (sql, params = {}) => {
  const [rows] = await sequelize.query(sql, { replacements: params, type: QueryTypes.SELECT });
  return rows;
};

const qall = async (sql, params = {}) => {
  const rows = await sequelize.query(sql, { replacements: params, type: QueryTypes.SELECT });
  return rows;
};

const num = (v) => Number(v ?? 0);

/** Paiements encaissés confirmés : jamais echoue/annule/en_attente/initie. */
const CONFIRMED = "p.statut = 'paye' AND p.type = 'encaissement'";
/** Remboursements (montant dans la colonne remboursement). */
const REFUNDED = "p.statut IN ('rembourse', 'partiellement_rembourse')";
/** Taux de remplissage (0..1, 3 décimales). */
const taux = (vendues, total) => (total ? Math.round((vendues / total) * 1000) / 1000 : 0);

module.exports = {
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
};
