/**
 * BUS TIX CONNECT — Agency Messaging Center Mock Data
 * Conversations, messages, contacts, folders, and support tickets
 * Ready to swap with real Express.js API endpoints
 */

export const currentUser = {
  id: 'ag_001',
  firstName: 'Admin',
  lastName: 'Guillaume',
  avatar: null,
  initials: 'AG',
  role: 'Administrateur',
  email: 'admin@guillaume-express.cm',
  phone: '+237 670 000 001',
  company: 'Guillaume Express',
};

export const folders = [
  { id: 'inbox', label: 'Boîte de réception', icon: 'bi-inbox', count: 12 },
  { id: 'unread', label: 'Messages non lus', icon: 'bi-envelope-open', count: 5 },
  { id: 'important', label: 'Messages importants', icon: 'bi-star', count: 3 },
  { id: 'archived', label: 'Archives', icon: 'bi-archive', count: 8 },
  { id: 'trash', label: 'Corbeille', icon: 'bi-trash', count: 2 },
  { id: 'support', label: 'Support', icon: 'bi-headset', count: 4 },
  { id: 'internal', label: 'Conversations internes', icon: 'bi-people', count: 6 },
  { id: 'client', label: 'Conversations clients', icon: 'bi-person-badge', count: 7 },
];

export const contacts = [
  { id: 'co_001', name: 'Jean Kamga', initials: 'JK', role: 'Voyageur', company: null, email: 'jean.kamga@email.cm', phone: '+237 677 123 456', online: true, avatar: null },
  { id: 'co_002', name: 'Support Bus Tix', initials: 'ST', role: 'Support technique', company: 'BUS TIX CONNECT', email: 'support@bustixconnect.cm', phone: '+237 677 000 000', online: true, avatar: null },
  { id: 'co_003', name: 'Marie Ngo Biyong', initials: 'MB', role: 'Agente de guichet', company: 'Guillaume Express', email: 'marie.ngo@guillaume-express.cm', phone: '+237 699 888 777', online: true, avatar: null },
  { id: 'co_004', name: 'Paul Biya Mbedi', initials: 'PM', role: 'Voyageur', company: null, email: 'paul.mbedi@yahoo.fr', phone: '+237 655 444 333', online: false, avatar: null },
  { id: 'co_005', name: 'Christine Eyanga', initials: 'CE', role: 'Voyageuse', company: null, email: 'christine.eyanga@gmail.cm', phone: '+237 670 111 222', online: true, avatar: null },
  { id: 'co_006', name: 'Thomas Owona', initials: 'TO', role: 'Manager', company: 'Guillaume Express', email: 'thomas.owona@guillaume-express.cm', phone: '+237 622 333 444', online: false, avatar: null },
  { id: 'co_007', name: 'Fatima Aboubakar', initials: 'FA', role: 'Voyageuse', company: null, email: 'fatima.ab@outlook.cm', phone: '+237 699 555 666', online: true, avatar: null },
  { id: 'co_008', name: 'David Essomba', initials: 'DE', role: 'Chauffeur', company: 'Guillaume Express', email: 'david.essomba@guillaume-express.cm', phone: '+237 677 777 888', online: true, avatar: null },
  { id: 'co_009', name: 'Esther Nkwi', initials: 'EN', role: 'Voyageuse', company: null, email: 'esther.nkwi@gmail.cm', phone: '+237 693 222 111', online: false, avatar: null },
  { id: 'co_010', name: 'Roland Tchinda', initials: 'RT', role: 'Agent de guichet', company: 'Guillaume Express', email: 'roland.tchinda@guillaume-express.cm', phone: '+237 655 888 999', online: true, avatar: null },
  { id: 'co_011', name: 'Alice Mendomo', initials: 'AM', role: 'Voyageuse', company: null, email: 'alice.mendomo@email.cm', phone: '+237 670 444 555', online: false, avatar: null },
  { id: 'co_012', name: 'Samuel Fongang', initials: 'SF', role: 'Voyageur', company: null, email: 'samuel.fongang@yahoo.cm', phone: '+237 699 666 777', online: true, avatar: null },
  { id: 'co_013', name: 'Gilles Mbah', initials: 'GM', role: 'Voyageur', company: null, email: 'gilles.mbah@email.cm', phone: '+237 655 111 333', online: false, avatar: null },
  { id: 'co_014', name: 'Brigitte Ndomo', initials: 'BN', role: 'Voyageuse', company: null, email: 'brigitte.ndomo@outlook.cm', phone: '+237 693 444 555', online: true, avatar: null },
  { id: 'co_015', name: 'Jean-Pierre Mvondo', initials: 'JM', role: 'Voyageur', company: null, email: 'jp.mvondo@gmail.cm', phone: '+237 677 222 444', online: false, avatar: null },
];

export const agents = contacts.filter((c) => c.company === 'Guillaume Express');

export const messageStatuses = ['sent', 'delivered', 'read'];

const now = new Date();

const minutesAgo = (m) => {
  const d = new Date(now);
  d.setMinutes(d.getMinutes() - m);
  return d.toISOString();
};

const hoursAgo = (h) => {
  const d = new Date(now);
  d.setHours(d.getHours() - h);
  return d.toISOString();
};

const daysAgo = (d) => {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (iso) => {
  const d = new Date(iso);
  const nowDate = new Date();
  const diff = nowDate - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const randomStatus = () => messageStatuses[Math.floor(Math.random() * messageStatuses.length)];

const buildMessages = (conversationId, lines) => {
  let time = now.getTime();
  return lines.map(([senderId, text, type = 'text', attachment = null], i) => {
    time -= 60000 * (1 + Math.floor(Math.random() * 5));
    return {
      id: `msg_${conversationId}_${i}`,
      conversationId,
      senderId,
      text,
      type,
      attachment,
      timestamp: new Date(time).toISOString(),
      status: i < lines.length - 1 ? 'read' : randomStatus(),
      edited: false,
      replyTo: null,
    };
  });
};

export const conversations = [
  {
    id: 'conv_001',
    contactId: 'co_001',
    folder: 'inbox',
    pinned: true,
    unread: 2,
    lastActivity: minutesAgo(3),
    messages: buildMessages('conv_001', [
      ['co_001', 'Bonjour, je souhaite réserver un billet pour Douala ce vendredi.'],
      ['ag_001', 'Bonjour Jean ! Bien sûr, quel horaire vous conviendrait ? Nous avons des départs à 6h, 9h et 14h.'],
      ['co_001', 'Le départ de 9h serait parfait. Combien coûte le billet ?'],
      ['ag_001', 'Le tarif est de 4 500 FCFA en standard, 6 000 FCFA en confort.'],
      ['co_001', 'Je prends un confort s\'il vous plaît. Je paie par Orange Money.'],
      ['ag_001', 'Parfait ! Voici le code de réservation : BK-2026-1983. Vous pouvez payer au guichet ou par OM au 677123456.'],
      ['co_001', 'Merci beaucoup ! Je viens de faire le paiement. Voici le code : OM-987654.'],
      ['ag_001', 'Paiement reçu ! Votre billet électronique est prêt. Bon voyage ! 🚌'],
      ['co_001', 'Merci ! À vendredi.'],
    ]),
  },
  {
    id: 'conv_002',
    contactId: 'co_002',
    folder: 'support',
    pinned: true,
    unread: 0,
    lastActivity: minutesAgo(15),
    messages: buildMessages('conv_002', [
      ['ag_001', 'Bonjour, j\'ai un problème avec l\'interface de réservation.'],
      ['co_002', 'Bonjour Admin Guillaume. Pouvez-vous décrire le problème ?'],
      ['ag_001', 'La page des réservations ne charge pas correctement depuis ce matin.'],
      ['co_002', 'Nous avons détecté une panie mineure du serveur. Notre équipe technique travaille sur la résolution.'],
      ['co_002', 'Le service sera rétabli dans environ 30 minutes. Veuillez nous excuser pour le désagrément.'],
      ['ag_001', 'D\'accord, merci pour l\'information. Je patiente.'],
      ['co_002', 'Le problème est maintenant résolu. Veuillez actualiser votre page.'],
      ['ag_001', 'Parfait, ça fonctionne ! Merci pour votre réactivité.'],
    ]),
  },
  {
    id: 'conv_003',
    contactId: 'co_003',
    folder: 'internal',
    pinned: false,
    unread: 1,
    lastActivity: minutesAgo(8),
    messages: buildMessages('conv_003', [
      ['co_003', 'Bonjour Admin, le guichet de Mbalmayo a besoin de 50 carnets de billets supplémentaires.'],
      ['ag_001', 'Bonjour Marie, je vais passer la commande auprès du fournisseur. Combien de carnets avez-vous en stock actuellement ?'],
      ['co_003', 'Il nous reste seulement 15 carnets. Avec l\'affluence du week-end, nous allons en manquer.'],
      ['ag_001', 'Je comprends. Je commande 100 carnets pour être tranquilles. Livraison prévue mercredi.'],
      ['co_003', 'Parfait, merci ! Avez-vous reçu le rapport des ventes du weekend ?'],
      ['ag_001', 'Oui, je l\'ai consulté ce matin. Très bon chiffre ! 2 850 000 FCFA de recettes.'],
      ['co_003', 'Excellent ! L\'équipe de Mbalmayo a bien travaillé.'],
    ]),
  },
  {
    id: 'conv_004',
    contactId: 'co_004',
    folder: 'inbox',
    pinned: false,
    unread: 0,
    lastActivity: hoursAgo(2),
    messages: buildMessages('conv_004', [
      ['co_004', 'Bonjour, j\'ai perdu mon bagage lors du trajet Yaoundé-Bafoussam hier.'],
      ['ag_001', 'Bonjour Paul, je suis désolé d\'apprendre cela. Pouvez-vous me donner les détails du voyage ?'],
      ['co_004', 'C\'était le voyage de 14h, bus Standard-05, siège 12.'],
      ['ag_001', 'Je contacte immédiatement le chauffeur. Pouvez-vous décrire le bagage ?'],
      ['co_004', 'Un sac de sport noir avec des vêtements et un ordinateur portable HP.'],
      ['ag_001', 'Bonnes nouvelles ! Le chauffeur a retrouvé votre sac. Il est déposé à notre agence de Bafoussam.'],
      ['co_004', 'Ouf ! Quel soulagement ! Merci infiniment. Je passe le récupérer demain.'],
    ]),
  },
  {
    id: 'conv_005',
    contactId: 'co_005',
    folder: 'client',
    pinned: false,
    unread: 0,
    lastActivity: hoursAgo(5),
    messages: buildMessages('conv_005', [
      ['co_005', 'Bonjour, je voudrais modifier ma réservation pour le voyage Douala-Yaoundé.'],
      ['ag_001', 'Bonjour Christine, bien sûr. Quel est votre numéro de réservation ?'],
      ['co_005', 'C\'est le BK-2026-1721. Je voudrais passer de demain à après-demain.'],
      ['ag_001', 'Je vois la réservation. Pas de problème, je la décale au 15 juillet même horaire.'],
      ['co_005', 'Parfait, merci beaucoup !'],
      ['ag_001', 'C\'est fait. Nouveau départ : 15 juillet à 9h. Vous recevrez un email de confirmation.'],
      ['co_005', 'Reçu ! Merci pour votre rapidité.'],
    ]),
  },
  {
    id: 'conv_006',
    contactId: 'co_006',
    folder: 'internal',
    pinned: false,
    unread: 3,
    lastActivity: hoursAgo(1),
    messages: buildMessages('conv_006', [
      ['co_006', 'Admin, nous avons un souci avec le bus Standard-03. Le moteur surchauffe.'],
      ['ag_001', 'Encore ? C\'est la troisième fois ce mois-ci. Il faut le mettre en maintenance approfondie.'],
      ['co_006', 'Je suis d\'accord. Je propose de le retirer du service pendant une semaine.'],
      ['ag_001', 'Approuvé. Contactez le garage de l\'Est pour une révision complète.'],
      ['co_006', 'C\'est fait. Le bus sera conduit au garage demain à 6h.'],
      ['ag_001', 'Parfait. En attendant, réaffectez le trajet de demain au Standard-08.'],
      ['co_006', 'On s\'en occupe. Aussi, il faudrait commander des pièces de rechange.'],
      ['ag_001', 'Faites-moi une liste des pièces nécessaires et je valide la commande.'],
    ]),
  },
  {
    id: 'conv_007',
    contactId: 'co_007',
    folder: 'client',
    pinned: false,
    unread: 1,
    lastActivity: minutesAgo(45),
    messages: buildMessages('conv_007', [
      ['co_007', 'Assalamou Alaikum ! Est-ce que le bus de 22h pour Garoua est toujours disponible ?'],
      ['ag_001', 'Wa Alaikum Assalam Fatima ! Oui, le bus de nuit pour Garoua part tous les jours à 22h.'],
      ['co_007', 'Parfait. Je veux réserver 2 places en confort, s\'il vous plaît.'],
      ['ag_001', 'Deux places confort pour Garoua, départ 22h. Le tarif est de 12 000 FCFA par personne.'],
      ['co_007', 'D\'accord. Je paye par MTN Mobile Money.'],
    ]),
  },
  {
    id: 'conv_008',
    contactId: 'co_008',
    folder: 'internal',
    pinned: false,
    unread: 0,
    lastActivity: hoursAgo(3),
    messages: buildMessages('conv_008', [
      ['co_008', 'Admin, je viens de terminer le trajet Douala-Yaoundé. Tout s\'est bien passé.'],
      ['ag_001', 'Excellent David. Pas de problème technique ?'],
      ['co_008', 'Non, tout est OK. Le bus est propre et en bon état.'],
      ['ag_001', 'Parfait. Vous avez le prochain départ à 16h pour Bafoussam.'],
      ['co_008', 'Reçu. Je prépare le bus et je prends ma pause.'],
    ]),
  },
  {
    id: 'conv_009',
    contactId: 'co_009',
    folder: 'archived',
    pinned: false,
    unread: 0,
    lastActivity: daysAgo(5),
    messages: buildMessages('conv_009', [
      ['co_009', 'Bonjour, je n\'ai pas reçu mon remboursement pour le voyage annulé de la semaine dernière.'],
      ['ag_001', 'Bonjour Esther, laissez-moi vérifier dans le système.'],
      ['ag_001', 'Effectivement, le remboursement est en attente. Je le lance maintenant.'],
      ['co_009', 'Merci, combien de temps ça prend ?'],
      ['ag_001', 'Sous 24 à 48 heures sur votre compte Orange Money.'],
      ['co_009', 'D\'accord, je vais surveiller. Merci.'],
      ['co_009', 'Bonjour, j\'ai bien reçu le remboursement. Merci beaucoup !'],
    ]),
  },
  {
    id: 'conv_010',
    contactId: 'co_010',
    folder: 'internal',
    pinned: true,
    unread: 0,
    lastActivity: minutesAgo(20),
    messages: buildMessages('conv_010', [
      ['co_010', 'Admin, le guichet de Yaoundé centre a vendu 45 billets aujourd\'hui !'],
      ['ag_001', 'Excellent Roland ! C\'est un record pour un mardi. Continuez comme ça.'],
      ['co_010', 'Merci ! L\'affluence est due à la fête de la musique ce week-end.'],
      ['ag_001', 'Préparez-vous pour le week-end. Je vais envoyer du renfort.'],
      ['co_010', 'Parfait, on aura besoin de 2 agents supplémentaires samedi et dimanche.'],
      ['ag_001', 'Je m\'en occupe. Je vais affecter Alice et Samuel en renfort.'],
      ['co_010', 'Super, merci Admin !'],
    ]),
  },
  {
    id: 'conv_011',
    contactId: 'co_011',
    folder: 'inbox',
    pinned: false,
    unread: 0,
    lastActivity: daysAgo(1),
    messages: buildMessages('conv_011', [
      ['co_011', 'Bonjour, je souhaite réclamer pour un retard de 3 heures sur mon voyage.'],
      ['ag_001', 'Bonjour Alice, je vous présente mes excuses. Puis-je avoir le numéro du voyage ?'],
      ['co_011', 'Voyage YD-2026-0789 du 10 juillet, départ 8h, arrivée 11h au lieu de 8h.'],
      ['ag_001', 'Je vois. C\'était dû à une panne mécanique. Nous vous offrons un bon de réduction de 20%.'],
      ['co_011', 'C\'est une bonne initiative, mais je pense que 20% c\'est insuffisant pour 3 heures de retard.'],
      ['ag_001', 'Vous avez raison. Je vous accorde 50% de réduction sur votre prochain voyage.'],
      ['co_011', 'Merci, j\'accepte. Comment est-ce que je reçois ce bon ?'],
      ['ag_001', 'Je vous envoie le bon par email dans l\'heure qui suit.'],
    ]),
  },
  {
    id: 'conv_012',
    contactId: 'co_012',
    folder: 'important',
    pinned: true,
    unread: 0,
    lastActivity: daysAgo(2),
    messages: buildMessages('conv_012', [
      ['co_012', 'Bonjour Admin, je suis intéressé par un partenariat avec votre compagnie.'],
      ['ag_001', 'Bonjour Samuel, merci pour votre intérêt. Quel type de partenariat proposez-vous ?'],
      ['co_012', 'Je représente l\'hôtel "Royal Palace" de Douala. Nous voulons offrir des navettes à nos clients.'],
      ['ag_001', 'C\'est une excellente idée ! Nous pouvons mettre en place un tarif préférentiel pour vos clients.'],
      ['co_012', 'Parfait. Je propose qu\'on se rencontre pour discuter des modalités.'],
      ['ag_001', 'Je vous propose ce vendredi à 15h dans nos locaux de Douala.'],
      ['co_012', 'C\'est noté. Je serai présent avec mon associé.'],
    ]),
  },
  {
    id: 'conv_013',
    contactId: 'co_013',
    folder: 'trash',
    pinned: false,
    unread: 0,
    lastActivity: daysAgo(10),
    messages: buildMessages('conv_013', [
      ['co_013', 'Bonjour, je ne suis pas satisfait du service. Le bus était en retard et sale.'],
      ['ag_001', 'Bonjour Gilles, je suis désolé d\'apprendre cela. Laissez-moi enquêter.'],
      ['co_013', 'C\'était le voyage Douala-Yaoundé du 5 juillet à 6h. Bus Standard-02.'],
      ['ag_001', 'Je vais parler au responsable et vous reviens rapidement.'],
      ['co_013', 'Franchement, je ne prendrai plus jamais votre compagnie.'],
      ['ag_001', 'Je comprends votre frustration Gilles. Nous allons améliorer nos services.'],
    ]),
  },
  {
    id: 'conv_014',
    contactId: 'co_014',
    folder: 'inbox',
    pinned: false,
    unread: 0,
    lastActivity: hoursAgo(6),
    messages: buildMessages('conv_014', [
      ['co_014', 'Bonjour ! Est-ce que je peux acheter un billet directement à bord ?'],
      ['ag_001', 'Bonjour Brigitte ! Oui, vous pouvez acheter votre billet directement auprès du chauffeur.'],
      ['co_014', 'Génial ! Et est-ce que je peux payer par Mobile Money ?'],
      ['ag_001', 'Absolument, tous nos bus sont équipés pour les paiements Orange Money et MTN.'],
      ['co_014', 'Parfait, merci pour l\'info !'],
    ]),
  },
  {
    id: 'conv_015',
    contactId: 'co_015',
    folder: 'important',
    pinned: false,
    unread: 1,
    lastActivity: minutesAgo(30),
    messages: buildMessages('conv_015', [
      ['co_015', 'Bonjour Admin, j\'ai une réclamation importante concernant mon voyage.'],
      ['ag_001', 'Bonjour Jean-Pierre, je vous écoute.'],
      ['co_015', 'J\'ai réservé un confort et on m\'a mis en standard. Je veux un remboursement.'],
      ['ag_001', 'Je vérifie immédiatement votre réservation. Veuillez m\'excuser pour cette erreur.'],
      ['co_015', 'C\'est vraiment inadmissible. J\'ai payé 6 000 FCFA pour rien.'],
      ['ag_001', 'Je vous rembourse la différence de 1 500 FCFA et vous offre un bon de 2 000 FCFA.'],
      ['co_015', 'D\'accord pour le remboursement, mais le bon ne m\'intéresse pas.'],
    ]),
  },
];

export const conversationsMap = Object.fromEntries(conversations.map((c) => [c.id, c]));

export const getContact = (contactId) => contacts.find((c) => c.id === contactId);

export const getConversationsByFolder = (folderId) =>
  conversations.filter((c) => c.folder === folderId);

export const getUnreadCount = () =>
  conversations.reduce((sum, c) => sum + c.unread, 0);

export const getPinnedConversations = () =>
  conversations.filter((c) => c.pinned);

export const searchConversations = (query) => {
  const q = query.toLowerCase();
  return conversations.filter((c) => {
    const contact = getContact(c.contactId);
    if (!contact) return false;
    const matchName = contact.name.toLowerCase().includes(q);
    const lastMsg = c.messages[c.messages.length - 1];
    const matchMsg = lastMsg && lastMsg.text.toLowerCase().includes(q);
    const matchCompany = contact.company && contact.company.toLowerCase().includes(q);
    return matchName || matchMsg || matchCompany;
  });
};

export const supportTicketStatuses = [
  { id: 'open', label: 'Ouvert', icon: 'bi-circle', color: '#0ea5e9' },
  { id: 'in_progress', label: 'En cours', icon: 'bi-arrow-repeat', color: '#f59e0b' },
  { id: 'resolved', label: 'Résolu', icon: 'bi-check-circle', color: '#22c55e' },
  { id: 'closed', label: 'Fermé', icon: 'bi-x-circle', color: '#6b7280' },
];

export const supportTickets = [
  { id: 'tkt_001', subject: 'Panne de l\'interface de réservation', status: 'resolved', priority: 'high', date: daysAgo(1), lastUpdate: hoursAgo(2), messages: 8 },
  { id: 'tkt_002', subject: 'Problème de synchronisation des paiements', status: 'in_progress', priority: 'urgent', date: minutesAgo(30), lastUpdate: minutesAgo(10), messages: 5 },
  { id: 'tkt_003', subject: 'Demande de nouveau module reporting', status: 'open', priority: 'medium', date: hoursAgo(5), lastUpdate: hoursAgo(3), messages: 3 },
  { id: 'tkt_004', subject: 'Bug sur l\'export des fichiers Excel', status: 'open', priority: 'low', date: daysAgo(2), lastUpdate: daysAgo(1), messages: 2 },
];

export const typingUsers = {
  conv_001: true,
  conv_007: true,
};

export const draftMessages = {
  conv_002: 'Merci pour votre aide précieuse. Je voulais aussi demander...',
  conv_010: 'Très bon travail cette semaine ! Pour vendredi, prévoyez...',
};

export const quickReplies = [
  { id: 'qr_01', text: 'Merci pour votre message. Je reviens vers vous rapidement.' },
  { id: 'qr_02', text: 'Votre réservation a bien été confirmée.' },
  { id: 'qr_03', text: 'Paiement reçu avec succès. Bon voyage !' },
  { id: 'qr_04', text: 'Pouvez-vous me donner plus de détails ?' },
  { id: 'qr_05', text: 'Je transfère votre demande au service concerné.' },
];

export const attachmentTypes = [
  { id: 'image', label: 'Image', icon: 'bi-image', accept: 'image/*' },
  { id: 'document', label: 'Document', icon: 'bi-file-text', accept: '.pdf,.doc,.docx,.xls,.xlsx' },
  { id: 'audio', label: 'Audio', icon: 'bi-mic', accept: 'audio/*' },
  { id: 'gif', label: 'GIF', icon: 'bi-camera-reels', accept: 'image/gif' },
];

export default conversations;
