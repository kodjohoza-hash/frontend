/**
 * BUS TIX CONNECT — Landing Page Data
 * Target: Cameroon (extensible to all Africa)
 */

export const NAV_LINKS = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Compagnies', href: '#compagnies' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Comment ça marche', href: '#comment-ca-marche' },
  { label: 'FAQ', href: '#faq' },
];

export const STATS = [
  { id: 1, value: 85, suffix: '+', label: 'Compagnies partenaires', icon: 'bi-building' },
  { id: 2, value: 420, suffix: '+', label: 'Voyages quotidiens', icon: 'bi-bus-front' },
  { id: 3, value: 120000, suffix: '+', label: 'Voyageurs satisfaits', icon: 'bi-people' },
  { id: 4, value: 10, suffix: '+', label: 'Régions couvertes', icon: 'bi-geo-alt' },
];

export const FEATURES = [
  { id: 1, icon: 'bi-lightning-charge', title: 'Réservation instantanée', description: 'Réservez votre billet en moins de 2 minutes, où que vous soyez.' },
  { id: 2, icon: 'bi-shield-lock', title: 'Paiement 100% sécurisé', description: 'Mobile Money, carte bancaire ou paiement à l\'embarquement.' },
  { id: 3, icon: 'bi-qr-code-scan', title: 'Billet numérique', description: 'Recevez votre ticket par SMS et email. Aucun papier nécessaire.' },
  { id: 4, icon: 'bi-bell', title: 'Alertes en temps réel', description: 'Notifications pour retards, changements d\'horaires et promotions.' },
  { id: 5, icon: 'bi-patch-check', title: 'Compagnies certifiées', description: 'Chaque partenaire est vérifié et évalué par notre équipe.' },
  { id: 6, icon: 'bi-headset', title: 'Support 24h/24', description: 'Une équipe dédiée disponible à tout moment pour vous aider.' },
];

export const COMPANIES = [
  {
    id: 1,
    name: 'Finexs Voyage',
    slug: 'finexs-voyage',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop&q=80',
    rating: 4.8,
    trips: 45,
    verified: true,
    cities: ['Yaoundé', 'Douala', 'Bamenda', 'Bafoussam'],
    price: 3000,
    amenities: ['wifi', 'usb', 'climatisation', 'toilettes'],
  },
  {
    id: 2,
    name: 'Touristique Express',
    slug: 'touristique-express',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&q=80',
    rating: 4.6,
    trips: 38,
    verified: true,
    cities: ['Douala', 'Yaoundé', 'Kribi', 'Limbe'],
    price: 2500,
    amenities: ['wifi', 'climatisation'],
  },
  {
    id: 3,
    name: 'Garanti Express',
    slug: 'garanti-express',
    image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=600&h=400&fit=crop&q=80',
    rating: 4.7,
    trips: 32,
    verified: true,
    cities: ['Yaoundé', 'Douala', 'Ebolowa', 'Bafoussam'],
    price: 3500,
    amenities: ['wifi', 'usb', 'climatisation', 'toilettes'],
  },
  {
    id: 4,
    name: 'Buca Voyages',
    slug: 'buca-voyages',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=600&h=400&fit=crop&q=80',
    rating: 4.5,
    trips: 28,
    verified: true,
    cities: ['Douala', 'Buea', 'Limbe', 'Kumba'],
    price: 2000,
    amenities: ['climatisation', 'usb'],
  },
  {
    id: 5,
    name: 'Vatican Express',
    slug: 'vatican-express',
    image: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=600&h=400&fit=crop&q=80',
    rating: 4.4,
    trips: 22,
    verified: false,
    cities: ['Yaoundé', 'Douala', 'Ngaoundéré', 'Garoua'],
    price: 8000,
    amenities: ['wifi', 'climatisation', 'toilettes'],
  },
  {
    id: 6,
    name: 'Moghamo Express',
    slug: 'moghamo-express',
    image: 'https://images.unsplash.com/photo-1464219551459-27e42d721c65?w=600&h=400&fit=crop&q=80',
    rating: 4.3,
    trips: 18,
    verified: false,
    cities: ['Douala', 'Bamenda', 'Kumbo', 'Nkambe'],
    price: 4500,
    amenities: ['climatisation'],
  },
  {
    id: 7,
    name: 'Amour Mezam',
    slug: 'amour-mezam',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop&q=80',
    rating: 4.6,
    trips: 25,
    verified: true,
    cities: ['Bamenda', 'Douala', 'Yaoundé', 'Bafoussam'],
    price: 4000,
    amenities: ['wifi', 'usb', 'climatisation'],
  },
  {
    id: 8,
    name: 'Global Voyage',
    slug: 'global-voyage',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&q=80',
    rating: 4.5,
    trips: 30,
    verified: true,
    cities: ['Yaoundé', 'Douala', 'Bertoua', 'Ngaoundéré'],
    price: 6500,
    amenities: ['wifi', 'usb', 'climatisation', 'toilettes'],
  },
  {
    id: 9,
    name: 'Danay Express',
    slug: 'danay-express',
    image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=600&h=400&fit=crop&q=80',
    rating: 4.2,
    trips: 15,
    verified: false,
    cities: ['Douala', 'Maroua', 'Garoua', 'Yagoua'],
    price: 9000,
    amenities: ['climatisation', 'toilettes'],
  },
  {
    id: 10,
    name: 'United Express',
    slug: 'united-express',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=600&h=400&fit=crop&q=80',
    rating: 4.7,
    trips: 40,
    verified: true,
    cities: ['Yaoundé', 'Douala', 'Bafoussam', 'Kribi', 'Limbe'],
    price: 2800,
    amenities: ['wifi', 'usb', 'climatisation', 'toilettes'],
  },
];

export const DESTINATIONS = [
  { id: 1, name: 'Douala', image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&h=600&fit=crop&q=80', trips: 180, price: 2500 },
  { id: 2, name: 'Yaoundé', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&h=600&fit=crop&q=80', trips: 165, price: 3000 },
  { id: 3, name: 'Bafoussam', image: 'https://images.unsplash.com/photo-1548018560-c7196e4f220b?w=800&h=600&fit=crop&q=80', trips: 90, price: 4000 },
  { id: 4, name: 'Kribi', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80', trips: 75, price: 3500 },
  { id: 5, name: 'Limbe', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop&q=80', trips: 60, price: 2000 },
  { id: 6, name: 'Bamenda', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop&q=80', trips: 85, price: 5000 },
];

export const STEPS = [
  { id: 1, number: 1, icon: 'bi-search', title: 'Recherchez', description: 'Indiquez votre départ et destination pour voir les voyages disponibles.' },
  { id: 2, number: 2, icon: 'bi-bus-front', title: 'Comparez', description: 'Consultez les horaires, prix et avis pour chaque compagnie.' },
  { id: 3, number: 3, icon: 'bi-check2-square', title: 'Réservez', description: 'Choisissez votre place et confirmez votre réservation en ligne.' },
  { id: 4, number: 4, icon: 'bi-wallet2', title: 'Payez', description: 'Mobile Money, carte bancaire ou payez à l\'embarquement.' },
  { id: 5, number: 5, icon: 'bi-ticket-perforated', title: 'Voyagez', description: 'Votre billet numérique est envoyé instantanément. Prêt à partir !' },
];

export const TESTIMONIALS = [
  { id: 1, name: 'Marie Ngo Biyick', city: 'Yaoundé', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face', comment: 'Incroyable ! J\'ai réservé Yaoundé-Douala en 2 minutes. Le billet numérique est super pratique. Je recommande à 100%.', rating: 5, date: 'Juin 2026' },
  { id: 2, name: 'Paul Nkou Mvondo', city: 'Douala', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face', comment: 'Le meilleur service de réservation en ligne au Cameroun. Les compagnies sont fiables et le support est très réactif.', rating: 5, date: 'Mai 2026' },
  { id: 3, name: 'Cécile Fouda', city: 'Bafoussam', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face', comment: 'Interface moderne, paiement par Mobile Money sécurisé et notifications très utiles. Bravo Bus Tix Connect !', rating: 4, date: 'Juin 2026' },
  { id: 4, name: 'Jean-Pierre Kamga', city: 'Bamenda', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face', comment: 'Pratique et fiable. Je l\'utilise chaque mois pour Bamenda-Douala. Je ne peux plus m\'en passer.', rating: 5, date: 'Avril 2026' },
  { id: 5, name: 'Aimée Tchidjou', city: 'Garoua', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face', comment: 'Magnifique design et expérience fluide. Les prix sont très compétitifs par rapport aux guichets.', rating: 4, date: 'Mai 2026' },
];

export const FAQ_ITEMS = [
  { id: 1, question: 'Comment réserver un billet ?', answer: 'Sélectionnez votre ville de départ et destination, choisissez la date et le nombre de voyageurs, puis sélectionnez le voyage. Payez et recevez votre billet numérique par email et SMS.', category: 'Réservation' },
  { id: 2, question: 'Quels moyens de paiement acceptez-vous ?', answer: 'Nous acceptons le Mobile Money (MTN MoMo, Orange Money), les cartes bancaires (Visa, Mastercard) et le paiement à l\'embarquement pour certaines compagnies.', category: 'Paiement' },
  { id: 3, question: 'Puis-je annuler ma réservation ?', answer: 'Oui, vous pouvez annuler jusqu\'à 2 heures avant le départ. Les conditions varient selon la compagnie. Consultez nos conditions générales.', category: 'Annulation' },
  { id: 4, question: 'Comment recevoir mon billet ?', answer: 'Votre billet est envoyé instantanément par email et SMS après le paiement. Vous pouvez aussi le télécharger depuis votre espace personnel.', category: 'Billet' },
  { id: 5, question: 'Le service est disponible 24h/24 ?', answer: 'Oui, la plateforme est disponible 24h/24, 7j/7. Notre support client est également disponible en cas de besoin.', category: 'Service' },
  { id: 6, question: 'Comment contacter le support ?', answer: 'Via le chat en direct, par email à support@bustixconnect.com, ou par téléphone au +237 6 XX XXX XXX.', category: 'Support' },
];

export const CITIES = [
  'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Garoua',
  'Maroua', 'Kumba', 'Buea', 'Limbe', 'Kribi',
  'Ebolowa', 'Ngaoundéré', 'Nkongsamba', 'Bertoua', 'Ngaoundal',
];
