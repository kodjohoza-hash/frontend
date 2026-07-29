import clsx from 'clsx';
import { folders } from '@data/messageData';

export default function AgencyMessageSidebar({ activeFolder, onSelectFolder }) {
  return (
    <div className="amsg-sidebar">
      <div className="amsg-sidebar__section">
        <div className="amsg-sidebar__section-title">Dossiers</div>
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            className={clsx('amsg-sidebar__item', { 'amsg-sidebar__item--active': activeFolder === folder.id })}
            onClick={() => onSelectFolder(folder.id)}
          >
            <i className={clsx('bi', folder.icon, 'amsg-sidebar__item-icon')} />
            <span className="amsg-sidebar__item-label">{folder.label}</span>
            {folder.count > 0 && <span className="amsg-sidebar__item-count">{folder.count}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
