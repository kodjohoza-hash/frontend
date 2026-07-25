import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

const AgencyClientGrowthChart = ({ data }) => {
  return (
    <div className="aa-chart">
      <h3 className="aa-chart__title">Évolution des clients</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="clients"
            stroke="#0d6efd"
            strokeWidth={2}
          />
          <Bar
            dataKey="newClients"
            fill="#0d6efd"
            fillOpacity={0.4}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgencyClientGrowthChart;
