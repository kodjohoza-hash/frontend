-- =====================================================================
-- BUS TIX CONNECT — MIGRATION SAAS SUBSCRIPTIONS (additive)
-- Version : 2026-08-02
-- Nature  : 100% ADDITIVE — aucune table existante n'est modifiée/supprimée.
--           Le système d'abonnement par AGENCE (abonnement, paiement_abonnement,
--           rappel_abonnement) reste intact et coexiste avec le nouveau
--           système par COMPAGNIE (plans SaaS).
--
-- Pré-requis : tables de base déjà créées (compagnie, agence, agent, ...).
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_add_saas_subscriptions.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. COLONNES AJOUTÉES SUR `compagnie` (dénormalisation pour blocage)
-- ---------------------------------------------------------------------
ALTER TABLE compagnie
  ADD COLUMN statut_abonnement ENUM('actif','en_retard','expire','suspendu') NOT NULL DEFAULT 'suspendu' AFTER actif,
  ADD COLUMN abonnement_expire_le DATE NULL AFTER statut_abonnement;

-- ---------------------------------------------------------------------
-- 2. PLAN_ABONNEMENT — plans SaaS (Gratuit / Standard / Premium / Enterprise)
-- ---------------------------------------------------------------------
CREATE TABLE plan_abonnement (
  id                INT           NOT NULL AUTO_INCREMENT,
  code              VARCHAR(20)   NOT NULL,
  nom               VARCHAR(60)   NOT NULL,
  description       VARCHAR(255)  NULL,
  prix_mensuel      INT           NOT NULL DEFAULT 0,        -- FCFA / mois
  prix_annuel       INT           NULL,                      -- FCFA / an (optionnel)
  duree_jours       SMALLINT      NOT NULL DEFAULT 30,       -- durée d'un cycle
  max_bus           SMALLINT      NULL,                      -- NULL = illimité
  max_agences       SMALLINT      NULL,
  max_agents        SMALLINT      NULL,
  max_reservations  INT           NULL,
  fonctionnalites   JSON          NULL,                      -- liste de features incluses
  statut            ENUM('actif','inactif') NOT NULL DEFAULT 'actif',
  ordre             SMALLINT      NOT NULL DEFAULT 0,
  cree_le           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_plan_abonnement PRIMARY KEY (id),
  CONSTRAINT uq_plan_abonnement_code UNIQUE (code)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. ABONNEMENT_COMPAGNIE — abonnement courant d'une compagnie (1 / compagnie)
-- ---------------------------------------------------------------------
CREATE TABLE abonnement_compagnie (
  id                  INT           NOT NULL AUTO_INCREMENT,
  compagnie_id        CHAR(4)       NOT NULL,
  plan_id             INT           NOT NULL,
  plan_precedent_id   INT           NULL,
  date_debut          DATE          NOT NULL,
  date_fin            DATE          NOT NULL,
  renouvellement_auto TINYINT(1)    NOT NULL DEFAULT 0,
  statut              ENUM('actif','en_attente','en_retard','expire','suspendu','annule') NOT NULL DEFAULT 'actif',
  cree_le             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_abonnement_compagnie PRIMARY KEY (id),
  CONSTRAINT uq_abonnement_compagnie UNIQUE (compagnie_id),
  CONSTRAINT fk_abcomp_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id),
  CONSTRAINT fk_abcomp_plan FOREIGN KEY (plan_id) REFERENCES plan_abonnement (id),
  CONSTRAINT fk_abcomp_plan_precedent FOREIGN KEY (plan_precedent_id) REFERENCES plan_abonnement (id),
  INDEX idx_abcomp_statut (statut),
  INDEX idx_abcomp_dates (date_debut, date_fin)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. PAIEMENT_ABONNEMENT_COMPAGNIE — historique des paiements de plans
-- ---------------------------------------------------------------------
CREATE TABLE paiement_abonnement_compagnie (
  id                      INT           NOT NULL AUTO_INCREMENT,
  abonnement_compagnie_id INT           NOT NULL,
  compagnie_id            CHAR(4)       NOT NULL,
  plan_id                 INT           NULL,
  montant                 INT           NOT NULL,             -- FCFA
  methode                 ENUM('orange_money','mtn_money','carte_bancaire','virement_bancaire','especes') NOT NULL,
  statut                  ENUM('paye','en_attente','echoue','rembourse') NOT NULL DEFAULT 'paye',
  date                    DATETIME      NOT NULL,
  reference               VARCHAR(40)   NOT NULL,
  facture_url             VARCHAR(255)  NULL,
  CONSTRAINT pk_paiement_abcomp PRIMARY KEY (id),
  CONSTRAINT uq_paiement_abcomp_reference UNIQUE (reference),
  CONSTRAINT fk_pabcomp_abonnement FOREIGN KEY (abonnement_compagnie_id) REFERENCES abonnement_compagnie (id),
  CONSTRAINT fk_pabcomp_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id),
  CONSTRAINT fk_pabcomp_plan FOREIGN KEY (plan_id) REFERENCES plan_abonnement (id),
  INDEX idx_pabcomp_compagnie (compagnie_id),
  INDEX idx_pabcomp_date (date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. NOTIFICATION_ABONNEMENT — rappels automatiques (J-15, J-7, J-3, J-1, J0)
-- ---------------------------------------------------------------------
CREATE TABLE notification_abonnement (
  id                      INT           NOT NULL AUTO_INCREMENT,
  compagnie_id            CHAR(4)       NOT NULL,
  abonnement_compagnie_id INT           NOT NULL,
  type                    ENUM('j15','j7','j3','j1','j0','expiration','retard_paiement','renouvellement') NOT NULL,
  canal                   ENUM('email','sms','notification','in_app','tous') NOT NULL DEFAULT 'notification',
  statut                  ENUM('envoye','delivre','lu','echec') NOT NULL DEFAULT 'envoye',
  sujet                   VARCHAR(160)  NOT NULL,
  message                 TEXT          NOT NULL,
  date_envoi              DATETIME      NOT NULL,
  CONSTRAINT pk_notification_abonnement PRIMARY KEY (id),
  CONSTRAINT fk_nabcomp_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id),
  CONSTRAINT fk_nabcomp_abonnement FOREIGN KEY (abonnement_compagnie_id) REFERENCES abonnement_compagnie (id),
  INDEX idx_nabcomp_compagnie (compagnie_id),
  INDEX idx_nabcomp_date (date_envoi),
  INDEX idx_nabcomp_type (type)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. HISTORIQUE_ABONNEMENT — journal des changements (plans, renouvellements…)
-- ---------------------------------------------------------------------
CREATE TABLE historique_abonnement (
  id                      INT           NOT NULL AUTO_INCREMENT,
  compagnie_id            CHAR(4)       NOT NULL,
  abonnement_compagnie_id INT           NOT NULL,
  action                  ENUM('creation','renouvellement','changement_plan','suspension','reprise','expiration','annulation','paiement') NOT NULL,
  plan_id                 INT           NULL,
  detail                  VARCHAR(255)  NULL,
  auteur                  VARCHAR(120)  NULL,                -- super_admin / systeme / compagnie
  date                    DATETIME      NOT NULL,
  CONSTRAINT pk_historique_abonnement PRIMARY KEY (id),
  CONSTRAINT fk_habcomp_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id),
  CONSTRAINT fk_habcomp_plan FOREIGN KEY (plan_id) REFERENCES plan_abonnement (id),
  INDEX idx_habcomp_compagnie (compagnie_id),
  INDEX idx_habcomp_date (date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. PLANS PAR DÉFAUT (idempotent : INSERT IGNORE sur code unique)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO plan_abonnement
  (code, nom, description, prix_mensuel, prix_annuel, duree_jours,
   max_bus, max_agences, max_agents, max_reservations, fonctionnalites, statut, ordre) VALUES
('gratuit',    'Gratuit',    'Découverte de la plateforme — 1 bus, 1 agence', 0,     0,      30, 1,  1,  3,  50,
  '["Ventes de billets","Rapports basiques","Support par email"]', 'actif', 0),
('standard',   'Standard',   'Pour les petites compagnies',                  25000, 270000, 30, 5,  2,  10, 500,
  '["Ventes de billets","Rapports détaillés","3 agences","10 agents","Support prioritaire","SMS de notification"]', 'actif', 1),
('premium',    'Premium',    'Pour les compagnies en croissance',            60000, 648000, 30, 15, 5,  30, 5000,
  '["Tout Standard","15 bus","5 agences","30 agents","Tableau de bord avancé","API","Sans marque"]', 'actif', 2),
('enterprise', 'Enterprise', 'Solution sur mesure pour grands réseaux',      150000, 1620000, 30, NULL, NULL, NULL, NULL,
  '["Tout Premium","Bus illimités","Agences illimitées","Agents illimités","Accompagnement dédié","SLA 99.9%"]', 'actif', 3);

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
