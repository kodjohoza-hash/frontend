import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatCurrency } from './companyHelpers';

const AdminCompanyCharts = ({ chartData }) => {
  if (!chartData) return null;
  const { monthlyBookings, userGrowth } = chartData;
  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#EC4899'];
  return (
    <div className="admc-charts-grid">
      <div className="admc-chart-card">
        <h3><i className="bi bi-bar-chart" style={{ color: 'var(--adm-accent)' }} /> Réservations mensuelles</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyBookings}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="bookings" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Réservations" />
            <Bar dataKey="tickets" fill="#10B981" radius={[4, 4, 0, 0]} name="Billets" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="admc-chart-card">
        <h3><i className="bi bi-people" style={{ color: '#10B981' }} /> Croissance utilisateurs</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="admins" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Administrateurs" />
            <Area type="monotone" dataKey="agents" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Agents" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="admc-chart-card">
        <h3><i className="bi bi-cash-coin" style={{ color: '#F59E0B' }} /> Revenus mensuels</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyBookings}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} formatter={(v) => formatCurrency(v)} />
            <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 4 }} name="Revenus" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="admc-chart-card">
        <h3><i className="bi bi-pie-chart" style={{ color: '#3B82F6' }} /> Répartition des abonnements</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={[
              { name: 'Premium', value: 6, color: '#8B5CF6' },
              { name: 'Standard', value: 18, color: '#E5E7EB' },
            ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
              {[0, 1].map((i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default AdminCompanyCharts;
