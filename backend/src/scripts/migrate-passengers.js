/**
 * Migration — Passagers & contacts d'urgence (rétro-compatible, idempotente).
 *
 * Pré-requis : la migration SQL `2026_passengers_emergency_contact.sql` a été
 * appliquée (tables `passenger` et `emergency_contact`, colonne
 * `billet.passenger_id`).
 *
 * Étapes :
 *   1. Crée un `passenger` pour chaque `place_reservee` existante (1 passager
 *      = 1 siège). Le nom provient de `place_reservee.nom_passager` (découpé
 *      en prénom / nom) ; les champs d'identité inconnus reçoivent des
 *      valeurs par défaut marquées (l'identité réelle est saisie ensuite).
 *   2. Relie chaque `billet` existant à son passager (même réservation et
 *      même siège) → 1 passager = 1 billet.
 *
 * Exécution :  node src/scripts/migrate-passengers.js
 */
const { sequelize, Passenger, PlaceReservee, Reservation } = require('../models');
const { ulid } = require('../utils/ulid');

const tableExists = async (table) => {
  const [rows] = await sequelize.query(
    `SELECT COUNT(*) AS n FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table`,
    { replacements: { table } }
  );
  return Number(rows[0]?.n) > 0;
};

/** Découpe « Prénom Nom » → { first, last } (garde la totalité sinon). */
const splitFullName = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  const first = parts.shift() || 'Passager';
  const last = parts.join(' ') || first;
  return { first, last };
};

async function run() {
  console.log('▶ Backfill passagers…');

  if (!(await tableExists('passenger')) || !(await tableExists('emergency_contact'))) {
    console.error('✖ Tables `passenger` / `emergency_contact` absentes. Appliquer d’abord la migration SQL 2026_passengers_emergency_contact.sql.');
    process.exit(1);
  }

  const places = await PlaceReservee.findAll({
    include: [{ model: Reservation, as: 'reservation', attributes: ['id', 'client_id'] }],
    order: [['id', 'ASC']],
  });

  let created = 0;
  await sequelize.transaction(async (t) => {
    for (const place of places) {
      const existing = await Passenger.findOne({ where: { place_reservee_id: place.id }, transaction: t });
      if (existing) continue;

      const { first, last } = splitFullName(place.nom_passager);
      await Passenger.create(
        {
          id: ulid(),
          reservation_id: place.reservation_id,
          place_reservee_id: place.id,
          client_id: place.reservation?.client_id ?? null,
          first_name: first,
          last_name: last,
          gender: 'M',
          birth_date: '1970-01-01',
          phone: '',
          email: null,
          document_type: 'cni',
          document_number: `MIG-${place.id}`,
          nationality: null,
          status: 'BOOKED',
        },
        { transaction: t }
      );
      created += 1;
    }
  });

  console.log(`✔ ${created} passager(s) créé(s) depuis place_reservee.nom_passager`);

  const [upd] = await sequelize.query(
    `UPDATE billet b
        JOIN place_reservee pr ON pr.reservation_id = b.reservation_id AND pr.siege = b.siege
        JOIN passenger p ON p.place_reservee_id = pr.id
       SET b.passenger_id = p.id
     WHERE b.passenger_id IS NULL`
  );
  console.log(`✔ ${upd.affectedRows ?? 0} billet(s) relié(s) à leur passager`);

  const [orphans] = await sequelize.query(
    `SELECT COUNT(*) AS n
       FROM place_reservee pr
       LEFT JOIN passenger p ON p.place_reservee_id = pr.id
      WHERE p.id IS NULL`
  );
  console.log(`ℹ places sans passager restantes : ${Number(orphans[0]?.n) || 0}`);

  console.log('✔ Backfill terminé.');
  process.exit(0);
}

run().catch(async (err) => {
  console.error('✖ Backfill échoué :', err.message);
  process.exit(1);
});
