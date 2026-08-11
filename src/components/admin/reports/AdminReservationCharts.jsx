import { useState } from 'react';
import { bookingData } from '../../../data/adminReportData';

const ReservationCharts = ({ bookings }) => {
  const [activeView, setActiveView] = useState('byDay');
  const [fullscreen, setFullscreen] = useState(null);

  const views = [
    { key: 'byDay', label: 'Par jour', icon: 'fa-calendar-day' },
    { key: 'byCompany', label: 'Par compagnie', icon: 'fa-building' },
    { key: 'byCity', label: 'Par ville', icon: 'fa-city' },
    { key: 'byRoute', label: 'Par ligne', icon: 'fa-route' },
  ];

  const source = bookings && (bookings.byDay || bookings.byCompany)
    ? bookings
    : bookingData;

  const data = source[activeView];
  const isByDay = activeView === 'byDay';
  const isHorizontal = !isByDay;
  const maxValue = isByDay ? Math.max(...(data.map(d => d.bookings) || [0])) : 100;

  const toggleFullscreen = () => setFullscreen(fullscreen === 'reservations' ? null : 'reservations');

  return (
    <div className="adbi-chart-card full">
      <div className="adbi-chart-header">
        <h3><i className="fas fa-ticket" style={{ color: '#3B82F6', marginRight: 8 }} /> Réservations</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {views.map(v => (
              <button key={v.key} className="adbi-control-btn" style={{
                background: activeView === v.key ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: activeView === v.key ? '#60A5FA' : 'rgba(255,255,255,0.5)',
                borderColor: activeView === v.key ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)',
                padding: '0.3rem 0.7rem', fontSize: '0.75rem',
              }} onClick={() => setActiveView(v.key)}>
                <i className={`fas ${v.icon}`} style={{ marginRight: 4 }} /> {v.label}
              </button>
            ))}
          </div>
          <button className="adbi-chart-action-btn" onClick={toggleFullscreen} title="Plein écran">
            <i className={`fas ${fullscreen ? 'fa-compress' : 'fa-expand'}`} />
          </button>
        </div>
      </div>

      {data ? (
        isHorizontal ? (
          <div className="adbi-hbar-list">
            {data.map((d, i) => (
              <div key={i} className="adbi-hbar-item">
                <div className="adbi-hbar-label">{activeView === 'byCompany' ? d.company : activeView === 'byCity' ? d.city : d.route}</div>
                <div className="adbi-hbar-track">
                  <div
                    className="adbi-hbar-fill"
                    style={{
                      width: `${d.share}%`,
                      background: `linear-gradient(90deg, #3B82F6, #8B5CF6)`,
                    }}
                  >
                    {d.share > 15 ? `${d.share}%` : ''}
                  </div>
                </div>
                <div className="adbi-hbar-value">{d.bookings.toLocaleString('fr-FR')}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="adbi-bar-chart">
            {data.map((d, i) => {
              const pct = (d.bookings / maxValue) * 100;
              return (
                <div key={i} className="adbi-bar-item">
                  <div className="adbi-bar" style={{ height: `${Math.max(pct, 2)}%`, background: '#3B82F6' }}>
                    <span className="adbi-bar-tooltip">{d.bookings.toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="adbi-bar-label">{d.date?.slice(5) || i}</div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
          Donnée indisponible pour cette vue sur la période.
        </div>
      )}
    </div>
  );
};

export default ReservationCharts;
