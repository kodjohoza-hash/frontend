-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE TICKETS / ÉTAPE 2 (QR SECURISÉ)
-- Version : 2026-08-05
-- Nature  : 100% ADDITIVE (aucune donnée supprimée)
--   1. `billet` : QR code sécurisé.
--        - token_hash     : empreinte SHA-256 du jeton (vérification par
--                           hash — le jeton n'est jamais indexé en clair).
--        - qr_version     : version du QR (incrémentée à chaque régénération ;
--                           un ancien QR devient automatiquement invalide).
--        - regenerations  : compteur de régénérations (audit anti-fraude).
--      + backfill des lignes existantes :
--          token_hash = SHA2(token), qr_version = 1, regenerations = 0,
--          qr_code    = "BTC:<ticket_id>:<token>:<version>" (le QR ne contient
--                       QUE ticket_id, token, version — aucune donnée sensible).
--          signature  = NULL (l'ancienne signature couvrait un ancien format ;
--                       les nouveaux billets signent le payload QR).
--   2. `scan_billet` : journal de vérification (anti-fraude).
--        Chaque scan est enregistré : billet, agent, guichet (agence),
--        compagnie, résultat, raison du refus, adresse IP, date/heure.
--
-- Pré-requis : migration 2026_tickets_module.sql appliquée.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_tickets_qrcode.sql
-- =====================================================================

-- ── 1. TABLE `billet` ─────────────────────────────────────────────
ALTER TABLE billet
  ADD COLUMN token_hash    VARCHAR(64) NULL AFTER token,
  ADD COLUMN qr_version    TINYINT     NOT NULL DEFAULT 1 AFTER token_hash,
  ADD COLUMN regenerations INT         NOT NULL DEFAULT 0 AFTER qr_version;

ALTER TABLE billet
  ADD UNIQUE KEY uq_billet_token_hash (token_hash);

-- ── 2. BACKFILL (lignes existantes) ───────────────────────────────
UPDATE billet
   SET token_hash = SHA2(token, 256),
       qr_version = 1,
       regenerations = 0,
       signature = NULL
 WHERE token IS NOT NULL;

UPDATE billet
   SET qr_code = CONCAT('BTC:', id, ':', token, ':', COALESCE(qr_version, 1))
 WHERE token IS NOT NULL;

-- ── 3. TABLE `scan_billet` (journal des scans) ────────────────────
CREATE TABLE IF NOT EXISTS scan_billet (
  id               CHAR(15)     NOT NULL,
  billet_id        CHAR(15)     NOT NULL,
  scanner_agent_id CHAR(10)     NULL,
  client_id        CHAR(12)     NULL,
  agence_id        CHAR(10)     NULL,
  compagnie_id     CHAR(10)     NULL,
  statut           VARCHAR(20)  NOT NULL,
  raison           VARCHAR(120) NULL,
  adresse_ip       VARCHAR(45)  NULL,
  cree_le          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_scan_billet_billet (billet_id),
  KEY idx_scan_billet_date (cree_le),
  KEY idx_scan_billet_statut (statut),
  KEY idx_scan_billet_agence (agence_id),
  KEY idx_scan_billet_compagnie (compagnie_id),
  CONSTRAINT fk_scan_billet_billet FOREIGN KEY (billet_id) REFERENCES billet (id),
  CONSTRAINT fk_scan_billet_agent FOREIGN KEY (scanner_agent_id) REFERENCES agent (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
