import { useState, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import DbSidebar from '@components/client/DbSidebar';
import DbHeader from '@components/client/DbHeader';
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

const TicketsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [previewTicket, setPreviewTicket] = useState(null);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

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
    <div className="db-layout">
      <DbSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`db-layout__main ${sidebarCollapsed ? 'db-layout__main--collapsed' : ''}`}>
        <DbHeader onToggleSidebar={toggleSidebar} />
        <main className="db-layout__content tk-page">
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
        </main>
      </div>

      {previewTicket && (
        <TkTicketPreviewModal
          ticket={previewTicket}
          onClose={() => setPreviewTicket(null)}
        />
      )}
    </div>
  );
};

const Tickets = () => (
  <Suspense fallback={<TkTicketSkeleton />}>
    <TicketsPage />
  </Suspense>
);

export default Tickets;
