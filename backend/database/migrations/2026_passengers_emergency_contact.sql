-- =====================================================================
-- BUS TIX CONNECT — MIGRATION PASSAGERS & CONTACTS D'URGENCE
-- Version : 2026-08-05
-- Nature  : 100% ADDITIVE (aucune donnée supprimée)
--
--   1. `passenger` : nouvelle table dédiée.
--        - 1 passager = 1 siège   : place_reservee_id UNIQUE (1:1 avec
--          `place_reservee`, qui reste l'occupation d'un siège).
--        - 1 passager = 1 billet  : `billet.passenger_id` UNIQUE (ajout ci-dessous).
--        - Le contact d'urgence n'est jamais un passager.
--
--   2. `emergency_contact` : contact d'urgence rattaché à UN passager
--        (passenger_id UNIQUE → 0..1 par passager).
--        Champs : full_name, phone, relationship, address (optionnel).
--
--   3. `billet.passenger_id` : FK vers `passenger` (1:1).
--
-- Le backfill des données existantes (place_reservee.nom_passager → passenger,
-- puis billet.passenger_id) est réalisé par le script Node :
--   backend/src/scripts/migrate-passengers.js  (génère de vrais ULID).
--
-- Pré-requis : migrations bookings + tickets appliquées.
-- Exécution  : mysql -u root -p bus_tix_connect < 2026_passengers_emergency_contact.sql
-- =====================================================================

-- ── 1. TABLE `passenger` ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS passenger (
  id               CHAR(26)    NOT NULL,
  reservation_id   CHAR(15)    NOT NULL,
  place_reservee_id INT        NOT NULL,
  client_id        CHAR(12)    NULL,
  first_name       VARCHAR(80) NOT NULL,
  last_name        VARCHAR(80) NOT NULL,
  gender           ENUM('M','F') NOT NULL,
  birth_date       DATE        NOT NULL,
  phone            VARCHAR(20) NOT NULL,
  email            VARCHAR(120) NULL,
  document_type    VARCHAR(20) NOT NULL,
  document_number  VARCHAR(40) NOT NULL,
  nationality      VARCHAR(60) NULL,
  status           ENUM('BOOKED','CHECKED_IN','BOARDED','CANCELLED')
                               NOT NULL DEFAULT 'BOOKED',
  created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_passenger_place (place_reservee_id),
  KEY idx_passenger_reservation (reservation_id),
  KEY idx_passenger_client (client_id),
  CONSTRAINT fk_passenger_reservation FOREIGN KEY (reservation_id) REFERENCES reservation (id) ON DELETE CASCADE,
  CONSTRAINT fk_passenger_place FOREIGN KEY (place_reservee_id) REFERENCES place_reservee (id) ON DELETE CASCADE,
  CONSTRAINT fk_passenger_client FOREIGN KEY (client_id) REFERENCES client (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ── 2. TABLE `emergency_contact` ───────────────────────────────────
CREATE TABLE IF NOT EXISTS emergency_contact (
  id            CHAR(26)     NOT NULL,
  passenger_id  CHAR(26)     NOT NULL,
  full_name     VARCHAR(160) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  relationship  VARCHAR(60)  NOT NULL,
  address       VARCHAR(255) NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_emergency_contact_passenger (passenger_id),
  CONSTRAINT fk_emergency_contact_passenger
    FOREIGN KEY (passenger_id) REFERENCES passenger (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ── 3. TABLE `billet` — lien 1 passager = 1 billet ─────────────────
ALTER TABLE billet
  ADD COLUMN passenger_id CHAR(26) NULL AFTER reservation_id;

ALTER TABLE billet
  ADD UNIQUE KEY uq_billet_passenger (passenger_id);

ALTER TABLE billet
  ADD CONSTRAINT fk_billet_passenger
    FOREIGN KEY (passenger_id) REFERENCES passenger (id) ON DELETE SET NULL;

-- =====================================================================
-- FIN MIGRATION
-- =====================================================================
