import { transactions, statusConfig } from '@data/adminData';

const formatFCFA = (v) => `${v.toLocaleString('fr-FR')} FCFA`;

const AdminTransactions = () => (
  <div className="adm-transactions-card">
    <div className="adm-transactions-card__header">
      <span className="adm-transactions-card__title">Dernières transactions</span>
      <a href="/super-admin/reports" className="adm-timeline-card__link">
        Voir tout <i className="bi bi-arrow-right" />
      </a>
    </div>
    <table className="adm-transactions-table">
      <thead>
        <tr>
          <th>Référence</th>
          <th>Compagnie</th>
          <th>Montant</th>
          <th>Commission</th>
          <th>Statut</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((txn) => {
          const status = statusConfig[txn.status] || { label: txn.status, class: '' };
          return (
            <tr key={txn.id}>
              <td style={{ fontWeight: 600 }}>{txn.id}</td>
              <td>{txn.company}</td>
              <td>{formatFCFA(txn.amount)}</td>
              <td>{formatFCFA(txn.commission)}</td>
              <td><span className={`adm-badge ${status.class}`}>{status.label}</span></td>
              <td style={{ color: 'var(--adm-text-muted)', fontSize: 12 }}>
                {new Date(txn.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default AdminTransactions;
