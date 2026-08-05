-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE TICKETS (Billets Électroniques)
-- Version : 2026-08-05
-- Nature  : 100% ADDITIVE (aucune donnée supprimée)
--   1. `billet` : enrichissement pour l'émission automatique de billets
--      électroniques à la confirmation du paiement d'une réservation.
--        - nom_passager   : passager du siège (un billet = un passager = un siège).
--        - token          : jeton d'authentification unique du billet (vérification
--                           sécurisée, double utilisation).
--        - signature      : signature HMAC-SHA256 du contenu du billet (clé JWT).
--        - validite_jusqua: fin de validité (départ du voyage).
--        - email_envoye   : drapeau envoi email du billet (étape envois).
--        - sms_envoye     : drapeau envoi SMS du billet (étape envois).
--      + `cree_par` devient NULLABLE : un billet peut être émis automatiquement
--        par le système (paiement en ligne) sans agent rattaché.
--      + clé unique (reservation_id, siege) : garantit UN billet par siège.
--      + clé unique (token) : jeton de vérification infalsifiable.
--
-- Pré-requis : table `billet` existante (schéma MCD).
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_tickets_module.sql
-- =====================================================================

-- ── 1. TABLE `billet` ─────────────────────────────────────────────
ALTER TABLE billet
  ADD COLUMN nom_passager    VARCHAR(120)  NULL AFTER siege,
  ADD COLUMN token           VARCHAR(48)   NULL AFTER code_barre,
  ADD COLUMN signature       VARCHAR(128)  NULL AFTER token,
  ADD COLUMN validite_jusqua DATETIME      NULL AFTER cree_le,
  ADD COLUMN email_envoye    TINYINT(1)    NOT NULL DEFAULT 0 AFTER validite_jusqua,
  ADD COLUMN sms_envoye      TINYINT(1)    NOT NULL DEFAULT 0 AFTER email_envoye,
  MODIFY COLUMN cree_par     CHAR(10)      NULL;

-- ── 2. INDEX / CONTRAINTES (intégrité) ────────────────────────────
ALTER TABLE billet
  ADD UNIQUE KEY uq_billet_token (token),
  ADD UNIQUE KEY uq_billet_reservation_siege (reservation_id, siege);

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
