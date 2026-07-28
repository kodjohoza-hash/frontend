import { useState, useMemo, useCallback } from 'react';
import { notificationStats, mockNotifications, notificationCategories, notificationDetailExample, notificationFilters as defaultFilters } from '@data/notificationData';
import AgencyNotificationStats from '@components/agency/AgencyNotificationStats';
import AgencyNotificationFilters from '@components/agency/AgencyNotificationFilters';
import AgencyNotificationList from '@components/agency/AgencyNotificationList';
import AgencyNotificationCard from '@components/agency/AgencyNotificationCard';
import AgencyNotificationDetails from '@components/agency/AgencyNotificationDetails';
import AgencyNotificationSkeleton from '@components/agency/AgencyNotificationSkeleton';

const PAGE_SIZE = 10;

export default function AgencyNotifications() {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const filtered = useMemo(() => {
    return mockNotifications.filter((n) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!n.title.toLowerCase().includes(q) && !n.description.toLowerCase().includes(q)) return false;
      }
      if (filters.category && n.category !== filters.category) return false;
      if (filters.priority && n.priority !== filters.priority) return false;
      if (filters.status && n.status !== filters.status) return false;
      if (filters.branch && n.branch !== filters.branch) return false;
      if (filters.agent && n.agent !== filters.agent) return false;
      if (filters.trip && n.trip !== filters.trip) return false;
      if (filters.dateFrom && new Date(n.date) < new Date(filters.dateFrom)) return false;
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleAction = useCallback((actionId, notif) => {
    if (actionId === 'view') {
      setSelectedNotif({ ...notificationDetailExample, ...notif });
    } else if (actionId === 'delete') {
      if (window.confirm(`Supprimer la notification "${notif.title}" ?`)) {
        console.log('Deleted:', notif.id);
      }
    } else if (actionId === 'mark_read' || actionId === 'mark_unread') {
      console.log(`${actionId}:`, notif.id);
    } else if (actionId === 'pin') {
      console.log('Pin toggled:', notif.id);
    } else if (actionId === 'archive') {
      console.log('Archived:', notif.id);
    } else if (actionId === 'share') {
      console.log('Share:', notif.id);
    } else if (actionId === 'copy_link') {
      navigator.clipboard?.writeText?.(`${window.location.origin}/agency/notifications/${notif.id}`);
    }
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  }, []);

  if (loading) return <AgencyNotificationSkeleton />;

  if (selectedNotif) {
    return (
      <div className="anot-page">
        <AgencyNotificationDetails
          notification={selectedNotif}
          onAction={(actionId) => handleAction(actionId, selectedNotif)}
          onBack={() => setSelectedNotif(null)}
        />
      </div>
    );
  }

  return (
    <div className="anot-page">
      <div className="anot-page__header">
        <div className="anot-page__title-group">
          <h1 className="anot-page__title">
            <i className="bi bi-bell" />
            Centre de notifications
          </h1>
          <span className="anot-page__subtitle">
            {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <AgencyNotificationStats stats={notificationStats} />

      <AgencyNotificationFilters
        categories={notificationCategories}
        filters={filters}
        onFilterChange={handleFilterChange}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced((p) => !p)}
        onReset={handleReset}
      />

      {/* Mobile cards */}
      <div style={{ display: 'none' }} className="anot-mobile-container">
        {paginated.map((n) => (
          <AgencyNotificationCard key={n.id} notification={n} onAction={handleAction} />
        ))}
      </div>

      <AgencyNotificationList
        notifications={paginated}
        onAction={handleAction}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={filtered.length}
      />
    </div>
  );
}
