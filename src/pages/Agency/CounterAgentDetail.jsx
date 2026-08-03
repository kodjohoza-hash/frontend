import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyCounterAgentDetails from '../../components/agency/AgencyCounterAgentDetails';
import AgencyCounterAgentSkeleton from '../../components/agency/AgencyCounterAgentSkeleton';
import AgencyCounterAgentModal from '../../components/agency/AgencyCounterAgentModal';
import usersService from '../../services/users.service';
import agencyService from '../../services/agency.service';
import counterService from '../../services/counter.service';
import { mapCounterAgent, buildUpdatePayload } from '../../utils/counterAgents';

export default function CounterAgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [pdvOptions, setPdvOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [user, branches, guichets] = await Promise.all([
        usersService.getById(id),
        agencyService.getAll(),
        counterService.getAll(),
      ]);
      setAgencyOptions(branches);
      setPdvOptions(guichets);
      setAgent(mapCounterAgent(user, branches, guichets));
    } catch (err) {
      setError(err.message || 'Agent introuvable.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      await usersService.update(id, buildUpdatePayload(formData));
      const oldGuichet = agent.pointDeVente;
      if (oldGuichet && oldGuichet !== formData.pointDeVente) {
        await counterService.removeAgents(oldGuichet, [id]);
      }
      if (formData.pointDeVente && formData.pointDeVente !== oldGuichet) {
        await counterService.assignAgents(formData.pointDeVente, [id]);
      }
      await loadData();
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const handleAction = (action) => {
    if (action === 'edit') setModalOpen(true);
  };

  if (loading) return <AgencyCounterAgentSkeleton count={4} />;

  if (error || !agent) {
    return (
      <div className="ac-page">
        <div className="ac-page__empty">
          <i className="bi bi-people" />
          <h2>Agent introuvable</h2>
          <p>{error || `L'agent ${id} n'existe pas ou a été supprimé.`}</p>
          <button className="ac-btn ac-btn--primary" onClick={() => navigate('/agency/counter-agents')}>
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
          <button className="ac-page__back" onClick={() => navigate('/agency/counter-agents')}>
            <i className="bi bi-arrow-left" />
          </button>
          <h1 className="ac-page__title"><i className="bi bi-person-badge" /> Détails de l'agent</h1>
        </div>
        <div className="ac-page__header-actions">
          <button className="ac-btn ac-btn--outline" onClick={() => setModalOpen(true)} disabled={saving}>
            <i className="bi bi-pencil" /> Modifier
          </button>
        </div>
      </div>
      <AgencyCounterAgentDetails
        agent={agent}
        onBack={() => navigate('/agency/counter-agents')}
        onAction={handleAction}
        agencies={agencyOptions}
        pointsDeVente={pdvOptions}
      />
      <AgencyCounterAgentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        agent={agent}
        onSave={handleSave}
        saving={saving}
        agencies={agencyOptions}
        pointsDeVente={pdvOptions}
      />
    </div>
  );
}
