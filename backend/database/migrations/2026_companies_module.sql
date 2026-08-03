-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE COMPANIES (additive)
-- Version : 2026-08-03
-- Nature  : 100% ADDITIVE
--   1. Étend la table `compagnie` avec les champs du profil d'entreprise
--      (coordonnées, RCCM, identifiants fiscaux, statut de modération).
--   2. Crée la table `document_compagnie` (documents légaux/administratifs).
--
-- Statuts compagnie (alignés sur la demande) :
--   ACTIVE/PENDING/SUSPENDED/BANNED/EXPIRED  →  actif/en_attente/suspendu/banni/expire
--
-- Pré-requis : table `compagnie` existante.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_companies_module.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. CHAMPS PROFIL AJOUTÉS SUR `compagnie`
--    - description        : présentation de l'entreprise
--    - email / site_web   : coordonnées de contact
--    - adresse / ville / pays : localisation du siège
--    - rccm               : Registre du Commerce et du Crédit Mobilier
--    - numero_contribuable: identifiant fiscal
--    - date_creation      : date de création de l'entreprise
--    - statut             : statut de modération de la compagnie
-- ---------------------------------------------------------------------
ALTER TABLE compagnie
  ADD COLUMN description         TEXT        NULL AFTER nom,
  ADD COLUMN email               VARCHAR(120) NULL AFTER telephone,
  ADD COLUMN site_web            VARCHAR(255) NULL AFTER email,
  ADD COLUMN adresse             VARCHAR(255) NULL AFTER site_web,
  ADD COLUMN ville               VARCHAR(120) NULL AFTER adresse,
  ADD COLUMN pays                VARCHAR(60)  NULL AFTER ville,
  ADD COLUMN rccm                VARCHAR(60)  NULL AFTER pays,
  ADD COLUMN numero_contribuable VARCHAR(60)  NULL AFTER rccm,
  ADD COLUMN date_creation       DATE         NULL AFTER numero_contribuable,
  ADD COLUMN statut              ENUM('actif', 'en_attente', 'suspendu', 'banni', 'expire')
                                 NOT NULL DEFAULT 'actif' AFTER actif;

-- Backfill : les compagnies déjà inactives passent en « suspendu ».
UPDATE compagnie SET statut = 'suspendu' WHERE actif = 0 AND statut = 'actif';

-- Index sur le nouveau champ de recherche/statut.
ALTER TABLE compagnie ADD INDEX idx_compagnie_statut (statut);

-- ---------------------------------------------------------------------
-- 2. TABLE `document_compagnie` — documents légaux / administratifs
--    - categorie : RCCM / contribuable / licence / autorisation / autre
--    - fichier   : chemin relatif stocké (ex: /uploads/companies/docs/...)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_compagnie (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  compagnie_id   CHAR(4)      NOT NULL,
  categorie      ENUM('rccm', 'contribuable', 'licence', 'autorisation_transport', 'autre')
                               NOT NULL DEFAULT 'autre',
  nom_original   VARCHAR(255) NOT NULL,
  fichier        VARCHAR(255) NOT NULL,
  mime           VARCHAR(100) NOT NULL,
  taille         INT UNSIGNED NOT NULL DEFAULT 0,
  televerse_le   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_document_compagnie (compagnie_id),
  CONSTRAINT fk_document_compagnie
    FOREIGN KEY (compagnie_id) REFERENCES compagnie (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
