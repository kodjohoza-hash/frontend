const CITY_CODES = { Douala: 'DLA', Yaoundé: 'YDE', Bafoussam: 'BFS', Garoua: 'GOU', Kribi: 'KBI', Limbé: 'LMB', Ngaoundéré: 'NGA', Bertoua: 'BTA', Bamenda: 'BDA', Maroua: 'MOU', Buea: 'BUE' };

const toCode = (city) => (CITY_CODES[city] || (city ? city.slice(0, 3).toUpperCase() : '—'));

const formatFrDate = (date) => {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const buildSeats = (selectedSeats, fallbackSeats = []) => {
  if (!selectedSeats || !selectedSeats.length) return fallbackSeats;
  return selectedSeats.map((s) => ({
    id: s.id || s.number,
    number: s.number,
    type: s.type || (s.position === 'window' ? 'Fenêtre' : s.position === 'aisle' ? 'Couloir' : 'Standard'),
    price: Number(s.price) || 4500,
  }));
};

export const buildTripFromState = (trip, fallback) => {
  if (!trip) return fallback;
  const f = fallback;
  const t = trip;
  const from = t.departureCity || t.from || (t.route && t.route.from) || f.route.from;
  const to = t.arrivalCity || t.to || (t.route && t.route.to) || f.route.to;
  const date = t.departureDate || t.date || (t.schedule && t.schedule.date) || f.schedule.date;
  return {
    ...f,
    company: {
      ...f.company,
      name: t.companyName || (t.company && t.company.name) || f.company.name,
      initial: t.companyInitial || (t.company && t.company.initial) || f.company.initial,
      color: t.companyColor || (t.company && t.company.color) || f.company.color,
    },
    bus: {
      ...f.bus,
      type: t.busType ? t.busType.toUpperCase() : (t.bus && t.bus.type) || f.bus.type,
      number: t.busNumber || (t.bus && t.bus.number) || f.bus.number,
      photo: t.busPhoto || (t.bus && t.bus.photo) || f.bus.photo,
    },
    tripNumber: t.tripNumber || f.tripNumber,
    route: {
      from,
      fromCode: t.departureCode || (t.route && t.route.fromCode) || toCode(from),
      to,
      toCode: t.arrivalCode || (t.route && t.route.toCode) || toCode(to),
    },
    schedule: {
      date,
      dateFormatted: formatFrDate(date),
      departure: t.departureTime || t.departure || (t.schedule && t.schedule.departure) || f.schedule.departure,
      arrival: t.arrivalTime || t.arrival || (t.schedule && t.schedule.arrival) || f.schedule.arrival,
      duration: t.duration || (t.schedule && t.schedule.duration) || f.schedule.duration,
      distance: t.distance || (t.schedule && t.schedule.distance) || f.schedule.distance,
    },
    boarding: t.departurePoint || (t.boarding) || f.boarding,
    arrivalPoint: t.arrivalPoint || f.arrivalPoint,
    baggage: t.baggagePolicy || f.baggage,
  };
};

export const buildReservationFromState = ({ selectedSeats, passengers, tripId, trip }, fallback) => {
  const base = buildTripFromState(trip, fallback);
  return {
    ...base,
    tripId: tripId || base.tripId,
    seats: buildSeats(selectedSeats, base.seats),
    passengers: Array.isArray(passengers) ? passengers : [],
  };
};

export const buildPassengersWithSeats = (passengers, seats) => {
  if (!Array.isArray(passengers) || !passengers.length) return [];
  const list = Array.isArray(seats) ? seats : [];
  return passengers.map((p, i) => {
    const seat = list[i] || list[0] || {};
    return {
      id: p.id || `pax_${i + 1}`,
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      phone: p.phone || '',
      email: p.email || '',
      seat: {
        number: seat.number,
        type: seat.type || 'Standard',
        price: Number(seat.price) || 0,
      },
    };
  });
};
