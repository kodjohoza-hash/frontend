import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const renderLabel = ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`;

const AgencyPaymentChart = ({ data }) => (
  <div className="aa-chart">
    <h3 className="aa-chart__title">Répartition des paiements</h3>
    <div className="aa-chart__body">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AgencyPaymentChart;
