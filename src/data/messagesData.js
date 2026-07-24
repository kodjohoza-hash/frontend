/**
 * BUS TIX CONNECT — Mock Messages Data
 * Rich conversation + message data for the messaging center
 * Ready to swap with real API endpoints
 */

export const currentUser = {
  id: 'usr_001',
  firstName: 'Jean',
  lastName: 'Kamga',
  avatar: null,
  initials: 'JK',
};

export const contacts = [
  {
    id: 'co_001',
    name: 'Guillaume Express',
    avatar: null,
    initials: 'GE',
    type: 'company',
    online: true,
  },
  {
    id: 'co_002',
    name: 'Support Bus Tix',
    avatar: null,
    initials: 'ST',
    type: 'support',
    online: true,
  },
  {
    id: 'co_003',
    name: 'Galaxie Voyage',
    avatar: null,
    initials: 'GV',
    type: 'company',
    online: false,
  },
  {
    id: 'co_004',
    name: 'Nso Transport',
    avatar: null,
    initials: 'NT',
    type: 'company',
    online: false,
  },
  {
    id: 'co_005',
    name: 'Meridien Voyages',
    avatar: null,
    initials: 'MV',
    type: 'company',
    online: true,
  },
];

export const conversations = [
  {
    id: 'conv_001',
    contactId: 'co_002',
    lastMessage: 'Votre demande de support #4521 a été prise en charge.',
    lastMessageTime: '2026-07-24T14:32:00',
    unreadCount: 2,
    pinned: true,
  },
  {
    id: 'conv_002',
    contactId: 'co_001',
    lastMessage: 'Le départ est confirmé pour 06h30 demain.',
    lastMessageTime: '2026-07-24T11:15:00',
    unreadCount: 1,
    pinned: true,
  },
  {
    id: 'conv_003',
    contactId: 'co_003',
    lastMessage: 'Merci pour votre feedback ! Nous améliorerons ce service.',
    lastMessageTime: '2026-07-23T18:40:00',
    unreadCount: 0,
    pinned: false,
  },
  {
    id: 'conv_004',
    contactId: 'co_005',
    lastMessage: 'Votre réservation MV-7890 est en attente de confirmation.',
    lastMessageTime: '2026-07-22T09:20:00',
    unreadCount: 0,
    pinned: false,
  },
  {
    id: 'conv_005',
    contactId: 'co_004',
    lastMessage: 'Le bus NT-204 est retardé de 45 minutes.',
    lastMessageTime: '2026-07-20T06:10:00',
    unreadCount: 0,
    pinned: false,
  },
];

export const messagesByConversation = {
  conv_001: [
    {
      id: 'msg_001',
      senderId: 'usr_001',
      text: 'Bonjour, j\'ai un problème avec ma réservation BK-2026-4521. Le siège sélectionné n\'est plus disponible.',
      timestamp: '2026-07-24T10:05:00',
      status: 'read',
    },
    {
      id: 'msg_002',
      senderId: 'co_002',
      text: 'Bonjour Jean ! Merci de nous avoir contactés. Pouvez-vous nous confirmer le numéro de votre réservation et la date de voyage ?',
      timestamp: '2026-07-24T10:12:00',
      status: 'read',
    },
    {
      id: 'msg_003',
      senderId: 'usr_001',
      text: 'Bien sûr. La réservation est BK-2026-4521, pour le 28 juillet de Douala à Yaoundé.',
      timestamp: '2026-07-24T10:15:00',
      status: 'read',
    },
    {
      id: 'msg_004',
      senderId: 'co_002',
      text: 'Merci ! J\'ai vérifié dans notre système. Le siège A12 est toujours réservé à votre nom. Y a-t-il un autre problème que vous rencontrez ?',
      timestamp: '2026-07-24T10:22:00',
      status: 'read',
    },
    {
      id: 'msg_005',
      senderId: 'usr_001',
      text: 'Oui, je voudrais changer l\'heure de départ si possible. Le bus des 06h30 est-il annulé ?',
      timestamp: '2026-07-24T10:30:00',
      status: 'read',
    },
    {
      id: 'msg_006',
      senderId: 'co_002',
      text: 'Je vérifie cela avec Guillaume Express. Un instant s\'il vous plaît.',
      timestamp: '2026-07-24T10:35:00',
      status: 'read',
    },
    {
      id: 'msg_007',
      senderId: 'co_002',
      text: 'Bonne nouvelle ! Le bus des 06h30 est bien maintenu. Vous pouvez voyager normalement.',
      timestamp: '2026-07-24T14:30:00',
      status: 'delivered',
    },
    {
      id: 'msg_008',
      senderId: 'co_002',
      text: 'Votre demande de support #4521 a été prise en charge. Vous recevrez un SMS de confirmation.',
      timestamp: '2026-07-24T14:32:00',
      status: 'delivered',
    },
  ],
  conv_002: [
    {
      id: 'msg_101',
      senderId: 'usr_001',
      text: 'Bonjour, est-ce que le trajet Douala-Yaoundé du 28 juillet est bien maintenu ?',
      timestamp: '2026-07-24T09:00:00',
      status: 'read',
    },
    {
      id: 'msg_102',
      senderId: 'co_001',
      text: 'Bonjour Jean ! Oui, le trajet est confirmé. Départ à 06h30 de la Gare Routière de Douala.',
      timestamp: '2026-07-24T09:08:00',
      status: 'read',
    },
    {
      id: 'msg_103',
      senderId: 'usr_001',
      text: 'Parfait. Faut-il arriver combien de temps avant le départ ?',
      timestamp: '2026-07-24T09:12:00',
      status: 'read',
    },
    {
      id: 'msg_104',
      senderId: 'co_001',
      text: 'Nous vous recommandons d\'arriver au moins 30 minutes avant le départ pour récupérer votre billet et passer le contrôle.',
      timestamp: '2026-07-24T09:18:00',
      status: 'read',
    },
    {
      id: 'msg_105',
      senderId: 'co_001',
      text: 'Le départ est confirmé pour 06h30 demain.',
      timestamp: '2026-07-24T11:15:00',
      status: 'delivered',
    },
  ],
  conv_003: [
    {
      id: 'msg_201',
      senderId: 'usr_001',
      text: 'Bonjour, le service WiFi du bus Douala-Bafoussam n\'a pas fonctionné pendant tout le trajet.',
      timestamp: '2026-07-23T16:20:00',
      status: 'read',
    },
    {
      id: 'msg_202',
      senderId: 'co_003',
      text: 'Bonjour et merci pour votre retour. Nous nous excusons pour ce désagrément. Pouvez-vous nous donner la date et le numéro du bus ?',
      timestamp: '2026-07-23T16:30:00',
      status: 'read',
    },
    {
      id: 'msg_203',
      senderId: 'usr_001',
      text: 'C\'était le 20 juillet, bus GV-1088, départ 07h00.',
      timestamp: '2026-07-23T16:35:00',
      status: 'read',
    },
    {
      id: 'msg_204',
      senderId: 'co_003',
      text: 'Merci pour ces informations. Nous allons vérifier avec notre équipe technique et prendre les mesures nécessaires.',
      timestamp: '2026-07-23T17:10:00',
      status: 'read',
    },
    {
      id: 'msg_205',
      senderId: 'co_003',
      text: 'Merci pour votre feedback ! Nous améliorerons ce service.',
      timestamp: '2026-07-23T18:40:00',
      status: 'read',
    },
  ],
  conv_004: [
    {
      id: 'msg_301',
      senderId: 'usr_001',
      text: 'Bonjour, j\'ai fait une réservation il y a 2 jours et je n\'ai pas encore reçu la confirmation.',
      timestamp: '2026-07-22T08:00:00',
      status: 'read',
    },
    {
      id: 'msg_302',
      senderId: 'co_005',
      text: 'Bonjour Jean. Merci de nous avoir contactés. Pouvez-vous nous donner votre numéro de réservation ?',
      timestamp: '2026-07-22T08:15:00',
      status: 'read',
    },
    {
      id: 'msg_303',
      senderId: 'usr_001',
      text: 'C\'est MV-7890, Yaoundé → Kribi.',
      timestamp: '2026-07-22T08:20:00',
      status: 'read',
    },
    {
      id: 'msg_304',
      senderId: 'co_005',
      text: 'Votre réservation MV-7890 est en attente de confirmation. Le paiement est bien reçu, nous confirmons sous 24h.',
      timestamp: '2026-07-22T09:20:00',
      status: 'read',
    },
  ],
  conv_005: [
    {
      id: 'msg_401',
      senderId: 'co_004',
      text: 'Bonjour Jean. Nous vous informons qu\'un retard est à prévoir sur le trajet Douala-Bamenda.',
      timestamp: '2026-07-20T05:30:00',
      status: 'read',
    },
    {
      id: 'msg_402',
      senderId: 'usr_001',
      text: 'Bonjour, combien de temps environ ?',
      timestamp: '2026-07-20T05:45:00',
      status: 'read',
    },
    {
      id: 'msg_403',
      senderId: 'co_004',
      text: 'Le bus NT-204 est retardé de 45 minutes. Le nouveau départ est prévu à 06h30.',
      timestamp: '2026-07-20T06:10:00',
      status: 'read',
    },
  ],
};
