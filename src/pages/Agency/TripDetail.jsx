import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyTripDetails from '../../components/agency/AgencyTripDetails';
import AgencyTripSkeleton from '../../components/agency/AgencyTripSkeleton';
import { mockTrips } from '../../data/agencyTripsData';
import AgencyTripModal from '../../components/agency/AgencyTripModal';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockTrips.find((t) => t.id === id);
      setTrip(found || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSave = (formData) => {
    setTrip((prev) => prev ? { ...prev, ...formData } : prev);
    setModalOpen(false);
  };

  if (loading) return <AgencyTripSkeleton rows={4} />;

  if (!trip) {
    return (
      <div className="at-page">
        <div className="at-page__empty">
          <i className="bi bi-signpost-2" />
          <h2>Voyage introuvable</h2>
          <p>Le voyage {id} n'existe pas ou a été supprimé.</p>
          <button className="at-btn at-btn--primary" onClick={() => navigate('/company/trips')}>
            <i className="bi bi-arrow-left" /> Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="at-page">
      <div className="at-page__header">
        <div className="at-page__title-group">
          <button className="at-page__back" onClick={() => navigate('/company/trips')}>
            <i className="bi bi-arrow-left" />
          </button>
          <h1 className="at-page__title">
            <i className="bi bi-signpost-2" />
            Détails du voyage
          </h1>
        </div>
        <div className="at-page__actions">
          <button className="at-btn at-btn--outline" onClick={() => setModalOpen(true)}>
            <i className="bi bi-pencil" /> Modifier
          </button>
        </div>
      </div>

      <AgencyTripDetails trip={trip} />

      <AgencyTripModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        trip={trip}
        onSave={handleSave}
      />
    </div>
  );
}
