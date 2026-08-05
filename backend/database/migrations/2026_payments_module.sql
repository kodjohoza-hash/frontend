-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE PAYMENTS (Gestion des Paiements)
-- Version : 2026-08-05
-- Nature  : 100% ADDITIVE (aucune donnée supprimée)
--   1. `paiement` : enrichissement pour la gestion & le reporting.
--        - type     : encaissement / remboursement (dérivé du statut pour
--                     l'existant : 'rembourse'/'partiellement_rembourse').
--        - frais    : frais de transaction (par défaut 0).
--        - devise   : monnaie de la transaction (XAF par défaut).
--        - metadata : JSON libre (operatorRef, phone, errorCode, last4,
--                     bankRef, refundRef…).
--      + index sur type / cree_le / methode (reporting).
--
-- Pré-requis : table `paiement` existante (module Bookings).
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_payments_module.sql
-- =====================================================================

-- ── 1. TABLE `paiement` ──────────────────────────────────────────
ALTER TABLE paiement
  ADD COLUMN frais    INT NOT NULL DEFAULT 0 AFTER montant,
  ADD COLUMN devise   CHAR(3) NOT NULL DEFAULT 'XAF' AFTER frais,
  ADD COLUMN type     ENUM('encaissement','remboursement') NOT NULL DEFAULT 'encaissement' AFTER note,
  ADD COLUMN metadata JSON NULL AFTER type;

-- Backfill : les paiements de remboursement existants sont typés.
UPDATE paiement SET type = 'remboursement'
 WHERE statut IN ('rembourse','partiellement_rembourse');

-- ── 2. INDEX (reporting) ─────────────────────────────────────────
ALTER TABLE paiement
  ADD INDEX idx_paiement_type (type),
  ADD INDEX idx_paiement_cree_le (cree_le),
  ADD INDEX idx_paiement_methode (methode);

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
