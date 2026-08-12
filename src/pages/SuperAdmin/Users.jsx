import { useState, useMemo, useEffect } from 'react';
import { buildFilterOptions, defaultFilters, filterUsers, sortUsers } from '../../services/users.service';
import useUsersStore from '../../store/users.store';
import AdminUserStats from '../../components/admin/AdminUserStats';
import AdminUserFilters from '../../components/admin/AdminUserFilters';
import AdminUserTable from '../../components/admin/AdminUserTable';
import AdminUserCards from '../../components/admin/AdminUserCards';
import AdminUserProfile from '../../components/admin/AdminUserProfile';
import AdminUserPermissions from '../../components/admin/AdminUserPermissions';
import AdminUserTimeline from '../../components/admin/AdminUserTimeline';
import AdminUserSessions from '../../components/admin/AdminUserSessions';
import AdminUserActivity from '../../components/admin/AdminUserActivity';
import AdminUserSkeleton from '../../components/admin/AdminUserSkeleton';

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const {
    users, stats, loading, refresh, suspend, reactivate, removeUser, resetPassword,
  } = useUsersStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  useEffect(() => {
    refresh().catch((err) => {
      addToast('error', err.message || 'Impossible de charger les utilisateurs.');
    });
  }, [refresh]);

  const filtered = useMemo(() => filterUsers(users, filters), [users, filters]);
  const sorted = useMemo(() => sortUsers(filtered, sortBy), [filtered, sortBy]);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const filterOptions = useMemo(() => buildFilterOptions(users), [users]);

  /* Historique dérivé de l'utilisateur sélectionné (données réelles). */
  const selectedUserTimeline = useMemo(() => {
    const u = selectedUser;
    if (!u) return [];
    const events = [
      { id: 'created', type: 'created', icon: 'bi-person-plus', color: 'info', action: 'Compte créé', detail: 'Inscription sur la plateforme', time: u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—' },
    ];
    if (u.lastLogin) {
      events.push({ id: 'login', type: 'login', icon: 'bi-shield-check', color: 'success', action: 'Dernière connexion', detail: 'Authentification réussie', time: new Date(u.lastLogin).toLocaleString('fr-FR') });
    }
    if (u.status === 'suspended') {
      events.push({ id: 'suspended', type: 'suspended', icon: 'bi-pause-circle', color: 'danger', action: 'Compte suspendu', detail: 'Compte actuellement suspendu', time: '—' });
    }
    if (u.status === 'blocked') {
      events.push({ id: 'blocked', type: 'blocked', icon: 'bi-shield-exclamation', color: 'danger', action: 'Compte banni', detail: 'Accès révoqué par l\'administrateur', time: '—' });
    }
    return events;
  }, [selectedUser]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handleAction = (action, user) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        break;
      case 'edit':
        addToast('info', `Modification de ${user.firstName} ${user.lastName} (à venir)`);
        break;
      case 'suspend':
        setConfirmAction({ action: 'suspend', user, message: `Suspendre ${user.firstName} ${user.lastName} ?`, icon: 'warning' });
        break;
      case 'reactivate':
        setConfirmAction({ action: 'reactivate', user, message: `Réactiver ${user.firstName} ${user.lastName} ?`, icon: 'success' });
        break;
      case 'resetPassword':
        setConfirmAction({ action: 'resetPassword', user, message: `Réinitialiser le mot de passe de ${user.firstName} ${user.lastName} ? Un mot de passe temporaire sera généré.`, icon: 'warning' });
        break;
      case 'resetSession':
        addToast('info', `Réinitialisation de session pour ${user.firstName} ${user.lastName} (à venir)`);
        break;
      case 'changeRole':
        addToast('info', `Changement de rôle pour ${user.firstName} ${user.lastName} (à venir)`);
        break;
      case 'delete':
        setConfirmAction({ action: 'delete', user, message: `Supprimer le compte de ${user.firstName} ${user.lastName} ? Cette action est irréversible.`, icon: 'danger' });
        break;
      case 'history':
        addToast('info', `Historique de ${user.firstName} ${user.lastName} (à venir)`);
        break;
      default:
        addToast('info', `${action} — ${user.firstName} ${user.lastName} (à venir)`);
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { action, user } = confirmAction;
    setConfirming(true);
    try {
      switch (action) {
        case 'suspend':
          await suspend(user);
          addToast('success', `${user.firstName} ${user.lastName} suspendu`);
          break;
        case 'reactivate':
          await reactivate(user);
          addToast('success', `${user.firstName} ${user.lastName} réactivé`);
          break;
        case 'resetPassword': {
          const temp = await resetPassword(user);
          addToast('success', `Mot de passe temporaire de ${user.firstName} ${user.lastName} : ${temp}`);
          break;
        }
        case 'delete':
          await removeUser(user);
          addToast('success', `${user.firstName} ${user.lastName} supprimé`);
          break;
        default:
          addToast('success', `${user.firstName} ${user.lastName} — action effectuée`);
      }
    } catch (err) {
      addToast('error', err.message || 'Action impossible.');
    } finally {
      setConfirming(false);
      setConfirmAction(null);
    }
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSortBy('newest');
    setPage(1);
    addToast('info', 'Filtres réinitialisés');
  };

  if (loading && users.length === 0) return <AdminUserSkeleton />;

  return (
    <div className="admu-page">
      {/* Hero */}
      <div className="admu-hero">
        <div className="admu-hero-content">
          <div>
            <h1>Gestion des utilisateurs</h1>
            <p>Gérez tous les comptes de la plateforme — clients, administrateurs, agents et super admins.</p>
          </div>
          <div className="admu-hero-actions">
            <button className="admu-btn admu-btn--primary" onClick={() => addToast('info', 'Création d\'utilisateur (à venir)')}>
              <i className="bi bi-plus-lg" /> Nouvel utilisateur
            </button>
            <button className="admu-btn admu-btn--outline" onClick={() => addToast('info', 'Import CSV (à venir)')}>
              <i className="bi bi-upload" /> Importer
            </button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <AdminUserStats stats={stats} />

      {/* Filters */}
      <AdminUserFilters
        filters={filters} onFilterChange={handleFilterChange}
        onReset={handleReset} total={users.length} filtered={filtered.length}
        options={filterOptions}
      />

      {/* Sort */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem', gap: '0.5rem', alignItems: 'center' }}>
        <label style={{ fontSize: '0.75rem', color: '#6B7280' }}>Trier par :</label>
        <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}
          style={{ padding: '0.3rem 0.55rem', borderRadius: 6, border: '1.5px solid #E5E7EB', fontSize: '0.75rem', background: '#fff' }}>
          <option value="newest">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="name_asc">Nom A-Z</option>
          <option value="name_desc">Nom Z-A</option>
          <option value="lastLogin_desc">Dernière connexion ↓</option>
        </select>
      </div>

      {/* Table */}
      <AdminUserTable users={paginated} onAction={handleAction} onSelect={(u) => setSelectedUser(u)} />

      {/* Cards (mobile) */}
      <AdminUserCards users={paginated} onAction={handleAction} onSelect={(u) => setSelectedUser(u)} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admu-table-wrapper">
          <div className="admu-pagination">
            <div className="admu-pagination-info">
              Page {page} sur {totalPages} — {sorted.length} utilisateur{sorted.length !== 1 ? 's' : ''}
            </div>
            <div className="admu-pagination-pages">
              <button className="admu-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <i className="bi bi-chevron-left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`admu-page-btn ${p === page ? 'admu-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="admu-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity & Sessions side by side (desktop) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="admu-drawer-section">
          <AdminUserTimeline events={selectedUserTimeline} />
        </div>
        <div>
          <AdminUserSessions sessions={[]} />
        </div>
      </div>

      {/* Permissions section */}
      <AdminUserPermissions permissions={[]} />

      {/* Activity log */}
      <div className="admu-drawer-section">
        <AdminUserActivity activity={[]} />
      </div>

      {/* Drawer — User Profile */}
      {selectedUser && (
        <AdminUserProfile user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="admu-modal-overlay" onClick={() => !confirming && setConfirmAction(null)}>
          <div className="admu-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`admu-modal-icon admu-modal-icon--${confirmAction.icon}`}>
              <i className={`bi ${confirmAction.icon === 'danger' ? 'bi-exclamation-triangle' : confirmAction.icon === 'success' ? 'bi-check-circle' : 'bi-question-circle'}`} />
            </div>
            <h3>Confirmation</h3>
            <p>{confirmAction.message}</p>
            <div className="admu-modal-actions">
              <button className="admu-btn--cancel" disabled={confirming} onClick={() => setConfirmAction(null)}>Annuler</button>
              <button className={`admu-btn--${confirmAction.icon === 'danger' ? 'danger' : confirmAction.icon === 'success' ? 'success' : 'primary'}`} disabled={confirming} onClick={handleConfirm}>
                {confirming ? 'En cours…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="admu-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`admu-toast admu-toast--${t.type}`}>
            <i className={`bi ${t.type === 'success' ? 'bi-check-circle' : t.type === 'error' ? 'bi-x-circle' : t.type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle'}`} />
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Users;
