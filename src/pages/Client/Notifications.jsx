import { useState, useMemo, useCallback, Suspense } from 'react';
import DbSidebar from '@components/client/DbSidebar';
import DbHeader from '@components/client/DbHeader';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState(mockNotifications);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [drawerNotification, setDrawerNotification] = useState(null);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

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

  const handleMarkAllRead = useCallback(() => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleDeleteRead = useCallback(() => {
    setAllNotifications((prev) => prev.filter((n) => !n.read));
  }, []);

  const handleMarkRead = useCallback((id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleDelete = useCallback((id) => {
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));
    if (drawerNotification?.id === id) {
      setDrawerNotification(null);
    }
  }, [drawerNotification]);

  const handleOpenDrawer = useCallback((notification) => {
    setDrawerNotification(notification);
  }, []);

  return (
    <div className="db-layout">
      <DbSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`db-layout__main ${sidebarCollapsed ? 'db-layout__main--collapsed' : ''}`}>
        <DbHeader onToggleSidebar={toggleSidebar} />
        <main className="db-layout__content nf-page">
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
        </main>
      </div>

      {drawerNotification && (
        <NotificationDrawer
          notification={drawerNotification}
          onClose={() => setDrawerNotification(null)}
          onMarkRead={handleMarkRead}
        />
      )}
    </div>
  );
};

const Notifications = () => (
  <Suspense fallback={<NotificationSkeleton />}>
    <NotificationsPage />
  </Suspense>
);

export default Notifications;
