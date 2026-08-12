import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  ReservationStats,
  ReservationSearch,
  ReservationFilters,
  ReservationCard,
  ReservationDetailsDrawer,
  ReservationEmptyState,
  ReservationSkeleton,
} from '@components/reservations';
import { serializeReservation, serializeBookingStats, deriveCompanies } from '@utils/reservationAdapter';
import bookingService from '@services/booking.service';
import '@assets/styles/reservations.css';

const BookingsPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [state, setState] = useState({ loading: true, error: null, reservations: [], stats: [], companies: [] });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [list, stats] = await Promise.all([
        bookingService.listBookings({ limit: 100, sort: 'newest' }),
        bookingService.getBookingStats(),
      ]);
      const reservations = (list.items || []).map(serializeReservation).filter(Boolean);
      setState({
        loading: false,
        error: null,
        reservations,
        stats: serializeBookingStats(stats),
        companies: deriveCompanies(list.items || []),
      });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  const filteredReservations = useMemo(() => {
    let result = state.reservations;
    if (activeFilter !== 'all') result = result.filter((r) => r.status === activeFilter);
    if (selectedCompany) result = result.filter((r) => r.companyId === selectedCompany);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) => r.id.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.departureCity.toLowerCase().includes(q) || r.arrivalCity.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeFilter, selectedCompany, search, state.reservations]);

  const handleViewDetails = (reservation) => setSelectedReservation(reservation);
  const handleCancel = (reservation) => setCancelTarget(reservation);
  const confirmCancel = async () => {
    if (!cancelTarget || !cancelTarget.apiId) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(cancelTarget.apiId, { motif: 'Annulation depuis le portail client.' });
      setCancelTarget(null);
      pushToast('success', `Réservation ${cancelTarget.id} annulée.`);
      await load();
    } catch (err) {
      pushToast('error', err.message || "Impossible d'annuler la réservation.");
    } finally {
      setCancelling(false);
    }
  };
  const handleDownload = () => {};
  const handleRebook = () => {};
  const handleContact = () => {};

  if (state.loading && !state.reservations.length) return <ReservationSkeleton />;
  if (state.error && !state.reservations.length) {
    return (
      <div className="rv-page">
        <div className="rv-page__header">
          <h1 className="rv-page__title">Mes Réservations</h1>
        </div>
        <div className="rv-error">
          <i className="bi bi-exclamation-triangle" />
          <p>{state.error}</p>
          <button type="button" className="rv-card__btn rv-card__btn--primary" onClick={load}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ReservationSkeleton />}>
      <div className="rv-page__header">
        <div className="rv-page__title-group">
          <h1 className="rv-page__title">Mes Réservations</h1>
          <p className="rv-page__subtitle">Retrouvez toutes vos réservations et suivez leur évolution.</p>
        </div>
        <Link to="/" className="rv-page__action">
          <i className="bi bi-plus-circle" /> Réserver un nouveau voyage
        </Link>
      </div>
      <ReservationStats stats={state.stats} />
      <ReservationSearch value={search} onChange={setSearch} />
      <ReservationFilters active={activeFilter} onFilterChange={setActiveFilter} companies={state.companies} selectedCompany={selectedCompany} onCompanyChange={setSelectedCompany} />
      {filteredReservations.length > 0 ? (
        <div className="rv-list">
          {filteredReservations.map((reservation, i) => (
            <ReservationCard key={reservation.id} reservation={reservation} onViewDetails={handleViewDetails} onCancel={handleCancel} onDownload={handleDownload} onRebook={handleRebook} onContact={handleContact} style={{ animationDelay: `${i * 0.06}s` }} />
          ))}
        </div>
      ) : (
        <ReservationEmptyState />
      )}
      {selectedReservation && <ReservationDetailsDrawer reservation={selectedReservation} onClose={() => setSelectedReservation(null)} onCancel={handleCancel} onDownload={handleDownload} onContact={handleContact} />}
      {cancelTarget && (
        <div className="rv-confirm-overlay" onClick={() => !cancelling && setCancelTarget(null)}>
          <div className="rv-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="rv-confirm__icon"><i className="bi bi-exclamation-triangle" /></div>
            <h4 className="rv-confirm__title">Annuler la réservation ?</h4>
            <p className="rv-confirm__desc">Êtes-vous sûr de vouloir annuler la réservation <strong>{cancelTarget.id}</strong> ? Cette action est irréversible.</p>
            <div className="rv-confirm__actions">
              <button type="button" className="rv-card__btn rv-card__btn--outline" disabled={cancelling} onClick={() => setCancelTarget(null)}>Non, garder</button>
              <button type="button" className="rv-card__btn rv-card__btn--danger" disabled={cancelling} onClick={confirmCancel}>
                {cancelling ? 'Annulation…' : 'Oui, annuler'}
              </button>
            </div>
          </div>
        </div>
      )}
      {toasts.length > 0 && (
        <div className="db-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`db-toast db-toast--${toast.type}`}>
              <span className="db-toast-icon">
                {toast.type === 'success' && <i className="bi bi-check-circle-fill" />}
                {toast.type === 'error' && <i className="bi bi-exclamation-circle-fill" />}
              </span>
              <span className="db-toast-message">{toast.message}</span>
              <button className="db-toast-close" onClick={() => removeToast(toast.id)}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Suspense>
  );
};

export default BookingsPage;
