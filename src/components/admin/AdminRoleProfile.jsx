import { formatDate, getRoleIconBg } from './rolHelpers';
import { roleStatusConfig, ROLE_TYPES, roleActivityTimeline } from '../../data/adminRoleData';
import AdminPermissionMatrix from './AdminPermissionMatrix';
import AdminRoleUsers from './AdminRoleUsers';
import AdminRoleTimeline from './AdminRoleTimeline';

const AdminRoleProfile = ({ role, onUpdate, onClose }) => {
  if (!role) return null;
  const st = roleStatusConfig[role.status] || { label: role.status, class: '' };
  const typeCfg = ROLE_TYPES.find((t) => t.id === role.type);

  return (
    <>
      <div className="admr-drawer-overlay" onClick={onClose} />
      <div className="admr-drawer">
        <div className="admr-drawer-header">
          <h2><i className="bi bi-shield-lock" /> Fiche Rôle</h2>
          <button className="admr-drawer-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="admr-drawer-body">
          {/* Header */}
          <div className="admr-drawer-section">
            <div className="admr-profile-header">
              <div className="admr-profile-icon" style={{ background: getRoleIconBg(role.color) }}>
                <i className={`bi ${role.icon}`} />
              </div>
              <div className="admr-profile-meta">
                <h4>{role.name}</h4>
                <p>
                  <span className={st.class}>{st.label}</span>
                  <span className={`admr-badge ${typeCfg?.badge || ''}`}>{typeCfg?.label || role.type}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Créé le {formatDate(role.createdAt)}</span>
                </p>
              </div>
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>{role.description}</p>
          </div>

          {/* Info */}
          <div className="admr-drawer-section">
            <h3><i className="bi bi-info-circle" /> Informations</h3>
            <div className="admr-profile-grid">
              <div className="admr-profile-field"><label>Nom</label><span>{role.name}</span></div>
              <div className="admr-profile-field"><label>Icône</label><span><i className={`bi ${role.icon}`} /> {role.icon}</span></div>
              <div className="admr-profile-field"><label>Type</label><span>{typeCfg?.label || role.type}</span></div>
              <div className="admr-profile-field"><label>Statut</label><span className={st.class}>{st.label}</span></div>
              <div className="admr-profile-field"><label>Date de création</label><span>{formatDate(role.createdAt)}</span></div>
              <div className="admr-profile-field"><label>Créateur</label><span>{role.createdBy}</span></div>
              <div className="admr-profile-field"><label>Utilisateurs</label><span>{role.userCount}</span></div>
              <div className="admr-profile-field"><label>Permissions</label><span>{role.permissionCount}</span></div>
            </div>
          </div>

          {/* Permission Matrix */}
          <AdminPermissionMatrix role={role} onUpdate={onUpdate} />

          {/* Users */}
          <AdminRoleUsers role={role} />

          {/* Timeline */}
          <AdminRoleTimeline events={roleActivityTimeline} />
        </div>
      </div>
    </>
  );
};
export default AdminRoleProfile;
