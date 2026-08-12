import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { ROUTES } from '@routes/routeConstants';
import { Link } from 'react-router-dom';
import {
  TkTicketStats,
  TkSearch,
  TkFilters,
  TkTicketCard,
  TkTicketPreviewModal,
  TkTicketEmptyState,
  TkTicketSkeleton,
} from '@components/tickets';
import { serializeTicket, serializeTicketStats } from '@utils/ticketAdapter';
import bookingService from '@services/booking.service';
import '@assets/styles/tickets.css';

const TicketsPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [previewTicket, setPreviewTicket] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [state, setState] = useState({ loading: true, error: null, tickets: [], stats: { active: 0, used: 0, expired: 0, totalTrips: 0 } });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [list, stats] = await Promise.all([
        bookingService.listMyTickets({ limit: 100, sort: 'newest' }),
        bookingService.getMyTicketStats(),
      ]);
      setState({
        loading: false,
        error: null,
        tickets: (list.items || []).map(serializeTicket).filter(Boolean),
        stats: serializeTicketStats(stats),
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

  const openPreview = useCallback(async (ticket) => {
    setPreviewTicket({ ...ticket, qrCode: null });
    if (!ticket.apiId) return;
    try {
      const blob = await bookingService.getTicketQr(ticket.apiId);
      const url = URL.createObjectURL(blob);
      setPreviewTicket((prev) => (prev?.apiId === ticket.apiId ? { ...prev, qrCode: url } : prev));
    } catch {
      pushToast('warning', 'QR code indisponible pour ce billet.');
    }
  }, [pushToast]);

  const downloadPdf = useCallback(async (ticket) => {
    if (!ticket.apiId) return;
    try {
      const blob = await bookingService.getTicketPdf(ticket.apiId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `billet-${ticket.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      pushToast('error', err.message || 'Téléchargement PDF impossible.');
    }
  }, [pushToast]);

  const filtered = useMemo(() => {
    let result = state.tickets;
    if (activeFilter === 'upcoming') {
      result = result.filter((t) => t.status === 'active' && t.date && new Date(`${t.date}T${t.departure || '00:00'}`) >= new Date());
    } else if (activeFilter !== 'all') {
      result = result.filter((t) => t.status === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.from.toLowerCase().includes(q) || t.to.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.bookingRef.toLowerCase().includes(q) || t.company.toLowerCase().includes(q));
    }
    return result;
  }, [activeFilter, search, state.tickets]);

  if (state.loading && !state.tickets.length) return <TkTicketSkeleton />;
  if (state.error && !state.tickets.length) {
    return (
      <div className="tk-page__header">
        <h1 className="tk-page__title">Mes Billets</h1>
        <div className="tk-error">
          <i className="bi bi-exclamation-triangle" />
          <p>{state.error}</p>
          <button type="button" className="tk-page__cta" onClick={load}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<TkTicketSkeleton />}>
      <div className="tk-page__header">
        <div className="tk-page__title-group">
          <h1 className="tk-page__title">Mes Billets</h1>
          <p className="tk-page__subtitle">Consultez et gérez vos billets électroniques</p>
        </div>
        <Link to={ROUTES.HOME} className="tk-page__cta"><i className="bi bi-plus-lg" /> Réserver un billet</Link>
      </div>
      <div className="tk-page__content">
        <TkTicketStats stats={state.stats} />
        <TkSearch value={search} onChange={setSearch} />
        <TkFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} viewMode={viewMode} onViewChange={setViewMode} />
        {filtered.length === 0 ? <TkTicketEmptyState /> : viewMode === 'grid' ? (
          <div className="tk-ticket-grid">{filtered.map((ticket) => <TkTicketCard key={ticket.id} ticket={ticket} onView={openPreview} />)}</div>
        ) : (
          <div className="tk-ticket-list">{filtered.map((ticket) => <TkTicketCard key={ticket.id} ticket={ticket} viewMode="list" onView={openPreview} />)}</div>
        )}
      </div>
      {previewTicket && (
        <TkTicketPreviewModal
          ticket={previewTicket}
          onClose={() => setPreviewTicket(null)}
          onDownloadPdf={() => downloadPdf(previewTicket)}
        />
      )}
      {toasts.length > 0 && (
        <div className="db-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`db-toast db-toast--${toast.type}`}>
              <span className="db-toast-icon">
                {toast.type === 'success' && <i className="bi bi-check-circle-fill" />}
                {toast.type === 'error' && <i className="bi bi-exclamation-circle-fill" />}
                {toast.type === 'warning' && <i className="bi bi-exclamation-triangle-fill" />}
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

export default TicketsPage;
