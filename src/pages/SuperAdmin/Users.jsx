import { useState, useMemo, useEffect } from 'react';
import {
  userStats, users as allUsers, filterUsers, sortUsers, defaultFilters as defFilters,
  userPermissions, userActivityTimeline, userSessions, userActivityLog,
} from '../../data/adminUserData';
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
  const [filters, setFilters] = useState(defFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => filterUsers(allUsers, filters), [filters]);
  const sorted = useMemo(() => sortUsers(filtered, sortBy), [filtered, sortBy]);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [filters, sortBy]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const handleAction = (action, user) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        break;
      case 'edit':
        addToast('info', `Modification de ${user.firstName} ${user.lastName} (mock)`);
        break;
      case 'suspend':
        setConfirmAction({ action: 'suspend', user, message: `Suspendre ${user.firstName} ${user.lastName} ?`, icon: 'warning' });
        break;
      case 'reactivate':
        setConfirmAction({ action: 'reactivate', user, message: `Réactiver ${user.firstName} ${user.lastName} ?`, icon: 'success' });
        break;
      case 'resetPassword':
        setConfirmAction({ action: 'resetPassword', user, message: `Réinitialiser le mot de passe de ${user.firstName} ${user.lastName} ?`, icon: 'warning' });
        break;
      case 'resetSession':
        addToast('success', `Session de ${user.firstName} ${user.lastName} réinitialisée (mock)`);
        break;
      case 'changeRole':
        addToast('info', `Changement de rôle pour ${user.firstName} ${user.lastName} (mock)`);
        break;
      case 'delete':
        setConfirmAction({ action: 'delete', user, message: `Supprimer le compte de ${user.firstName} ${user.lastName} ? Cette action est irréversible.`, icon: 'danger' });
        break;
      case 'history':
        addToast('info', `Historique de ${user.firstName} ${user.lastName} (mock)`);
        break;
      default:
        addToast('info', `${action} — ${user.firstName} ${user.lastName} (mock)`);
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { action, user } = confirmAction;
    const labels = {
      suspend: 'suspendu', reactivate: 'réactivé', resetPassword: 'mot de passe réinitialisé', delete: 'supprimé',
    };
    addToast('success', `${user.firstName} ${user.lastName} ${labels[action] || action}`);
    setConfirmAction(null);
  };

  const handleReset = () => {
    setFilters(defFilters);
    setSortBy('newest');
    addToast('info', 'Filtres réinitialisés');
  };

  if (loading) return <AdminUserSkeleton />;

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
            <button className="admu-btn admu-btn--primary" onClick={() => addToast('info', 'Création d\'utilisateur (mock)')}>
              <i className="bi bi-plus-lg" /> Nouvel utilisateur
            </button>
            <button className="admu-btn admu-btn--outline" onClick={() => addToast('info', 'Import CSV (mock)')}>
              <i className="bi bi-upload" /> Importer
            </button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <AdminUserStats stats={userStats} />

      {/* Filters */}
      <AdminUserFilters
        filters={filters} onFilterChange={setFilters}
        onReset={handleReset} total={allUsers.length} filtered={filtered.length}
      />

      {/* Sort */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem', gap: '0.5rem', alignItems: 'center' }}>
        <label style={{ fontSize: '0.75rem', color: '#6B7280' }}>Trier par :</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
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
          <AdminUserTimeline events={userActivityTimeline} />
        </div>
        <div>
          <AdminUserSessions sessions={userSessions} />
        </div>
      </div>

      {/* Permissions section */}
      <AdminUserPermissions permissions={userPermissions} />

      {/* Activity log */}
      <div className="admu-drawer-section">
        <AdminUserActivity activity={userActivityLog} />
      </div>

      {/* Drawer — User Profile */}
      {selectedUser && (
        <AdminUserProfile user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="admu-modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="admu-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`admu-modal-icon admu-modal-icon--${confirmAction.icon}`}>
              <i className={`bi ${confirmAction.icon === 'danger' ? 'bi-exclamation-triangle' : confirmAction.icon === 'success' ? 'bi-check-circle' : 'bi-question-circle'}`} />
            </div>
            <h3>Confirmation</h3>
            <p>{confirmAction.message}</p>
            <div className="admu-modal-actions">
              <button className="admu-btn--cancel" onClick={() => setConfirmAction(null)}>Annuler</button>
              <button className={`admu-btn--${confirmAction.icon === 'danger' ? 'danger' : confirmAction.icon === 'success' ? 'success' : 'primary'}`} onClick={handleConfirm}>
                Confirmer
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
