import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyBusDetails from '../../components/agency/AgencyBusDetails';
import AgencyBusSkeleton from '../../components/agency/AgencyBusSkeleton';
import AgencyBusModal from '../../components/agency/AgencyBusModal';
import { mockBuses } from '../../data/agencyBusData';

export default function BusDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockBuses.find((b) => b.id === id);
      setBus(found || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSave = (formData) => {
    setBus((prev) => prev ? { ...prev, ...formData, amenities: formData.amenities || prev.amenities } : prev);
    setModalOpen(false);
  };

  if (loading) return <AgencyBusSkeleton rows={4} />;

  if (!bus) {
    return (
      <div className="ab-page">
        <div className="ab-page__empty">
          <i className="bi bi-bus-front" />
          <h2>Bus introuvable</h2>
          <p>Le bus {id} n'existe pas ou a été supprimé.</p>
          <button className="ab-btn ab-btn--primary" onClick={() => navigate('/company/buses')}>
            <i className="bi bi-arrow-left" /> Retour à la flotte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ab-page">
      <div className="ab-page__header">
        <div className="ab-page__title-group">
          <button className="ab-page__back" onClick={() => navigate('/company/buses')}>
            <i className="bi bi-arrow-left" />
          </button>
          <h1 className="ab-page__title">
            <i className="bi bi-bus-front-fill" />
            Détails du bus
          </h1>
        </div>
        <div className="ab-page__actions">
          <button className="ab-btn ab-btn--outline" onClick={() => setModalOpen(true)}>
            <i className="bi bi-pencil" /> Modifier
          </button>
        </div>
      </div>

      <AgencyBusDetails bus={bus} />

      <AgencyBusModal isOpen={modalOpen} onClose={() => setModalOpen(false)} bus={bus} onSave={handleSave} />
    </div>
  );
}
