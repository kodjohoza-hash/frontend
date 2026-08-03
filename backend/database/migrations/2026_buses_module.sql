-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE BUSES (additive)
-- Version : 2026-08-03
-- Nature  : 100% ADDITIVE
--   1. Étend la table `bus` avec le profil complet du véhicule
--      (n° interne, marque, année, type, carburant, couleur,
--       équipements, photo, chauffeur, maintenances, kilométrage…).
--   2. Aligne les statuts sur la demande :
--      AVAILABLE / ON_TRIP / MAINTENANCE / OUT_OF_SERVICE / INACTIVE
--        → available / on_trip / maintenance / out_of_service / inactive
--   3. Aligne la classe sur les valeurs du frontend (first/business/economy/mixed).
--   4. Crée les tables liées :
--      - bus_seat_layout  : plan de sièges du bus
--      - bus_maintenance  : historique des maintenances
--      - bus_image        : galerie de photos du bus
--
-- Pré-requis : tables `bus`, `agent`, `compagnie` existantes.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_buses_module.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFIL COMPLET DU BUS
--    - interne              : n° interne (ex: GE-001)
--    - marque               : marque (mercedes, man, volvo, hino…)
--    - annee                : année de mise en circulation
--    - type_bus             : vip / confort / standard / economique / minibus / double_deck
--    - classe               : first / business / economy / mixed
--    - carburant            : diesel / essence / electrique / hybride
--    - couleur              : couleur du véhicule (hex)
--    - equipements          : équipements (JSON : {"climatisation": true, …})
--    - notes                : observations internes
--    - photo_url            : URL relative (ex: /uploads/buses/BUS0000001_xxx.webp)
--    - chauffeur_id         : chauffeur courant (FK → agent.id, nullable)
--    - dernier_maintenance / prochaine_maintenance : suivi maintenance
--    - mise_en_service      : date de mise en service
--    - kilometrage          : kilométrage total
-- ---------------------------------------------------------------------
ALTER TABLE bus
  ADD COLUMN interne            VARCHAR(30)                  NULL AFTER immatriculation,
  ADD COLUMN marque             VARCHAR(40)                  NULL AFTER modele,
  ADD COLUMN annee              SMALLINT                     NULL AFTER marque,
  ADD COLUMN type_bus           ENUM('vip','confort','standard','economique','minibus','double_deck')
                                 NOT NULL DEFAULT 'standard' AFTER classe,
  ADD COLUMN carburant          ENUM('diesel','essence','electrique','hybride')
                                 NOT NULL DEFAULT 'diesel'   AFTER type_bus,
  ADD COLUMN couleur            CHAR(7)                      NULL DEFAULT '#0B1D51' AFTER carburant,
  ADD COLUMN equipements        JSON                         NULL AFTER couleur,
  ADD COLUMN notes              TEXT                         NULL AFTER equipements,
  ADD COLUMN photo_url          VARCHAR(255)                 NULL AFTER notes,
  ADD COLUMN chauffeur_id       CHAR(10)                     NULL AFTER photo_url,
  ADD COLUMN dernier_maintenance DATE                        NULL AFTER chauffeur_id,
  ADD COLUMN prochaine_maintenance DATE                      NULL AFTER dernier_maintenance,
  ADD COLUMN mise_en_service    DATE                         NULL AFTER prochaine_maintenance,
  ADD COLUMN kilometrage        INT                          NOT NULL DEFAULT 0 AFTER mise_en_service,
  ADD COLUMN date_creation      DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER kilometrage,
  ADD COLUMN date_modification  DATETIME                     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER date_creation;

-- ---------------------------------------------------------------------
-- 2. ALIGNEMENT DES ENUMS (statut + classe)
--    Table vide au moment de la migration : aucune conversion de données.
-- ---------------------------------------------------------------------
ALTER TABLE bus
  MODIFY COLUMN statut
    ENUM('available','on_trip','maintenance','out_of_service','inactive')
    NOT NULL DEFAULT 'available';

ALTER TABLE bus
  MODIFY COLUMN classe
    ENUM('first','business','economy','mixed')
    NOT NULL DEFAULT 'economy';

-- Index pour la recherche / filtres / tri du module.
ALTER TABLE bus
  ADD INDEX idx_bus_compagnie (compagnie_id),
  ADD INDEX idx_bus_statut (statut),
  ADD INDEX idx_bus_type (type_bus),
  ADD INDEX idx_bus_marque (marque),
  ADD INDEX idx_bus_chauffeur (chauffeur_id);

-- Chauffeur courant : un agent de la compagnie (ou de l'écosystème).
ALTER TABLE bus
  ADD CONSTRAINT fk_bus_chauffeur
    FOREIGN KEY (chauffeur_id) REFERENCES agent (id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------
-- 3. TABLE `bus_seat_layout` — plan de sièges d'un bus
--    - rows / seats_per_side / aisle_after / vip_rows / pmr_seats
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bus_seat_layout (
  id                CHAR(10)     NOT NULL,
  bus_id            CHAR(10)     NOT NULL,
  rows_count        SMALLINT     NOT NULL DEFAULT 12,
  seats_per_side    SMALLINT     NOT NULL DEFAULT 2,
  aisle_after       JSON         NULL,
  vip_rows          JSON         NULL,
  pmr_seats         JSON         NULL,
  total_seats       SMALLINT     NOT NULL DEFAULT 0,
  date_creation     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bus_seat_layout_bus (bus_id),
  CONSTRAINT fk_bus_seat_layout_bus
    FOREIGN KEY (bus_id) REFERENCES bus (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. TABLE `bus_maintenance` — historique des maintenances
--    - type   : revision / vidange / pneu / frein / climatisation /
--               carrosserie / electrique / moteur / controle_technique /
--               nettoyage / autre
--    - status : planifiee / en_cours / terminee
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bus_maintenance (
  id                CHAR(10)     NOT NULL,
  bus_id            CHAR(10)     NOT NULL,
  type              ENUM('revision','vidange','pneu','frein','climatisation','carrosserie',
                         'electrique','moteur','controle_technique','nettoyage','autre')
                                 NOT NULL DEFAULT 'autre',
  date              DATE         NOT NULL,
  completed_date    DATE         NULL,
  mileage           INT          NOT NULL DEFAULT 0,
  cost              INT          NOT NULL DEFAULT 0,
  provider          VARCHAR(120) NULL,
  status            ENUM('planifiee','en_cours','terminee')
                                 NOT NULL DEFAULT 'planifiee',
  notes             TEXT         NULL,
  date_creation     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bus_maint_bus (bus_id),
  KEY idx_bus_maint_status (status),
  CONSTRAINT fk_bus_maintenance_bus
    FOREIGN KEY (bus_id) REFERENCES bus (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. TABLE `bus_image` — galerie de photos d'un bus
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bus_image (
  id            CHAR(10)     NOT NULL,
  bus_id        CHAR(10)     NOT NULL,
  url           VARCHAR(255) NOT NULL,
  is_primary    TINYINT(1)   NOT NULL DEFAULT 0,
  date_creation DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bus_image_bus (bus_id),
  CONSTRAINT fk_bus_image_bus
    FOREIGN KEY (bus_id) REFERENCES bus (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
