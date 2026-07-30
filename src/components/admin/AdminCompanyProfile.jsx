import { formatCurrency, formatDate, getLogoBgClass } from './companyHelpers';
import { statusConfig } from '../../data/adminCompanyData';

const AdminCompanyProfile = ({ company, onClose }) => {
  if (!company) return null;
  const st = statusConfig[company.status] || { label: company.status, class: '' };
  const hash = company.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const bgClass = getLogoBgClass(hash);

  return (
    <>
      <div className="admc-drawer-overlay" onClick={onClose} />
      <div className="admc-drawer">
        <div className="admc-drawer-header">
          <h2>Fiche Compagnie</h2>
          <button className="admc-drawer-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="admc-drawer-body">
          <div className="admc-drawer-section">
            <div className="admc-profile-header">
              <div className={`admc-profile-logo ${bgClass}`}>{company.logo}</div>
              <div className="admc-profile-meta">
                <h4>{company.name}</h4>
                <p>{company.description}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`admc-badge ${st.class}`} style={{ marginRight: 6 }}>{st.label}</span>
                  <span className={`admc-badge ${company.subscription === 'premium' ? 'admc-badge--premium' : 'admc-badge--standard'}`}>
                    {company.subscription === 'premium' && <i className="bi bi-star-fill" style={{ marginRight: 3, fontSize: '0.65rem' }} />}
                    {company.subscription === 'premium' ? 'Premium' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>
            <div className="admc-profile-grid">
              {[
                { label: 'Responsable', value: company.manager },
                { label: 'Email', value: company.email },
                { label: 'Téléphone', value: company.phone },
                { label: 'Adresse', value: company.address },
                { label: 'Ville', value: company.city },
                { label: 'Pays', value: company.country },
                { label: 'RCCM', value: company.rccm },
                { label: 'N° Contribuable', value: company.taxpayerId },
                { label: 'Date de création', value: formatDate(company.createdAt) },
                { label: 'Abonnement', value: company.subscription.charAt(0).toUpperCase() + company.subscription.slice(1) },
              ].map((f) => (
                <div className="admc-profile-field" key={f.label}><label>{f.label}</label><span>{f.value}</span></div>
              ))}
            </div>
          </div>
          <div className="admc-drawer-section">
            <h3><i className="bi bi-bar-chart-line" /> Statistiques</h3>
            <div className="admc-profile-grid">
              {[
                { label: 'Bus', value: company.stats.buses },
                { label: 'Chauffeurs', value: company.stats.drivers },
                { label: 'Agents', value: company.stats.agents },
                { label: 'Points de vente', value: company.stats.branches },
                { label: 'Voyages', value: company.stats.trips.toLocaleString() },
                { label: 'Réservations', value: company.stats.bookings.toLocaleString() },
                { label: 'Billets', value: company.stats.tickets.toLocaleString() },
                { label: 'Revenus', value: formatCurrency(company.stats.revenue) },
                { label: 'Commissions', value: formatCurrency(company.stats.commission) },
              ].map((f) => (
                <div className="admc-profile-field" key={f.label}><label>{f.label}</label><span>{f.value}</span></div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[
              { label: 'Voir les voyages', icon: 'bi-bus-front', key: 'trips' },
              { label: 'Voir les bus', icon: 'bi-truck', key: 'buses' },
              { label: 'Voir les chauffeurs', icon: 'bi-person-badge', key: 'drivers' },
              { label: 'Voir les points de vente', icon: 'bi-shop', key: 'branches' },
              { label: 'Voir les agents', icon: 'bi-people', key: 'agents' },
              { label: 'Voir les revenus', icon: 'bi-cash-coin', key: 'revenue' },
              { label: 'Voir les commissions', icon: 'bi-percent', key: 'commission' },
              { label: 'Historique', icon: 'bi-clock-history', key: 'history' },
              { label: "Journal d'activité", icon: 'bi-journal-text', key: 'activity' },
            ].map((a) => (
              <button key={a.key} className="admc-filters-toggler" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                onClick={() => alert(`${a.label} (mock)`)}>
                <i className={`bi ${a.icon}`} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminCompanyProfile;
