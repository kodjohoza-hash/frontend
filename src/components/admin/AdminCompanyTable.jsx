import { statusConfig } from '../../data/adminCompanyData';
import { formatCurrency, formatDate, getLogoBgClass } from './companyHelpers';

const AdminCompanyTable = ({ companies, onAction, onSelect }) => {
  if (!companies?.length) {
    return (
      <div className="admc-table-wrapper">
        <div className="admc-empty"><i className="bi bi-building-slash" /><h3>Aucune compagnie trouvée</h3><p>Essayez de modifier vos filtres de recherche.</p></div>
      </div>
    );
  }
  return (
    <div className="admc-table-wrapper">
      <div className="admc-table-responsive" style={{ overflowX: 'auto' }}>
        <table className="admc-table">
          <thead>
            <tr>
              <th style={{ width: 200 }}>Compagnie</th>
              <th>Responsable</th>
              <th>Ville</th>
              <th>Pays</th>
              <th>Abonnement</th>
              <th style={{ textAlign: 'center' }}>Voyages</th>
              <th style={{ textAlign: 'center' }}>Bus</th>
              <th style={{ textAlign: 'center' }}>Agents</th>
              <th>Inscription</th>
              <th>Statut</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, idx) => {
              const st = statusConfig[c.status] || { label: c.status, class: '' };
              const bgClass = getLogoBgClass(idx);
              return (
                <tr key={c.id} onClick={() => onSelect?.(c)}>
                  <td>
                    <div className="admc-table-name-row">
                      <div className={`admc-table-logo ${bgClass}`}>{c.logo}</div>
                      <div className="admc-table-name" style={{ whiteSpace: 'nowrap' }}>{c.name}</div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{c.manager}</td>
                  <td>{c.city}</td>
                  <td>{c.country}</td>
                  <td>
                    <span className={`admc-badge ${c.subscription === 'premium' ? 'admc-badge--premium' : 'admc-badge--standard'}`}>
                      {c.subscription === 'premium' && <i className="bi bi-star-fill" style={{ marginRight: 3, fontSize: '0.65rem' }} />}
                      {c.subscription === 'premium' ? 'Premium' : 'Standard'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>{c.stats.trips.toLocaleString()}</td>
                  <td style={{ textAlign: 'center' }}>{c.stats.buses}</td>
                  <td style={{ textAlign: 'center' }}>{c.stats.agents}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                  <td><span className={`admc-badge ${st.class}`}>{st.label}</span></td>
                  <td>
                    <div className="admc-table-actions" onClick={(e) => e.stopPropagation()}>
                      {renderActions(c, onAction)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {companies.length === 0 && (
        <div className="admc-empty"><i className="bi bi-building-slash" /><h3>Aucune compagnie trouvée</h3><p>Essayez de modifier vos filtres de recherche.</p></div>
      )}
    </div>
  );
};

const renderActions = (company, onAction) => {
  const actionBtns = [
    { key: 'view', icon: 'bi-eye', cls: 'view', title: 'Voir' },
    { key: 'edit', icon: 'bi-pencil', cls: 'edit', title: 'Modifier' },
  ];
  if (company.status === 'pending' || company.status === 'refused') {
    actionBtns.push({ key: 'validate', icon: 'bi-check-lg', cls: 'validate', title: 'Valider' });
  }
  if (company.status === 'pending') {
    actionBtns.push({ key: 'refuse', icon: 'bi-x-lg', cls: 'refuse', title: 'Refuser' });
  }
  if (company.status === 'active') {
    actionBtns.push({ key: 'suspend', icon: 'bi-pause', cls: 'suspend', title: 'Suspendre' });
  }
  if (company.status === 'suspended') {
    actionBtns.push({ key: 'reactivate', icon: 'bi-play', cls: 'reactivate', title: 'Réactiver' });
  }
  actionBtns.push({ key: 'stats', icon: 'bi-graph-up', cls: 'stats', title: 'Statistiques' });
  if (company.status !== 'refused') {
    actionBtns.push({ key: 'delete', icon: 'bi-trash', cls: 'delete', title: 'Supprimer' });
  }
  return actionBtns.map((a) => (
    <button key={a.key} className={`admc-action-btn admc-action-btn--${a.cls}`} title={a.title}
      onClick={() => onAction?.(a.key, company)}>
      <i className={`bi ${a.icon}`} />
    </button>
  ));
};

export { renderActions };
export default AdminCompanyTable;
