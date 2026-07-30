import { statusConfig } from '../../data/adminCompanyData';
import { formatDate, getLogoBgClass } from './companyHelpers';

const AdminCompanyCards = ({ companies, onAction, onSelect }) => {
  if (!companies?.length) {
    return (
      <div className="admc-cards" style={{ display: 'grid' }}>
        <div className="admc-empty"><i className="bi bi-building-slash" /><h3>Aucune compagnie trouvée</h3><p>Essayez de modifier vos filtres.</p></div>
      </div>
    );
  }
  return (
    <div className="admc-cards">
      {companies.map((c, idx) => {
        const st = statusConfig[c.status] || { label: c.status, class: '' };
        const bgClass = getLogoBgClass(idx);
        return (
          <div key={c.id} className="admc-company-card" onClick={() => onSelect?.(c)}>
            <div className="admc-card-header">
              <div className={`admc-table-logo ${bgClass}`}>{c.logo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{c.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{c.manager}</div>
              </div>
              <span className={`admc-badge ${st.class}`}>{st.label}</span>
            </div>
            <div className="admc-card-body">
              <span><i className="bi bi-geo-alt" /> {c.city}</span>
              <span><i className={`bi ${c.subscription === 'premium' ? 'bi-star-fill' : 'bi-building'}`} /> {c.subscription === 'premium' ? 'Premium' : 'Standard'}</span>
              <span><i className="bi bi-bus-front" /> {c.stats.buses} bus</span>
              <span><i className="bi bi-people" /> {c.stats.agents} agents</span>
              <span><i className="bi bi-calendar" /> {formatDate(c.createdAt)}</span>
              <span><i className="bi bi-graph-up" /> {c.stats.trips} voyages</span>
            </div>
            <div className="admc-card-actions" onClick={(e) => e.stopPropagation()}>
              {['view', 'edit', 'validate', 'suspend', 'reactivate', 'refuse', 'delete', 'stats'].map((key) => {
                const show = {
                  view: true, edit: true,
                  validate: c.status === 'pending' || c.status === 'refused',
                  refuse: c.status === 'pending',
                  suspend: c.status === 'active',
                  reactivate: c.status === 'suspended',
                  delete: c.status !== 'refused',
                  stats: true,
                }[key];
                if (!show) return null;
                const icons = { view: 'bi-eye', edit: 'bi-pencil', validate: 'bi-check-lg', refuse: 'bi-x-lg', suspend: 'bi-pause', reactivate: 'bi-play', delete: 'bi-trash', stats: 'bi-graph-up' };
                return (
                  <button key={key} className={`admc-action-btn admc-action-btn--${key === 'reactivate' ? 'reactivate' : key}`}
                    title={key} onClick={() => onAction?.(key, c)}>
                    <i className={`bi ${icons[key]}`} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AdminCompanyCards;
