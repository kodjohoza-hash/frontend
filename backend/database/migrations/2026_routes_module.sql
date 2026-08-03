-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE ROUTES (additive)
-- Version : 2026-08-03
-- Nature  : 100% ADDITIVE
--   1. Étend la table `ville` avec le profil complet d'une ville
--      (région, pays, coordonnées GPS, statut) + villes seed.
--   2. Étend la table `trajet` (itinéraire) avec le profil complet
--      (nom, code unique, compagnie, prix min/max, statut, description).
--   3. Crée la table `escale` (étapes intermédiaires d'un itinéraire).
--
-- Pré-requis : tables `ville`, `trajet`, `compagnie` existantes.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_routes_module.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFIL COMPLET DE LA VILLE
--    - region     : région du Cameroun (Centre, Littoral, Ouest…)
--    - pays       : pays (défaut Cameroun)
--    - latitude / longitude : coordonnées GPS (affichage carte)
--    - statut     : active / inactive / archived
-- ---------------------------------------------------------------------
ALTER TABLE ville
  ADD COLUMN region    VARCHAR(100)                                 NULL AFTER nom,
  ADD COLUMN pays      VARCHAR(60)  NOT NULL DEFAULT 'Cameroun'     AFTER region,
  ADD COLUMN latitude  DECIMAL(10,7)                                NULL AFTER pays,
  ADD COLUMN longitude DECIMAL(10,7)                                NULL AFTER latitude,
  ADD COLUMN statut    ENUM('active','inactive','archived')
                        NOT NULL DEFAULT 'active' AFTER longitude;

ALTER TABLE ville
  ADD INDEX idx_ville_nom (nom),
  ADD INDEX idx_ville_statut (statut);

-- Données GPS + régions des villes existantes.
UPDATE ville SET region = 'Ouest',   pays = 'Cameroun', latitude = 5.4781000,  longitude = 10.4177000  WHERE id = 'BFS';
UPDATE ville SET region = 'Littoral', pays = 'Cameroun', latitude = 4.0511000,  longitude = 9.7679000   WHERE id = 'DLA';
UPDATE ville SET region = 'Centre',   pays = 'Cameroun', latitude = 3.8480000,  longitude = 11.5021000  WHERE id = 'YDE';

-- Villes seed (INSERT IGNORE : n'écrase pas une ville déjà présente).
INSERT IGNORE INTO ville (id, nom, region, pays, latitude, longitude, statut) VALUES
  ('EDE', 'Edéa',        'Littoral',     'Cameroun', 3.7970000, 10.1328000, 'active'),
  ('KRI', 'Kribi',       'Sud',          'Cameroun', 2.9372000, 9.9074000,  'active'),
  ('BDA', 'Bamenda',     'Nord-Ouest',   'Cameroun', 5.9631000, 10.1591000, 'active'),
  ('GAR', 'Garoua',      'Nord',         'Cameroun', 9.3015000, 13.3978000, 'active'),
  ('NGO', 'Ngaoundéré',  'Adamaoua',     'Cameroun', 7.3182000, 13.5847000, 'active'),
  ('MTA', 'Maroua',      'Extrême-Nord', 'Cameroun', 10.5910000, 14.3159000, 'active'),
  ('BAF', 'Bafang',      'Ouest',        'Cameroun', 5.1538000, 10.1785000, 'active'),
  ('NKO', 'Nkongsamba',  'Littoral',     'Cameroun', 4.9585000, 9.9309000,  'active'),
  ('EBO', 'Ébolowa',     'Sud',          'Cameroun', 2.9040000, 11.1500000, 'active'),
  ('BER', 'Bertoua',     'Est',          'Cameroun', 4.5769000, 13.6844000, 'active'),
  ('BUE', 'Buéa',        'Sud-Ouest',    'Cameroun', 4.1533000, 9.2860000,  'active'),
  ('DSH', 'Dschang',     'Ouest',        'Cameroun', 5.4445000, 10.0640000, 'active'),
  ('KUM', 'Kumba',       'Sud-Ouest',    'Cameroun', 4.6363000, 9.4463000,  'active'),
  ('LMB', 'Limbe',       'Sud-Ouest',    'Cameroun', 4.0236000, 9.2068000,  'active');

-- ---------------------------------------------------------------------
-- 2. PROFIL COMPLET DU TRAJET (itinéraire)
--    - nom          : libellé (ex : « Douala → Yaoundé »)
--    - code         : code métier unique (ex : RT-DLA-YDE-01)
--    - compagnie_id : compagnie propriétaire de l'itinéraire
--    - prix_min / prix_max : fourchette de prix (FCFA)
--    - statut       : active / inactive / archived
--    - description  : observations (étapes, temps de trajet…)
-- ---------------------------------------------------------------------
ALTER TABLE trajet
  ADD COLUMN nom            VARCHAR(120)                               NULL AFTER id,
  ADD COLUMN code           VARCHAR(20)                                NULL AFTER nom,
  ADD COLUMN compagnie_id   CHAR(4)                                    NULL AFTER ville_arrivee_id,
  ADD COLUMN prix_min       INT                                        NULL AFTER distance_km,
  ADD COLUMN prix_max       INT                                        NULL AFTER prix_min,
  ADD COLUMN statut         ENUM('active','inactive','archived')
                             NOT NULL DEFAULT 'active' AFTER prix_max,
  ADD COLUMN description    TEXT                                       NULL AFTER statut,
  ADD COLUMN date_creation      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER description,
  ADD COLUMN date_modification  DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER date_creation;

ALTER TABLE trajet
  ADD UNIQUE KEY uq_trajet_code (code),
  ADD INDEX idx_trajet_compagnie (compagnie_id),
  ADD INDEX idx_trajet_statut (statut),
  ADD INDEX idx_trajet_villes (ville_depart_id, ville_arrivee_id);

ALTER TABLE trajet
  ADD CONSTRAINT fk_trajet_compagnie
    FOREIGN KEY (compagnie_id) REFERENCES compagnie (id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------
-- 3. TABLE `escale` — étapes intermédiaires d'un itinéraire
--    - ordre         : position de l'escale (1 = première après le départ)
--    - heure_estimee : heure estimée d'arrivée à l'escale
--    - duree_arret   : durée d'arrêt en minutes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS escale (
  id                CHAR(10)     NOT NULL,
  trajet_id         CHAR(10)     NOT NULL,
  ville_id          CHAR(3)      NOT NULL,
  ordre             SMALLINT     NOT NULL DEFAULT 0,
  heure_estimee     TIME         NULL,
  duree_arret       SMALLINT     NULL,
  description       VARCHAR(255) NULL,
  date_creation     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_escale_trajet_ordre (trajet_id, ordre),
  KEY idx_escale_trajet (trajet_id),
  KEY idx_escale_ville (ville_id),
  CONSTRAINT fk_escale_trajet
    FOREIGN KEY (trajet_id) REFERENCES trajet (id) ON DELETE CASCADE,
  CONSTRAINT fk_escale_ville
    FOREIGN KEY (ville_id) REFERENCES ville (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
