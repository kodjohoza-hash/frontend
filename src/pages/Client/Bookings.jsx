import { useState, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@components/client/DashboardLayout';
import {
  ReservationStats,
  ReservationSearch,
  ReservationFilters,
  ReservationCard,
  ReservationDetailsDrawer,
  ReservationEmptyState,
  ReservationSkeleton,
} from '@components/reservations';
import { mockReservations, mockReservationStats, mockCompanies } from '@data/reservationsData';
import '@assets/styles/reservations.css';

const BookingsPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const filteredReservations = useMemo(() => {
    let result = mockReservations;

    if (activeFilter !== 'all') {
      result = result.filter((r) => r.status === activeFilter);
    }

    if (selectedCompany) {
      result = result.filter((r) => r.companyId === selectedCompany);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.departureCity.toLowerCase().includes(q) ||
          r.arrivalCity.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeFilter, selectedCompany, search]);

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleCancel = (reservation) => {
    setCancelTarget(reservation);
  };

  const confirmCancel = () => {
    alert(`Réservation ${cancelTarget.id} annulée (mock). En production, cette action appelera l'API backend.`);
    setCancelTarget(null);
  };

  const handleDownload = (reservation) => {
    alert(`Téléchargement du billet ${reservation.id} (mock). En production, un PDF sera généré.`);
  };

  const handleRebook = (reservation) => {
    alert(`Redirection vers la page de réservation pour ${reservation.departureCity} → ${reservation.arrivalCity} (mock).`);
  };

  const handleContact = (reservation) => {
    alert(`Contact avec ${reservation.company} (mock). En production, ouvre un chat ou email.`);
  };

  return (
    <DashboardLayout>
      <Suspense fallback={<ReservationSkeleton />}>
        <div className="rv-page__header">
          <div className="rv-page__title-group">
            <h1 className="rv-page__title">Mes Réservations</h1>
            <p className="rv-page__subtitle">
              Retrouvez toutes vos réservations et suivez leur évolution.
            </p>
          </div>
          <Link to="/" className="rv-page__action">
            <i className="bi bi-plus-circle" />
            Réserver un nouveau voyage
          </Link>
        </div>

        <ReservationStats stats={mockReservationStats} />

        <ReservationSearch value={search} onChange={setSearch} />

        <ReservationFilters
          active={activeFilter}
          onFilterChange={setActiveFilter}
          companies={mockCompanies}
          selectedCompany={selectedCompany}
          onCompanyChange={setSelectedCompany}
        />

        {filteredReservations.length > 0 ? (
          <div className="rv-list">
            {filteredReservations.map((reservation, i) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onViewDetails={handleViewDetails}
                onCancel={handleCancel}
                onDownload={handleDownload}
                onRebook={handleRebook}
                onContact={handleContact}
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>
        ) : (
          <ReservationEmptyState />
        )}
      </Suspense>

      {selectedReservation && (
        <ReservationDetailsDrawer
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onCancel={handleCancel}
          onDownload={handleDownload}
          onContact={handleContact}
        />
      )}

      {cancelTarget && (
        <div className="rv-confirm-overlay" onClick={() => setCancelTarget(null)}>
          <div className="rv-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="rv-confirm__icon">
              <i className="bi bi-exclamation-triangle" />
            </div>
            <h4 className="rv-confirm__title">Annuler la réservation ?</h4>
            <p className="rv-confirm__desc">
              Êtes-vous sûr de vouloir annuler la réservation <strong>{cancelTarget.id}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="rv-confirm__actions">
              <button
                type="button"
                className="rv-card__btn rv-card__btn--outline"
                onClick={() => setCancelTarget(null)}
              >
                Non, garder
              </button>
              <button
                type="button"
                className="rv-card__btn rv-card__btn--danger"
                onClick={confirmCancel}
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BookingsPage;
