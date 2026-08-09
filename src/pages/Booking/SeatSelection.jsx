import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import {
  SeatMap,
  SeatLegend,
  JourneyInfoCard,
  ReservationSummary,
  CountdownCard,
  BusServicesCard,
  SeatSkeleton,
} from '@components/seats';
import { BUS_LAYOUTS, SERVICES_CONFIG } from '@data/seatMap';
import bookingService from '@services/booking.service';
import '@assets/styles/seats.css';

const LAYOUT_BY_TYPE = {
  vip: 'vip',
  premium: 'vip',
  confort: 'standard',
  standard: 'standard',
  economique: 'standard',
  minibus: 'mini',
  double_deck: 'premium',
};

const ONBOARD_SERVICES = {
  VIP: ['wifi', 'usb', 'ac', 'tv', 'toilet', 'charger', 'water', 'luggage'],
  Business: ['wifi', 'usb', 'ac', 'toilet', 'charger', 'water', 'luggage'],
  Economique: ['wifi', 'usb', 'water', 'luggage'],
};

const STATE_MAP = {
  libre: 'available',
  occupe: 'occupied',
  reserve: 'reserved',
  bloque: 'reserved',
};

/* Construit les objets sièges attendus par SeatMap/BusSeat à partir de la
   réponse d'occupation réelle (numéro + état + vip) et du gabarit du bus. */
function buildSeats(apiSeats, layoutKey, pricePerSeat) {
  const config = BUS_LAYOUTS[layoutKey];
  const perRow = (config.leftSeats || 0) + (config.rightSeats || 0);
  const leftPositions = Array.from({ length: config.leftSeats || 0 }, (_, i) => (i === 0 ? 'window' : 'aisle'));
  const rightPositions = Array.from({ length: config.rightSeats || 0 }, (_, i) => (i === 0 ? 'aisle' : 'window'));

  return (apiSeats || [])
    .map((s) => {
      const n = Number(s.number);
      const idx = (n - 1) % perRow;
      const row = Math.floor((n - 1) / perRow) + 1;
      const side = idx < (config.leftSeats || 0) ? 'left' : 'right';
      const localIdx = side === 'left' ? idx : idx - (config.leftSeats || 0);
      const position = side === 'left' ? leftPositions[localIdx] : rightPositions[localIdx];

      return {
        id: `${layoutKey}_${String(n).padStart(3, '0')}`,
        number: n,
        row,
        position,
        side,
        state: STATE_MAP[s.state] || (s.state === 'libre' ? 'available' : 'reserved'),
        price: Number(pricePerSeat) + (s.vip ? 500 : 0),
        isPMR: row === 1 && position === 'aisle',
        isVIP: Boolean(s.vip),
        legroom: config.legroom,
      };
    })
    .sort((a, b) => a.number - b.number);
}

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeTrip = searchParams.get('trip');
  const trip = location.state?.trip || null;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [retryKey, setRetryKey] = useState(0);

  const tripId = trip?.id || routeTrip || '';

  const layoutKey = trip?.busType ? LAYOUT_BY_TYPE[trip.busType] : null;
  const layout = layoutKey ? BUS_LAYOUTS[layoutKey] : null;

  useEffect(() => {
    if (!tripId) return;
    let active = true;
    (async () => {
      try {
        const data = await bookingService.getAvailability(tripId);
        if (active) setAvailability(data);
      } catch (err) {
        if (active) {
          setError(err.message || 'Ce voyage n\'est plus disponible. Veuillez effectuer une nouvelle recherche.');
          setAvailability(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tripId, retryKey]);

  const allSeats = useMemo(() => {
    if (!availability?.seats || !layoutKey) return [];
    return buildSeats(availability.seats, layoutKey, trip?.pricePerSeat || 0);
  }, [availability, layoutKey, trip?.pricePerSeat]);

  const availableCount = availability?.placesDispo ?? allSeats.filter((s) => s.state === 'available').length;

  const seatTrip = useMemo(
    () => (trip ? { ...trip, services: ONBOARD_SERVICES[trip.busType] || [] } : null),
    [trip]
  );

  const handleSeatToggle = useCallback((seat) => {
    if (seat.state === 'occupied' || seat.state === 'reserved') return;
    setSelectedSeats((prev) =>
      prev.includes(seat.number)
        ? prev.filter((n) => n !== seat.number)
        : [...prev, seat.number]
    );
  }, []);

  const handleContinue = useCallback(() => {
    const selectedObjects = allSeats.filter((s) => selectedSeats.includes(s.number));
    navigate(ROUTES.BOOKING_PASSENGER, {
      state: {
        selectedSeats: selectedObjects.map((s) => ({
          id: s.id,
          number: s.number,
          row: s.row,
          position: s.position,
          side: s.side,
          price: s.price,
          isVIP: s.isVIP,
        })),
        tripId: trip.id,
        trip,
        availability,
      },
    });
  }, [navigate, selectedSeats, allSeats, trip, availability]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BOOKING_SEARCH);
  }, [navigate]);

  const handleExpired = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  if (!trip) {
    return (
      <div className="btc-seat-page">
        <div className="btc-seat-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <i className="bi bi-bus-front" style={{ fontSize: 44, color: 'var(--text-muted)', marginBottom: 16 }} />
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Voyage introuvable
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: '0 0 24px' }}>
            Lancez une nouvelle recherche pour sélectionner vos sièges.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px 28px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--color-primary, #0B1D51)',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Rechercher un voyage
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="btc-seat-page">
        <div className="btc-seat-container">
          <SeatSkeleton />
        </div>
      </div>
    );
  }

  if (error || !availability) {
    return (
      <div className="btc-seat-page">
        <div className="btc-seat-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <i className="bi bi-exclamation-triangle" style={{ fontSize: 44, color: '#DC2626', marginBottom: 16 }} />
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Sièges indisponibles
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: '0 0 24px' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                padding: '12px 28px',
                borderRadius: 10,
                border: '1px solid var(--color-gray-300, #CBD5E1)',
                background: '#fff',
                color: 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Nouvelle recherche
            </button>
            <button
              type="button"
              onClick={() => { setIsLoading(true); setError(null); setRetryKey((k) => k + 1); }}
              style={{
                padding: '12px 28px',
                borderRadius: 10,
                border: 'none',
                background: 'var(--color-primary, #0B1D51)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="btc-seat-page">
      <div className="btc-seat-container">
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: 20, animation: 'btcFadeInUp 0.3s ease both' }}>
          <ol style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6, margin: 0, padding: 0, fontSize: 'var(--font-size-xs)' }}>
            <li>
              <Link to={ROUTES.HOME} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}>
                Accueil
              </Link>
            </li>
            <li style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
              <i className="bi bi-chevron-right" />
            </li>
            <li>
              <Link to={ROUTES.BOOKING_SEARCH} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}>
                Recherche
              </Link>
            </li>
            <li style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
              <i className="bi bi-chevron-right" />
            </li>
            <li style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              Choix des sièges
            </li>
          </ol>
        </nav>

        <div className="btc-seat-layout">
          {/* Left Column — Journey Info (Sticky) */}
          <div>
            <JourneyInfoCard trip={seatTrip} availableSeats={availableCount} />
          </div>

          {/* Center Column — Bus Visualization */}
          <div>
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--color-gray-200, #E5E7EB)', overflow: 'hidden', animation: 'btcFadeInUp 0.5s ease both', animationDelay: '0.1s' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-gray-100, #F3F4F6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-accent, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>
                    <i className="bi bi-bus-front-fill" />
                  </span>
                  Plan du bus
                </h3>
                <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 600, color: 'var(--color-primary, #0B1D51)', background: 'var(--color-primary-50, #EEF2FF)', padding: '3px 10px', borderRadius: 20 }}>
                  {layout.label} · {allSeats.length} places
                </span>
              </div>
              <div style={{ padding: '8px 16px 20px' }}>
                <SeatMap
                  layout={layout}
                  seats={allSeats}
                  selectedSeats={selectedSeats}
                  onSeatToggle={handleSeatToggle}
                />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <SeatLegend availableCount={availableCount} totalCount={allSeats.length} />
            </div>
          </div>

          {/* Right Column — Reservation Summary (Sticky) */}
          <div>
            <ReservationSummary
              trip={seatTrip}
              selectedSeats={selectedSeats}
              allSeats={allSeats}
              onContinue={handleContinue}
              onBack={handleBack}
            />
            <CountdownCard durationMinutes={10} onExpired={handleExpired} />
            <BusServicesCard services={seatTrip.services} servicesConfig={SERVICES_CONFIG} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
