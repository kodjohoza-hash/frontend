import { mockMaintenanceHistory } from '../../data/agencyBusData';

const statusColors = {
  terminee: { label: 'Terminée', bg: '#F0FDF4', color: '#22C55E' },
  en_cours: { label: 'En cours', bg: '#EFF6FF', color: '#3B82F6' },
  planifiee: { label: 'Planifiée', bg: '#FFFBEB', color: '#F59E0B' },
};

export default function AgencyMaintenanceHistory({ busId }) {
  const history = mockMaintenanceHistory.filter((m) => m.busId === busId);

  if (history.length === 0) {
    return (
      <div className="ab-maint__empty">
        <i className="bi bi-wrench" />
        <p>Aucun historique de maintenance</p>
      </div>
    );
  }

  return (
    <div className="ab-maint">
      {history.map((item) => {
        const st = statusColors[item.status] || statusColors.planifiee;
        return (
          <div key={item.id} className="ab-maint__item">
            <div className="ab-maint__marker" style={{ background: st.color }} />
            <div className="ab-maint__content">
              <div className="ab-maint__header">
                <span className="ab-maint__id">{item.id}</span>
                <span className="ab-maint__type">{item.type.replace(/_/g, ' ')}</span>
                <span className="ab-maint__status" style={{ background: st.bg, color: st.color }}>{st.label}</span>
              </div>
              <div className="ab-maint__details">
                <span><i className="bi bi-calendar3" /> {new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                {item.completedDate && <span><i className="bi bi-check-circle" /> {new Date(item.completedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>}
                <span><i className="bi bi-speedometer" /> {item.mileage.toLocaleString('fr-FR')} km</span>
                {item.cost > 0 && <span><i className="bi bi-cash" /> {item.cost.toLocaleString('fr-FR')} FCFA</span>}
              </div>
              <div className="ab-maint__provider">
                <i className="bi bi-building" /> {item.provider}
              </div>
              {item.notes && <div className="ab-maint__notes">{item.notes}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
