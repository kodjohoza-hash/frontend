import { useState, useMemo, useEffect } from 'react';
import AgencyBranchStatus from '../../components/agency/AgencyBranchStatus';
import useCounterStore from '../../store/counter.store';
import useAgencyStore from '../../store/agency.store';
import usersService from '../../services/users.service';

const counterTypes = [
  { value: 'vente_billets', label: 'Vente de billets', icon: 'bi-ticket-perforated' },
  { value: 'reservation', label: 'Réservation', icon: 'bi-bookmark-plus' },
  { value: 'caisse', label: 'Caisse', icon: 'bi-cash-stack' },
  { value: 'renseignement', label: 'Renseignement', icon: 'bi-info-circle' },
  { value: 'autre', label: 'Autre', icon: 'bi-three-dots' },
];

const counterStatuses = [
  { value: 'ouvert', label: 'Ouvert' },
  { value: 'ferme', label: 'Fermé' },
  { value: 'maintenance', label: 'Maintenance' },
];

function formatMoney(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M XAF';
  return (n || 0).toLocaleString('fr-FR') + ' XAF';
}

function getInitials(name) {
  return String(name || '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function typeLabel(type) {
  return counterTypes.find((t) => t.value === type)?.label || type;
}

function typeIcon(type) {
  return counterTypes.find((t) => t.value === type)?.icon || 'bi-shop';
}

export default function Guichets() {
  const { counters, stats, loading, error, fetchCounters, fetchStats, refresh, createCounter, updateCounter, updateStatus, removeCounter, assignAgents, unassignAgents } = useCounterStore();
  const branches = useAgencyStore((s) => s.branches);
  const fetchBranches = useAgencyStore((s) => s.fetchBranches);

  const [filters, setFilters] = useState({ search: '', agence: '', statut: '', type: '' });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const perPage = 10;

  useEffect(() => {
    fetchCounters();
    fetchStats();
    if (branches.length === 0) fetchBranches();
  }, [fetchCounters, fetchStats, fetchBranches, branches.length]);

  const filtered = useMemo(() => {
    let result = [...counters];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) => `${c.name} ${c.code} ${c.agenceName} ${c.city}`.toLowerCase().includes(q));
    }
    if (filters.agence) result = result.filter((c) => c.agenceId === filters.agence);
    if (filters.statut) result = result.filter((c) => c.status === filters.statut);
    if (filters.type) result = result.filter((c) => c.type === filters.type);
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return result;
  }, [counters, filters]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const handleReset = () => { setFilters({ search: '', agence: '', statut: '', type: '' }); setPage(1); };

  const openDetail = async (id) => {
    const counter = counters.find((c) => c.id === id);
    setDetail(counter || null);
  };

  const handleAction = async (action, id) => {
    const counter = counters.find((c) => c.id === id);
    if (action === 'view') { openDetail(id); return; }
    if (action === 'edit') { setEditing(counter); setFormOpen(true); return; }
    if (action === 'assign') { setDetail(counter); setAssignOpen(true); return; }
    if (action === 'open') { try { setBusy(true); await updateStatus(counter, 'ouvert'); } catch (err) { window.alert(err.message || 'Erreur'); } finally { setBusy(false); } return; }
    if (action === 'close') { try { setBusy(true); await updateStatus(counter, 'ferme'); } catch (err) { window.alert(err.message || 'Erreur'); } finally { setBusy(false); } return; }
    if (action === 'maintenance') { try { setBusy(true); await updateStatus(counter, 'maintenance'); } catch (err) { window.alert(err.message || 'Erreur'); } finally { setBusy(false); } return; }
    if (action === 'delete') {
      if (window.confirm(`Supprimer le guichet ${counter?.name || counter?.code} ?`)) {
        try { setBusy(true); await removeCounter(counter); } catch (err) { window.alert(err.message || 'Impossible de supprimer ce guichet.'); } finally { setBusy(false); }
      }
      return;
    }
    alert(`Action "${action}" sur ${counter?.name}`);
  };

  const handleSave = async (formData) => {
    try {
      setBusy(true);
      if (editing) {
        await updateCounter(editing.id, formData);
      } else {
        await createCounter(formData);
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      window.alert(err.message || 'Impossible d\'enregistrer ce guichet.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="abr-page">
      <div className="abr-page__header">
        <div className="abr-page__title-group">
          <h1 className="abr-page__title"><i className="bi bi-shop-window" /> Guichets</h1>
          <p className="abr-page__subtitle">{filtered.length} guichet{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <div className="abr-page__header-actions">
          <div className="abr-page__view-toggle">
            <button className={`abr-page__view-btn ${viewMode === 'table' ? 'abr-page__view-btn--active' : ''}`} onClick={() => setViewMode('table')}><i className="bi bi-list-ul" /></button>
            <button className={`abr-page__view-btn ${viewMode === 'cards' ? 'abr-page__view-btn--active' : ''}`} onClick={() => setViewMode('cards')}><i className="bi bi-grid-3x3-gap" /></button>
          </div>
          <button className="abr-btn abr-btn--primary abr-btn--lg" disabled={busy} onClick={() => { setEditing(null); setFormOpen(true); }}>
            <i className="bi bi-plus-lg" /><span>Ajouter un guichet</span>
          </button>
        </div>
      </div>

      <GuichetStats stats={stats} />
      <GuichetFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} onReset={handleReset} branches={branches} />

      {error && (
        <div className="abr-page__error">
          <i className="bi bi-exclamation-triangle" /> {error}
          <button className="abr-btn abr-btn--outline" onClick={() => refresh()}>Réessayer</button>
        </div>
      )}

      <div className="abr-page__content">
        {viewMode === 'table' ? (
          <>
            <GuichetTable counters={paginated} onAction={handleAction} />
            {paginated.length === 0 && (
              <div className="abr-page__empty"><i className="bi bi-shop-window" /><h3>Aucun guichet trouvé</h3><p>Modifiez vos filtres ou ajoutez un nouveau guichet.</p></div>
            )}
          </>
        ) : (
          <div className="abr-page__cards">
            {paginated.map((c) => <GuichetCard key={c.id} counter={c} onAction={handleAction} />)}
            {paginated.length === 0 && (
              <div className="abr-page__empty"><i className="bi bi-shop-window" /><h3>Aucun guichet trouvé</h3><p>Modifiez vos filtres ou ajoutez un nouveau guichet.</p></div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="abr-pagination">
          <button className="abr-pagination__btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><i className="bi bi-chevron-left" /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`abr-pagination__btn ${p === page ? 'abr-pagination__btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="abr-pagination__btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><i className="bi bi-chevron-right" /></button>
          <span className="abr-pagination__info">Page {page} sur {totalPages}</span>
        </div>
      )}

      <GuichetFormModal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} counter={editing} branches={branches} onSave={handleSave} />
      {detail && <GuichetDetailModal counter={detail} onClose={() => setDetail(null)} onAssign={() => setAssignOpen(true)} onUnassign={async (agentId) => {
        try { await unassignAgents(detail, [agentId]); setDetail((d) => d ? { ...d, agents: (d.agents || []).filter((a) => a.id !== agentId) } : d); } catch (err) { window.alert(err.message || 'Erreur'); }
      }} />}
      {assignOpen && detail && <GuichetAssignModal counter={detail} onClose={() => setAssignOpen(false)} onSave={async (added, removed) => {
        try {
          if (added.length) await assignAgents(detail, added);
          if (removed.length) await unassignAgents(detail, removed);
          setAssignOpen(false);
        } catch (err) {
          window.alert(err.message || 'Erreur lors de l\'affectation.');
        }
      }} />}
    </div>
  );
}

/* ── Stats ──────────────────────────────────────────────────────── */
function GuichetStats({ stats }) {
  const cards = stats.length
    ? stats
    : [
        { id: 'total', label: 'Total guichets', value: 0, icon: 'bi-shop-window', color: '#0B1D51' },
        { id: 'ouvert', label: 'Guichets ouverts', value: 0, icon: 'bi-shop', color: '#10b981' },
        { id: 'ferme', label: 'Guichets fermés', value: 0, icon: 'bi-lock', color: '#6b7280' },
        { id: 'maintenance', label: 'En maintenance', value: 0, icon: 'bi-wrench', color: '#f59e0b' },
        { id: 'agents', label: 'Agents (total)', value: 0, icon: 'bi-people', color: '#3b82f6' },
        { id: 'todayRevenue', label: 'CA du jour', value: 0, icon: 'bi-cash-stack', color: '#FF6B35' },
      ];

  return (
    <div className="abr-stats-grid">
      {cards.map((card) => (
        <div key={card.id} className="abr-stats-card" style={{ '--card-gradient': `linear-gradient(135deg, ${card.color} 0%, ${card.color} 100%)` }}>
          <div className="abr-stats-card__icon"><i className={`bi ${card.icon}`} /></div>
          <div className="abr-stats-card__content">
            <span className="abr-stats-card__value">
              {card.id === 'todayRevenue' || card.id === 'weekRevenue' ? formatMoney(card.value) : (card.value || 0).toLocaleString('fr-FR')}
            </span>
            <span className="abr-stats-card__label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Filtres ────────────────────────────────────────────────────── */
function GuichetFilters({ filters, onChange, onReset, branches }) {
  return (
    <div className="abr-filters">
      <div className="abr-filters__row">
        <div className="abr-filters__field abr-filters__field--search">
          <i className="bi bi-search abr-filters__search-icon" />
          <input
            type="text"
            className="abr-filters__input"
            placeholder="Nom, code, agence, ville…"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="abr-filters__field">
          <label className="abr-filters__label">Agence</label>
          <select className="abr-filters__select" value={filters.agence || ''} onChange={(e) => onChange({ ...filters, agence: e.target.value })}>
            <option value="">Toutes</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="abr-filters__field">
          <label className="abr-filters__label">Statut</label>
          <select className="abr-filters__select" value={filters.statut || ''} onChange={(e) => onChange({ ...filters, statut: e.target.value })}>
            <option value="">Tous</option>
            {counterStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="abr-filters__field">
          <label className="abr-filters__label">Type</label>
          <select className="abr-filters__select" value={filters.type || ''} onChange={(e) => onChange({ ...filters, type: e.target.value })}>
            <option value="">Tous</option>
            {counterTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <button className="abr-filters__reset" onClick={onReset}>
          <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
        </button>
      </div>
    </div>
  );
}

/* ── Table ──────────────────────────────────────────────────────── */
function GuichetTable({ counters, onAction }) {
  return (
    <div className="abr-table-wrapper">
      <table className="abr-table">
        <thead>
          <tr>
            <th><span>Guichet</span></th>
            <th><span>Agence</span></th>
            <th><span>Ville</span></th>
            <th><span>Type</span></th>
            <th><span>Agents</span></th>
            <th><span>CA du jour</span></th>
            <th><span>Statut</span></th>
            <th><span></span></th>
          </tr>
        </thead>
        <tbody>
          {counters.map((c) => (
            <tr key={c.id}>
              <td>
                <div className="abr-table__branch">
                  <div className="abr-table__avatar">{getInitials(c.name)}</div>
                  <div className="abr-table__branch-info">
                    <span className="abr-table__branch-name">{c.name}</span>
                    <span className="abr-table__branch-code">{c.code}</span>
                  </div>
                </div>
              </td>
              <td>{c.agenceName || '—'}</td>
              <td>{c.city || '—'}</td>
              <td><span className="abr-table__text"><i className={`bi ${typeIcon(c.type)}`} /> {typeLabel(c.type)}</span></td>
              <td><span className="abr-table__badge">{c.stats.agents}</span></td>
              <td><span className="abr-table__text">{formatMoney(c.stats.todayRevenue)}</span></td>
              <td><AgencyBranchStatus status={c.status} /></td>
              <td>
                <div className="abr-table__actions">
                  <button className="abr-table__action-btn abr-table__action-btn--view" title="Voir" onClick={() => onAction('view', c.id)}><i className="bi bi-eye" /></button>
                  <button className="abr-table__action-btn abr-table__action-btn--edit" title="Modifier" onClick={() => onAction('edit', c.id)}><i className="bi bi-pencil" /></button>
                  <div className="abr-table__dropdown">
                    <button className="abr-table__action-btn abr-table__action-btn--more"><i className="bi bi-three-dots-vertical" /></button>
                    <div className="abr-table__dropdown-menu">
                      <button onClick={() => onAction('view', c.id)}><i className="bi bi-eye" /> Voir</button>
                      <button onClick={() => onAction('assign', c.id)}><i className="bi bi-people" /> Affecter des agents</button>
                      <button onClick={() => onAction('open', c.id)}><i className="bi bi-play-circle" /> Ouvrir</button>
                      <button onClick={() => onAction('close', c.id)}><i className="bi bi-pause-circle" /> Fermer</button>
                      <button onClick={() => onAction('maintenance', c.id)}><i className="bi bi-wrench" /> Maintenance</button>
                      <button className="abr-table__dropdown-item--danger" onClick={() => onAction('delete', c.id)}><i className="bi bi-trash" /> Supprimer</button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Cartes ─────────────────────────────────────────────────────── */
function GuichetCard({ counter: c, onAction }) {
  return (
    <div className="abr-card">
      <div className="abr-card__header">
        <div className="abr-card__avatar">{getInitials(c.name)}</div>
        <div className="abr-card__identity">
          <h4 className="abr-card__name">{c.name}</h4>
          <span className="abr-card__code">{c.code} · {typeLabel(c.type)}</span>
        </div>
        <AgencyBranchStatus status={c.status} />
      </div>
      <div className="abr-card__body">
        <div className="abr-card__row"><i className="bi bi-building" /><span>{c.agenceName || '—'}</span></div>
        <div className="abr-card__row"><i className="bi bi-geo-alt" /><span>{c.city || '—'}</span></div>
        <div className="abr-card__row"><i className="bi bi-people" /><span>{c.stats.agents} agent{c.stats.agents > 1 ? 's' : ''}</span></div>
        <div className="abr-card__row"><i className="bi bi-ticket-perforated" /><span>{c.stats.todayBookings} réservation{c.stats.todayBookings > 1 ? 's' : ''} aujourd&apos;hui</span></div>
        <div className="abr-card__row"><i className="bi bi-cash-stack" /><span>{formatMoney(c.stats.todayRevenue)}</span></div>
      </div>
      <div className="abr-card__footer">
        <button className="abr-card__btn abr-card__btn--view" onClick={() => onAction('view', c.id)}><i className="bi bi-eye" /> Voir</button>
        <button className="abr-card__btn abr-card__btn--edit" onClick={() => onAction('edit', c.id)}><i className="bi bi-pencil" /> Modifier</button>
        <button className="abr-card__btn abr-card__btn--map" onClick={() => onAction('assign', c.id)}><i className="bi bi-people" /></button>
      </div>
    </div>
  );
}

/* ── Modal formulaire ───────────────────────────────────────────── */
function GuichetFormModal({ isOpen, onClose, counter, branches, onSave }) {
  const [form, setForm] = useState({ agenceId: '', code: '', nom: '', type: 'vente_billets', statut: 'ouvert', description: '' });

  useEffect(() => {
    if (isOpen) {
      setForm(counter
        ? { agenceId: counter.agenceId || '', code: counter.code || '', nom: counter.name || '', type: counter.type, statut: counter.status, description: counter.description || '' }
        : { agenceId: branches[0]?.id || '', code: '', nom: '', type: 'vente_billets', statut: 'ouvert', description: '' });
    }
  }, [isOpen, counter, branches]);

  if (!isOpen) return null;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="abr-modal-overlay" onClick={onClose}>
      <div className="abr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="abr-modal__header">
          <h3>{counter ? 'Modifier le guichet' : 'Ajouter un guichet'}</h3>
          <button className="abr-modal__close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <form className="abr-modal__form" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
          <div className="abr-modal__fields">
            <div className="abr-modal__row">
              <div className="abr-modal__field">
                <label>Agence <span>*</span></label>
                <select value={form.agenceId} onChange={(e) => set('agenceId', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="abr-modal__field">
                <label>Code <span>*</span></label>
                <input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="GCH-001" />
              </div>
            </div>
            <div className="abr-modal__row">
              <div className="abr-modal__field">
                <label>Nom</label>
                <input value={form.nom} onChange={(e) => set('nom', e.target.value)} placeholder="Guichet n°1 — vente" />
              </div>
              <div className="abr-modal__field">
                <label>Type <span>*</span></label>
                <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                  {counterTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="abr-modal__row">
              <div className="abr-modal__field">
                <label>Statut <span>*</span></label>
                <select value={form.statut} onChange={(e) => set('statut', e.target.value)}>
                  {counterStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div className="abr-modal__row">
              <div className="abr-modal__field abr-modal__field--full">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="abr-modal__footer">
            <button type="button" className="abr-modal__btn abr-modal__btn--cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="abr-modal__btn abr-modal__btn--save" disabled={!form.agenceId}><i className="bi bi-check-lg" /> {counter ? 'Enregistrer' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Modal détail ───────────────────────────────────────────────── */
function GuichetDetailModal({ counter: c, onClose, onAssign, onUnassign }) {
  return (
    <div className="abr-modal-overlay" onClick={onClose}>
      <div className="abr-modal abr-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="abr-modal__header">
          <h3><i className="bi bi-shop-window" /> {c.name || c.code}</h3>
          <button className="abr-modal__close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="abr-modal__body">
          <div className="abr-details__grid">
            <div className="abr-details__card">
              <h4><i className="bi bi-info-circle" /> Informations</h4>
              <div className="abr-details__card-body">
                <div className="abr-details__field"><span>Code</span><span>{c.code}</span></div>
                <div className="abr-details__field"><span>Type</span><span>{typeLabel(c.type)}</span></div>
                <div className="abr-details__field"><span>Statut</span><span><AgencyBranchStatus status={c.status} /></span></div>
                <div className="abr-details__field"><span>Description</span><span>{c.description || '—'}</span></div>
              </div>
            </div>
            <div className="abr-details__card">
              <h4><i className="bi bi-building" /> Agence</h4>
              <div className="abr-details__card-body">
                <div className="abr-details__field"><span>Nom</span><span>{c.agenceName || '—'}</span></div>
                <div className="abr-details__field"><span>Ville</span><span>{c.city || '—'}</span></div>
                <div className="abr-details__field"><span>Agents affectés</span><span>{c.stats.agents}</span></div>
              </div>
            </div>
            <div className="abr-details__card">
              <h4><i className="bi bi-graph-up" /> Activité</h4>
              <div className="abr-details__card-body">
                <div className="abr-details__field"><span>Réservations (auj.)</span><span>{c.stats.todayBookings}</span></div>
                <div className="abr-details__field"><span>Réservations (sem.)</span><span>{c.stats.weekBookings}</span></div>
                <div className="abr-details__field"><span>CA du jour</span><span>{formatMoney(c.stats.todayRevenue)}</span></div>
                <div className="abr-details__field"><span>CA de la semaine</span><span>{formatMoney(c.stats.weekRevenue)}</span></div>
              </div>
            </div>
          </div>
          <div className="abr-details__card" style={{ marginTop: 16 }}>
            <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><i className="bi bi-people" /> Agents affectés</span>
              <button className="abr-btn abr-btn--primary" onClick={onAssign}><i className="bi bi-person-plus" /> Affecter</button>
            </h4>
            <div className="abr-details__card-body">
              {(c.agents || []).length === 0 && <p>Aucun agent affecté à ce guichet.</p>}
              {(c.agents || []).map((a) => (
                <div key={a.id} className="abr-overview__history-item">
                  <div className="abr-overview__history-dot" style={{ background: '#0B1D51' }} />
                  <div className="abr-overview__history-content">
                    <span className="abr-overview__history-badge" style={{ background: '#0B1D5120', color: '#0B1D51' }}><i className="bi bi-person" /> {a.name}</span>
                    <span className="abr-overview__history-time">{a.matricule || a.id} · {a.role}</span>
                  </div>
                  <button className="abr-btn abr-btn--outline" onClick={() => onUnassign(a.id)}><i className="bi bi-person-dash" /> Retirer</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Modal affectation ──────────────────────────────────────────── */
function GuichetAssignModal({ counter, onClose, onSave }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const assignedIds = new Set((counter.agents || []).map((a) => a.id));

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const list = await usersService.getAll({ role: 'counter_agent' });
        if (!mounted) return;
        setAgents(list);
        setSelected(list.filter((a) => assignedIds.has(a.id)).map((a) => a.id));
      } catch {
        if (mounted) setAgents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [counter.id]);

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = () => {
    const added = selected.filter((id) => !assignedIds.has(id));
    const removed = [...assignedIds].filter((id) => !selected.includes(id));
    onSave(added, removed);
  };

  return (
    <div className="abr-modal-overlay" onClick={onClose}>
      <div className="abr-modal abr-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="abr-modal__header">
          <h3>Affecter des agents — {counter.name || counter.code}</h3>
          <button className="abr-modal__close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="abr-modal__body">
          {loading ? (
            <p>Chargement des agents…</p>
          ) : agents.length === 0 ? (
            <p>Aucun agent de guichet disponible. Créez d'abord des agents dans « Agents de guichet ».</p>
          ) : (
            <div className="abr-modal__services-grid">
              {agents.map((a) => (
                <label key={a.id} className="abr-modal__svc-switch">
                  <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} />
                  <span className="abr-modal__svc-track" />
                  <span className="abr-modal__svc-info">
                    <i className="bi bi-person" /><span>{a.firstName} {a.lastName} — {a.email}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="abr-modal__footer">
          <button className="abr-modal__btn abr-modal__btn--cancel" onClick={onClose}>Annuler</button>
          <button className="abr-modal__btn abr-modal__btn--save" onClick={submit}><i className="bi bi-check-lg" /> Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
