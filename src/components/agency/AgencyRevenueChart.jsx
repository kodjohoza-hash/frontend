import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AgencyRevenueChart = ({ data }) => (
  <div className="aa-chart">
    <h3 className="aa-chart__title">Évolution des ventes</h3>
    <div className="aa-chart__body">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bookings" stroke="#0B1D51" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AgencyRevenueChart;
