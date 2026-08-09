import { useMemo, useState } from 'react';
import {
  NotificationsHeader,
  NotificationsStats,
  NotificationsSearch,
  NotificationsFilters,
  NotificationCard,
  NotificationDrawer,
  NotificationEmptyState,
  NotificationSkeleton,
  NotificationsPagination,
} from '@components/notifications';
import { ROUTES } from '@routes/routeConstants';
import { useNotificationStore } from '@store';
import '@assets/styles/notifications.css';

const AgencyNotificationsPage = () => {
  const store = useNotificationStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [drawerNotification, setDrawerNotification] = useState(null);

  const { items, total, unread, page, totalPages, loading, error } = store;

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return {
      total,
      unread,
      today: items.filter((n) => n.date && new Date(n.date) >= today).length,
      week: items.filter((n) => n.date && new Date(n.date) >= weekAgo).length,
    };
  }, [items, total, unread]);

  const filtered = useMemo(() => {
    let result = items;
    if (activeFilter === 'unread') result = result.filter((n) => !n.read);
    else if (activeFilter !== 'all') result = result.filter((n) => n.category === activeFilter);
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (dateFilter === 'today') result = result.filter((n) => n.date && new Date(n.date) >= today);
      else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        result = result.filter((n) => n.date && new Date(n.date) >= weekAgo);
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        result = result.filter((n) => n.date && new Date(n.date) >= monthAgo);
      }
    }
    if (priorityFilter !== 'all') result = result.filter((n) => n.priority === priorityFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          (n.company && n.company.toLowerCase().includes(q)) ||
          (n.bookingRef && n.bookingRef.toLowerCase().includes(q))
      );
    }
    return result;
  }, [items, activeFilter, dateFilter, priorityFilter, search]);

  const handleMarkAllRead = () => store.markAllRead();
  const handleDeleteRead = () => store.removeRead();
  const handleMarkRead = (id) => store.markRead(id);
  const handleDelete = (id) => {
    store.remove(id);
    if (drawerNotification?.id === id) setDrawerNotification(null);
  };

  if (loading && items.length === 0) return <NotificationSkeleton />;

  if (error && items.length === 0) {
    return (
      <div className="nf-error">
        <div className="nf-error__visual">
          <i className="bi bi-cloud-slash" />
        </div>
        <h3 className="nf-error__title">Impossible de charger les notifications</h3>
        <p className="nf-error__text">{error}</p>
        <button type="button" className="nf-btn nf-btn--primary" onClick={() => store.fetchPage(1)}>
          <i className="bi bi-arrow-clockwise" />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <NotificationsHeader
        unreadCount={stats.unread}
        totalCount={stats.total}
        onMarkAllRead={handleMarkAllRead}
        onDeleteRead={handleDeleteRead}
      />
      <NotificationsStats stats={stats} />
      <NotificationsSearch value={search} onChange={setSearch} />
      <NotificationsFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />
      {filtered.length === 0 ? (
        <NotificationEmptyState
          isFiltered={activeFilter !== 'all' || search.trim() !== ''}
          dashboardPath={ROUTES.COMPANY_DASHBOARD}
        />
      ) : (
        <div className="nf-list">
          {filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onOpen={setDrawerNotification}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <NotificationsPagination page={page} totalPages={totalPages} onPageChange={store.fetchPage} />
      {drawerNotification && (
        <NotificationDrawer
          notification={drawerNotification}
          onClose={() => setDrawerNotification(null)}
          onMarkRead={handleMarkRead}
        />
      )}
    </>
  );
};

export default AgencyNotificationsPage;
