import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyDriverDetails from '../../components/agency/AgencyDriverDetails';
import AgencyDriverSkeleton from '../../components/agency/AgencyDriverSkeleton';
import AgencyDriverModal from '../../components/agency/AgencyDriverModal';
import { mockDrivers } from '../../data/agencyDriverData';

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDriver(mockDrivers.find((d) => d.id === id) || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSave = (formData) => {
    setDriver((prev) => prev ? { ...prev, ...formData } : prev);
    setModalOpen(false);
  };

  if (loading) return <AgencyDriverSkeleton rows={4} />;

  if (!driver) {
    return (
      <div className="ad-page">
        <div className="ad-page__empty"><i className="bi bi-person-badge" /><h2>Chauffeur introuvable</h2><p>Le chauffeur {id} n'existe pas ou a été supprimé.</p><button className="ad-btn ad-btn--primary" onClick={() => navigate('/company/drivers')}><i className="bi bi-arrow-left" /> Retour à la liste</button></div>
      </div>
    );
  }

  return (
    <div className="ad-page">
      <div className="ad-page__header">
        <div className="ad-page__title-group">
          <button className="ad-page__back" onClick={() => navigate('/company/drivers')}><i className="bi bi-arrow-left" /></button>
          <h1 className="ad-page__title"><i className="bi bi-person-badge" /> Détails du chauffeur</h1>
        </div>
        <div className="ad-page__actions">
          <button className="ad-btn ad-btn--outline" onClick={() => setModalOpen(true)}><i className="bi bi-pencil" /> Modifier</button>
        </div>
      </div>
      <AgencyDriverDetails driver={driver} />
      <AgencyDriverModal isOpen={modalOpen} onClose={() => setModalOpen(false)} driver={driver} onSave={handleSave} />
    </div>
  );
}
