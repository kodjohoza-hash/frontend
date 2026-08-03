/**
 * Sérialise un agent (avec agence + compagnie) en profil utilisateur API.
 * Ne contient JAMAIS de données sensibles (mot de passe, hash, tokens).
 */
const serializeUser = (agent) => ({
  id: agent.id,
  matricule: agent.matricule,
  email: agent.email,
  firstName: agent.prenom,
  lastName: agent.nom,
  phone: agent.telephone,
  role: agent.role,
  agenceId: agent.agence_id,
  compagnieId: agent.agence?.compagnie_id ?? null,
  companyName: agent.agence?.compagnie?.nom ?? null,
  emailVerified: Boolean(agent.verifie),
  statut: agent.statut,
});

module.exports = { serializeUser };
