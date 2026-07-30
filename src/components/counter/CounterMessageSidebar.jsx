import { useState } from 'react';
import clsx from 'clsx';
import { currentUser } from '@data/counterMessageData';

const FOLDER_ICONS = {
  inbox: 'bi-inbox',
  unread: 'bi-envelope-open',
  important: 'bi-star',
  archived: 'bi-archive',
  sent: 'bi-send',
  spam: 'bi-exclamation-triangle',
  drafts: 'bi-pencil',
  trash: 'bi-trash',
};

const CounterMessageSidebar = ({ folders, activeFolder, onFolderChange, unreadCounts }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = currentUser.name
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <button
        type="button"
        className="acm-sidebar-toggle d-lg-none"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Ouvrir la sidebar"
      >
        <i className="bi bi-list" />
      </button>
      <aside className={clsx('acm-sidebar', mobileOpen && 'acm-sidebar--open')}>
        <div className="acm-sidebar__header">
          <i className="bi bi-chat-square-dots acm-sidebar__header-icon" />
          <span className="acm-sidebar__header-title">Messagerie</span>
        </div>
        <nav className="acm-sidebar__nav">
          {folders.map((folder) => {
            const count = unreadCounts?.[folder.id] || 0;
            return (
              <button
                key={folder.id}
                type="button"
                className={clsx('acm-sidebar__item', activeFolder === folder.id && 'acm-sidebar__item--active')}
                onClick={() => {
                  onFolderChange(folder.id);
                  setMobileOpen(false);
                }}
              >
                <i className={clsx('bi acm-sidebar__item-icon', FOLDER_ICONS[folder.id] || 'bi-folder')} />
                <span className="acm-sidebar__item-label">{folder.label}</span>
                {count > 0 && <span className="acm-sidebar__item-badge">{count > 99 ? '99+' : count}</span>}
              </button>
            );
          })}
        </nav>
        <div className="acm-sidebar__user">
          <div className="acm-sidebar__user-avatar">{initials}</div>
          <div className="acm-sidebar__user-info">
            <span className="acm-sidebar__user-name">{currentUser.name}</span>
            <span className="acm-sidebar__user-role">{currentUser.role}</span>
          </div>
          <span className={clsx('acm-sidebar__user-status', `acm-sidebar__user-status--${currentUser.status}`)} />
        </div>
      </aside>
      {mobileOpen && <div className="acm-sidebar-overlay d-lg-none" onClick={() => setMobileOpen(false)} />}
    </>
  );
};

export default CounterMessageSidebar;
