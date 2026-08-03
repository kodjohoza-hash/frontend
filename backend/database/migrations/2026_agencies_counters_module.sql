-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE AGENCIES & COUNTERS (additive)
-- Version : 2026-08-03
-- Nature  : 100% ADDITIVE
--   1. Étend la table `agence` avec le profil du point de vente
--      (statut opérationnel, type, GPS, horaires, services…).
--   2. Crée la table `guichet` (points de vente internes à une agence).
--   3. Rattaché les agents à leur guichet (colonne `agent.guichet_id`).
--
-- Statuts (alignés sur la demande) :
--   AGENCE  : ACTIVE/INACTIVE/SUSPENDED  →  actif/inactif/suspendu
--   GUICHET : OPEN/CLOSED/MAINTENANCE    →  ouvert/ferme/maintenance
--
-- Pré-requis : tables `agence`, `agent`, `ville` existantes.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_agencies_counters_module.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. CHAMPS PROFIL AJOUTÉS SUR `agence`
--    - statut           : statut opérationnel du point de vente
--    - type             : gare / agence / bouette / bureau
--    - description      : présentation du point de vente
--    - email            : contact du point de vente
--    - region           : région administrative (Cameroun)
--    - quartier         : quartier / zone
--    - latitude / longitude : localisation GPS (carte + agences proches)
--    - heure_ouverture / heure_fermeture : amplitude horaire
--    - jours_ouverture  : jours d'ouverture (JSON : ["Lundi", …])
--    - services         : services disponibles (JSON : ["vente_billets", …])
-- ---------------------------------------------------------------------
ALTER TABLE agence
  ADD COLUMN description         TEXT                         NULL AFTER telephone,
  ADD COLUMN email               VARCHAR(120)                 NULL AFTER description,
  ADD COLUMN region              VARCHAR(60)                  NULL AFTER ville_id,
  ADD COLUMN quartier            VARCHAR(120)                 NULL AFTER adresse,
  ADD COLUMN statut              ENUM('actif','inactif','suspendu')
                                 NOT NULL DEFAULT 'actif'     AFTER statut_abonnement,
  ADD COLUMN type                ENUM('gare','agence','bouette','bureau')
                                 NULL                         AFTER statut,
  ADD COLUMN latitude            DECIMAL(9,6)                 NULL AFTER type,
  ADD COLUMN longitude           DECIMAL(9,6)                 NULL AFTER latitude,
  ADD COLUMN heure_ouverture     TIME                         NULL AFTER longitude,
  ADD COLUMN heure_fermeture     TIME                         NULL AFTER heure_ouverture,
  ADD COLUMN jours_ouverture     VARCHAR(255)                 NULL AFTER heure_fermeture,
  ADD COLUMN services            JSON                         NULL AFTER jours_ouverture;

-- Index pour la recherche / filtres géographiques et statut.
ALTER TABLE agence
  ADD INDEX idx_agence_statut (statut),
  ADD INDEX idx_agence_type (type),
  ADD INDEX idx_agence_ville (ville_id);

-- ---------------------------------------------------------------------
-- 2. TABLE `guichet` — point de vente interne à une agence
--    - type   : vente_billets / reservation / caisse / renseignement / autre
--    - statut : ouvert / ferme / maintenance
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guichet (
  id               CHAR(10)     NOT NULL,
  agence_id        CHAR(10)     NOT NULL,
  code             VARCHAR(20)  NOT NULL,
  nom              VARCHAR(120) NULL,
  type             ENUM('vente_billets','reservation','caisse','renseignement','autre')
                                 NOT NULL DEFAULT 'vente_billets',
  statut           ENUM('ouvert','ferme','maintenance')
                                 NOT NULL DEFAULT 'ouvert',
  description      VARCHAR(255) NULL,
  date_creation    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_guichet_code (code),
  KEY idx_guichet_agence (agence_id),
  CONSTRAINT fk_guichet_agence
    FOREIGN KEY (agence_id) REFERENCES agence (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. RATTACHEMENT DES AGENTS À LEUR GUICHET
--    - `agent.guichet_id` : guichet courant de l'agent (nullable)
-- ---------------------------------------------------------------------
ALTER TABLE agent
  ADD COLUMN guichet_id CHAR(10) NULL AFTER agence_id,
  ADD KEY idx_agent_guichet (guichet_id),
  ADD CONSTRAINT fk_agent_guichet
    FOREIGN KEY (guichet_id) REFERENCES guichet (id) ON DELETE SET NULL;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
