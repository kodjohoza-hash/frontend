import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="aa-chart__tooltip">
      <p className="aa-chart__tooltip-label">{d.city}</p>
      <p className="aa-chart__tooltip-value">{d.reservations} réservations</p>
      <p className="aa-chart__tooltip-sub">{d.revenue.toLocaleString()} XAF</p>
    </div>
  );
};

const AgencyCityChart = ({ data }) => {
  return (
    <div className="aa-chart">
      <div className="aa-chart__header">
        <h3 className="aa-chart__title">
          <i className="bi bi-geo-alt" />
          Réservations par ville
        </h3>
      </div>
      <div className="aa-chart__body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="city" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="reservations" fill="var(--aa-accent, #6366f1)" radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgencyCityChart;
