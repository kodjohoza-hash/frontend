import { topCompanies } from '@data/adminData';

const formatXAF = (v) => `${(v / 1000000).toFixed(1)} M XAF`;

const AdminTopCompanies = () => (
  <div className="adm-companies-card">
    <div className="adm-companies-card__header">
      <span className="adm-companies-card__title">Top compagnies</span>
      <a href="/super-admin/companies" className="adm-timeline-card__link">
        Voir tout <i className="bi bi-arrow-right" />
      </a>
    </div>
    <table className="adm-companies-table">
      <thead>
        <tr>
          <th>Compagnie</th>
          <th>Billets</th>
          <th>Voyages</th>
          <th>Revenus</th>
          <th>Satisfaction</th>
          <th>Croissance</th>
        </tr>
      </thead>
      <tbody>
        {topCompanies.map((c) => (
          <tr key={c.id}>
            <td>
              <div className="adm-company-cell">
                <div className="adm-company-cell__logo">{c.logo}</div>
                <span className="adm-company-cell__name">{c.name}</span>
              </div>
            </td>
            <td>{c.tickets.toLocaleString('fr-FR')}</td>
            <td>{c.trips}</td>
            <td>{formatXAF(c.revenue)}</td>
            <td>
              <div className="adm-satisfaction">
                <div className="adm-satisfaction__bar">
                  <div className="adm-satisfaction__fill" style={{ width: `${c.satisfaction}%` }} />
                </div>
                <span className="adm-satisfaction__text">{c.satisfaction}%</span>
              </div>
            </td>
            <td>
              <span className={`adm-growth-badge ${c.growth >= 0 ? 'adm-growth-badge--up' : 'adm-growth-badge--down'}`}>
                <i className={`bi ${c.growth >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'}`} />
                {Math.abs(c.growth)}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminTopCompanies;
