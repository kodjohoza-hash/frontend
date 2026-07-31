-- ============================================================
--  BUS TIX CONNECT — MODÈLE CONCEPTUEL DE DONNÉES (MCD)
--  Généré à partir des pages du guichet (Counter Agent) :
--    Dashboard / Vente / Réservations / Encaissements / Clients
--    Contrôle billets / Notifications / Messagerie / Profil / Paramètres
--
--  SGBD cible : MySQL 8+ / MariaDB 10.5+
--  Encodage : UTF-8
-- ============================================================

CREATE DATABASE IF NOT EXISTS bus_tix_connect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE bus_tix_connect;

-- ============================================================
--  1. STRUCTURE DE L'ENTREPRISE
-- ============================================================

-- Entité : COMPAGNIE (transporteur)
CREATE TABLE compagnie (
  id                CHAR(4)       NOT NULL,
  nom               VARCHAR(120)  NOT NULL,
  telephone         VARCHAR(20)   NULL,
  couleur           CHAR(7)       NULL,
  logo              VARCHAR(255)  NULL,
  actif             TINYINT(1)    NOT NULL DEFAULT 1,
  CONSTRAINT pk_compagnie PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Entité : VILLE
CREATE TABLE ville (
  id                CHAR(3)       NOT NULL,
  nom               VARCHAR(60)   NOT NULL,
  CONSTRAINT pk_ville PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Entité : AGENCE / POINT DE VENTE (branche)
CREATE TABLE agence (
  id                CHAR(10)      NOT NULL,
  nom               VARCHAR(120)  NOT NULL,
  ville_id          CHAR(3)       NOT NULL,
  adresse           VARCHAR(255)  NULL,
  telephone         VARCHAR(20)   NULL,
  compagnie_id      CHAR(4)       NULL,
  -- Abonnement : une agence sans abonnement payé est suspendue (déconnexion auto)
  statut_abonnement ENUM('actif','en_retard','suspendu') NOT NULL DEFAULT 'suspendu',
  abonnement_expire_le DATE       NULL,
  CONSTRAINT pk_agence PRIMARY KEY (id),
  CONSTRAINT fk_agence_ville FOREIGN KEY (ville_id) REFERENCES ville (id),
  CONSTRAINT fk_agence_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id)
) ENGINE=InnoDB;

-- Entité : BUS (véhicule)
CREATE TABLE bus (
  id                CHAR(10)      NOT NULL,
  immatriculation   VARCHAR(15)   NOT NULL,
  modele            VARCHAR(60)   NOT NULL,
  capacite          SMALLINT      NOT NULL,
  classe            ENUM('standard','confort','vip','premium') NOT NULL DEFAULT 'standard',
  compagnie_id      CHAR(4)       NOT NULL,
  statut            ENUM('disponible','maintenance','en_panne','affecte') NOT NULL DEFAULT 'disponible',
  CONSTRAINT pk_bus PRIMARY KEY (id),
  CONSTRAINT fk_bus_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id)
) ENGINE=InnoDB;

-- Entité : TRAJET (route) — association VILLE x VILLE
CREATE TABLE trajet (
  id                CHAR(10)      NOT NULL,
  ville_depart_id   CHAR(3)       NOT NULL,
  ville_arrivee_id  CHAR(3)       NOT NULL,
  duree             VARCHAR(10)   NOT NULL,
  distance_km       SMALLINT      NULL,
  CONSTRAINT pk_trajet PRIMARY KEY (id),
  CONSTRAINT fk_trajet_vdep FOREIGN KEY (ville_depart_id) REFERENCES ville (id),
  CONSTRAINT fk_trajet_varr FOREIGN KEY (ville_arrivee_id) REFERENCES ville (id)
) ENGINE=InnoDB;

-- Entité : DÉPART (instance programmée d'un trajet)
CREATE TABLE depart (
  id                CHAR(10)      NOT NULL,
  trajet_id         CHAR(10)      NOT NULL,
  bus_id            CHAR(10)      NOT NULL,
  date_depart       DATE          NOT NULL,
  heure_depart      TIME          NOT NULL,
  heure_arrivee     TIME          NOT NULL,
  prix_base         INT           NOT NULL,              -- en FCFA
  places_total      SMALLINT      NOT NULL,
  places_dispo      SMALLINT      NOT NULL,
  quai              VARCHAR(20)   NULL,
  statut            ENUM('disponible','bientot_complet','complet','annule','en_retard') NOT NULL DEFAULT 'disponible',
  CONSTRAINT pk_depart PRIMARY KEY (id),
  CONSTRAINT fk_depart_trajet FOREIGN KEY (trajet_id) REFERENCES trajet (id),
  CONSTRAINT fk_depart_bus FOREIGN KEY (bus_id) REFERENCES bus (id)
) ENGINE=InnoDB;

-- Entité : TARIF (grille tarifaire par classe)
CREATE TABLE tarif (
  id                INT           NOT NULL AUTO_INCREMENT,
  trajet_id         CHAR(10)      NOT NULL,
  classe            ENUM('standard','confort','vip','premium') NOT NULL,
  prix              INT           NOT NULL,              -- en FCFA
  date_effet        DATE          NOT NULL,
  CONSTRAINT pk_tarif PRIMARY KEY (id),
  CONSTRAINT fk_tarif_trajet FOREIGN KEY (trajet_id) REFERENCES trajet (id)
) ENGINE=InnoDB;

-- ============================================================
--  2. AGENTS, UTILISATEURS ET SÉCURITÉ
-- ============================================================

-- Entité : AGENT (utilisateur du guichet)
CREATE TABLE agent (
  id                CHAR(10)      NOT NULL,
  matricule         VARCHAR(20)   NOT NULL,
  prenom            VARCHAR(60)   NOT NULL,
  nom               VARCHAR(60)   NOT NULL,
  email             VARCHAR(120)  NOT NULL,
  telephone         VARCHAR(20)   NOT NULL,
  role              VARCHAR(60)   NOT NULL,              -- Agent de guichet / Superviseur / ...
  date_naissance    DATE          NULL,
  genre             ENUM('F','M','Autre') NULL,
  adresse           VARCHAR(255)  NULL,
  langue            VARCHAR(40)   NULL,
  date_embauche     DATE          NOT NULL,
  statut            ENUM('actif','inactif','suspendu') NOT NULL DEFAULT 'actif',
  verifie           TINYINT(1)    NOT NULL DEFAULT 0,
  agence_id         CHAR(10)      NOT NULL,
  superieur_id      CHAR(10)      NULL,                  -- auto-référence (superviseur)
  CONSTRAINT pk_agent PRIMARY KEY (id),
  CONSTRAINT uq_agent_email UNIQUE (email),
  CONSTRAINT uq_agent_matricule UNIQUE (matricule),
  CONSTRAINT fk_agent_agence FOREIGN KEY (agence_id) REFERENCES agence (id),
  CONSTRAINT fk_agent_superieur FOREIGN KEY (superieur_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : COMPTE_AGENT (paramètres de sécurité / accès)
CREATE TABLE compte_agent (
  agent_id          CHAR(10)      NOT NULL,
  mot_de_passe_hash VARCHAR(255)  NOT NULL,
  email            VARCHAR(120)  NOT NULL,
  telephone        VARCHAR(20)   NOT NULL,
  double_authentification TINYINT(1) NOT NULL DEFAULT 0,
  expiration_pwd    DATE          NULL,
  langue_preferee   VARCHAR(10)   NOT NULL DEFAULT 'fr',
  theme             ENUM('sombre','clair','systeme') NOT NULL DEFAULT 'sombre',
  derniere_connexion DATETIME     NULL,
  CONSTRAINT pk_compte_agent PRIMARY KEY (agent_id),
  CONSTRAINT fk_compte_agent FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : SESSION_CONNEXION (historique de connexions / sécurité)
CREATE TABLE session_connexion (
  id                INT           NOT NULL AUTO_INCREMENT,
  agent_id          CHAR(10)      NOT NULL,
  date              DATETIME      NOT NULL,
  ip                VARCHAR(45)   NOT NULL,
  navigateur        VARCHAR(120)  NULL,
  appareil          VARCHAR(120)  NULL,
  localisation      VARCHAR(120)  NULL,
  type              ENUM('connexion','deconnexion','echec','suspect') NOT NULL DEFAULT 'connexion',
  CONSTRAINT pk_session PRIMARY KEY (id),
  CONSTRAINT fk_session_agent FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : DOCUMENT_AGENT (RH — contrats, CNI, attestations)
CREATE TABLE document_agent (
  id                CHAR(10)      NOT NULL,
  agent_id          CHAR(10)      NOT NULL,
  nom               VARCHAR(150)  NOT NULL,
  type              ENUM('pdf','image','docx','xlsx') NOT NULL,
  categorie         ENUM('contrat','identite','photo','attestation','autre') NOT NULL,
  url               VARCHAR(255)  NOT NULL,
  taille            VARCHAR(20)   NULL,
  upload_le         DATE          NOT NULL,
  CONSTRAINT pk_document_agent PRIMARY KEY (id),
  CONSTRAINT fk_doc_agent FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- ============================================================
--  3. CLIENTS ET FIDÉLITÉ
-- ============================================================

-- Entité : CLIENT (passager / fiche client)
CREATE TABLE client (
  id                CHAR(12)      NOT NULL,
  prenom            VARCHAR(60)   NOT NULL,
  nom               VARCHAR(60)   NOT NULL,
  telephone         VARCHAR(20)   NOT NULL,
  email             VARCHAR(120)  NULL,
  adresse           VARCHAR(255)  NULL,
  ville_id          CHAR(3)       NULL,
  pays              VARCHAR(60)   NOT NULL DEFAULT 'Cameroun',
  type_piece        ENUM('cni','passeport','permis','aucune','autre') NOT NULL DEFAULT 'aucune',
  numero_piece      VARCHAR(40)   NULL,
  date_inscription  DATETIME      NOT NULL,
  statut            ENUM('nouveau','actif','vip','inactif','suspendu') NOT NULL DEFAULT 'nouveau',
  CONSTRAINT pk_client PRIMARY KEY (id),
  CONSTRAINT fk_client_ville FOREIGN KEY (ville_id) REFERENCES ville (id)
) ENGINE=InnoDB;

-- Entité : PREFERENCE_CLIENT (siège, classe, paiement préférés)
CREATE TABLE preference_client (
  client_id         CHAR(12)      NOT NULL,
  siege             ENUM('fenetre','couloir') NULL,
  classe            ENUM('standard','confort','vip') NULL,
  paiement          ENUM('orange_money','mtn_money','carte','especes') NULL,
  CONSTRAINT pk_pref_client PRIMARY KEY (client_id),
  CONSTRAINT fk_pref_client FOREIGN KEY (client_id) REFERENCES client (id)
) ENGINE=InnoDB;

-- Entité : PROGRAMME_FIDELITE (niveau de fidélité du client)
CREATE TABLE programme_fidelite (
  client_id         CHAR(12)      NOT NULL,
  niveau            ENUM('bronze','argent','or','platine') NOT NULL DEFAULT 'bronze',
  points            INT           NOT NULL DEFAULT 0,
  total_trajets     SMALLINT      NOT NULL DEFAULT 0,
  total_depenses    INT           NOT NULL DEFAULT 0,     -- en FCFA
  remise_vip        TINYINT(1)    NOT NULL DEFAULT 0,
  CONSTRAINT pk_fidelite PRIMARY KEY (client_id),
  CONSTRAINT fk_fidelite_client FOREIGN KEY (client_id) REFERENCES client (id)
) ENGINE=InnoDB;

-- Entité : NOTE_CLIENT (notes internes des agents)
CREATE TABLE note_client (
  id                INT           NOT NULL AUTO_INCREMENT,
  client_id         CHAR(12)      NOT NULL,
  texte             TEXT          NOT NULL,
  auteur_id         CHAR(10)      NOT NULL,
  cree_le           DATETIME      NOT NULL,
  CONSTRAINT pk_note_client PRIMARY KEY (id),
  CONSTRAINT fk_note_client FOREIGN KEY (client_id) REFERENCES client (id),
  CONSTRAINT fk_note_auteur FOREIGN KEY (auteur_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- ============================================================
--  4. VENTES : RÉSERVATIONS, BILLETS, PAIEMENTS
-- ============================================================

-- Entité : RESERVATION
CREATE TABLE reservation (
  id                CHAR(15)      NOT NULL,
  reference         VARCHAR(30)   NOT NULL,
  client_id         CHAR(12)      NOT NULL,
  depart_id         CHAR(10)      NOT NULL,
  agence_id         CHAR(10)      NOT NULL,
  agent_id          CHAR(10)      NOT NULL,
  date_creation     DATETIME      NOT NULL,
  date_confirmation DATETIME      NULL,
  date_annulation   DATETIME      NULL,
  date_expiration   DATETIME      NULL,
  montant           INT           NOT NULL,               -- en FCFA
  statut            ENUM('en_attente','confirmee','annulee','expiree','convertie') NOT NULL DEFAULT 'en_attente',
  motif_annulation  VARCHAR(255)  NULL,
  CONSTRAINT pk_reservation PRIMARY KEY (id),
  CONSTRAINT uq_reservation_ref UNIQUE (reference),
  CONSTRAINT fk_res_client FOREIGN KEY (client_id) REFERENCES client (id),
  CONSTRAINT fk_res_depart FOREIGN KEY (depart_id) REFERENCES depart (id),
  CONSTRAINT fk_res_agence FOREIGN KEY (agence_id) REFERENCES agence (id),
  CONSTRAINT fk_res_agent FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : PLACE_RESERVEE (association RESERVATION x SIÈGE — un passager par place)
CREATE TABLE place_reservee (
  id                INT           NOT NULL AUTO_INCREMENT,
  reservation_id    CHAR(15)      NOT NULL,
  siege             VARCHAR(5)    NOT NULL,               -- ex : A3, 12B
  nom_passager      VARCHAR(120)  NULL,
  CONSTRAINT pk_place_reservee PRIMARY KEY (id),
  CONSTRAINT fk_place_reservation FOREIGN KEY (reservation_id) REFERENCES reservation (id)
) ENGINE=InnoDB;

-- Entité : HISTORIQUE_RESERVATION (traçabilité des statuts)
CREATE TABLE historique_reservation (
  id                INT           NOT NULL AUTO_INCREMENT,
  reservation_id    CHAR(15)      NOT NULL,
  action            VARCHAR(120)  NOT NULL,
  timestamp         DATETIME      NOT NULL,
  utilisateur       VARCHAR(120)  NOT NULL,
  CONSTRAINT pk_hist_res PRIMARY KEY (id),
  CONSTRAINT fk_hist_res FOREIGN KEY (reservation_id) REFERENCES reservation (id)
) ENGINE=InnoDB;

-- Entité : BILLET
CREATE TABLE billet (
  id                CHAR(15)      NOT NULL,
  reference         VARCHAR(40)   NOT NULL,
  qr_code           VARCHAR(80)   NOT NULL,
  code_barre        VARCHAR(40)   NOT NULL,
  reservation_id    CHAR(15)      NULL,
  depart_id         CHAR(10)      NOT NULL,
  client_id         CHAR(12)      NOT NULL,
  siege             VARCHAR(5)    NOT NULL,
  prix              INT           NOT NULL,
  statut            ENUM('valide','utilise','expire','annule','rembourse','impaye','inconnu') NOT NULL DEFAULT 'valide',
  cree_le           DATETIME      NOT NULL,
  cree_par          CHAR(10)      NOT NULL,
  verifie_le        DATETIME      NULL,
  verifie_par       CHAR(10)      NULL,
  CONSTRAINT pk_billet PRIMARY KEY (id),
  CONSTRAINT uq_billet_qr UNIQUE (qr_code),
  CONSTRAINT uq_billet_ref UNIQUE (reference),
  CONSTRAINT fk_billet_reservation FOREIGN KEY (reservation_id) REFERENCES reservation (id),
  CONSTRAINT fk_billet_depart FOREIGN KEY (depart_id) REFERENCES depart (id),
  CONSTRAINT fk_billet_client FOREIGN KEY (client_id) REFERENCES client (id),
  CONSTRAINT fk_billet_agent FOREIGN KEY (cree_par) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : HISTORIQUE_BILLET (émis / scanné / annulé / remboursé)
CREATE TABLE historique_billet (
  id                INT           NOT NULL AUTO_INCREMENT,
  billet_id         CHAR(15)      NOT NULL,
  action            VARCHAR(120)  NOT NULL,
  timestamp         DATETIME      NOT NULL,
  utilisateur       VARCHAR(120)  NOT NULL,
  CONSTRAINT pk_hist_billet PRIMARY KEY (id),
  CONSTRAINT fk_hist_billet FOREIGN KEY (billet_id) REFERENCES billet (id)
) ENGINE=InnoDB;

-- Entité : PAIEMENT
CREATE TABLE paiement (
  id                CHAR(15)      NOT NULL,
  reference         VARCHAR(40)   NOT NULL,
  reservation_id    CHAR(15)      NULL,
  billet_id         CHAR(15)      NULL,
  client_id         CHAR(12)      NOT NULL,
  agent_id          CHAR(10)      NOT NULL,
  montant           INT           NOT NULL,
  methode           ENUM('orange_money','mtn_money','carte_bancaire','especes','virement_bancaire','bon_reduction','code_promo') NOT NULL,
  statut            ENUM('paye','en_attente','echoue','annule','rembourse','partiellement_rembourse') NOT NULL,
  cree_le           DATETIME      NOT NULL,
  paiement_le       DATETIME      NULL,
  remboursement     INT           NULL,                   -- montant remboursé (FCFA)
  motif_remboursement VARCHAR(255) NULL,
  note              VARCHAR(255)  NULL,
  CONSTRAINT pk_paiement PRIMARY KEY (id),
  CONSTRAINT uq_paiement_ref UNIQUE (reference),
  CONSTRAINT fk_paiement_reservation FOREIGN KEY (reservation_id) REFERENCES reservation (id),
  CONSTRAINT fk_paiement_billet FOREIGN KEY (billet_id) REFERENCES billet (id),
  CONSTRAINT fk_paiement_client FOREIGN KEY (client_id) REFERENCES client (id),
  CONSTRAINT fk_paiement_agent FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : SESSION_CAISSE (ouverture / clôture de caisse d'un agent)
CREATE TABLE session_caisse (
  id                INT           NOT NULL AUTO_INCREMENT,
  agent_id          CHAR(10)      NOT NULL,
  agence_id         CHAR(10)      NOT NULL,
  ouverte_le        DATETIME      NOT NULL,
  fermee_le         DATETIME      NULL,
  solde_ouverture   INT           NOT NULL DEFAULT 0,
  solde_cloture     INT           NULL,
  note              VARCHAR(255)  NULL,
  statut            ENUM('ouverte','fermee') NOT NULL DEFAULT 'ouverte',
  CONSTRAINT pk_session_caisse PRIMARY KEY (id),
  CONSTRAINT fk_caisse_agent FOREIGN KEY (agent_id) REFERENCES agent (id),
  CONSTRAINT fk_caisse_agence FOREIGN KEY (agence_id) REFERENCES agence (id)
) ENGINE=InnoDB;

-- ============================================================
--  5. NOTIFICATIONS ET ALERTES
-- ============================================================

-- Entité : NOTIFICATION
CREATE TABLE notification (
  id                CHAR(15)      NOT NULL,
  titre             VARCHAR(160)  NOT NULL,
  description       TEXT          NULL,
  categorie         ENUM('reservation','paiement','billet','depart','client','bus','message','systeme','securite','support','abonnement') NOT NULL,
  priorite          ENUM('critique','haute','normale','faible') NOT NULL DEFAULT 'normale',
  statut            ENUM('non_lue','lue','epinglee','archivee','supprimee') NOT NULL DEFAULT 'non_lue',
  client_id         CHAR(12)      NULL,
  depart_id         CHAR(10)      NULL,
  reservation_id    CHAR(15)      NULL,
  paiement_id       CHAR(15)      NULL,
  bus_id            CHAR(10)      NULL,
  agence_id         CHAR(10)      NULL,
  date              DATETIME      NOT NULL,
  lue_le            DATETIME      NULL,
  CONSTRAINT pk_notification PRIMARY KEY (id),
  CONSTRAINT fk_notif_client FOREIGN KEY (client_id) REFERENCES client (id),
  CONSTRAINT fk_notif_depart FOREIGN KEY (depart_id) REFERENCES depart (id),
  CONSTRAINT fk_notif_reservation FOREIGN KEY (reservation_id) REFERENCES reservation (id),
  CONSTRAINT fk_notif_paiement FOREIGN KEY (paiement_id) REFERENCES paiement (id),
  CONSTRAINT fk_notif_bus FOREIGN KEY (bus_id) REFERENCES bus (id),
  CONSTRAINT fk_notif_agence FOREIGN KEY (agence_id) REFERENCES agence (id)
) ENGINE=InnoDB;

-- Entité : HISTORIQUE_NOTIFICATION (générée / lue / archivée)
CREATE TABLE historique_notification (
  id                INT           NOT NULL AUTO_INCREMENT,
  notification_id   CHAR(15)      NOT NULL,
  action            VARCHAR(120)  NOT NULL,
  date              DATETIME      NOT NULL,
  CONSTRAINT pk_hist_notif PRIMARY KEY (id),
  CONSTRAINT fk_hist_notif FOREIGN KEY (notification_id) REFERENCES notification (id)
) ENGINE=InnoDB;

-- Entité : COMMENTAIRE_NOTIFICATION (échanges entre agents)
CREATE TABLE commentaire_notification (
  id                CHAR(10)      NOT NULL,
  notification_id   CHAR(15)      NOT NULL,
  auteur            VARCHAR(120)  NOT NULL,
  texte             TEXT          NOT NULL,
  date              DATETIME      NOT NULL,
  CONSTRAINT pk_commentaire_notif PRIMARY KEY (id),
  CONSTRAINT fk_commentaire_notif FOREIGN KEY (notification_id) REFERENCES notification (id)
) ENGINE=InnoDB;

-- Entité : ALERTE (tableau de bord)
CREATE TABLE alerte (
  id                INT           NOT NULL AUTO_INCREMENT,
  type              ENUM('warning','info','success','primary','accent') NOT NULL,
  titre             VARCHAR(120)  NOT NULL,
  texte             TEXT          NOT NULL,
  depart_id         CHAR(10)      NULL,
  date              DATETIME      NOT NULL,
  CONSTRAINT pk_alerte PRIMARY KEY (id),
  CONSTRAINT fk_alerte_depart FOREIGN KEY (depart_id) REFERENCES depart (id)
) ENGINE=InnoDB;

-- ============================================================
--  6. MESSAGERIE (conversations, messages, fichiers)
-- ============================================================

-- Entité : CONTACT (carnet d'adresses de l'agent)
CREATE TABLE contact (
  id                CHAR(10)      NOT NULL,
  nom               VARCHAR(120)  NOT NULL,
  role              VARCHAR(60)   NOT NULL,
  telephone         VARCHAR(20)   NOT NULL,
  email             VARCHAR(120)  NOT NULL,
  compagnie_id      CHAR(4)       NULL,
  agence_id         CHAR(10)      NULL,
  statut            ENUM('en_ligne','hors_ligne','occupe') NOT NULL DEFAULT 'hors_ligne',
  derniere_activite DATETIME      NULL,
  CONSTRAINT pk_contact PRIMARY KEY (id),
  CONSTRAINT fk_contact_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id),
  CONSTRAINT fk_contact_agence FOREIGN KEY (agence_id) REFERENCES agence (id)
) ENGINE=InnoDB;

-- Entité : CONVERSATION
CREATE TABLE conversation (
  id                CHAR(15)      NOT NULL,
  agent_id          CHAR(10)      NOT NULL,               -- utilisateur courant
  contact_id        CHAR(10)      NOT NULL,               -- interlocuteur
  dossier           VARCHAR(15)   NOT NULL DEFAULT 'inbox',
  important         TINYINT(1)    NOT NULL DEFAULT 0,
  epinglee          TINYINT(1)    NOT NULL DEFAULT 0,
  non_lu            SMALLINT      NOT NULL DEFAULT 0,
  cree_le           DATETIME      NOT NULL,
  CONSTRAINT pk_conversation PRIMARY KEY (id),
  CONSTRAINT fk_conv_agent FOREIGN KEY (agent_id) REFERENCES agent (id),
  CONSTRAINT fk_conv_contact FOREIGN KEY (contact_id) REFERENCES contact (id)
) ENGINE=InnoDB;

-- Entité : MESSAGE
CREATE TABLE message (
  id                CHAR(10)      NOT NULL,
  conversation_id   CHAR(15)      NOT NULL,
  expediteur_id     VARCHAR(20)   NOT NULL,               -- agent_id OU contact_id
  texte             TEXT          NOT NULL,
  date              DATETIME      NOT NULL,
  statut            ENUM('envoye','delivre','lu','echec') NOT NULL DEFAULT 'envoye',
  est_modifie       TINYINT(1)    NOT NULL DEFAULT 0,
  est_epingle       TINYINT(1)    NOT NULL DEFAULT 0,
  est_supprime      TINYINT(1)    NOT NULL DEFAULT 0,
  repond_a          CHAR(10)      NULL,                   -- auto-référence (message cité)
  CONSTRAINT pk_message PRIMARY KEY (id),
  CONSTRAINT fk_message_conv FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  CONSTRAINT fk_message_reply FOREIGN KEY (repond_a) REFERENCES message (id)
) ENGINE=InnoDB;

-- Entité : REACTION (association MESSAGE x UTILISATEUR)
CREATE TABLE reaction (
  id                INT           NOT NULL AUTO_INCREMENT,
  message_id        CHAR(10)      NOT NULL,
  utilisateur_id    VARCHAR(20)   NOT NULL,
  emoji             VARCHAR(8)    NOT NULL,
  CONSTRAINT pk_reaction PRIMARY KEY (id),
  CONSTRAINT uq_reaction UNIQUE (message_id, utilisateur_id, emoji),
  CONSTRAINT fk_reaction_message FOREIGN KEY (message_id) REFERENCES message (id)
) ENGINE=InnoDB;

-- Entité : PIECE_JOINTE (attachements d'un message ou fichier partagé)
CREATE TABLE piece_jointe (
  id                INT           NOT NULL AUTO_INCREMENT,
  message_id        CHAR(10)      NULL,
  conversation_id   CHAR(15)      NULL,                   -- fichiers partagés au niveau conversation
  nom               VARCHAR(150)  NOT NULL,
  taille            VARCHAR(20)   NULL,
  type_mime         VARCHAR(120)  NULL,
  url               VARCHAR(255)  NOT NULL,
  date              DATETIME      NOT NULL,
  CONSTRAINT pk_piece_jointe PRIMARY KEY (id),
  CONSTRAINT fk_pj_message FOREIGN KEY (message_id) REFERENCES message (id),
  CONSTRAINT fk_pj_conversation FOREIGN KEY (conversation_id) REFERENCES conversation (id)
) ENGINE=InnoDB;

-- Entité : DOSSIER (boîte de réception, non lus, importants, archives, corbeille...)
CREATE TABLE dossier (
  id                VARCHAR(15)   NOT NULL,
  libelle           VARCHAR(60)   NOT NULL,
  icone             VARCHAR(40)   NULL,
  CONSTRAINT pk_dossier PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ============================================================
--  7. SUPPORT TECHNIQUE (tickets)
-- ============================================================

-- Entité : TICKET_SUPPORT
CREATE TABLE ticket_support (
  id                CHAR(10)      NOT NULL,
  sujet             VARCHAR(160)  NOT NULL,
  statut            ENUM('ouvert','en_cours','resolu','clos','en_attente') NOT NULL DEFAULT 'ouvert',
  priorite          ENUM('critique','haute','normale','faible') NOT NULL DEFAULT 'normale',
  agent_id          CHAR(10)      NOT NULL,
  cree_le           DATETIME      NOT NULL,
  mis_a_jour_le     DATETIME      NOT NULL,
  CONSTRAINT pk_ticket_support PRIMARY KEY (id),
  CONSTRAINT fk_ticket_agent FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : MESSAGE_SUPPORT (échanges sur un ticket)
CREATE TABLE message_support (
  id                CHAR(10)      NOT NULL,
  ticket_id         CHAR(10)      NOT NULL,
  expediteur        VARCHAR(120)  NOT NULL,
  texte             TEXT          NOT NULL,
  date              DATETIME      NOT NULL,
  CONSTRAINT pk_message_support PRIMARY KEY (id),
  CONSTRAINT fk_msg_ticket FOREIGN KEY (ticket_id) REFERENCES ticket_support (id)
) ENGINE=InnoDB;

-- ============================================================
--  8. JOURNAL D'ACTIVITÉ ET PERFORMANCE
-- ============================================================

-- Entité : ACTIVITE (timeline d'activités de l'agent)
CREATE TABLE activite (
  id                INT           NOT NULL AUTO_INCREMENT,
  agent_id          CHAR(10)      NOT NULL,
  type              ENUM('connexion','deconnexion','vente','reservation','paiement','impression','annulation','profil') NOT NULL,
  titre             VARCHAR(120)  NOT NULL,
  detail            VARCHAR(255)  NULL,
  date              DATETIME      NOT NULL,
  CONSTRAINT pk_activite PRIMARY KEY (id),
  CONSTRAINT fk_activite_agent FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : PERFORMANCE_MENSUELLE (objectifs / réalisations)
CREATE TABLE performance_mensuelle (
  id                INT           NOT NULL AUTO_INCREMENT,
  agent_id          CHAR(10)      NOT NULL,
  mois              TINYINT       NOT NULL,               -- 1..12
  annee             SMALLINT      NOT NULL,
  billets_vendus    SMALLINT      NOT NULL DEFAULT 0,
  reservations_crees SMALLINT     NOT NULL DEFAULT 0,
  chiffre_affaires  INT           NOT NULL DEFAULT 0,     -- en FCFA
  objectif          INT           NOT NULL DEFAULT 0,
  taux_atteinte     DECIMAL(5,1)  NULL,
  CONSTRAINT pk_perf PRIMARY KEY (id),
  CONSTRAINT uq_perf UNIQUE (agent_id, mois, annee),
  CONSTRAINT fk_perf_agent FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- Entité : STAT_JOURNALIERE (stats du tableau de bord)
CREATE TABLE stat_journaliere (
  id                INT           NOT NULL AUTO_INCREMENT,
  agent_id          CHAR(10)      NOT NULL,
  date              DATE          NOT NULL,
  billets_vendus    SMALLINT      NOT NULL DEFAULT 0,
  reservations      SMALLINT      NOT NULL DEFAULT 0,
  paiements_encaisses INT         NOT NULL DEFAULT 0,
  clients_servis    SMALLINT      NOT NULL DEFAULT 0,
  annulations       SMALLINT      NOT NULL DEFAULT 0,
  CONSTRAINT pk_stat_jour PRIMARY KEY (id),
  CONSTRAINT uq_stat_jour UNIQUE (agent_id, date),
  CONSTRAINT fk_stat_jour FOREIGN KEY (agent_id) REFERENCES agent (id)
) ENGINE=InnoDB;

-- ============================================================
--  9. ABONNEMENTS DES AGENCES (monétisation de la plateforme)
-- ============================================================
--  Règles métier :
--   1) Chaque agence a UN abonnement par mois (mois + année).
--   2) Si l'agence n'a pas payé à l'échéance → statut_abonnement = 'en_retard'
--      puis 'suspendu' → les agents de l'agence sont automatiquement
--      déconnectés (blocage des sessions + refus de connexion).
--   3) À J-7 et J-1 avant l'échéance → un rappel de renouvellement est
--      automatiquement envoyé à la compagnie (table rappel_abonnement
--      + notification de catégorie 'abonnement').
--   4) Les paiements d'abonnement = le revenu de la plateforme
--      (agrégé par compagnie pour le dashboard).

-- Entité : ABONNEMENT (abonnement mensuel d'une agence)
CREATE TABLE abonnement (
  id                INT           NOT NULL AUTO_INCREMENT,
  agence_id         CHAR(10)      NOT NULL,
  mois              TINYINT       NOT NULL,                -- 1..12
  annee             SMALLINT      NOT NULL,
  montant           INT           NOT NULL,                -- en FCFA
  date_debut        DATE          NOT NULL,
  date_fin          DATE          NOT NULL,
  statut_paiement   ENUM('paye','partiel','impaye','en_retard') NOT NULL DEFAULT 'impaye',
  statut            ENUM('actif','expire','suspendu','renouvele','annule') NOT NULL DEFAULT 'actif',
  date_paiement     DATETIME      NULL,
  reference_paiement VARCHAR(40)  NULL,
  CONSTRAINT pk_abonnement PRIMARY KEY (id),
  CONSTRAINT uq_abonnement UNIQUE (agence_id, mois, annee),
  CONSTRAINT fk_abonnement_agence FOREIGN KEY (agence_id) REFERENCES agence (id)
) ENGINE=InnoDB;

-- Entité : PAIEMENT_ABONNEMENT (versements reçus des compagnies)
-- C'est LA source de revenu de la plateforme, agrégée par compagnie.
CREATE TABLE paiement_abonnement (
  id                INT           NOT NULL AUTO_INCREMENT,
  abonnement_id     INT           NOT NULL,
  compagnie_id      CHAR(4)       NOT NULL,
  agence_id         CHAR(10)      NOT NULL,
  montant           INT           NOT NULL,                -- en FCFA
  methode           ENUM('orange_money','mtn_money','carte_bancaire','virement_bancaire','especes') NOT NULL,
  statut            ENUM('paye','en_attente','echoue','rembourse') NOT NULL DEFAULT 'paye',
  date              DATETIME      NOT NULL,
  reference         VARCHAR(40)   NOT NULL,
  CONSTRAINT pk_paiement_abonnement PRIMARY KEY (id),
  CONSTRAINT uq_paiement_abonnement UNIQUE (reference),
  CONSTRAINT fk_pa_abonnement FOREIGN KEY (abonnement_id) REFERENCES abonnement (id),
  CONSTRAINT fk_pa_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id),
  CONSTRAINT fk_pa_agence FOREIGN KEY (agence_id) REFERENCES agence (id)
) ENGINE=InnoDB;

-- Entité : RAPPEL_ABONNEMENT (relances de renouvellement envoyées à la compagnie)
CREATE TABLE rappel_abonnement (
  id                INT           NOT NULL AUTO_INCREMENT,
  abonnement_id     INT           NOT NULL,
  compagnie_id      CHAR(4)       NOT NULL,
  agence_id         CHAR(10)      NOT NULL,
  type              ENUM('avant_echeance','retard_paiement','derniere_relance') NOT NULL,
  sujet             VARCHAR(160)  NOT NULL,
  message           TEXT          NOT NULL,
  date_envoi        DATETIME      NOT NULL,
  statut            ENUM('envoye','delivre','lu','vu') NOT NULL DEFAULT 'envoye',
  canaux            ENUM('email','sms','notification','tous') NOT NULL DEFAULT 'notification',
  CONSTRAINT pk_rappel PRIMARY KEY (id),
  CONSTRAINT fk_rappel_abonnement FOREIGN KEY (abonnement_id) REFERENCES abonnement (id),
  CONSTRAINT fk_rappel_compagnie FOREIGN KEY (compagnie_id) REFERENCES compagnie (id),
  CONSTRAINT fk_rappel_agence FOREIGN KEY (agence_id) REFERENCES agence (id)
) ENGINE=InnoDB;

-- ============================================================
--  10. VUES POUR LE DASHBOARD (revenus par compagnie)
-- ============================================================

-- Vue : revenu total généré par chaque compagnie
CREATE OR REPLACE VIEW vue_revenu_par_compagnie AS
SELECT
  c.id                              AS compagnie_id,
  c.nom                             AS compagnie_nom,
  c.couleur                         AS couleur,
  COUNT(DISTINCT ag.id)             AS nb_agences,
  COUNT(DISTINCT a.id)              AS nb_abonnements_payes,
  SUM(pa.montant)                   AS revenu_total,
  SUM(CASE WHEN pa.date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
           THEN pa.montant ELSE 0 END) AS revenu_mois_courant,
  MAX(pa.date)                      AS dernier_paiement,
  RANK() OVER (ORDER BY SUM(pa.montant) DESC) AS rang_revenu
FROM compagnie c
LEFT JOIN agence ag            ON ag.compagnie_id = c.id
LEFT JOIN abonnement a         ON a.agence_id = ag.id
                              AND a.statut_paiement IN ('paye','partiel')
LEFT JOIN paiement_abonnement pa ON pa.abonnement_id = a.id
                              AND pa.statut = 'paye'
GROUP BY c.id, c.nom, c.couleur;

-- Vue : agences en retard / suspendues (pour la déconnexion automatique)
CREATE OR REPLACE VIEW vue_agences_non_abonnees AS
SELECT
  ag.id,
  ag.nom                            AS agence_nom,
  c.nom                             AS compagnie_nom,
  ag.statut_abonnement,
  ag.abonnement_expire_le,
  a.mois,
  a.annee,
  a.montant,
  DATEDIFF(ag.abonnement_expire_le, CURDATE()) AS jours_restants
FROM agence ag
JOIN compagnie c ON c.id = ag.compagnie_id
LEFT JOIN abonnement a ON a.agence_id = ag.id
  AND a.statut_paiement NOT IN ('paye','partiel')
WHERE ag.statut_abonnement IN ('en_retard','suspendu')
   OR ag.abonnement_expire_le < CURDATE()
ORDER BY ag.abonnement_expire_le ASC;
