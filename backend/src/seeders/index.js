/**
 * Seed de démarrage — données de démonstration alignées sur le MCD
 * et sur les comptes mock du frontend (src/mock/users.js).
 *
 * Comptes créés (mot de passe identiques aux mocks frontend) :
 *   admin@bustixconnect.com   / Admin@123     (super_admin)
 *   company@bustixconnect.com / Company@123   (company_admin)
 *   counter@bustixconnect.com / Counter@123   (counter_agent)
 */
const {
  sequelize,
  Compagnie,
  Agence,
  Agent,
  CompteAgent,
  Abonnement,
  PaiementAbonnement,
  PlanAbonnement,
  AbonnementCompagnie,
  PaiementAbonnementCompagnie,
  HistoriqueAbonnement,
} = require('../models');
const { hashPassword } = require('../utils/password');

const now = new Date();
const moisCourant = now.getMonth() + 1; // 1..12
const anneeCourante = now.getFullYear();

const IDS = {
  compagnie: 'C001',
  agence: 'AG00000001',
  agentAdmin: 'AGT0000001',
  agentCompany: 'AGT0000002',
  agentCounter: 'AGT0000003',
};

const genererRef = (prefix) =>
  `${prefix}${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1e6)
    .toString(36)
    .toUpperCase()}`;

async function seed() {
  console.log('▶ Démarrage du seed…');

  /* Ville (table du MCD, pas encore modélisée → INSERT brut, tolérant) */
  try {
    await sequelize.query(
      `INSERT IGNORE INTO ville (id, nom) VALUES ('DLA', 'Douala'), ('YDE', 'Yaoundé'), ('BFS', 'Bafoussam')`
    );
    console.log('✔ Villes insérées (Douala, Yaoundé, Bafoussam)');
  } catch (_err) {
    console.warn('⚠ Table `ville` absente ou non modélisée — ignoré.');
  }

  const [compagnie] = await Compagnie.findOrCreate({
    where: { id: IDS.compagnie },
    defaults: { nom: 'Bus Tix Connect', telephone: '+237699887766', couleur: '#6D28D9', actif: true },
  });
  console.log(`✔ Compagnie : ${compagnie.nom}`);

  const [agence] = await Agence.findOrCreate({
    where: { id: IDS.agence },
    defaults: {
      nom: 'Agence Centrale Douala',
      ville_id: 'DLA',
      adresse: 'Akwa, Boulevard de la Liberté',
      telephone: '+237691234567',
      compagnie_id: IDS.compagnie,
      statut_abonnement: 'actif',
    },
  });
  console.log(`✔ Agence : ${agence.nom}`);

  /* Agents + comptes (rôles alignés sur ROLES du frontend) */
  const agents = [
    {
      id: IDS.agentAdmin,
      matricule: 'ADM-0001',
      prenom: 'Super',
      nom: 'Admin',
      email: 'admin@bustixconnect.com',
      telephone: '+237655443322',
      role: 'super_admin',
      date_embauche: '2023-12-01',
      motDePasse: 'Admin@123',
    },
    {
      id: IDS.agentCompany,
      matricule: 'CMP-0001',
      prenom: 'Marie',
      nom: 'Ngo Biyick',
      email: 'company@bustixconnect.com',
      telephone: '+237699887766',
      role: 'company_admin',
      date_embauche: '2024-01-10',
      motDePasse: 'Company@123',
    },
    {
      id: IDS.agentCounter,
      matricule: 'GCH-0001',
      prenom: 'Paul',
      nom: 'Atangana',
      email: 'counter@bustixconnect.com',
      telephone: '+237677554433',
      role: 'counter_agent',
      date_embauche: '2024-02-20',
      motDePasse: 'Counter@123',
    },
  ];

  for (const a of agents) {
    const { motDePasse, ...agentData } = a;
    const [agent] = await Agent.findOrCreate({
      where: { id: a.id },
      defaults: { ...agentData, agence_id: IDS.agence },
    });

    const compteExistant = await CompteAgent.findByPk(agent.id);
    if (!compteExistant) {
      await CompteAgent.create({
        agent_id: agent.id,
        email: a.email,
        telephone: a.telephone,
        mot_de_passe_hash: await hashPassword(motDePasse),
      });
    }
    /* Les comptes de démo sont considérés comme vérifiés (parité mocks frontend) */
    if (!agent.verifie) {
      await Agent.update({ verifie: true }, { where: { id: agent.id } });
    }
    console.log(`✔ Agent : ${a.email} (${a.role})`);
  }

  /* Abonnement du mois courant (payé) + paiement associé */
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const debutMois = iso(new Date(anneeCourante, moisCourant - 1, 1));
  const finMois = iso(new Date(anneeCourante, moisCourant, 0));
  const montant = 50000;

  const [abonnement] = await Abonnement.findOrCreate({
    where: { agence_id: IDS.agence, mois: moisCourant, annee: anneeCourante },
    defaults: {
      montant,
      date_debut: debutMois,
      date_fin: finMois,
      statut_paiement: 'paye',
      statut: 'actif',
      date_paiement: new Date(),
      reference_paiement: genererRef('PAY'),
    },
  });

  const paiementExistant = await PaiementAbonnement.findOne({
    where: { abonnement_id: abonnement.id },
  });
  if (!paiementExistant) {
    await PaiementAbonnement.create({
      abonnement_id: abonnement.id,
      compagnie_id: IDS.compagnie,
      agence_id: IDS.agence,
      montant,
      methode: 'virement_bancaire',
      statut: 'paye',
      date: new Date(),
      reference: genererRef('REF'),
    });
  }
  console.log(`✔ Abonnement ${moisCourant}/${anneeCourante} payé (${montant} XAF)`);

  /* ── Abonnement SaaS (par compagnie) : plan Standard actif + paiement + historique ── */
  const planStandard = await PlanAbonnement.findOne({ where: { code: 'STANDARD' } });
  if (planStandard) {
    const dateFinDemo = new Date(anneeCourante, moisCourant, 0); // fin de mois en cours
    const finIso = iso(dateFinDemo);

    const [aboSaaS] = await AbonnementCompagnie.findOrCreate({
      where: { compagnie_id: IDS.compagnie },
      defaults: {
        plan_id: planStandard.id,
        date_debut: debutMois,
        date_fin: finIso,
        renouvellement_auto: true,
        statut: 'actif',
      },
    });
    console.log(`✔ Abonnement SaaS démo : ${planStandard.nom} (${debutMois} → ${finIso})`);

    const paiementSaaS = await PaiementAbonnementCompagnie.findOne({
      where: { abonnement_compagnie_id: aboSaaS.id },
    });
    if (!paiementSaaS) {
      await PaiementAbonnementCompagnie.create({
        abonnement_compagnie_id: aboSaaS.id,
        compagnie_id: IDS.compagnie,
        plan_id: planStandard.id,
        montant: planStandard.prix_mensuel,
        methode: 'virement_bancaire',
        statut: 'paye',
        date: new Date(),
        reference: genererRef('SUB'),
      });
      console.log(`✔ Paiement SaaS démo : ${planStandard.prix_mensuel} XAF`);
    }

    const histo = await HistoriqueAbonnement.findOne({
      where: { abonnement_compagnie_id: aboSaaS.id, action: 'creation' },
    });
    if (!histo) {
      await HistoriqueAbonnement.create({
        compagnie_id: IDS.compagnie,
        abonnement_compagnie_id: aboSaaS.id,
        action: 'creation',
        plan_id: planStandard.id,
        detail: 'Abonnement initial (seed)',
        auteur: 'systeme',
        date: new Date(),
      });
    }

    await Compagnie.update(
      { statut_abonnement: 'actif', abonnement_expire_le: finIso },
      { where: { id: IDS.compagnie } }
    );
    console.log(`✔ Compagnie ${IDS.compagnie} : statut_abonnement=actif`);
  } else {
    console.warn('⚠ Plan STANDARD absent — abonnement SaaS démo ignoré.');
  }

  console.log('✓ Seed terminé.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('✗ Erreur seed :', err);
  process.exit(1);
});
