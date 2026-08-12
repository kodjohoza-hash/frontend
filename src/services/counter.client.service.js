import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Counter Client Service (API réelle, contexte guichet)
 * Endpoints backend (module counters, réservés COUNTER_AGENT) :
 *   GET  /guichets/clients/search?recherche=&limite=   (recherche de clients)
 *   POST /guichets/clients                             (création client sans compte)
 *
 * Ces endpoints permettent au counter_agent de récupérer / créer un client,
 * d'obtenir son `clientId`, puis de l'injecter dans POST /bookings. L'accès
 * générique POST /users reste interdit pour ce rôle (garde-fou backend).
 */

/** Pièces d'identité acceptées par le backend (validateur client). */
export const PIECES = [
  { id: 'aucune', label: "Aucune" },
  { id: 'cni', label: "CNI (Carte Nationale d'Identité)" },
  { id: 'passeport', label: 'Passeport' },
  { id: 'permis', label: 'Permis de conduire' },
  { id: 'autre', label: 'Autre' },
];

/** Met en forme un client du répertoire guichet → structure attendue par l'UI. */
export const mapCounterClient = (c = {}) => ({
  id: c.id,
  firstName: c.firstName || c.prenom || '',
  lastName: c.lastName || c.nom || '',
  phone: c.phone || c.telephone || '',
  email: c.email || '',
  adresse: c.adresse || '',
  ville: c.ville || null,
  villeId: c.villeId || null,
  pays: c.pays || 'Cameroun',
  typePiece: c.typePiece || 'aucune',
  numeroPiece: c.numeroPiece || c.numero_piece || '',
  statut: c.statut || 'nouveau',
});

const counterClientService = {
  /** GET /guichets/clients/search — recherche de clients du répertoire guichet. */
  searchClients: async ({ recherche = '', limite = 20 } = {}) => {
    const data = await apiClient.get('/guichets/clients/search', {
      params: { recherche, limite },
    });
    return {
      items: (data.items || []).map(mapCounterClient),
      total: data.total || 0,
    };
  },

  /** POST /guichets/clients — création d'un client au guichet (sans compte). */
  createClient: async (payload) => {
    const data = await apiClient.post('/guichets/clients', payload);
    return mapCounterClient(data);
  },
};

export default counterClientService;
