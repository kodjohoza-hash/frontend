export const companies = [
  { id: 'EB', name: 'Express Bus Cameroun', logo: null, color: '#0B1D51' },
  { id: 'GE', name: 'Guillaume Express', logo: null, color: '#1E3A5F' },
  { id: 'ST', name: 'Sécurité Transport', logo: null, color: '#166534' },
  { id: 'RC', name: 'Royal Coach', logo: null, color: '#7C3AED' },
];

export const cities = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Kribi', 'Ebolowa', 'Bertoua',
  'Limbe', 'Buea', 'Kumba', 'Nkongsamba', 'Foumban',
];

export const busClasses = [
  { id: 'standard', label: 'Standard', multiplier: 1 },
  { id: 'confort', label: 'Confort', multiplier: 1.3 },
  { id: 'vip', label: 'VIP', multiplier: 1.6 },
  { id: 'premium', label: 'Premium', multiplier: 2.0 },
];

export const passengerCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const mockTrips = [
  { id: 'TR-101', company: 'Express Bus Cameroun', bus: 'Express-01', busClass: 'vip', from: 'Yaoundé', to: 'Douala', departure: '06:00', arrival: '08:15', duration: '2h 15min', basePrice: 8500, seats: { total: 45, available: 12 }, status: 'disponible' },
  { id: 'TR-102', company: 'Express Bus Cameroun', bus: 'Express-02', busClass: 'confort', from: 'Yaoundé', to: 'Douala', departure: '07:30', arrival: '09:45', duration: '2h 15min', basePrice: 6500, seats: { total: 50, available: 28 }, status: 'disponible' },
  { id: 'TR-103', company: 'Guillaume Express', bus: 'VIP-05', busClass: 'vip', from: 'Yaoundé', to: 'Douala', departure: '08:00', arrival: '10:00', duration: '2h 00min', basePrice: 9000, seats: { total: 45, available: 3 }, status: 'bientot_complet' },
  { id: 'TR-104', company: 'Sécurité Transport', bus: 'ST-03', busClass: 'standard', from: 'Yaoundé', to: 'Douala', departure: '09:00', arrival: '11:30', duration: '2h 30min', basePrice: 4500, seats: { total: 55, available: 42 }, status: 'disponible' },
  { id: 'TR-105', company: 'Royal Coach', bus: 'Royal-01', busClass: 'premium', from: 'Yaoundé', to: 'Douala', departure: '10:00', arrival: '11:50', duration: '1h 50min', basePrice: 15000, seats: { total: 30, available: 8 }, status: 'disponible' },
  { id: 'TR-106', company: 'Express Bus Cameroun', bus: 'Express-03', busClass: 'standard', from: 'Yaoundé', to: 'Douala', departure: '11:00', arrival: '13:15', duration: '2h 15min', basePrice: 5000, seats: { total: 55, available: 5 }, status: 'bientot_complet' },
  { id: 'TR-107', company: 'Guillaume Express', bus: 'Confort-04', busClass: 'confort', from: 'Yaoundé', to: 'Douala', departure: '12:00', arrival: '14:15', duration: '2h 15min', basePrice: 7000, seats: { total: 50, available: 22 }, status: 'disponible' },
  { id: 'TR-108', company: 'Express Bus Cameroun', bus: 'Express-05', busClass: 'vip', from: 'Yaoundé', to: 'Douala', departure: '14:00', arrival: '16:00', duration: '2h 00min', basePrice: 8500, seats: { total: 45, available: 0 }, status: 'complet' },
  { id: 'TR-201', company: 'Express Bus Cameroun', bus: 'Express-04', busClass: 'confort', from: 'Yaoundé', to: 'Bafoussam', departure: '07:00', arrival: '11:00', duration: '4h 00min', basePrice: 7500, seats: { total: 50, available: 18 }, status: 'disponible' },
  { id: 'TR-202', company: 'Guillaume Express', bus: 'Standard-05', busClass: 'standard', from: 'Yaoundé', to: 'Bafoussam', departure: '08:30', arrival: '13:00', duration: '4h 30min', basePrice: 5500, seats: { total: 55, available: 35 }, status: 'disponible' },
  { id: 'TR-203', company: 'Sécurité Transport', bus: 'ST-05', busClass: 'confort', from: 'Yaoundé', to: 'Bafoussam', departure: '10:00', arrival: '14:00', duration: '4h 00min', basePrice: 7000, seats: { total: 50, available: 0 }, status: 'complet' },
  { id: 'TR-301', company: 'Express Bus Cameroun', bus: 'Express-06', busClass: 'standard', from: 'Yaoundé', to: 'Kribi', departure: '06:30', arrival: '10:00', duration: '3h 30min', basePrice: 6000, seats: { total: 55, available: 25 }, status: 'disponible' },
  { id: 'TR-302', company: 'Guillaume Express', bus: 'Confort-02', busClass: 'confort', from: 'Yaoundé', to: 'Kribi', departure: '09:00', arrival: '12:15', duration: '3h 15min', basePrice: 8000, seats: { total: 50, available: 10 }, status: 'disponible' },
  { id: 'TR-303', company: 'Royal Coach', bus: 'Royal-02', busClass: 'premium', from: 'Yaoundé', to: 'Kribi', departure: '11:00', arrival: '13:45', duration: '2h 45min', basePrice: 14000, seats: { total: 30, available: 15 }, status: 'disponible' },
  { id: 'TR-401', company: 'Express Bus Cameroun', bus: 'Express-07', busClass: 'vip', from: 'Yaoundé', to: 'Bamenda', departure: '07:00', arrival: '13:00', duration: '6h 00min', basePrice: 12000, seats: { total: 45, available: 20 }, status: 'disponible' },
  { id: 'TR-402', company: 'Sécurité Transport', bus: 'ST-07', busClass: 'confort', from: 'Yaoundé', to: 'Bamenda', departure: '09:00', arrival: '15:30', duration: '6h 30min', basePrice: 9000, seats: { total: 50, available: 14 }, status: 'disponible' },
  { id: 'TR-403', company: 'Guillaume Express', bus: 'VIP-06', busClass: 'vip', from: 'Yaoundé', to: 'Bamenda', departure: '11:00', arrival: '16:30', duration: '5h 30min', basePrice: 13000, seats: { total: 45, available: 6 }, status: 'bientot_complet' },
];

export const paymentMethods = [
  { id: 'orange', label: 'Orange Money', icon: 'bi-phone', color: '#FF7900' },
  { id: 'mtn', label: 'MTN Mobile Money', icon: 'bi-phone', color: '#FFC300' },
  { id: 'card', label: 'Carte bancaire', icon: 'bi-credit-card', color: '#1E3A5F' },
  { id: 'cash', label: 'Espèces', icon: 'bi-cash', color: '#10B981' },
  { id: 'transfer', label: 'Virement bancaire', icon: 'bi-bank', color: '#8B5CF6' },
];

export const idTypes = [
  { id: 'none', label: 'Aucune' },
  { id: 'cni', label: 'CNI (Carte Nationale d\'Identité)' },
  { id: 'passport', label: 'Passeport' },
  { id: 'permis', label: 'Permis de conduire' },
  { id: 'autre', label: 'Autre' },
];

export const mockClients = [
  { id: 'CL-001', firstName: 'Jean', lastName: 'Ndongo', phone: '+237 691 234 567', email: 'jean.ndongo@email.cm', idType: 'cni', idNumber: 'CNI-10234567' },
  { id: 'CL-002', firstName: 'Fatima', lastName: 'Souleymane', phone: '+237 699 876 543', email: 'fatima.s@email.cm', idType: 'passport', idNumber: 'PA-CM-8765432' },
  { id: 'CL-003', firstName: 'Paul', lastName: 'Biya', phone: '+237 677 345 678', email: 'paul.biya@email.cm', idType: 'cni', idNumber: 'CNI-10345678' },
  { id: 'CL-004', firstName: 'Esther', lastName: 'Mbang', phone: '+237 695 567 890', email: 'esther.mbang@email.cm', idType: 'none', idNumber: '' },
  { id: 'CL-005', firstName: 'David', lastName: 'Nkwi', phone: '+237 683 456 789', email: 'david.nkwi@email.cm', idType: 'permis', idNumber: 'PER-2023-4567' },
  { id: 'CL-006', firstName: 'Marie', lastName: 'Tchinda', phone: '+237 690 123 456', email: 'marie.tchinda@email.cm', idType: 'cni', idNumber: 'CNI-10456789' },
  { id: 'CL-007', firstName: 'Ahmadou', lastName: 'Bello', phone: '+237 698 765 432', email: 'ahmadou.bello@email.cm', idType: 'none', idNumber: '' },
  { id: 'CL-008', firstName: 'Chantal', lastName: 'Eyanga', phone: '+237 696 234 567', email: 'chantal.eyanga@email.cm', idType: 'passport', idNumber: 'PA-CM-9876543' },
];

export const fees = {
  serviceFee: 500,
  taxRate: 0.05,
  discountRate: 0.10,
};

export const seatLayout = {
  rows: 10,
  leftCols: 2,
  rightCols: 3,
};

export const generateSeatMap = (totalSeats, reservedSeats = [], selectedSeats = []) => {
  const seats = [];
  let seatNum = 1;
  const { rows, leftCols, rightCols } = seatLayout;
  const cols = leftCols + rightCols;

  for (let row = 1; row <= rows; row++) {
    const rowSeats = [];
    for (let col = 1; col <= cols; col++) {
      const id = `S${String(row).padStart(2, '0')}${String(col).padStart(2, '0')}`;
      const number = seatNum++;
      const isReserved = reservedSeats.includes(id);
      const isSelected = selectedSeats.includes(id);
      rowSeats.push({
        id,
        number,
        row,
        col,
        side: col <= leftCols ? 'left' : 'right',
        isReserved,
        isSelected,
        isAvailable: !isReserved,
      });
    }
    seats.push(rowSeats);
  }
  return seats;
};

export const TAX_RATE = 0.05;
export const SERVICE_FEE = 500;

export default {
  companies,
  cities,
  busClasses,
  passengerCounts,
  mockTrips,
  paymentMethods,
  idTypes,
  mockClients,
  fees,
  seatLayout,
  generateSeatMap,
};
