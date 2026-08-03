/**
 * Sérialise un agent (avec agence + compagnie + compte) en profil utilisateur API.
 * Ne contient JAMAIS de données sensibles (mot de passe, hash, tokens, secrets).
 * Les associations `agence` / `compte` sont optionnelles : la fonction tolère
 * des agents chargés sans include (ex: middleware authenticate).
 */
const serializeUser = (agent) => ({
  id: agent.id,
  matricule: agent.matricule,
  email: agent.email,
  firstName: agent.prenom,
  lastName: agent.nom,
  phone: agent.telephone,
  photo: agent.photo ?? null,
  adresse: agent.adresse ?? null,
  dateNaissance: agent.date_naissance ?? null,
  genre: agent.genre ?? null,
  nationalite: agent.nationalite ?? null,
  langue: agent.langue ?? null,
  role: agent.role,
  agenceId: agent.agence_id ?? null,
  agenceName: agent.agence?.nom ?? null,
  guichetId: agent.guichet_id ?? null,
  guichetName: agent.guichet?.nom ?? null,
  compagnieId: agent.agence?.compagnie_id ?? null,
  companyName: agent.agence?.compagnie?.nom ?? null,
  dateCreation: agent.date_creation ?? agent.date_embauche ?? null,
  derniereConnexion: agent.compte?.derniere_connexion ?? null,
  emailVerified: Boolean(agent.verifie),
  statut: agent.statut,
});

module.exports = { serializeUser };
