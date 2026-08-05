-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE BOOKINGS (Réservations)
-- Version : 2026-08-05
-- Nature  : 100% ADDITIVE (aucune donnée supprimée)
--   1. `reservation` : agent_id devient NULL (réservations en ligne sans agent),
--      ajout de guichet_id, mode_reservation, mode_paiement, nb_places,
--      remise, taxes, observations, et extension de l'ENUM statut.
--   2. `place_reservee` : colonne tarif (prix unitaire du siège).
--   3. `paiement` : agent_id devient NULL (paiements en ligne sans agent).
--
-- Statuts réservation (alignés sur la demande) :
--   BROUILLON → brouillon     (brouillon, sièges bloqués jusqu'à expiration)
--   EN ATTENTE → en_attente   (en attente de paiement, expiration 30 min)
--   CONFIRMÉE → confirmee     (confirmée, paiement non finalisé)
--   PAYÉE → payee             (entièrement payée)
--   PARTIELLEMENT PAYÉE → partiellement_payee
--   ANNULÉE → annulee
--   EXPIRÉE → expiree
--   REMBOURSÉE → remboursee
--   CONVERTIE → convertie     (valeur historique MCD, conservée)
--
-- Modes réservation : en_ligne / guichet / telephone
-- Modes paiement   : orange_money / mtn_money / carte_bancaire / especes /
--                    virement_bancaire / bon_reduction / code_promo
--
-- Pré-requis : tables `reservation`, `place_reservee`, `paiement`,
--              `guichet`, `agent`, `agence` existantes.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_bookings_module.sql
-- =====================================================================

-- ── 1. TABLE `reservation` ─────────────────────────────────────────
ALTER TABLE reservation
  MODIFY COLUMN agent_id CHAR(10) NULL,
  ADD COLUMN guichet_id       CHAR(10) NULL AFTER agent_id,
  ADD COLUMN mode_reservation ENUM('en_ligne','guichet','telephone')
                              NOT NULL DEFAULT 'en_ligne' AFTER guichet_id,
  ADD COLUMN mode_paiement    ENUM('orange_money','mtn_money','carte_bancaire','especes','virement_bancaire','bon_reduction','code_promo')
                              NULL AFTER mode_reservation,
  ADD COLUMN nb_places        SMALLINT NOT NULL DEFAULT 1 AFTER mode_paiement,
  ADD COLUMN remise           INT NOT NULL DEFAULT 0 AFTER montant,
  ADD COLUMN taxes            INT NOT NULL DEFAULT 0 AFTER remise,
  ADD COLUMN observations     VARCHAR(500) NULL AFTER motif_annulation;

ALTER TABLE reservation
  MODIFY COLUMN statut ENUM('brouillon','en_attente','confirmee','payee','partiellement_payee','annulee','expiree','remboursee','convertie')
                       NOT NULL DEFAULT 'en_attente';

ALTER TABLE reservation
  ADD INDEX idx_reservation_statut (statut),
  ADD INDEX idx_reservation_date_creation (date_creation),
  ADD KEY fk_res_guichet (guichet_id),
  ADD CONSTRAINT fk_res_guichet
    FOREIGN KEY (guichet_id) REFERENCES guichet (id) ON DELETE SET NULL;

-- ── 2. TABLE `place_reservee` ──────────────────────────────────────
ALTER TABLE place_reservee
  ADD COLUMN tarif INT NULL AFTER nom_passager,
  ADD INDEX idx_place_reservee_siege (siege);

-- ── 3. TABLE `paiement` ────────────────────────────────────────────
ALTER TABLE paiement
  MODIFY COLUMN agent_id CHAR(10) NULL;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
