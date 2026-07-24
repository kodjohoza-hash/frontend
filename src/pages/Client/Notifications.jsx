import { useState, useMemo, Suspense } from 'react';
import DashboardLayout from '@components/client/DashboardLayout';
import {
  NotificationsHeader,
  NotificationsStats,
  NotificationsSearch,
  NotificationsFilters,
  NotificationCard,
  NotificationDrawer,
  NotificationEmptyState,
  NotificationSkeleton,
} from '@components/notifications';
import { notifications as mockNotifications } from '@data/notificationsData';
import '@assets/styles/notifications.css';

const NotificationsPage = () => {
  const [allNotifications, setAllNotifications] = useState(mockNotifications);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [drawerNotification, setDrawerNotification] = useState(null);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      total: allNotifications.length,
      unread: allNotifications.filter((n) => !n.read).length,
      today: allNotifications.filter((n) => new Date(n.date) >= today).length,
      week: allNotifications.filter((n) => new Date(n.date) >= weekAgo).length,
    };
  }, [allNotifications]);

  const filtered = useMemo(() => {
    let result = allNotifications;

    if (activeFilter === 'unread') {
      result = result.filter((n) => !n.read);
    } else if (activeFilter !== 'all') {
      result = result.filter((n) => n.category === activeFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (dateFilter === 'today') {
        result = result.filter((n) => new Date(n.date) >= today);
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        result = result.filter((n) => new Date(n.date) >= weekAgo);
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        result = result.filter((n) => new Date(n.date) >= monthAgo);
      }
    }

    if (priorityFilter !== 'all') {
      result = result.filter((n) => n.priority === priorityFilter);
    }

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
  }, [allNotifications, activeFilter, dateFilter, priorityFilter, search]);

  const handleMarkAllRead = () => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteRead = () => {
    setAllNotifications((prev) => prev.filter((n) => !n.read));
  };

  const handleMarkRead = (id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id) => {
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));
    if (drawerNotification?.id === id) {
      setDrawerNotification(null);
    }
  };

  const handleOpenDrawer = (notification) => {
    setDrawerNotification(notification);
  };

  return (
    <DashboardLayout>
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
        <NotificationEmptyState isFiltered={activeFilter !== 'all' || search.trim() !== ''} />
      ) : (
        <div className="nf-list">
          {filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onOpen={handleOpenDrawer}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {drawerNotification && (
        <NotificationDrawer
          notification={drawerNotification}
          onClose={() => setDrawerNotification(null)}
          onMarkRead={handleMarkRead}
        />
      )}
    </DashboardLayout>
  );
};

const Notifications = () => (
  <Suspense fallback={<NotificationSkeleton />}>
    <NotificationsPage />
  </Suspense>
);

export default Notifications;
