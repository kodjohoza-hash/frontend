import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export default function AgencyProfileCharts({ charts }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-graph-up" /> Performance</h3>
      </div>
      <div className="apro-section__body">
        <div className="apro-charts-grid">
          <div className="apro-chart-card">
            <div className="apro-chart-card__title">
              <span>Chiffre d'affaires</span>
              <span style={{fontSize:'0.75rem',color:'var(--apro-text-muted)'}}>2026</span>
            </div>
            <div className="apro-chart-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.revenue.filter(d => d.value > 0)}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B1D51" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0B1D51" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{fontSize:11}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize:11}} stroke="#94a3b8" tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v) => `${v.toLocaleString()} XAF`} />
                  <Area type="monotone" dataKey="value" stroke="#0B1D51" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="apro-chart-card">
            <div className="apro-chart-card__title">
              <span>Réservations</span>
            </div>
            <div className="apro-chart-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.bookings.filter(d => d.value > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{fontSize:11}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize:11}} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF6B35" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="apro-chart-card">
            <div className="apro-chart-card__title">
              <span>Taux d'occupation (%)</span>
            </div>
            <div className="apro-chart-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.occupancy.filter(d => d.value > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{fontSize:11}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize:11}} stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{fill:'#22c55e',r:4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="apro-chart-card">
            <div className="apro-chart-card__title">
              <span>Nouveaux clients</span>
            </div>
            <div className="apro-chart-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.clients.filter(d => d.value > 0)}>
                  <defs>
                    <linearGradient id="clGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{fontSize:11}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize:11}} stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#clGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
