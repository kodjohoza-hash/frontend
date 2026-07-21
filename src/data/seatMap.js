/**
 * BUS TIX CONNECT — Seat Map Mock Data
 * Configurable for different bus types (30, 45, 70 seats)
 */

export const BUS_LAYOUTS = {
  vip: {
    id: 'layout_vip',
    type: 'vip',
    label: 'VIP',
    rows: 9,
    leftSeats: 2,
    rightSeats: 2,
    lastRowLeft: 2,
    lastRowRight: 2,
    hasToilet: true,
    legroom: 'extended',
    seatWidth: 'large',
  },
  business: {
    id: 'layout_business',
    type: 'business',
    label: 'Business',
    rows: 11,
    leftSeats: 2,
    rightSeats: 2,
    lastRowLeft: 2,
    lastRowRight: 1,
    hasToilet: true,
    legroom: 'standard',
    seatWidth: 'standard',
  },
  economy: {
    id: 'layout_economy',
    type: 'economy',
    label: 'Économique',
    rows: 13,
    leftSeats: 2,
    rightSeats: 2,
    lastRowLeft: 2,
    lastRowRight: 1,
    hasToilet: false,
    legroom: 'compact',
    seatWidth: 'standard',
  },
};

export const mockTripInfo = {
  id: 'trp_001',
  companyId: 'comp_001',
  companyName: 'GRAND LITTORAL',
  companyLogo: null,
  tripNumber: 'GL-2026-0824-001',
  busType: 'vip',
  departureCity: 'Douala',
  arrivalCity: 'Yaoundé',
  departureDate: '2026-08-24',
  departureTime: '06:00',
  arrivalTime: '09:15',
  duration: '3h 15min',
  distance: '243 km',
  pricePerSeat: 4500,
  currency: 'FCFA',
  status: 'available',
  services: ['wifi', 'usb', 'ac', 'tv', 'toilet', 'charger'],
  baggagePolicy: '1 bagage en soute (23 kg) + 1 bagage à main (7 kg) inclus',
};

export const generateSeats = (layout) => {
  const seats = [];
  let seatNumber = 1;

  for (let row = 1; row <= layout.rows; row++) {
    const isLastRow = row === layout.rows;
    const leftCount = isLastRow ? layout.lastRowLeft : layout.leftSeats;
    const rightCount = isLastRow ? layout.lastRowRight : layout.rightSeats;

    for (let pos = 0; pos < leftCount; pos++) {
      seats.push({
        id: `seat_${String(seatNumber).padStart(2, '0')}`,
        number: seatNumber,
        row,
        position: pos === 0 ? 'window' : 'aisle',
        side: 'left',
        state: getMockState(seatNumber),
        type: layout.type,
        price: layout.type === 'vip' ? 4500 : layout.type === 'business' ? 3500 : 2500,
        isPMR: seatNumber === 3,
        isVIP: layout.type === 'vip',
        legroom: layout.legroom,
      });
      seatNumber++;
    }

    for (let pos = 0; pos < rightCount; pos++) {
      seats.push({
        id: `seat_${String(seatNumber).padStart(2, '0')}`,
        number: seatNumber,
        row,
        position: pos === 0 ? 'aisle' : 'window',
        side: 'right',
        state: getMockState(seatNumber),
        type: layout.type,
        price: layout.type === 'vip' ? 4500 : layout.type === 'business' ? 3500 : 2500,
        isPMR: false,
        isVIP: layout.type === 'vip',
        legroom: layout.legroom,
      });
      seatNumber++;
    }
  }

  return seats;
};

function getMockState(seatNumber) {
  const occupied = [5, 6, 11, 12, 17, 18, 23, 24, 29, 30, 35];
  const reserved = [7, 8, 19, 20];
  if (occupied.includes(seatNumber)) return 'occupied';
  if (reserved.includes(seatNumber)) return 'reserved';
  return 'available';
}

export const SERVICES_CONFIG = [
  { id: 'wifi', label: 'Wi-Fi', icon: 'bi-wifi', included: true },
  { id: 'usb', label: 'Ports USB', icon: 'bi-usb-plug-fill', included: true },
  { id: 'ac', label: 'Climatisation', icon: 'bi-snow', included: true },
  { id: 'tv', label: 'TV individuelle', icon: 'bi-tv', included: true },
  { id: 'toilet', label: 'Toilettes', icon: 'bi-droplet-fill', included: true },
  { id: 'charger', label: 'Recharge phone', icon: 'bi-battery-charging', included: true },
];
