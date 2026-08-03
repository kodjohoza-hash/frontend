-- =====================================================================
-- BUS TIX CONNECT — MIGRATION AUTH SÉCURISÉE (additive)
-- Version : 2026-08-03
-- Nature  : 100% ADDITIVE — les tables existantes ne sont pas modifiées
--           dans leur structure existante ; on ajoute des colonnes et
--           3 nouvelles tables de sécurité (refresh tokens, reset,
--           vérification email).
--
-- Pré-requis : tables de base déjà créées (agent, compte_agent).
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_auth_security.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. COLONNES AJOUTÉES SUR `compte_agent` (verrouillage après échecs)
-- ---------------------------------------------------------------------
ALTER TABLE compte_agent
  ADD COLUMN nb_echecs_connexion INT NOT NULL DEFAULT 0 AFTER derniere_connexion,
  ADD COLUMN bloque_jusque DATETIME NULL AFTER nb_echecs_connexion;

-- ---------------------------------------------------------------------
-- 2. REFRESH_TOKEN — jetons de rafraîchissement (rotation + révocation)
--    On ne stocke que le hash SHA-256 du token, jamais le jeton brut.
-- ---------------------------------------------------------------------
CREATE TABLE refresh_token (
  id                    INT           NOT NULL AUTO_INCREMENT,
  agent_id              CHAR(10)      NOT NULL,
  token_hash            CHAR(64)      NOT NULL,
  ip                    VARCHAR(45)   NULL,
  user_agent            VARCHAR(255)  NULL,
  expires_at            DATETIME      NOT NULL,
  revoked_at            DATETIME      NULL,
  replaced_by_token_id  INT           NULL,          -- rotation (lien au suivant)
  created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_refresh_token PRIMARY KEY (id),
  CONSTRAINT uq_refresh_token_hash UNIQUE (token_hash),
  CONSTRAINT fk_refresh_agent FOREIGN KEY (agent_id) REFERENCES agent (id),
  CONSTRAINT fk_refresh_replaced FOREIGN KEY (replaced_by_token_id) REFERENCES refresh_token (id),
  INDEX idx_refresh_agent (agent_id),
  INDEX idx_refresh_expires (expires_at)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. PASSWORD_RESET_TOKEN — réinitialisation de mot de passe
-- ---------------------------------------------------------------------
CREATE TABLE password_reset_token (
  id            INT           NOT NULL AUTO_INCREMENT,
  agent_id      CHAR(10)      NOT NULL,
  token_hash    CHAR(64)      NOT NULL,
  expires_at    DATETIME      NOT NULL,
  used_at       DATETIME      NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_password_reset_token PRIMARY KEY (id),
  CONSTRAINT uq_password_reset_hash UNIQUE (token_hash),
  CONSTRAINT fk_pwdreset_agent FOREIGN KEY (agent_id) REFERENCES agent (id),
  INDEX idx_pwdreset_agent (agent_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. EMAIL_VERIFICATION_TOKEN — vérification d'email
-- ---------------------------------------------------------------------
CREATE TABLE email_verification_token (
  id            INT           NOT NULL AUTO_INCREMENT,
  agent_id      CHAR(10)      NOT NULL,
  token_hash    CHAR(64)      NOT NULL,
  email         VARCHAR(120)  NULL,
  expires_at    DATETIME      NOT NULL,
  used_at       DATETIME      NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_email_verification_token PRIMARY KEY (id),
  CONSTRAINT uq_email_verification_hash UNIQUE (token_hash),
  CONSTRAINT fk_verify_agent FOREIGN KEY (agent_id) REFERENCES agent (id),
  INDEX idx_verify_agent (agent_id)
) ENGINE=InnoDB;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
