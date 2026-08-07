-- =====================================================================
-- BUS TIX CONNECT — MIGRATION STANDARDISATION DEVISE (XAF)
-- Version : 2026-08-07
-- Nature  : ADDITIVE + normalisation des données (aucun montant modifié)
--   1. `paiement.devise` : DEFAULT 'XAF' (code ISO 4217, Franc CFA BEAC).
--   2. Données : toute valeur héritée 'XOF' est remplacée par 'XAF'
--      (même zone monétaire — 1 FCFA BCEAO = 1 FCFA BEAC — les montants
--      numériques ne sont JAMAIS convertis, seule l'unité est normalisée).
-- Idempotente : peut être exécutée plusieurs fois sans effet de bord.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_currency_xaf.sql
-- =====================================================================

-- ── 1. Valeurs héritées (XOF -> XAF) ──────────────────────────────
UPDATE paiement SET devise = 'XAF' WHERE devise = 'XOF';

-- ── 2. Défaut de colonne ──────────────────────────────────────────
ALTER TABLE paiement
  MODIFY devise CHAR(3) NOT NULL DEFAULT 'XAF';
