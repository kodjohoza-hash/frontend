import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const getOccupancyColor = (value) => {
  if (value >= 80) return '#22c55e';
  if (value >= 50) return '#f59e0b';
  return '#ef4444';
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="aa-chart__tooltip">
      <p className="aa-chart__tooltip-label">{d.bus}</p>
      <p className="aa-chart__tooltip-value">{d.occupancy}%</p>
      <p className="aa-chart__tooltip-sub">{d.occupied}/{d.seats} places occupées</p>
    </div>
  );
};

const AgencyOccupancyChart = ({ data }) => {
  return (
    <div className="aa-chart">
      <div className="aa-chart__header">
        <h3 className="aa-chart__title">
          <i className="bi bi-bar-chart-line" />
          Occupation des bus
        </h3>
      </div>
      <div className="aa-chart__body">
        <ResponsiveContainer width="100%" height={data.length * 50 + 20}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="bus" tick={{ fontSize: 13 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="occupancy" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getOccupancyColor(entry.occupancy)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgencyOccupancyChart;
