-- =====================================================================
-- BUS TIX CONNECT — MIGRATION MODULE USERS (additive)
-- Version : 2026-08-03
-- Nature  : 100% ADDITIVE — on complète la table `agent` avec les champs
--           du profil utilisateur demandés par le module Users, et on
--           étend l'ENUM statut (actif, inactif, suspendu, supprime, banni).
--
-- Pré-requis : tables agent / compte_agent déjà présentes.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_users_module.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. CHAMPS PROFIL AJOUTÉS SUR `agent`
--    - photo        : URL relative (ex: /uploads/users/AGT0000001_xxx.webp)
--    - nationalite  : nationalité de l'utilisateur
--    - date_creation: date de création du compte utilisateur
-- ---------------------------------------------------------------------
ALTER TABLE agent
  ADD COLUMN photo         VARCHAR(255) NULL AFTER langue,
  ADD COLUMN nationalite   VARCHAR(60)  NULL AFTER photo,
  ADD COLUMN date_creation DATE         NULL AFTER nationalite;

-- ---------------------------------------------------------------------
-- 2. STATUT ÉTENDU — cinq états possibles
--    actif | inactif | suspendu | supprime | banni
--    (aligné sur la demande : ACTIVE / INACTIVE / SUSPENDED / DELETED / BANNED)
-- ---------------------------------------------------------------------
ALTER TABLE agent
  MODIFY COLUMN statut
    ENUM('actif', 'inactif', 'suspendu', 'supprime', 'banni')
    NOT NULL DEFAULT 'actif';

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
