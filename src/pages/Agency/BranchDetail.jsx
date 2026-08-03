import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyBranchDetails from '../../components/agency/AgencyBranchDetails';
import AgencyBranchSkeleton from '../../components/agency/AgencyBranchSkeleton';
import AgencyBranchModal from '../../components/agency/AgencyBranchModal';
import useAgencyStore from '../../store/agency.store';
import agencyService, { UI_TO_STATUS } from '../../services/agency.service';

export default function BranchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const villes = useAgencyStore((s) => s.villes);
  const fetchVilles = useAgencyStore((s) => s.fetchVilles);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadBranch = useCallback(async (branchId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await agencyService.getById(branchId);
      setBranch(data);
    } catch (err) {
      setError(err.message || 'Impossible de charger le point de vente.');
      setBranch(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranch(id);
  }, [id, loadBranch]);

  useEffect(() => {
    if (villes.length === 0) fetchVilles();
  }, [villes.length, fetchVilles]);

  const handleSave = async (formData) => {
    const ville = villes.find((v) => v.nom === formData.city);
    if (!ville) {
      window.alert(`La ville "${formData.city}" n'existe pas dans la base. Sélectionnez une ville de la liste.`);
      return;
    }
    const payload = {
      nom: formData.name,
      villeId: ville.id,
      region: formData.region,
      adresse: formData.fullAddress,
      quartier: formData.quartier,
      telephone: formData.phone,
      email: formData.email,
      description: formData.description,
      statut: UI_TO_STATUS[formData.status] || 'actif',
      type: formData.type,
      latitude: formData.lat ? parseFloat(formData.lat) : null,
      longitude: formData.lng ? parseFloat(formData.lng) : null,
      heureOuverture: formData.openTime,
      heureFermeture: formData.closeTime,
      joursOuverture: formData.openDays,
      services: formData.services,
    };
    try {
      setBusy(true);
      await agencyService.update(id, payload);
      setModalOpen(false);
      await loadBranch(id);
    } catch (err) {
      window.alert(err.message || 'Impossible de modifier ce point de vente.');
    } finally {
      setBusy(false);
    }
  };

  const handleAction = (action) => {
    if (action === 'edit') setModalOpen(true);
  };

  if (loading) return <AgencyBranchSkeleton count={4} />;

  if (!branch || error) {
    return (
      <div className="abr-page">
        <div className="abr-page__empty">
          <i className="bi bi-building" /><h2>Agence introuvable</h2><p>{error || `Le point de vente ${id} n'existe pas ou a été supprimé.`}</p>
          <button className="abr-btn abr-btn--primary" onClick={() => navigate('/agency/branches')}><i className="bi bi-arrow-left" /> Retour à la liste</button>
        </div>
      </div>
    );
  }

  return (
    <div className="abr-page">
      <div className="abr-page__header">
        <div className="abr-page__title-group">
          <button className="abr-page__back" onClick={() => navigate('/agency/branches')}><i className="bi bi-arrow-left" /></button>
          <h1 className="abr-page__title"><i className="bi bi-building" /> Détails du point de vente</h1>
        </div>
        <div className="abr-page__header-actions">
          <button className="abr-btn abr-btn--outline" disabled={busy} onClick={() => setModalOpen(true)}><i className="bi bi-pencil" /> Modifier</button>
        </div>
      </div>
      <AgencyBranchDetails branch={branch} onBack={() => navigate('/agency/branches')} onAction={handleAction} />
      <AgencyBranchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} branch={branch} onSave={handleSave} villes={villes} />
    </div>
  );
}
