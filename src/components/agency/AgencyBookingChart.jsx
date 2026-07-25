import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AgencyBookingChart = ({ data }) => (
  <div className="aa-chart">
    <h3 className="aa-chart__title">Réservations par jour</h3>
    <div className="aa-chart__body">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="reservations" fill="#FF6B35" radius={[4, 4, 0, 0]} />
          <Bar dataKey="annulations" fill="#DC3545" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AgencyBookingChart;
