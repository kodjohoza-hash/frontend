import React from 'react';
import { formatCurrency, commissionChartData } from '../../../data/adminCommissionData';

const barColors = ['#059669', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#0F172A'];

export default function AdminCommissionCharts() {
  if (!commissionChartData) return null;
  const maxMonthly = Math.max(...commissionChartData.monthly.map(d => d.commissions));
  const maxCompany = Math.max(...commissionChartData.byCompany.map(d => d.commissions));
  return (
    <div className="adcm-charts-grid">
      {/* Monthly trend */}
      <div className="adcm-chart-card">
        <h3><i className="fa-solid fa-chart-line" /> Monthly Commission Trend</h3>
        {commissionChartData.monthly.map((d, i) => (
          <div className="adcm-chart-bar" key={d.month}>
            <span className="adcm-chart-bar-label">{d.month}</span>
            <div className="adcm-chart-bar-track">
              <div className="adcm-chart-bar-fill" style={{ width: `${(d.commissions / maxMonthly) * 100}%`, background: barColors[i % barColors.length] }}>
                {d.commissions > maxMonthly * 0.15 ? formatCurrency(d.commissions) : ''}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* By company */}
      <div className="adcm-chart-card">
        <h3><i className="fa-solid fa-building" /> Commissions by Company</h3>
        {commissionChartData.byCompany.map((d, i) => (
          <div className="adcm-chart-bar" key={d.company}>
            <span className="adcm-chart-bar-label">{d.company}</span>
            <div className="adcm-chart-bar-track">
              <div className="adcm-chart-bar-fill" style={{ width: `${(d.commissions / maxCompany) * 100}%`, background: barColors[i % barColors.length] }}>
                {d.commissions > maxCompany * 0.15 ? formatCurrency(d.commissions) : ''}
              </div>
            </div>
            <span className="adcm-chart-bar-value">{d.share}%</span>
          </div>
        ))}
      </div>

      {/* By type (pie alternative — horizontal bars) */}
      <div className="adcm-chart-card">
        <h3><i className="fa-solid fa-chart-pie" /> Commission Type Distribution</h3>
        {commissionChartData.byType.map((d, i) => (
          <div className="adcm-chart-bar" key={d.type}>
            <span className="adcm-chart-bar-label">{d.type}</span>
            <div className="adcm-chart-bar-track">
              <div className="adcm-chart-bar-fill" style={{ width: `${d.value}%`, background: barColors[i % barColors.length] }}>
                {d.value > 10 ? `${d.value}%` : ''}
              </div>
            </div>
            <span className="adcm-chart-bar-value">{formatCurrency(d.amount)}</span>
          </div>
        ))}
        <div className="adcm-chart-legend">
          {commissionChartData.byType.map((d, i) => (
            <div className="adcm-chart-legend-item" key={d.type}>
              <div className="adcm-chart-legend-dot" style={{ background: barColors[i % barColors.length] }} />
              {d.type} ({d.value}%)
            </div>
          ))}
        </div>
      </div>

      {/* Daily mini chart */}
      <div className="adcm-chart-card">
        <h3><i className="fa-solid fa-calendar-day" /> Daily Commissions (Last 15 days)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 120, padding: '0.5rem 0' }}>
          {commissionChartData.daily.map((d, i) => {
            const max = Math.max(...commissionChartData.daily.map(x => x.commissions));
            const h = (d.commissions / max) * 100;
            return (
              <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }} title={`${d.date}: ${formatCurrency(d.commissions)}`}>
                <div style={{ width: '100%', height: `${h}%`, background: barColors[i % barColors.length], borderRadius: '4px 4px 0 0', minHeight: 4, transition: 'height 0.5s' }} />
                <span style={{ fontSize: '0.5rem', color: '#94A3B8', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>{d.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
