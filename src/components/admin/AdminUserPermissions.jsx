const AdminUserPermissions = ({ permissions }) => {
  if (!permissions?.length) return null;
  return (
    <div className="admu-drawer-section">
      <h3><i className="bi bi-shield-check" /> Permissions</h3>
      <div className="admu-perms-grid">
        {permissions.map((p) => (
          <div key={p.id} className={`admu-perm-item ${p.granted ? 'admu-perm-item--granted' : p.inherited ? 'admu-perm-item--inherited' : 'admu-perm-item--denied'}`}>
            {p.granted
              ? <i className="bi bi-check-circle-fill" style={{ color: '#10B981' }} />
              : p.inherited
                ? <i className="bi bi-arrow-right-circle-fill" style={{ color: '#3B82F6' }} />
                : <i className="bi bi-x-circle-fill" style={{ color: '#D1D5DB' }} />
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, color: p.granted || p.inherited ? '#111827' : '#9CA3AF' }}>{p.name}</div>
              <div style={{ fontSize: '0.65rem', color: p.granted || p.inherited ? '#6B7280' : '#D1D5DB' }}>
                Module : {p.module}
                {p.inherited && !p.granted && ' — Héritée du rôle'}
              </div>
            </div>
            <span style={{ fontSize: '0.6rem', fontWeight: 600, padding: '0.1rem 0.35rem', borderRadius: 3,
              background: p.granted ? 'rgba(16,185,129,0.1)' : p.inherited ? 'rgba(59,130,246,0.1)' : '#F3F4F6',
              color: p.granted ? '#065F46' : p.inherited ? '#1E40AF' : '#9CA3AF' }}>
              {p.granted ? 'Attribuée' : p.inherited ? 'Héritée' : 'Refusée'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminUserPermissions;
