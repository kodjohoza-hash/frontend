export const BUS_LAYOUTS = {
  mini: {
    label: 'Mini Bus',
    rows: 7,
    leftSeats: 2,
    rightSeats: 2,
    hasToilet: false,
    hasDoor: 'front',
    seatWidth: 36,
    seatHeight: 32,
    rowGap: 6,
    legroom: 'compact',
    totalSeats: 28,
  },
  standard: {
    label: 'Bus Standard',
    rows: 11,
    leftSeats: 2,
    rightSeats: 2,
    hasToilet: true,
    hasDoor: 'front',
    seatWidth: 38,
    seatHeight: 34,
    rowGap: 7,
    legroom: 'standard',
    totalSeats: 44,
  },
  vip: {
    label: 'Bus VIP',
    rows: 9,
    leftSeats: 2,
    rightSeats: 2,
    hasToilet: true,
    hasDoor: 'front',
    seatWidth: 42,
    seatHeight: 38,
    rowGap: 10,
    legroom: 'extended',
    totalSeats: 36,
  },
  premium: {
    label: 'Bus Premium',
    rows: 13,
    leftSeats: 2,
    rightSeats: 2,
    hasToilet: true,
    hasDoor: 'front',
    seatWidth: 38,
    seatHeight: 34,
    rowGap: 7,
    legroom: 'standard',
    totalSeats: 52,
  },
};

export const SERVICES_CONFIG = {
  wifi: {
    icon: 'bi-wifi',
    label: 'WiFi',
    description: 'Accès internet sans fil pendant le trajet',
  },
  usb: {
    icon: 'bi-usb-symbol',
    label: 'Ports USB',
    description: 'Recharge de vos appareils électroniques',
  },
  ac: {
    icon: 'bi-snow',
    label: 'Climatisation',
    description: 'Température confortable tout au long du trajet',
  },
  tv: {
    icon: 'bi-tv',
    label: 'Écran TV',
    description: 'Divertissement vidéo pendant le voyage',
  },
  toilet: {
    icon: 'bi-droplet-half',
    label: 'Toilettes',
    description: 'Toilettes embarquées accessibles',
  },
  charger: {
    icon: 'bi-lightning-charge',
    label: 'Chargeur 220V',
    description: 'Prises électriques pour ordinateurs',
  },
  water: {
    icon: 'bi-cup-straw',
    label: 'Eau offerte',
    description: 'Bouteille d\'eau offerte pendant le trajet',
  },
  luggage: {
    icon: 'bi-bag',
    label: 'Bagages',
    description: 'Espace bagages généreux sous le bus',
  },
};

export const mockTripInfo = {
  id: 'trip_001',
  companyName: 'GRAND LITTORAL',
  companyInitial: 'GL',
  companyColor: '#0B1D51',
  tripNumber: 'GL-2026-0824-001',
  busNumber: 'GL-BUS-042',
  busType: 'vip',
  busPhoto: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop&q=80',
  departureCity: 'Douala',
  arrivalCity: 'Yaoundé',
  departureDate: '2026-08-24',
  departureTime: '06:00',
  arrivalTime: '09:15',
  duration: '3h 15min',
  distance: '243 km',
  pricePerSeat: 4500,
  currency: 'FCFA',
  services: ['wifi', 'usb', 'ac', 'tv', 'toilet', 'charger', 'water', 'luggage'],
  baggagePolicy: '2 bagages inclus (23 kg + 7 kg)',
  departurePoint: 'Gare Routière Bonabéri',
  arrivalPoint: 'Gare Routière Mokolo',
};

export function generateSeats(layout) {
  const config = BUS_LAYOUTS[layout];
  if (!config) return [];

  const seats = [];
  let seatNumber = 1;

  for (let row = 1; row <= config.rows; row++) {
    for (let i = 0; i < config.leftSeats; i++) {
      const position = i === 0 ? 'window' : 'aisle';
      const state = getMockState(seatNumber);
      const isPMR = row === 1 && position === 'aisle';
      const isVIP = layout === 'vip' && row <= 2;

      seats.push({
        id: `${layout}_${String(seatNumber).padStart(3, '0')}`,
        number: seatNumber,
        row,
        position,
        side: 'left',
        state,
        price: config.pricePerSeat || 4500 + (isVIP ? 500 : 0),
        isPMR,
        isVIP,
        legroom: config.legroom,
      });
      seatNumber++;
    }

    for (let i = 0; i < config.rightSeats; i++) {
      const position = i === 0 ? 'aisle' : 'window';
      const state = getMockState(seatNumber);
      const isPMR = row === 1 && position === 'aisle';
      const isVIP = layout === 'vip' && row <= 2;

      seats.push({
        id: `${layout}_${String(seatNumber).padStart(3, '0')}`,
        number: seatNumber,
        row,
        position,
        side: 'right',
        state,
        price: 4500 + (isVIP ? 500 : 0),
        isPMR,
        isVIP,
        legroom: config.legroom,
      });
      seatNumber++;
    }
  }

  return seats;
}

export function getMockState(seatNumber) {
  const occupiedSeats = [3, 7, 11, 14, 19, 22, 25, 30, 33, 38, 41, 45];
  const reservedSeats = [5, 10, 16, 28, 35, 42];

  if (occupiedSeats.includes(seatNumber)) return 'occupied';
  if (reservedSeats.includes(seatNumber)) return 'reserved';
  return 'available';
}
