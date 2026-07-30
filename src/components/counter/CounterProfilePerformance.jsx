import { useState, useMemo } from 'react';
import clsx from 'clsx';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import { formatCurrency } from '@data/counterProfileData';

const TABS = [
  { key: 'tickets', label: 'Billets vendus', icon: 'bi-ticket-perforated' },
  { key: 'bookings', label: 'Réservations', icon: 'bi-calendar-check' },
  { key: 'revenue', label: "Chiffre d'affaires", icon: 'bi-currency-exchange' },
];

const CounterProfilePerformance = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('tickets');
  const data = profile?.monthlyData || [];

  const tabMeta = useMemo(() => {
    if (!data.length) return { total: 0, avg: 0, target: 0 };

    const key = activeTab === 'tickets' ? 'tickets' : activeTab === 'bookings' ? 'reservations' : 'chiffreAffaires';
    const values = data.map((d) => d[key] || 0);
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;
    const target = profile?.objectifMensuel
      ? Math.min(Math.round((total / profile.objectifMensuel) * 100), 100)
      : 0;

    return { total, avg, target };
  }, [data, activeTab, profile]);

  const renderChart = () => {
    if (!data.length) {
      return (
        <div className="acpr-chart-empty">
          <i className="bi bi-bar-chart" />
          <span>Aucune donnée disponible</span>
        </div>
      );
    }

    const isRevenue = activeTab === 'revenue';
    const isTickets = activeTab === 'tickets';
    const dataKey = isTickets ? 'tickets' : isRevenue ? 'chiffreAffaires' : 'reservations';

    if (isTickets) {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="acprAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FF6B35" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(val) => [val.toLocaleString('fr-FR'), 'Billets']}
            />
            <Area type="monotone" dataKey={dataKey} stroke="#FF6B35" strokeWidth={2} fill="url(#acprAreaGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (isRevenue) {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(val) => [formatCurrency(val), 'CA']}
            />
            <Line type="monotone" dataKey={dataKey} stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            formatter={(val) => [val.toLocaleString('fr-FR'), 'Réservations']}
          />
          <Bar dataKey={dataKey} fill="#0B1D51" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="acpr-card">
      <div className="acpr-card-header">
        <i className="bi bi-graph-up-arrow" />
        <span>Mes performances</span>
      </div>
      <div className="acpr-perf-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={clsx('acpr-perf-tab', { 'acpr-perf-tab--active': activeTab === tab.key })}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={clsx('bi', tab.icon)} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="acpr-chart-container">
        {renderChart()}
      </div>
      <div className="acpr-perf-stats-row">
        <div className="acpr-perf-stat">
          <span className="acpr-perf-stat-label">Total</span>
          <span className="acpr-perf-stat-value">
            {activeTab === 'revenue' ? formatCurrency(tabMeta.total) : tabMeta.total.toLocaleString('fr-FR')}
          </span>
        </div>
        <div className="acpr-perf-stat">
          <span className="acpr-perf-stat-label">Moyenne</span>
          <span className="acpr-perf-stat-value">
            {activeTab === 'revenue' ? formatCurrency(tabMeta.avg) : tabMeta.avg.toFixed(1)}
          </span>
        </div>
        <div className="acpr-perf-stat">
          <span className="acpr-perf-stat-label">Objectif</span>
          <span className="acpr-perf-stat-value">
            <span style={{ color: tabMeta.target >= 80 ? '#10B981' : '#F59E0B' }}>
              {tabMeta.target}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CounterProfilePerformance;
