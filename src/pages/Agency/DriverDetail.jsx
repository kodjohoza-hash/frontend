import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyDriverDetails from '../../components/agency/AgencyDriverDetails';
import AgencyDriverSkeleton from '../../components/agency/AgencyDriverSkeleton';
import AgencyDriverModal from '../../components/agency/AgencyDriverModal';
import useDriverStore from '../../store/driver.store';

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { driver, loadingDetail, fetchDriver, updateDriver } = useDriverStore();
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchDriver(id)
      .then(() => setNotFound(false))
      .catch(() => setNotFound(true));
  }, [id, fetchDriver]);

  const handleSave = async (formData) => {
    try {
      await updateDriver(driver.id, formData);
      setModalOpen(false);
    } catch (err) {
      window.alert(err.message || 'Impossible de modifier ce chauffeur.');
    }
  };

  if (notFound) {
    return (
      <div className="ad-page">
        <div className="ad-page__empty"><i className="bi bi-person-badge" /><h2>Chauffeur introuvable</h2><p>Le chauffeur {id} n'existe pas ou a été supprimé.</p><button className="ad-btn ad-btn--primary" onClick={() => navigate('/agency/drivers')}><i className="bi bi-arrow-left" /> Retour à la liste</button></div>
      </div>
    );
  }

  if (loadingDetail || !driver) return <AgencyDriverSkeleton rows={4} />;

  return (
    <div className="ad-page">
      <div className="ad-page__header">
        <div className="ad-page__title-group">
          <button className="ad-page__back" onClick={() => navigate('/agency/drivers')}><i className="bi bi-arrow-left" /></button>
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
