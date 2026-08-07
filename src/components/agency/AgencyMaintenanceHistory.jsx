import { useEffect } from 'react';
import useBusStore from '../../store/bus.store';

const statusColors = {
  terminee: { label: 'Terminée', bg: '#F0FDF4', color: '#22C55E' },
  en_cours: { label: 'En cours', bg: '#EFF6FF', color: '#3B82F6' },
  planifiee: { label: 'Planifiée', bg: '#FFFBEB', color: '#F59E0B' },
};

export default function AgencyMaintenanceHistory({ busId }) {
  const { maintenances, fetchMaintenances } = useBusStore();

  useEffect(() => {
    if (busId) fetchMaintenances(busId).catch(() => {});
  }, [busId, fetchMaintenances]);

  if (maintenances.length === 0) {
    return (
      <div className="ab-maint__empty">
        <i className="bi bi-wrench" />
        <p>Aucun historique de maintenance</p>
      </div>
    );
  }

  return (
    <div className="ab-maint">
      {maintenances.map((item) => {
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
                {item.date && <span><i className="bi bi-calendar3" /> {new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>}
                {item.completedDate && <span><i className="bi bi-check-circle" /> {new Date(item.completedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>}
                <span><i className="bi bi-speedometer" /> {Number(item.mileage || 0).toLocaleString('fr-FR')} km</span>
                {item.cost > 0 && <span><i className="bi bi-cash" /> {Number(item.cost || 0).toLocaleString('fr-FR')} XAF</span>}
              </div>
              {item.provider && (
                <div className="ab-maint__provider">
                  <i className="bi bi-building" /> {item.provider}
                </div>
              )}
              {item.notes && <div className="ab-maint__notes">{item.notes}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
