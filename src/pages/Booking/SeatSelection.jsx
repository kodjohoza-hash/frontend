import { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import { SeatMap, SeatLegend, TripInfoCard, BookingSummary } from '@components/seats';
import { BUS_LAYOUTS, mockTripInfo, generateSeats } from '@data/seatMap';
import '@assets/styles/seats.css';

const SeatSelection = () => {
  const navigate = useNavigate();
  const trip = mockTripInfo;
  const layout = BUS_LAYOUTS[trip.busType] || BUS_LAYOUTS.vip;

  const allSeats = useMemo(() => generateSeats(layout), [layout]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const availableCount = useMemo(
    () => allSeats.filter((s) => s.state === 'available' || s.state === 'reserved').length,
    [allSeats]
  );

  const handleSeatToggle = useCallback((seat) => {
    if (seat.state === 'occupied' || seat.state === 'reserved') return;
    setSelectedSeats((prev) =>
      prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  }, []);

  const handleContinue = useCallback(() => {
    navigate('/booking/passenger', { state: { selectedSeats, tripId: trip.id } });
  }, [navigate, selectedSeats, trip.id]);

  const handleBack = useCallback(() => {
    navigate('/booking/search');
  }, [navigate]);

  return (
    <div className="btc-seat-selection-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-4">
          <ol className="breadcrumb" style={{ fontSize: 'var(--font-size-xs)' }}>
            <li className="breadcrumb-item"><Link to={ROUTES.HOME} className="text-decoration-none" style={{ color: 'var(--text-muted)' }}>Accueil</Link></li>
            <li className="breadcrumb-item"><Link to={ROUTES.BOOKING_SEARCH} className="text-decoration-none" style={{ color: 'var(--text-muted)' }}>Recherche</Link></li>
            <li className="breadcrumb-item"><Link to={ROUTES.BOOKING_SEARCH} className="text-decoration-none" style={{ color: 'var(--text-muted)' }}>Resultats</Link></li>
            <li className="breadcrumb-item active" style={{ color: 'var(--text-primary)' }}>Choix des sieges</li>
          </ol>
        </nav>

        {/* Trip Info Card */}
        <TripInfoCard trip={trip} />

        {/* Two Column Layout */}
        <div className="row g-4">
          {/* Left: Seat Map */}
          <div className="col-12 col-lg-7">
            <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold mb-0" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
                    <i className="bi bi-bus-front-fill me-2" style={{ color: 'var(--color-accent)' }} />
                    Plan du bus
                  </h6>
                  <span
                    className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                    style={{
                      fontSize: 'var(--font-size-2xs)',
                      fontWeight: 'var(--font-weight-semibold)',
                      background: 'var(--color-primary-50)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {layout.label} · {allSeats.length} places
                  </span>
                </div>

                <SeatMap
                  layout={layout}
                  seats={allSeats}
                  selectedSeats={selectedSeats}
                  onSeatToggle={handleSeatToggle}
                />

                <div className="mt-3">
                  <SeatLegend
                    availableCount={availableCount}
                    totalCount={allSeats.length}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="col-12 col-lg-5">
            <div className="btc-summary-sticky">
              <BookingSummary
                trip={trip}
                selectedSeats={selectedSeats}
                seats={allSeats}
                onContinue={handleContinue}
                onBack={handleBack}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
