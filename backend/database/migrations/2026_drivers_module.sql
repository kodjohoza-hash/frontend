-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE DRIVERS (additive)
-- Version : 2026-08-03
-- Nature  : 100% ADDITIVE
--   1. Table `chauffeur`        : extension profil chauffeur (1:1 avec agent)
--      — permis de conduire, expérience, ville/pays, observations,
--        statut opérationnel AVAILABLE / ON_TRIP / ON_LEAVE /
--        SUSPENDED / INACTIVE → available / on_trip / on_leave /
--        suspended / inactive.
--   2. Table `chauffeur_document` : documents du chauffeur
--      (Permis, Carte nationale, Certificat médical, Contrat, Photo, Autres).
--   3. Table `chauffeur_incident` : incidents (accident, panne, retard,
--      sanction, observation) + date + description.
--   4. Table `chauffeur_affectation` : historique d'affectation bus
--      (un chauffeur peut conduire plusieurs bus au cours de sa carrière).
--   5. Colonne `depart.chauffeur_id` : affectation d'un chauffeur à un
--      voyage (un seul voyage actif à un instant donné — vérifié côté
--      service, en transaction).
--
-- Pré-requis : tables `agent`, `bus`, `depart` existantes.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_drivers_module.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABLE `chauffeur` — extension profil chauffeur
--    PK = agent_id (1:1 avec agent ; un chauffeur EST un agent rôle
--    'chauffeur', ce qui préserve toutes les relations existantes :
--    bus.chauffeur_id → agent.id, agence, compagnie, etc.)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chauffeur (
  agent_id          CHAR(10)                     NOT NULL,
  ville             VARCHAR(120)                 NULL,
  pays              VARCHAR(60)                  NULL,
  permis_numero     VARCHAR(40)                  NULL,
  permis_categorie  ENUM('A','B','C','D','E')    NULL,
  permis_obtention  DATE                         NULL,
  permis_expiration DATE                         NULL,
  annees_experience SMALLINT                     NOT NULL DEFAULT 0,
  observations      TEXT                         NULL,
  statut            ENUM('available','on_trip','on_leave','suspended','inactive')
                                                 NOT NULL DEFAULT 'available',
  date_creation     DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME                     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (agent_id),
  KEY idx_chauffeur_statut (statut),
  CONSTRAINT fk_chauffeur_agent
    FOREIGN KEY (agent_id) REFERENCES agent (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. TABLE `chauffeur_document` — documents administratifs du chauffeur
--    - type : permis | cni | medical | contrat | photo | autre
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chauffeur_document (
  id                CHAR(10)                     NOT NULL,
  chauffeur_id      CHAR(10)                     NOT NULL,
  type              ENUM('permis','cni','medical','contrat','photo','autre')
                                                 NOT NULL DEFAULT 'autre',
  url               VARCHAR(255)                 NOT NULL,
  notes             VARCHAR(255)                 NULL,
  date_creation     DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_chd_chauffeur (chauffeur_id),
  KEY idx_chd_type (type),
  CONSTRAINT fk_chd_chauffeur
    FOREIGN KEY (chauffeur_id) REFERENCES agent (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. TABLE `chauffeur_incident` — historique des incidents
--    - type : accident | panne | retard | sanction | observation
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chauffeur_incident (
  id                CHAR(10)                     NOT NULL,
  chauffeur_id      CHAR(10)                     NOT NULL,
  type              ENUM('accident','panne','retard','sanction','observation')
                                                 NOT NULL DEFAULT 'observation',
  date              DATE                         NOT NULL,
  description       TEXT                         NULL,
  severite          ENUM('low','medium','high')  NOT NULL DEFAULT 'low',
  resolu            TINYINT(1)                   NOT NULL DEFAULT 0,
  date_creation     DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME                     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_chinc_chauffeur (chauffeur_id),
  KEY idx_chinc_type (type),
  CONSTRAINT fk_chinc_chauffeur
    FOREIGN KEY (chauffeur_id) REFERENCES agent (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. TABLE `chauffeur_affectation` — historique d'affectation bus
--    - Une ligne « ouverte » (date_fin NULL) = affectation en cours.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chauffeur_affectation (
  id                CHAR(10)                     NOT NULL,
  chauffeur_id      CHAR(10)                     NOT NULL,
  bus_id            CHAR(10)                     NOT NULL,
  date_debut        DATE                         NULL,
  date_fin          DATE                         NULL,
  notes             VARCHAR(255)                 NULL,
  date_creation     DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_chaff_chauffeur (chauffeur_id),
  KEY idx_chaff_bus (bus_id),
  CONSTRAINT fk_chaff_chauffeur
    FOREIGN KEY (chauffeur_id) REFERENCES agent (id) ON DELETE CASCADE,
  CONSTRAINT fk_chaff_bus
    FOREIGN KEY (bus_id) REFERENCES bus (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. `depart.chauffeur_id` — affectation d'un chauffeur à un voyage.
--    Additif : les modules existants ne lisent que des colonnes précises.
-- ---------------------------------------------------------------------
ALTER TABLE depart
  ADD COLUMN chauffeur_id CHAR(10) NULL AFTER bus_id;

ALTER TABLE depart
  ADD INDEX idx_depart_chauffeur (chauffeur_id),
  ADD CONSTRAINT fk_depart_chauffeur
    FOREIGN KEY (chauffeur_id) REFERENCES agent (id) ON DELETE SET NULL;

-- Index de recherche sur le rôle (la liste des chauffeurs filtre role='chauffeur').
ALTER TABLE agent
  ADD INDEX idx_agent_role (role);

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
