import { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { BUS_LAYOUTS, mockTripInfo, generateSeats, SERVICES_CONFIG } from '@data/seatMap';
import '@assets/styles/seats.css';

const SeatSelection = () => {
  const navigate = useNavigate();
  const trip = mockTripInfo;
  const layoutKey = trip.busType || 'vip';
  const layout = BUS_LAYOUTS[layoutKey] || BUS_LAYOUTS.vip;

  const allSeats = useMemo(() => generateSeats(layoutKey), [layoutKey]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading] = useState(false);

  const availableCount = useMemo(
    () => allSeats.filter((s) => s.state === 'available').length,
    [allSeats]
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
      },
    });
  }, [navigate, selectedSeats, allSeats, trip]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BOOKING_SEARCH);
  }, [navigate]);

  const handleExpired = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  if (isLoading) {
    return (
      <div className="btc-seat-page">
        <div className="btc-seat-container">
          <SeatSkeleton />
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
            <li>
              <Link to={ROUTES.BOOKING_TRIPS || ROUTES.BOOKING_SEARCH} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}>
                Résultats
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
            <JourneyInfoCard trip={trip} availableSeats={availableCount} />
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
              trip={trip}
              selectedSeats={selectedSeats}
              allSeats={allSeats}
              onContinue={handleContinue}
              onBack={handleBack}
            />
            <CountdownCard durationMinutes={10} onExpired={handleExpired} />
            <BusServicesCard services={trip.services} servicesConfig={SERVICES_CONFIG} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
