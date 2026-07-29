import { useState, useCallback, useEffect, useRef } from 'react';
import CounterBookingStats from '@components/counter/CounterBookingStats';
import CounterBookingFilters from '@components/counter/CounterBookingFilters';
import CounterBookingTable from '@components/counter/CounterBookingTable';
import CounterBookingDetails from '@components/counter/CounterBookingDetails';
import CounterBookingWizard from '@components/counter/CounterBookingWizard';
import CounterBookingSkeleton from '@components/counter/CounterBookingSkeleton';
import CounterBookingCard from '@components/counter/CounterBookingCard';
import {
  bookings as allBookings,
  filterBookings,
  sortBookings,
  quickFind,
} from '@data/counterBookingData';

const CounterBookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: '', route: '', company: '', bus: '', date: '',
    timeRange: '', status: '', salePoint: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [quickQuery, setQuickQuery] = useState('');
  const [quickResults, setQuickResults] = useState([]);
  const [showQuick, setShowQuick] = useState(false);
  const quickRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBookings(allBookings);
      setFiltered(allBookings);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = filterBookings(bookings, filters);
    result = sortBookings(result, sortBy);
    setFiltered(result);
    setPage(1);
  }, [bookings, filters, sortBy]);

  useEffect(() => {
    const handleClick = (e) => {
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setShowQuick(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    if (newFilters.viewBooking) {
      setViewing(newFilters.viewBooking);
      return;
    }
    setFilters(newFilters);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({
      search: '', route: '', company: '', bus: '', date: '',
      timeRange: '', status: '', salePoint: '',
    });
    setQuickQuery('');
    setShowQuick(false);
  }, []);

  const handleQuickSearch = (e) => {
    const q = e.target.value;
    setQuickQuery(q);
    if (q.trim().length >= 2) {
      setQuickResults(quickFind(q).slice(0, 8));
      setShowQuick(true);
    } else {
      setQuickResults([]);
      setShowQuick(false);
    }
  };

  const handleAction = useCallback((action, booking) => {
    switch (action) {
      case 'view':
        setViewing(booking);
        break;
      case 'edit':
        addToast('Modification de la réservation ' + booking.id, 'info');
        break;
      case 'confirm':
        setConfirmAction({
          booking,
          title: 'Confirmer la réservation',
          message: `Voulez-vous confirmer la réservation ${booking.id} de ${booking.clientName} ?`,
          icon: 'bi-check-circle',
          color: '#10B981',
          confirmText: 'Confirmer',
          onConfirm: () => {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === booking.id
                  ? {
                      ...b,
                      status: 'confirmed',
                      history: [
                        ...b.history,
                        { action: 'Réservation confirmée', timestamp: new Date().toISOString(), user: 'Kodjo Jojo', icon: 'bi-check-circle' },
                      ],
                    }
                  : b
              )
            );
            addToast(`Réservation ${booking.id} confirmée`);
            setConfirmAction(null);
          },
        });
        break;
      case 'cancel':
        setConfirmAction({
          booking,
          title: 'Annuler la réservation',
          message: `Voulez-vous vraiment annuler la réservation ${booking.id} de ${booking.clientName} ? Cette action est irréversible.`,
          icon: 'bi-x-circle',
          color: '#EF4444',
          confirmText: 'Annuler la réservation',
          danger: true,
          onConfirm: () => {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === booking.id
                  ? {
                      ...b,
                      status: 'cancelled',
                      notes: 'Annulation depuis le guichet.',
                      history: [
                        ...b.history,
                        { action: 'Réservation annulée', timestamp: new Date().toISOString(), user: 'Kodjo Jojo', icon: 'bi-x-circle' },
                      ],
                    }
                  : b
              )
            );
            addToast(`Réservation ${booking.id} annulée`);
            setConfirmAction(null);
          },
        });
        break;
      case 'convert':
        setConfirmAction({
          booking,
          title: 'Convertir en billet',
          message: `Voulez-vous convertir la réservation ${booking.id} en billet vendu ? Un paiement sera enregistré.`,
          icon: 'bi-ticket-perforated',
          color: '#8B5CF6',
          confirmText: 'Convertir en billet',
          onConfirm: () => {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === booking.id
                  ? {
                      ...b,
                      status: 'converted',
                      payment: { method: 'Cash', amount: b.amount, status: 'paid', paidAt: new Date().toISOString() },
                      history: [
                        ...b.history,
                        { action: 'Paiement confirmé', timestamp: new Date().toISOString(), user: 'Kodjo Jojo', icon: 'bi-credit-card' },
                        { action: 'Billet généré', timestamp: new Date().toISOString(), user: 'Kodjo Jojo', icon: 'bi-ticket-perforated' },
                      ],
                    }
                  : b
              )
            );
            addToast(`Réservation ${booking.id} convertie en billet`);
            setConfirmAction(null);
          },
        });
        break;
      case 'print':
        addToast('Impression de la réservation ' + booking.id, 'info');
        break;
      case 'download':
        addToast('Téléchargement de la réservation ' + booking.id, 'info');
        break;
      case 'history':
        setViewing(booking);
        break;
      case 'new':
        setShowWizard(true);
        break;
      default:
        break;
    }
  }, [addToast]);

  const handleWizardComplete = useCallback((newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setShowWizard(false);
    addToast(`Réservation ${newBooking.id} créée avec succès`);
  }, [addToast]);

  const handleBackFromDetail = useCallback(() => {
    setViewing(null);
  }, []);

  if (loading) return <CounterBookingSkeleton />;

  if (viewing) {
    return (
      <div className="acb-wrapper">
        <CounterBookingDetails
          booking={viewing}
          onBack={handleBackFromDetail}
          onAction={handleAction}
        />
      </div>
    );
  }

  return (
    <div className="acb-wrapper">
      {/* Header */}
      <div className="acb-header">
        <div className="acb-header-left">
          <h1 className="acb-title">Gestion des réservations</h1>
          <p className="acb-subtitle">
            Gérez les réservations de votre guichet —{' '}
            <strong>{bookings.length}</strong> réservation{bookings.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="acb-header-actions">
          <div className="acb-quick-find" ref={quickRef} style={{ position: 'relative' }}>
            <i className="bi bi-search acb-quick-find-icon" />
            <input
              placeholder="Recherche rapide (numéro, nom, téléphone)..."
              value={quickQuery}
              onChange={handleQuickSearch}
              onFocus={() => quickResults.length > 0 && setShowQuick(true)}
            />
            {quickQuery && (
              <button className="acb-quick-find-clear" onClick={() => { setQuickQuery(''); setShowQuick(false); }}>
                <i className="bi bi-x-lg" />
              </button>
            )}
            {showQuick && quickResults.length > 0 && (
              <div className="acb-quick-results">
                {quickResults.map((b) => (
                  <CounterBookingCard key={b.id} booking={b} onAction={handleAction} compact />
                ))}
              </div>
            )}
          </div>
          <button className="acb-btn acb-btn-primary" onClick={() => setShowWizard(true)}>
            <i className="bi bi-plus-lg" /> Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Stats */}
      <CounterBookingStats />

      {/* Filters */}
      <CounterBookingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onNewBooking={() => setShowWizard(true)}
      />

      {/* Results info */}
      <div className="acb-results-info">
        <span className="acb-results-count">
          <strong>{filtered.length}</strong> réservation{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          {filtered.length !== bookings.length && ` (sur ${bookings.length})`}
        </span>
        <select className="acb-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Plus récentes</option>
          <option value="oldest">Plus anciennes</option>
          <option value="amount_asc">Montant ↑</option>
          <option value="amount_desc">Montant ↓</option>
          <option value="status">Statut</option>
        </select>
      </div>

      {/* Table / Cards */}
      <CounterBookingTable
        bookings={filtered}
        onAction={handleAction}
        page={page}
        onPageChange={setPage}
      />

      {/* Wizard Modal */}
      {showWizard && (
        <CounterBookingWizard
          onClose={() => setShowWizard(false)}
          onComplete={handleWizardComplete}
        />
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <div className="acb-confirm-overlay" onClick={() => setConfirmAction(null)}>
          <div className="acb-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="acb-confirm-icon" style={{ color: confirmAction.color }}>
              <i className={`bi ${confirmAction.icon}`} />
            </div>
            <div className="acb-confirm-title">{confirmAction.title}</div>
            <div className="acb-confirm-text">{confirmAction.message}</div>
            <div className="acb-confirm-actions">
              <button className="acb-btn acb-btn-secondary" onClick={() => setConfirmAction(null)}>
                Retour
              </button>
              <button
                className={confirmAction.danger ? 'acb-btn acb-btn-danger' : 'acb-btn acb-btn-primary'}
                onClick={confirmAction.onConfirm}
              >
                {confirmAction.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="acb-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`acb-toast acb-toast-${toast.type}`}>
              <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'} acb-toast-icon`} />
              {toast.message}
              <button className="acb-toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounterBookingPage;
