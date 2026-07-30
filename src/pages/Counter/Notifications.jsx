import { useState, useCallback, useEffect } from 'react';
import CounterNotificationStats from '@components/counter/CounterNotificationStats';
import CounterNotificationFilters from '@components/counter/CounterNotificationFilters';
import CounterNotificationList from '@components/counter/CounterNotificationList';
import CounterNotificationDetails from '@components/counter/CounterNotificationDetails';
import CounterNotificationSkeleton from '@components/counter/CounterNotificationSkeleton';
import {
  notificationStats,
  notificationFilterOptions,
  notifications as allNotifications,
  quickFilters,
  filterNotifications,
  sortNotifications,
} from '@data/counterNotificationData';

const CounterNotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(allNotifications);
      setFiltered(allNotifications);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = filterNotifications(notifications, { ...filters, quickFilter: activeQuickFilter });
    result = sortNotifications(result, sortBy);
    setFiltered(result);
    setPage(1);
  }, [notifications, filters, sortBy, activeQuickFilter]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setActiveQuickFilter(null);
  }, []);

  const handleQuickFilter = useCallback((id) => {
    setActiveQuickFilter((prev) => prev === id ? null : id);
    setFilters({});
  }, []);

  const updateNotification = useCallback((id, updater) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? updater(n) : n));
  }, []);

  const handleAction = useCallback((action, notification) => {
    const now = new Date().toISOString();
    switch (action) {
      case 'view':
        setSelectedId(notification.id);
        setShowDetail(true);
        if (notification.status === 'unread') {
          updateNotification(notification.id, (n) => ({
            ...n, status: 'read', readAt: now,
            history: [...n.history, { action: 'Lue', date: now }],
          }));
        }
        break;
      case 'mark_read':
        updateNotification(notification.id, (n) => ({
          ...n, status: 'read', readAt: now,
          history: [...n.history, { action: 'Lue', date: now }],
        }));
        addToast('Marquée comme lue', 'info');
        break;
      case 'mark_unread':
        updateNotification(notification.id, (n) => ({
          ...n, status: 'unread', readAt: null,
          history: [...n.history, { action: 'Marquée non lue', date: now }],
        }));
        addToast('Marquée comme non lue', 'info');
        break;
      case 'pin':
        updateNotification(notification.id, (n) => ({
          ...n, pinned: true,
          history: [...n.history, { action: 'Épinglée', date: now }],
        }));
        addToast('Notification épinglée');
        break;
      case 'unpin':
        updateNotification(notification.id, (n) => ({
          ...n, pinned: false,
          history: [...n.history, { action: 'Désépinglée', date: now }],
        }));
        addToast('Notification désépinglée', 'info');
        break;
      case 'archive':
        updateNotification(notification.id, (n) => ({
          ...n, status: 'archived',
          history: [...n.history, { action: 'Archivée', date: now }],
        }));
        addToast('Notification archivée', 'info');
        if (showDetail) setShowDetail(false);
        break;
      case 'delete':
        setShowDeleteConfirm(notification);
        if (showDetail) setShowDetail(false);
        break;
      case 'share':
        addToast('Lien copié dans le presse-papier', 'info');
        break;
      case 'copy_link':
        navigator.clipboard?.writeText?.(`${window.location.origin}/counter/notifications/${notification.id}`);
        addToast('Lien copié', 'info');
        break;
      case 'comment':
        break;
      default: break;
    }
  }, [updateNotification, addToast, showDetail]);

  const handleDeleteConfirm = useCallback(() => {
    if (!showDeleteConfirm) return;
    updateNotification(showDeleteConfirm.id, (n) => ({
      ...n, status: 'deleted',
      history: [...n.history, { action: 'Supprimée', date: new Date().toISOString() }],
    }));
    setShowDeleteConfirm(null);
    addToast('Notification supprimée');
  }, [showDeleteConfirm, updateNotification, addToast]);

  const handleMarkAllRead = useCallback(() => {
    const now = new Date().toISOString();
    setNotifications((prev) => prev.map((n) =>
      n.status === 'unread' ? { ...n, status: 'read', readAt: now, history: [...n.history, { action: 'Lue', date: now }] } : n
    ));
    addToast('Toutes marquées comme lues', 'info');
  }, [addToast]);

  const handleAddComment = useCallback((notificationId, text) => {
    const now = new Date().toISOString();
    updateNotification(notificationId, (n) => ({
      ...n,
      comments: [...(n.comments || []), { id: `cmt-${Date.now()}`, author: 'Moi', text, date: now }],
    }));
    addToast('Commentaire ajouté');
  }, [updateNotification, addToast]);

  const selectedNotification = notifications.find((n) => n.id === selectedId);

  return (
    <div className="acn-wrapper">
      <div className="acn-header">
        <div className="acn-header-left">
          <h1 className="acn-title">Centre de notifications</h1>
          <p className="acn-subtitle">
            Consultez et gérez toutes les notifications du point de vente
          </p>
        </div>
        <div className="acn-header-actions">
          <button className="acn-btn acn-btn-secondary" onClick={handleMarkAllRead}>
            <i className="bi bi-check2-all" /> Tout marquer comme lu
          </button>
          <button className="acn-btn acn-btn-primary">
            <i className="bi bi-bell" />
            {notifications.filter((n) => n.status === 'unread').length > 0 && (
              <span className="acn-btn-badge">{notifications.filter((n) => n.status === 'unread').length}</span>
            )}
          </button>
        </div>
      </div>

      {loading && <CounterNotificationSkeleton />}

      {!loading && (
        <>
          <CounterNotificationStats stats={notificationStats} />

          <CounterNotificationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            options={notificationFilterOptions}
            quickFilters={quickFilters}
            activeQuickFilter={activeQuickFilter}
            onQuickFilter={handleQuickFilter}
          />

          <div className="acn-results">
            <div className="acn-results-count">
              <strong>{filtered.length}</strong> notification{filtered.length > 1 ? 's' : ''}
              {(activeQuickFilter || Object.values(filters).some(Boolean)) && (
                <span className="acn-results-filter-label">
                  {' '}· filtré{filtered.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <select className="acn-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {notificationFilterOptions.sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <CounterNotificationList
            notifications={filtered}
            onAction={handleAction}
            onSelect={(id) => {
              const n = notifications.find((x) => x.id === id);
              if (n) handleAction('view', n);
            }}
            selectedId={selectedId}
            page={page}
            onPageChange={setPage}
          />
        </>
      )}

      {showDetail && selectedNotification && (
        <CounterNotificationDetails
          notification={selectedNotification}
          onClose={() => { setShowDetail(false); setSelectedId(null); }}
          onAction={(action, notif) => {
            if (action === 'comment') {
              return;
            }
            handleAction(action, notif);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="acn-confirm-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="acn-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="acn-confirm-icon"><i className="bi bi-exclamation-triangle" /></div>
            <div className="acn-confirm-title">Supprimer la notification</div>
            <div className="acn-confirm-text">
              Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.
            </div>
            <div className="acn-confirm-actions">
              <button className="acn-btn acn-btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                Annuler
              </button>
              <button className="acn-btn acn-btn-danger" onClick={handleDeleteConfirm}>
                <i className="bi bi-trash3" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {toasts.length > 0 && (
        <div className="acn-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`acn-toast acn-toast-${toast.type}`}>
              <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'} acn-toast-icon`} />
              {toast.message}
              <button className="acn-toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounterNotificationsPage;
