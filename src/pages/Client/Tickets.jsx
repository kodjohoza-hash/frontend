import { Suspense } from 'react';
import { ROUTES } from '@routes/routeConstants';
import { Link } from 'react-router-dom';
import DashboardLayout from '@components/client/DashboardLayout';
import {
  TkTicketStats,
  TkSearch,
  TkFilters,
  TkTicketCard,
  TkTicketPreviewModal,
  TkTicketEmptyState,
  TkTicketSkeleton,
} from '@components/tickets';
import { mockTickets, mockTicketStats } from '@data/tickets';
import '@assets/styles/tickets.css';
import { useState, useMemo } from 'react';

const TicketsPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [previewTicket, setPreviewTicket] = useState(null);

  const filtered = useMemo(() => {
    let result = mockTickets;
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.status === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.from.toLowerCase().includes(q) ||
          t.to.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.bookingRef.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q)
      );
    }
    return result;
  }, [mockTickets, activeFilter, search]);

  return (
    <DashboardLayout>
      <div className="tk-page__header">
        <div className="tk-page__title-group">
          <h1 className="tk-page__title">Mes Billets</h1>
          <p className="tk-page__subtitle">
            Consultez et gérez vos billets électroniques
          </p>
        </div>
        <Link to={ROUTES.HOME} className="tk-page__cta">
          <i className="bi bi-plus-lg" />
          Réserver un billet
        </Link>
      </div>

      <div className="tk-page__content">
        <TkTicketStats stats={mockTicketStats} />

        <TkSearch value={search} onChange={setSearch} />

        <TkFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />

        {filtered.length === 0 ? (
          <TkTicketEmptyState />
        ) : viewMode === 'grid' ? (
          <div className="tk-ticket-grid">
            {filtered.map((ticket) => (
              <TkTicketCard
                key={ticket.id}
                ticket={ticket}
                onView={setPreviewTicket}
              />
            ))}
          </div>
        ) : (
          <div className="tk-ticket-list">
            {filtered.map((ticket) => (
              <TkTicketCard
                key={ticket.id}
                ticket={ticket}
                viewMode="list"
                onView={setPreviewTicket}
              />
            ))}
          </div>
        )}
      </div>

      {previewTicket && (
        <TkTicketPreviewModal
          ticket={previewTicket}
          onClose={() => setPreviewTicket(null)}
        />
      )}
    </DashboardLayout>
  );
};

const Tickets = () => (
  <Suspense fallback={<TkTicketSkeleton />}>
    <TicketsPage />
  </Suspense>
);

export default Tickets;
