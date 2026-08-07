import React, { useState } from 'react';
import { topAnalytics } from '../../../data/adminReportData';

const analyticsSections = [
  { key: 'topCompanies', title: 'Top compagnies', icon: 'fa-trophy', valueLabel: 'Revenus' },
  { key: 'topCities', title: 'Top villes', icon: 'fa-city', valueLabel: 'Réservations' },
  { key: 'topRoutes', title: 'Top lignes', icon: 'fa-route', valueLabel: 'Réservations' },
  { key: 'topClients', title: 'Top voyageurs', icon: 'fa-user', valueLabel: 'Trajets' },
  { key: 'topAgents', title: 'Top agents', icon: 'fa-user-gear', valueLabel: 'Billets' },
];

const AdminAnalyticsCards = ({ filters, loading }) => {
  if (loading) {
    return (
      <div className="adbi-analytics-grid">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="adbi-skeleton" style={{ height: 240, position: 'relative', overflow: 'hidden' }}>
            <div className="adbi-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  const getRankClass = (i) => {
    if (i === 0) return 'gold';
    if (i === 1) return 'silver';
    if (i === 2) return 'bronze';
    return '';
  };

  const getItemValue = (item) => {
    if (item.revenue !== undefined) return `${(item.revenue / 1000000).toFixed(1)}M XAF`;
    if (item.bookings !== undefined) return item.bookings.toLocaleString('fr-FR');
    if (item.trips !== undefined) return `${item.trips} trajets`;
    if (item.tickets !== undefined) return `${item.tickets} billets`;
    if (item.spent !== undefined) return `${(item.spent / 1000).toFixed(0)}k XAF`;
    return '';
  };

  return (
    <div className="adbi-analytics-grid">
      {analyticsSections.map(section => {
        const data = topAnalytics[section.key] || [];
        const valueKeyMap = { revenue: 'revenue', trips: 'trips', tickets: 'tickets', bookings: 'bookings' };
        return (
          <div key={section.key} className="adbi-analytics-card">
            <div className="adbi-analytics-title">
              <i className={`fas ${section.icon}`} style={{ color: '#8B5CF6', marginRight: 8 }} />
              {section.title}
            </div>
            <div className="adbi-analytics-list">
              {data.slice(0, 5).map((item, i) => (
                <div key={i} className="adbi-analytics-item">
                  <div className={`adbi-analytics-rank ${getRankClass(i)}`}>{i + 1}</div>
                  <div className="adbi-analytics-item-name">
                    {item.name || item.company || item.city || item.route}
                  </div>
                  <div className="adbi-analytics-item-value">{getItemValue(item)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminAnalyticsCards;
