-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE TRIPS (Voyages) (additive)
-- Version : 2026-08-05
-- Nature  : 100% ADDITIVE
--   1. Table `depart` = instance programmée d'un voyage (MCD section 1).
--      Ajouts (tous additifs) :
--        - code                   : référence voyage lisible (unique)
--        - compagnie_id           : compagnie propriétaire du voyage
--        - agence_id              : agence de départ
--        - chauffeur_remplacant_id: chauffeur remplaçant (optionnel)
--        - date_arrivee           : date d'arrivée (voyages de nuit)
--        - observations           : notes internes
--        - date_creation / date_modification (tri + traçabilité)
--      Le statut est migré vers les statuts voyage alignés sur la
--      demande (PROGRAMMÉ / EMBARQUEMENT / EN COURS / TERMINÉ / ANNULÉ /
--      RETARDÉ). « annule » est CONSERVÉ tel quel (utilisé par le module
--      Drivers dans activeDepart / assignTrip).
--
-- Pré-requis : tables `depart`, `compagnie`, `agence`, `agent`, `trajet`
--              existantes.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_trips_module.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. STATUT — migration préservant les données existantes.
--    Anciens : disponible / bientot_complet / complet / annule / en_retard
--    Nouveaux: programme / embarquement / en_cours / termine / annule / retarde
--    (table vide ou non : les valeurs sont mappées, jamais perdues)
-- ---------------------------------------------------------------------
ALTER TABLE depart
  ADD COLUMN statut_tmp ENUM('programme','embarquement','en_cours','termine','annule','retarde')
    NULL DEFAULT 'programme' AFTER statut;

UPDATE depart SET statut_tmp = CASE statut
  WHEN 'disponible'      THEN 'programme'
  WHEN 'bientot_complet' THEN 'programme'
  WHEN 'complet'         THEN 'programme'
  WHEN 'annule'          THEN 'annule'
  WHEN 'en_retard'       THEN 'retarde'
  ELSE 'programme'
END WHERE statut_tmp IS NULL;

ALTER TABLE depart DROP COLUMN statut;

ALTER TABLE depart
  CHANGE COLUMN statut_tmp statut ENUM('programme','embarquement','en_cours','termine','annule','retarde')
    NOT NULL DEFAULT 'programme';

-- ---------------------------------------------------------------------
-- 2. NOUVELLES COLONNES (additives)
-- ---------------------------------------------------------------------
ALTER TABLE depart
  ADD COLUMN code VARCHAR(30) NULL AFTER id,
  ADD COLUMN compagnie_id CHAR(4) NULL AFTER trajet_id,
  ADD COLUMN agence_id CHAR(10) NULL AFTER compagnie_id,
  ADD COLUMN chauffeur_remplacant_id CHAR(10) NULL AFTER chauffeur_id,
  ADD COLUMN date_arrivee DATE NULL AFTER date_depart,
  ADD COLUMN observations TEXT NULL AFTER quai,
  ADD COLUMN date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER statut,
  ADD COLUMN date_modification DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER date_creation;

-- ---------------------------------------------------------------------
-- 3. INDEX + CLÉS ÉTRANGÈRES
-- ---------------------------------------------------------------------
ALTER TABLE depart
  ADD UNIQUE KEY uq_depart_code (code),
  ADD INDEX idx_depart_compagnie (compagnie_id),
  ADD INDEX idx_depart_agence (agence_id),
  ADD INDEX idx_depart_chauffeur_remplacant (chauffeur_remplacant_id),
  ADD INDEX idx_depart_date (date_depart, heure_depart),
  ADD INDEX idx_depart_statut (statut),
  ADD CONSTRAINT fk_depart_compagnie
    FOREIGN KEY (compagnie_id) REFERENCES compagnie (id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_depart_agence
    FOREIGN KEY (agence_id) REFERENCES agence (id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_depart_chauffeur_remplacant
    FOREIGN KEY (chauffeur_remplacant_id) REFERENCES agent (id) ON DELETE SET NULL;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
