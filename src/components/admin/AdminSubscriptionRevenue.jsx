import { getRevenueByCompany, getSubscriptionSummary } from '@data/adminAgencySubscriptionData';

const formatXAF = (v) => `${(v / 1000).toFixed(0)} k XAF`;

const AdminSubscriptionRevenue = () => {
  const revenue = getRevenueByCompany();
  const summary = getSubscriptionSummary();
  return (
    <div className="adm-companies-card">
      <div className="adm-companies-card__header">
        <span className="adm-companies-card__title">Revenu abonnements par compagnie</span>
        <a href="/super-admin/agency-subscriptions" className="adm-timeline-card__link">
          Gérer <i className="bi bi-arrow-right" />
        </a>
      </div>
      <table className="adm-companies-table">
        <thead>
          <tr>
            <th>Compagnie</th>
            <th>Agences</th>
            <th>Revenu / mois</th>
            <th>Recouvré</th>
            <th>Relances</th>
          </tr>
        </thead>
        <tbody>
          {revenue.map((c) => (
            <tr key={c.id}>
              <td>
                <div className="adm-company-cell">
                  <div className="adm-company-cell__logo" style={{ background: c.color }}>{c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                  <span className="adm-company-cell__name">{c.name}</span>
                </div>
              </td>
              <td>{c.subscribedCount}/{c.agenciesCount} payées</td>
              <td style={{ fontWeight: 700, color: 'var(--adm-primary)' }}>{formatXAF(c.revenue)}</td>
              <td>
                <div className="adm-satisfaction">
                  <div className="adm-satisfaction__bar">
                    <div className="adm-satisfaction__fill" style={{ width: `${c.rate}%`, background: c.color }} />
                  </div>
                  <span className="adm-satisfaction__text">{c.rate}%</span>
                </div>
              </td>
              <td>
                <span className={`adm-growth-badge ${c.overdueCount + c.suspendedCount > 0 ? 'adm-growth-badge--down' : 'adm-growth-badge--up'}`}>
                  <i className={`bi ${c.overdueCount + c.suspendedCount > 0 ? 'bi-bell' : 'bi-check-lg'}`} />
                  {c.overdueCount + c.suspendedCount}
                </span>
              </td>
            </tr>
          ))}
          <tr style={{ background: 'var(--adm-surface-hover)', fontWeight: 700 }}>
            <td>Total encaissé</td>
            <td>{summary.paid}/{summary.total} agences</td>
            <td style={{ color: 'var(--adm-accent)' }}>{formatXAF(summary.totalRevenue)}</td>
            <td>{summary.collectedRate}%</td>
            <td>{summary.late + summary.unpaid + summary.suspended}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubscriptionRevenue;
