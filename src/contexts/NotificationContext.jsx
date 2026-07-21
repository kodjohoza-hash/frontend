import { createContext, useState, useCallback, useMemo } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (notification) => {
      const id = Date.now();
      const newNotification = { id, ...notification, createdAt: new Date() };
      setNotifications((prev) => [newNotification, ...prev]);

      if (notification.duration !== 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, notification.duration || 5000);
      }

      return id;
    },
    []
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback(
    (message, options = {}) => {
      return addNotification({ type: 'success', message, ...options });
    },
    [addNotification]
  );

  const error = useCallback(
    (message, options = {}) => {
      return addNotification({ type: 'danger', message, ...options });
    },
    [addNotification]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return addNotification({ type: 'warning', message, ...options });
    },
    [addNotification]
  );

  const info = useCallback(
    (message, options = {}) => {
      return addNotification({ type: 'info', message, ...options });
    },
    [addNotification]
  );

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      success,
      error,
      warning,
      info,
    }),
    [notifications, addNotification, removeNotification, clearNotifications, success, error, warning, info]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationContext;
