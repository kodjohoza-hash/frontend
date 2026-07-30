import { useState, useMemo, useEffect } from 'react';
import {
  roles as allRoles, roleStats, filterRoles, sortRoles, defaultRoleFilters as defFilters,
  copyPermissions, roleActivityTimeline,
} from '../../data/adminRoleData';
import AdminRoleStats from '../../components/admin/AdminRoleStats';
import AdminRoleFilters from '../../components/admin/AdminRoleFilters';
import AdminRoleTable from '../../components/admin/AdminRoleTable';
import AdminRoleCard from '../../components/admin/AdminRoleCard';
import AdminRoleProfile from '../../components/admin/AdminRoleProfile';
import AdminRoleTimeline from '../../components/admin/AdminRoleTimeline';
import AdminRoleSkeleton from '../../components/admin/AdminRoleSkeleton';

const ITEMS_PER_PAGE = 8;

const Roles = () => {
  const [filters, setFilters] = useState(defFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolesData, setRolesData] = useState(allRoles);
  const [toasts, setToasts] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => filterRoles(rolesData, filters), [rolesData, filters]);
  const sorted = useMemo(() => sortRoles(filtered, sortBy), [filtered, sortBy]);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [filters, sortBy]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const handleAction = (action, role) => {
    switch (action) {
      case 'view':
        setSelectedRole(role);
        break;
      case 'edit':
        setSelectedRole(role);
        addToast('info', `Modification de ${role.name} (éditez la matrice ci-dessous)`);
        break;
      case 'duplicate':
        const newRole = copyPermissions(role, {
          ...role,
          id: `ROLE-${Date.now()}`,
          name: `${role.name} (copie)`,
          type: 'custom',
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: 'Admin Super',
          userCount: 0,
        });
        setRolesData((prev) => [...prev, newRole]);
        addToast('success', `Rôle "${role.name}" dupliqué avec succès`);
        break;
      case 'archive':
        setRolesData((prev) => prev.map((r) => r.id === role.id ? { ...r, status: 'archived' } : r));
        addToast('success', `Rôle "${role.name}" archivé`);
        break;
      case 'reactivate':
        setRolesData((prev) => prev.map((r) => r.id === role.id ? { ...r, status: 'active' } : r));
        addToast('success', `Rôle "${role.name}" réactivé`);
        break;
      case 'delete':
        setConfirmAction({ action: 'delete', role, message: `Supprimer le rôle "${role.name}" ? Cette action est irréversible.`, icon: 'danger' });
        break;
      case 'users':
        setSelectedRole(role);
        addToast('info', `Gestion des utilisateurs pour ${role.name}`);
        break;
      case 'history':
        addToast('info', `Historique de ${role.name} (mock)`);
        break;
      default:
        addToast('info', `${action} — ${role.name} (mock)`);
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { action, role } = confirmAction;
    if (action === 'delete') {
      setRolesData((prev) => prev.filter((r) => r.id !== role.id));
      addToast('success', `Rôle "${role.name}" supprimé`);
    }
    setConfirmAction(null);
  };

  const handleReset = () => {
    setFilters(defFilters);
    setSortBy('newest');
    addToast('info', 'Filtres réinitialisés');
  };

  const handleRoleUpdate = (updatedRole) => {
    setRolesData((prev) => prev.map((r) => r.id === updatedRole.id ? updatedRole : r));
    setSelectedRole(updatedRole);
    addToast('success', `Permissions mises à jour pour "${updatedRole.name}"`);
  };

  if (loading) return <AdminRoleSkeleton />;

  return (
    <div className="admr-page">
      {/* Hero */}
      <div className="admr-hero">
        <div className="admr-hero-content">
          <div>
            <h1>Rôles & Permissions</h1>
            <p>Système de contrôle d'accès dynamique basé sur les rôles (RBAC). Gérez en toute flexibilité.</p>
          </div>
          <div className="admr-hero-actions">
            <button className="admr-btn admr-btn--primary" onClick={() => addToast('info', 'Création de rôle (mock)')}>
              <i className="bi bi-plus-lg" /> Nouveau rôle
            </button>
            <button className="admr-btn admr-btn--outline" onClick={() => addToast('info', 'Export (mock)')}>
              <i className="bi bi-download" /> Exporter
            </button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <AdminRoleStats stats={roleStats} />

      {/* Filters */}
      <AdminRoleFilters
        filters={filters} onFilterChange={setFilters}
        onReset={handleReset} total={rolesData.length} filtered={filtered.length}
      />

      {/* Sort */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem', gap: '0.5rem', alignItems: 'center' }}>
        <label style={{ fontSize: '0.8rem', color: '#6B7280' }}>Trier par :</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '0.35rem 0.6rem', borderRadius: 6, border: '1.5px solid #E5E7EB', fontSize: '0.8rem', background: '#fff' }}>
          <option value="newest">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="name_asc">Nom A-Z</option>
          <option value="name_desc">Nom Z-A</option>
          <option value="users_desc">Utilisateurs ↓</option>
          <option value="permissions_desc">Permissions ↓</option>
        </select>
      </div>

      {/* Table */}
      <AdminRoleTable roles={paginated} onAction={handleAction} onSelect={(r) => setSelectedRole(r)} />

      {/* Cards (mobile) */}
      <AdminRoleCard roles={paginated} onAction={handleAction} onSelect={(r) => setSelectedRole(r)} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admr-table-wrapper">
          <div className="admr-pagination">
            <div className="admr-pagination-info">
              Page {page} sur {totalPages} — {sorted.length} rôle{sorted.length !== 1 ? 's' : ''}
            </div>
            <div className="admr-pagination-pages">
              <button className="admr-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <i className="bi bi-chevron-left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`admr-page-btn ${p === page ? 'admr-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="admr-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <AdminRoleTimeline events={roleActivityTimeline} />

      {/* Drawer — Role Profile with Permission Matrix */}
      {selectedRole && (
        <AdminRoleProfile role={selectedRole} onUpdate={handleRoleUpdate} onClose={() => setSelectedRole(null)} />
      )}

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="admr-modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="admr-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`admr-modal-icon admr-modal-icon--${confirmAction.icon}`}>
              <i className="bi bi-exclamation-triangle" />
            </div>
            <h3>Confirmation</h3>
            <p>{confirmAction.message}</p>
            <div className="admr-modal-actions">
              <button className="admr-btn--cancel" onClick={() => setConfirmAction(null)}>Annuler</button>
              <button className="admr-btn--danger" onClick={handleConfirm}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="admr-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`admr-toast admr-toast--${t.type}`}>
            <i className={`bi ${t.type === 'success' ? 'bi-check-circle' : t.type === 'error' ? 'bi-x-circle' : t.type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle'}`} />
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Roles;
