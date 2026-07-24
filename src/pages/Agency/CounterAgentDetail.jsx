import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyCounterAgentDetails from '../../components/agency/AgencyCounterAgentDetails';
import AgencyCounterAgentSkeleton from '../../components/agency/AgencyCounterAgentSkeleton';
import AgencyCounterAgentModal from '../../components/agency/AgencyCounterAgentModal';
import { mockCounterAgents } from '../../data/agencyCounterAgentData';

export default function CounterAgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAgent(mockCounterAgents.find((a) => a.id === id) || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSave = (formData) => {
    setAgent((prev) => prev ? { ...prev, ...formData } : prev);
    setModalOpen(false);
  };

  const handleAction = (action, agentId) => {
    if (action === 'edit') {
      setModalOpen(true);
    }
  };

  if (loading) return <AgencyCounterAgentSkeleton count={4} />;

  if (!agent) {
    return (
      <div className="ac-page">
        <div className="ac-page__empty">
          <i className="bi bi-people" />
          <h2>Agent introuvable</h2>
          <p>L'agent {id} n'existe pas ou a été supprimé.</p>
          <button className="ac-btn ac-btn--primary" onClick={() => navigate('/company/counter-agents')}>
            <i className="bi bi-arrow-left" /> Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-page">
      <div className="ac-page__header">
        <div className="ac-page__title-group">
          <button className="ac-page__back" onClick={() => navigate('/company/counter-agents')}>
            <i className="bi bi-arrow-left" />
          </button>
          <h1 className="ac-page__title"><i className="bi bi-person-badge" /> Détails de l'agent</h1>
        </div>
        <div className="ac-page__header-actions">
          <button className="ac-btn ac-btn--outline" onClick={() => setModalOpen(true)}>
            <i className="bi bi-pencil" /> Modifier
          </button>
        </div>
      </div>
      <AgencyCounterAgentDetails agent={agent} onBack={() => navigate('/company/counter-agents')} onAction={handleAction} />
      <AgencyCounterAgentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} agent={agent} onSave={handleSave} />
    </div>
  );
}
