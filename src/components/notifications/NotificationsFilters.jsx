import clsx from 'clsx';
import { filterCategories } from '@data/notificationsData';

const NotificationsFilters = ({ activeFilter, onFilterChange, dateFilter, onDateChange, priorityFilter, onPriorityChange }) => {
  return (
    <div className="nf-filters">
      <div className="nf-filters__tabs">
        {filterCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={clsx('nf-filters__tab', activeFilter === cat.id && 'nf-filters__tab--active')}
            onClick={() => onFilterChange(cat.id)}
          >
            <i className={clsx('bi', cat.icon, 'nf-filters__tab-icon')} />
            <span className="nf-filters__tab-label">{cat.label}</span>
          </button>
        ))}
      </div>
      <div className="nf-filters__selects">
        <select
          className="nf-filters__select"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
        >
          <option value="all">Toutes les dates</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
        </select>
        <select
          className="nf-filters__select"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="all">Toutes priorités</option>
          <option value="high">Haute</option>
          <option value="medium">Moyenne</option>
          <option value="low">Basse</option>
        </select>
      </div>
    </div>
  );
};

export default NotificationsFilters;
