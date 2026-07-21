export const FAQ_CATEGORIES = [
  { id: 'all', label: 'Tous', icon: 'bi-grid' },
  { id: 'reservation', label: 'Réservation', icon: 'bi-calendar-check' },
  { id: 'paiement', label: 'Paiement', icon: 'bi-wallet2' },
  { id: 'billet', label: 'Billets', icon: 'bi-ticket-perforated' },
  { id: 'voyage', label: 'Voyage', icon: 'bi-bus-front' },
  { id: 'compte', label: 'Compte', icon: 'bi-person' },
  { id: 'support', label: 'Support', icon: 'bi-headset' },
];

export const FAQ_ITEMS = [
  {
    id: 1,
    question: 'Comment réserver un billet ?',
    answer: 'Sélectionnez votre ville de départ et destination, choisissez la date et le nombre de voyageurs, puis sélectionnez le voyage qui vous convient. Payez en quelques clics et recevez votre billet numérique instantanément par email et SMS.',
    category: 'reservation',
  },
  {
    id: 2,
    question: 'Puis-je modifier ma réservation ?',
    answer: 'Oui, vous pouvez modifier votre réservation jusqu\'à 4 heures avant l\'heure de départ prévue. Connectez-vous à votre espace personnel, sélectionnez la réservation concernée et cliquez sur "Modifier". Les changements de date ou d\'heure sont soumis à disponibilité.',
    category: 'reservation',
  },
  {
    id: 3,
    question: 'Comment annuler un voyage ?',
    answer: 'Pour annuler votre réservation, rendez-vous dans votre espace personnel, sélectionnez la réservation et cliquez sur "Annuler". L\'annulation est gratuite jusqu\'à 24 heures avant le départ. Entre 2 et 24 heures, des frais de 20% s\'appliquent. Moins de 2 heures, l\'annulation n\'est plus possible.',
    category: 'reservation',
  },
  {
    id: 4,
    question: 'Comment récupérer mon billet ?',
    answer: 'Votre billet est envoyé automatiquement par email et SMS après le paiement. Vous pouvez également le télécharger depuis votre espace personnel ou l\'accéder en mode hors-ligne via l\'application mobile BUS TIX CONNECT.',
    category: 'billet',
  },
  {
    id: 5,
    question: 'Quels moyens de paiement sont acceptés ?',
    answer: 'Nous acceptons le Mobile Money (MTN MoMo, Orange Money), les cartes bancaires (Visa, Mastercard), et le paiement à l\'embarquement pour certaines compagnies partenaires. Tous les paiements sont sécurisés et cryptés.',
    category: 'paiement',
  },
  {
    id: 6,
    question: 'Puis-je voyager avec une copie numérique du billet ?',
    answer: 'Oui, absolument. Votre billet numérique est valable sous forme d\'écran sur votre téléphone ou de impression papier. Présentez-le simplement au chauffeur ou au guichet lors de l\'embarquement. Le code QR sera vérifié automatiquement.',
    category: 'billet',
  },
  {
    id: 7,
    question: 'Comment contacter une compagnie ?',
    answer: 'Vous trouverez les coordonnées de chaque compagnie sur la page de la compagnie lors de votre recherche. Vous pouvez également accéder à la fiche complète de la compagnie en cliquant sur son nom dans les résultats de recherche.',
    category: 'support',
  },
  {
    id: 8,
    question: 'Comment retrouver mon historique de voyages ?',
    answer: 'Connectez-vous à votre espace personnel et cliquez sur "Mes voyages". Vous y trouverez l\'ensemble de vos réservations passées, en cours et à venir, avec tous les détails : dates, horaires, prix et statut.',
    category: 'compte',
  },
  {
    id: 9,
    question: 'Comment créer un compte ?',
    answer: 'Cliquez sur "S\'inscrire" en haut de page. Entrez votre numéro de téléphone camerounais, vérifiez le code SMS reçu, puis complétez votre profil. L\'inscription est gratuite et ne prend que 30 secondes.',
    category: 'compte',
  },
  {
    id: 10,
    question: 'Puis-je réserver pour une autre personne ?',
    answer: 'Oui, vous pouvez réserver pour un tiers. Il vous suffit de renseigner les informations du voyageur (nom complet, numéro de téléphone) lors de la réservation. Le billet sera envoyé à votre téléphone et vous pourrez le transmettre.',
    category: 'reservation',
  },
  {
    id: 11,
    question: 'Comment fonctionne le remboursement ?',
    answer: 'En cas d\'annulation éligible, le remboursement est effectué sous 48 à 72 heures ouvrées sur le moyen de paiement d\'origine. Pour les paiements Mobile Money, le remboursement est crédité directement sur votre compte Mobile Money.',
    category: 'paiement',
  },
  {
    id: 12,
    question: 'Comment choisir mon siège ?',
    answer: 'Lors de la réservation, après avoir sélectionné votre voyage, vous accédez à un plan de la bus affichant les sièges disponibles. Cliquez sur le siège de votre choix (fenêtre, couloir ou avant). Cette option est disponible pour les compagnies partenaires.',
    category: 'voyage',
  },
  {
    id: 13,
    question: 'Comment recevoir mes notifications ?',
    answer: 'Activez les notifications dans les paramètres de votre compte ou de l\'application. Vous recevrez des alertes pour : confirmation de réservation, rappel de voyage (24h avant), changement d\'heure, et offres promotionnelles personnalisées.',
    category: 'compte',
  },
  {
    id: 14,
    question: 'Comment retrouver un paiement effectué ?',
    answer: 'Tous vos paiements sont consultables dans la section "Historique des paiements" de votre espace personnel. Vous pouvez y voir le détail de chaque transaction : montant, date, moyen de paiement et statut.',
    category: 'paiement',
  },
  {
    id: 15,
    question: 'Comment contacter le support ?',
    answer: 'Notre équipe est disponible via plusieurs canaux : chat en direct sur l\'application et le site (24h/24), email à support@bustixconnect.com, ou par téléphone au +237 6 XX XXX XXX du lundi au samedi de 7h à 21h.',
    category: 'support',
  },
  {
    id: 16,
    question: 'Le service est-il disponible 24h/24 ?',
    answer: 'Oui, la plateforme BUS TIX CONNECT est accessible 24 heures sur 24, 7 jours sur 7. Vous pouvez réserver, modifier ou annuler vos billets à tout moment. Notre support client est également disponible en cas d\'urgence.',
    category: 'support',
  },
  {
    id: 17,
    question: 'Puis-je voyager avec des bagages supplémentaires ?',
    answer: 'Chaque compagnie a ses propres règles concernant les bagages. En général, un bagage à main et un bagage en soute sont inclus. Pour des bagages supplémentaires ou volumineux, contactez directement la compagnie avant le voyage.',
    category: 'voyage',
  },
];
