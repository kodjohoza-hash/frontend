import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyBranchDetails from '../../components/agency/AgencyBranchDetails';
import AgencyBranchSkeleton from '../../components/agency/AgencyBranchSkeleton';
import AgencyBranchModal from '../../components/agency/AgencyBranchModal';
import { mockBranches } from '../../data/agencyBranchData';

export default function BranchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBranch(mockBranches.find((b) => b.id === id) || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSave = (formData) => {
    setBranch((prev) => prev ? { ...prev, ...formData } : prev);
    setModalOpen(false);
  };

  const handleAction = (action) => {
    if (action === 'edit') setModalOpen(true);
  };

  if (loading) return <AgencyBranchSkeleton count={4} />;

  if (!branch) {
    return (
      <div className="abr-page">
        <div className="abr-page__empty">
          <i className="bi bi-building" /><h2>Agence introuvable</h2><p>Le point de vente {id} n'existe pas ou a été supprimé.</p>
          <button className="abr-btn abr-btn--primary" onClick={() => navigate('/company/branches')}><i className="bi bi-arrow-left" /> Retour à la liste</button>
        </div>
      </div>
    );
  }

  return (
    <div className="abr-page">
      <div className="abr-page__header">
        <div className="abr-page__title-group">
          <button className="abr-page__back" onClick={() => navigate('/company/branches')}><i className="bi bi-arrow-left" /></button>
          <h1 className="abr-page__title"><i className="bi bi-building" /> Détails du point de vente</h1>
        </div>
        <div className="abr-page__header-actions">
          <button className="abr-btn abr-btn--outline" onClick={() => setModalOpen(true)}><i className="bi bi-pencil" /> Modifier</button>
        </div>
      </div>
      <AgencyBranchDetails branch={branch} onBack={() => navigate('/company/branches')} onAction={handleAction} />
      <AgencyBranchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} branch={branch} onSave={handleSave} />
    </div>
  );
}
