import clsx from 'clsx';
import { CLIENT_STATUSES, CLIENT_STATUS_LABELS, CITIES } from '@data/clientData';

export default function AgencyClientFilters({ filters, onFilterChange, onReset, onToggleAdvanced, showAdvanced }) {
  const handle = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => {
    if (k === 'isVip') return v;
    return v !== '' && v != null;
  }).length;

  return (
    <div className="ac-filters">
      <div className="ac-filters__row">
        <div className="ac-filters__search">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={filters.search}
            onChange={(e) => handle('search', e.target.value)}
            className="ac-filters__input"
          />
          {filters.search && (
            <button className="ac-filters__clear" onClick={() => handle('search', '')}>
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>
      </div>

      <div className="ac-filters__row">
        <select className="ac-filters__select" value={filters.city} onChange={(e) => handle('city', e.target.value)}>
          <option value="">Toutes les villes</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="ac-filters__select" value={filters.status} onChange={(e) => handle('status', e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(CLIENT_STATUSES).map(([key, val]) => (
            <option key={key} value={val}>{CLIENT_STATUS_LABELS[val]}</option>
          ))}
        </select>

        <label className="ac-filters__checkbox">
          <input type="checkbox" checked={!!filters.isVip} onChange={(e) => handle('isVip', e.target.checked)} />
          <span>VIP</span>
        </label>

        <button className={clsx('ac-filters__toggle', { 'ac-filters__toggle--active': showAdvanced })} onClick={onToggleAdvanced} type="button">
          <i className="bi bi-sliders2" />
          <span>Avancé</span>
          <i className={clsx('bi', showAdvanced ? 'bi-chevron-up' : 'bi-chevron-down')} />
        </button>

        {activeCount > 0 && (
          <button className="ac-filters__reset" onClick={onReset} type="button">
            <i className="bi bi-arrow-counterclockwise" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="ac-filters__advanced">
          <div className="ac-filters__grid">
            <div className="ac-filters__field">
              <label>Prénom</label>
              <input type="text" value={filters.firstName} onChange={(e) => handle('firstName', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Nom</label>
              <input type="text" value={filters.lastName} onChange={(e) => handle('lastName', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Téléphone</label>
              <input type="text" value={filters.phone} onChange={(e) => handle('phone', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Email</label>
              <input type="text" value={filters.email} onChange={(e) => handle('email', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Voyages min</label>
              <input type="number" min="0" value={filters.tripsMin} onChange={(e) => handle('tripsMin', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Voyages max</label>
              <input type="number" min="0" value={filters.tripsMax} onChange={(e) => handle('tripsMax', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Inscrit du</label>
              <input type="date" value={filters.registeredFrom} onChange={(e) => handle('registeredFrom', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Inscrit au</label>
              <input type="date" value={filters.registeredTo} onChange={(e) => handle('registeredTo', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Dernière réservation du</label>
              <input type="date" value={filters.lastBookingFrom} onChange={(e) => handle('lastBookingFrom', e.target.value)} />
            </div>
            <div className="ac-filters__field">
              <label>Dernière réservation au</label>
              <input type="date" value={filters.lastBookingTo} onChange={(e) => handle('lastBookingTo', e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
