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

export const WHY_CHOOSE = [
  { id: 1, icon: 'bi-bus-front', title: 'Grand choix de compagnies', description: 'Comparez plusieurs compagnies de transport en quelques secondes et choisissez celle qui correspond le mieux à vos besoins.' },
  { id: 2, icon: 'bi-geo-alt', title: 'Réservation proche de vous', description: 'La plateforme propose les agences et points de vente les plus proches selon votre position.' },
  { id: 3, icon: 'bi-ticket-perforated', title: 'Billet numérique', description: 'Recevez immédiatement votre billet après votre réservation. Téléchargement simple. Présentation rapide.' },
  { id: 4, icon: 'bi-shield-lock', title: 'Paiement sécurisé', description: 'Toutes les transactions sont sécurisées. Protection des données. Paiements fiables.' },
  { id: 5, icon: 'bi-lightning-charge', title: 'Réservation rapide', description: 'Réservez votre voyage en moins de deux minutes grâce à une interface fluide et intuitive.' },
  { id: 6, icon: 'bi-headset', title: 'Support disponible', description: 'Notre équipe accompagne les voyageurs avant, pendant et après leur réservation.' },
];

export const STEPS = [
  { id: 1, number: 1, icon: 'bi-search', title: 'Rechercher un trajet', description: 'Choisissez votre ville de départ, votre destination, la date de voyage et lancez la recherche.' },
  { id: 2, number: 2, icon: 'bi-bus-front', title: 'Choisir une compagnie', description: 'Comparez les différentes compagnies de transport disponibles et sélectionnez celle qui vous convient.' },
  { id: 3, number: 3, icon: 'bi-grid-3x3-gap', title: 'Sélectionner un siège', description: 'Visualisez les sièges disponibles et choisissez votre place selon vos préférences.' },
  { id: 4, number: 4, icon: 'bi-credit-card', title: 'Effectuer le paiement', description: 'Payez votre réservation en toute sécurité grâce aux moyens de paiement pris en charge.' },
  { id: 5, number: 5, icon: 'bi-ticket-perforated', title: 'Recevoir votre billet', description: 'Votre billet électronique est généré automatiquement avec toutes les informations du voyage.' },
  { id: 6, number: 6, icon: 'bi-bag-check', title: 'Voyager sereinement', description: 'Présentez simplement votre billet lors de l\'embarquement et profitez de votre voyage.' },
];

export const CITIES = [
  'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Garoua',
  'Maroua', 'Kumba', 'Buea', 'Limbe', 'Kribi',
  'Ebolowa', 'Ngaoundéré', 'Nkongsamba', 'Bertoua', 'Ngaoundal',
];
