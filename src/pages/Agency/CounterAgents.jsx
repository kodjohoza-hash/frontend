import { useState, useMemo } from 'react';
import AgencyCounterAgentStats from '../../components/agency/AgencyCounterAgentStats';
import AgencyCounterAgentFilters from '../../components/agency/AgencyCounterAgentFilters';
import AgencyCounterAgentTable from '../../components/agency/AgencyCounterAgentTable';
import AgencyCounterAgentCard from '../../components/agency/AgencyCounterAgentCard';
import AgencyCounterAgentModal from '../../components/agency/AgencyCounterAgentModal';
import AgencyCounterAgentSkeleton from '../../components/agency/AgencyCounterAgentSkeleton';
import { mockCounterAgents } from '../../data/agencyCounterAgentData';

export default function CounterAgents() {
  const [agents, setAgents] = useState(mockCounterAgents);
  const [filters, setFilters] = useState({ search: '', agency: '', pointDeVente: '', status: '', role: '' });
  const [sort, setSort] = useState({ key: 'lastName', dir: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 10;

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

  const handleAction = (action, agentId) => {
    const agent = agents.find((a) => a.id === agentId);
    if (action === 'view') {
      window.location.href = `/company/counter-agents/${agentId}`;
    } else if (action === 'edit') {
      setEditingAgent(agent);
      setModalOpen(true);
    } else if (action === 'delete' && agent) {
      if (window.confirm(`Supprimer l'agent ${agent.firstName} ${agent.lastName} ?`)) {
        setAgents((prev) => prev.filter((a) => a.id !== agentId));
      }
    } else if (action === 'suspend' && agent) {
      setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, status: 'suspendu' } : a));
    } else if (action === 'reset_password') {
      alert(`Mot de passe réinitialisé pour ${agent?.firstName}. Un email de réinitialisation a été envoyé.`);
    } else {
      alert(`Action "${action}" sur ${agent?.firstName} ${agent?.lastName}`);
    }
  };

  const handleSave = (formData) => {
    if (editingAgent) {
      setAgents((prev) => prev.map((a) => a.id === editingAgent.id ? { ...a, ...formData } : a));
    } else {
      const newAgent = {
        id: `AGT-${String(agents.length + 1).padStart(3, '0')}`,
        ...formData,
        photoUrl: null,
        lastLogin: null,
        stats: { totalSales: 0, totalRevenue: 0, ticketsPrinted: 0, bookingsCreated: 0, cancellations: 0, avgDailySales: 0 },
        history: [],
      };
      setAgents((prev) => [newAgent, ...prev]);
    }
    setModalOpen(false);
    setEditingAgent(null);
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

      <AgencyCounterAgentStats />

      <AgencyCounterAgentFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} onReset={handleReset} />

      <div className="ac-page__content">
        {viewMode === 'table' ? (
          <>
            <AgencyCounterAgentTable agents={paginatedAgents} sort={sort} onSort={handleSort} onAction={handleAction} />
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
              <AgencyCounterAgentCard key={agent.id} agent={agent} onAction={handleAction} />
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

      <AgencyCounterAgentModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingAgent(null); }} agent={editingAgent} onSave={handleSave} />
    </div>
  );
}
