import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AgencyCounterAgentStats from '../../components/agency/AgencyCounterAgentStats';
import AgencyCounterAgentFilters from '../../components/agency/AgencyCounterAgentFilters';
import AgencyCounterAgentTable from '../../components/agency/AgencyCounterAgentTable';
import AgencyCounterAgentCard from '../../components/agency/AgencyCounterAgentCard';
import AgencyCounterAgentModal from '../../components/agency/AgencyCounterAgentModal';
import AgencyCounterAgentSkeleton from '../../components/agency/AgencyCounterAgentSkeleton';
import usersService, { generateTempPassword } from '../../services/users.service';
import agencyService from '../../services/agency.service';
import counterService from '../../services/counter.service';
import { mapCounterAgent, buildUpdatePayload } from '../../utils/counterAgents';

export default function CounterAgents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [pdvOptions, setPdvOptions] = useState([]);
  const [filters, setFilters] = useState({ search: '', agency: '', pointDeVente: '', status: '', role: '' });
  const [sort, setSort] = useState({ key: 'lastName', dir: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const perPage = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [users, branches, guichets] = await Promise.all([
        usersService.getAll(),
        agencyService.getAll(),
        counterService.getAll(),
      ]);
      setAgencyOptions(branches);
      setPdvOptions(guichets);
      setAgents(users.filter((u) => u.role !== 'client').map((u) => mapCounterAgent(u, branches, guichets)));
    } catch (err) {
      setError(err.message || 'Impossible de charger les agents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const count = (s) => agents.filter((a) => a.status === s).length;
    return {
      total: agents.length,
      actif: count('actif'),
      hors_ligne: count('hors_ligne'),
      en_service: count('en_service'),
      conge: count('conge'),
      guichetsOuverts: pdvOptions.filter((p) => p.status === 'ouvert').length,
      guichetsFermes: pdvOptions.length - pdvOptions.filter((p) => p.status === 'ouvert').length,
    };
  }, [agents, pdvOptions]);

  const filteredAgents = useMemo(() => {
    let result = [...agents];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((a) => `${a.firstName} ${a.lastName} ${a.phone} ${a.email}`.toLowerCase().includes(q));
    }
    if (filters.agency) result = result.filter((a) => a.agency === filters.agency);
    if (filters.pointDeVente) result = result.filter((a) => a.pointDeVente === filters.pointDeVente);
    if (filters.status) result = result.filter((a) => a.status === filters.status);
    if (filters.role) result = result.filter((a) => a.role === filters.role);
    result.sort((a, b) => {
      const valA = a[sort.key] || a.id;
      const valB = b[sort.key] || b.id;
      if (typeof valA === 'string') return sort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sort.dir === 'asc' ? valA - valB : valB - valA;
    });
    return result;
  }, [agents, filters, sort]);

  const paginatedAgents = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredAgents.slice(start, start + perPage);
  }, [filteredAgents, page]);

  const totalPages = Math.ceil(filteredAgents.length / perPage);

  const handleReset = () => { setFilters({ search: '', agency: '', pointDeVente: '', status: '', role: '' }); setPage(1); };
  const handleSort = (key) => { setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' })); };

  const runAction = async (fn) => {
    setSaving(true);
    try {
      await fn();
      await loadData();
    } catch (err) {
      alert(err.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  const handleAction = (action, agentId) => {
    const agent = agents.find((a) => a.id === agentId);
    if (action === 'view') {
      navigate(`/agency/counter-agents/${agentId}`);
    } else if (action === 'edit') {
      setEditingAgent(agent);
      setModalOpen(true);
    } else if (action === 'reassign' || action === 'change_role') {
      setEditingAgent(agent);
      setModalOpen(true);
    } else if (action === 'delete' && agent) {
      if (window.confirm(`Supprimer l'agent ${agent.firstName} ${agent.lastName} ?`)) {
        runAction(() => usersService.remove(agentId));
      }
    } else if (action === 'suspend' && agent) {
      if (window.confirm(`Suspendre l'agent ${agent.firstName} ${agent.lastName} ?`)) {
        runAction(() => usersService.updateStatus(agentId, 'suspendu', 'Suspendu depuis la gestion des agents de guichet'));
      }
    } else if (action === 'reset_password' && agent) {
      runAction(async () => {
        const temp = generateTempPassword();
        await usersService.update(agentId, { motDePasse: temp });
        alert(`Mot de passe réinitialisé pour ${agent.firstName} ${agent.lastName}. Nouveau mot de passe temporaire : ${temp}`);
      });
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingAgent) {
        await usersService.update(editingAgent.id, buildUpdatePayload(formData));
        const oldGuichet = editingAgent.pointDeVente;
        if (oldGuichet && oldGuichet !== formData.pointDeVente) {
          await counterService.removeAgents(oldGuichet, [editingAgent.id]);
        }
        if (formData.pointDeVente && formData.pointDeVente !== oldGuichet) {
          await counterService.assignAgents(formData.pointDeVente, [editingAgent.id]);
        }
      } else {
        const created = await usersService.create({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role === 'manager' ? 'company_admin' : 'counter_agent',
          gender: formData.gender,
          dob: formData.dateOfBirth || null,
          address: formData.address,
          agenceId: formData.agency,
          password: formData.tempPassword || generateTempPassword(),
        });
        if (formData.pointDeVente) {
          await counterService.assignAgents(formData.pointDeVente, [created.id]);
        }
      }
      await loadData();
      setModalOpen(false);
      setEditingAgent(null);
    } catch (err) {
      alert(err.message || 'Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AgencyCounterAgentSkeleton count={6} />;

  return (
    <div className="ac-page">
      <div className="ac-page__header">
        <div className="ac-page__title-group">
          <h1 className="ac-page__title"><i className="bi bi-people" /> Agents de guichet</h1>
          <p className="ac-page__subtitle">{filteredAgents.length} agent{filteredAgents.length > 1 ? 's' : ''} trouvé{filteredAgents.length > 1 ? 's' : ''}</p>
        </div>
        <div className="ac-page__header-actions">
          <div className="ac-page__view-toggle">
            <button className={`ac-page__view-btn ${viewMode === 'table' ? 'ac-page__view-btn--active' : ''}`} onClick={() => setViewMode('table')}>
              <i className="bi bi-list-ul" />
            </button>
            <button className={`ac-page__view-btn ${viewMode === 'cards' ? 'ac-page__view-btn--active' : ''}`} onClick={() => setViewMode('cards')}>
              <i className="bi bi-grid-3x3-gap" />
            </button>
          </div>
          <button className="ac-btn ac-btn--primary ac-btn--lg" onClick={() => { setEditingAgent(null); setModalOpen(true); }}>
            <i className="bi bi-plus-lg" /><span>Ajouter un agent</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="ac-page__error">
          <i className="bi bi-exclamation-triangle" />
          <span>{error}</span>
          <button className="ac-btn ac-btn--outline" onClick={loadData}><i className="bi bi-arrow-clockwise" /> Réessayer</button>
        </div>
      )}

      <AgencyCounterAgentStats stats={stats} />

      <AgencyCounterAgentFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setPage(1); }}
        onReset={handleReset}
        agencies={agencyOptions}
        pointsDeVente={pdvOptions}
      />

      <div className="ac-page__content">
        {viewMode === 'table' ? (
          <>
            <AgencyCounterAgentTable
              agents={paginatedAgents}
              sort={sort}
              onSort={handleSort}
              onAction={handleAction}
              agencies={agencyOptions}
              pointsDeVente={pdvOptions}
            />
            {paginatedAgents.length === 0 && (
              <div className="ac-page__empty">
                <i className="bi bi-people" />
                <h3>Aucun agent trouvé</h3>
                <p>Modifiez vos filtres ou ajoutez un nouvel agent.</p>
              </div>
            )}
          </>
        ) : (
          <div className="ac-page__cards">
            {paginatedAgents.map((agent) => (
              <AgencyCounterAgentCard key={agent.id} agent={agent} onAction={handleAction} agencies={agencyOptions} pointsDeVente={pdvOptions} />
            ))}
            {paginatedAgents.length === 0 && (
              <div className="ac-page__empty">
                <i className="bi bi-people" />
                <h3>Aucun agent trouvé</h3>
                <p>Modifiez vos filtres ou ajoutez un nouvel agent.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="ac-pagination">
          <button className="ac-pagination__btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <i className="bi bi-chevron-left" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`ac-pagination__btn ${p === page ? 'ac-pagination__btn--active' : ''}`} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
          <button className="ac-pagination__btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <i className="bi bi-chevron-right" />
          </button>
          <span className="ac-pagination__info">Page {page} sur {totalPages}</span>
        </div>
      )}

      <AgencyCounterAgentModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingAgent(null); }}
        agent={editingAgent}
        onSave={handleSave}
        saving={saving}
        agencies={agencyOptions}
        pointsDeVente={pdvOptions}
      />
    </div>
  );
}
