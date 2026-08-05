-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE PAYMENTS (LEDGER COMPLET)
-- Version : 2026-08-05
-- Nature  : 100% ADDITIVE (aucune donnée supprimée/modifiée en volume)
-- Objectif : compléter la table `paiement` pour en faire le grand livre
-- des paiements unique :
--   1. Statut `initie` (INITIATED) ajouté au flux de vie d'un paiement.
--   2. Modes Express Union Mobile + Autre.
--   3. Référence fournisseur + fournisseur (provider) de la transaction.
--   4. Catégorie métier : reservation / abonnement / complement /
--      remboursement / manuel (la colonne `type` reste le sens de flux :
--      encaissement / remboursement).
--   5. Lien abonnement compagnie (nullable) + compagnie + guichet.
-- Pré-requis : migration `2026_payments_module.sql` appliquée.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_payments_ledger.sql
-- =====================================================================

-- ── 1. TABLE `paiement` : enum étendus ──────────────────────────
ALTER TABLE paiement
  MODIFY COLUMN statut ENUM('initie','paye','en_attente','echoue','annule','rembourse','partiellement_rembourse') NOT NULL,
  MODIFY COLUMN methode ENUM('orange_money','mtn_money','carte_bancaire','especes','virement_bancaire','bon_reduction','code_promo','express_union_mobile','autre') NOT NULL;

-- ── 2. TABLE `paiement` : nouvelles colonnes ────────────────────
ALTER TABLE paiement
  ADD COLUMN reference_fournisseur VARCHAR(100) NULL AFTER note,
  ADD COLUMN provider VARCHAR(100) NULL AFTER reference_fournisseur,
  ADD COLUMN categorie ENUM('reservation','abonnement','complement','remboursement','manuel') NOT NULL DEFAULT 'reservation' AFTER type,
  ADD COLUMN abonnement_compagnie_id INT NULL AFTER categorie,
  ADD COLUMN compagnie_id CHAR(4) NULL AFTER abonnement_compagnie_id,
  ADD COLUMN guichet_id CHAR(10) NULL AFTER compagnie_id;

-- Backfill des catégories pour l'existant.
UPDATE paiement SET categorie = 'remboursement' WHERE type = 'remboursement';
UPDATE paiement SET categorie = 'manuel'
 WHERE categorie = 'reservation' AND reservation_id IS NULL;

-- ── 3. TABLE `reservation` : modes alignés sur le paiement ──────
-- Nécessaire : `booking.pay` recopie `mode_paiement` depuis le mode choisi.
ALTER TABLE reservation
  MODIFY COLUMN mode_paiement ENUM('orange_money','mtn_money','carte_bancaire','especes','virement_bancaire','bon_reduction','code_promo','express_union_mobile','autre') NULL;

-- ── 4. INDEX (reporting / filtre) ───────────────────────────────
ALTER TABLE paiement
  ADD INDEX idx_paiement_categorie (categorie),
  ADD INDEX idx_paiement_abonnement_compagnie (abonnement_compagnie_id),
  ADD INDEX idx_paiement_compagnie (compagnie_id),
  ADD INDEX idx_paiement_guichet (guichet_id);

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
