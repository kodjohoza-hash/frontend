import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import { chartData } from '@data/adminData';

const formatFCFA = (v) => `${(v / 1000000).toFixed(1)}M`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: 12 }}>
      <p style={{ fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: 0 }}>{p.name}: {p.value.toLocaleString('fr-FR')}</p>
      ))}
    </div>
  );
};

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: 12 }}>
      <p style={{ fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: 0 }}>
          {p.name}: {formatFCFA(p.value)} FCFA
        </p>
      ))}
    </div>
  );
};

const COLORS = ['#6366F1', '#FF6B35', '#10B981', '#8B5CF6'];

const AdminCharts = () => {
  const [revenueTab, setRevenueTab] = useState('revenue');

  return (
    <>
      <div className="adm-charts-grid">
        <div className="adm-chart-card">
          <div className="adm-chart-card__header">
            <div>
              <div className="adm-chart-card__title">Évolution des inscriptions</div>
              <div className="adm-chart-card__subtitle">Clients, compagnies et agents · 2026</div>
            </div>
          </div>
          <div className="adm-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.signups} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="clients" name="Clients" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="companies" name="Compagnies" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="agents" name="Agents" fill="#FF6B35" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="adm-chart-card">
          <div className="adm-chart-card__header">
            <div>
              <div className="adm-chart-card__title">Répartition utilisateurs</div>
              <div className="adm-chart-card__subtitle">Par type de compte</div>
            </div>
          </div>
          <div className="adm-chart-wrapper--donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.userDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="adm-charts-bottom">
        <div className="adm-chart-card">
          <div className="adm-chart-card__header">
            <div>
              <div className="adm-chart-card__title">Revenus & Commissions</div>
              <div className="adm-chart-card__subtitle">Évolution mensuelle</div>
            </div>
            <div className="adm-chart-card__tabs">
              <button
                className={`adm-chart-card__tab ${revenueTab === 'revenue' ? 'adm-chart-card__tab--active' : ''}`}
                onClick={() => setRevenueTab('revenue')}
              >
                Revenus
              </button>
              <button
                className={`adm-chart-card__tab ${revenueTab === 'commission' ? 'adm-chart-card__tab--active' : ''}`}
                onClick={() => setRevenueTab('commission')}
              >
                Commissions
              </button>
            </div>
          </div>
          <div className="adm-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.revenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={formatFCFA} />
                <Tooltip content={<RevenueTooltip />} />
                {revenueTab === 'revenue' ? (
                  <Area type="monotone" dataKey="revenue" name="Revenus" stroke="#6366F1" strokeWidth={2} fill="url(#revGrad)" />
                ) : (
                  <Area type="monotone" dataKey="commission" name="Commissions" stroke="#10B981" strokeWidth={2} fill="url(#commGrad)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="adm-chart-card">
          <div className="adm-chart-card__header">
            <div>
              <div className="adm-chart-card__title">Réservations par jour</div>
              <div className="adm-chart-card__subtitle">Cette semaine</div>
            </div>
          </div>
          <div className="adm-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.bookingsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="bookings" name="Réservations" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCharts;
