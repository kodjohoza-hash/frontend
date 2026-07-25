import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AgencyRevenueChartMonthly = ({ data }) => {
  return (
    <div className="aa-chart">
      <h3 className="aa-chart__title">Revenus mensuels vs objectif</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0d6efd"
            fill="#0d6efd"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#6c757d"
            strokeDasharray="5 5"
            fill="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgencyRevenueChartMonthly;
