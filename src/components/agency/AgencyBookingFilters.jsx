import clsx from 'clsx';
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  BOOKING_CHANNELS,
  BOOKING_CHANNEL_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from '@data/bookingData';

export default function AgencyBookingFilters({ filters, onFilterChange, onReset, onToggleAdvanced, showAdvanced }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="abr-filters">
      <div className="abr-filters__row">
        <div className="abr-filters__search">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Rechercher par n°, client, téléphone..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="abr-filters__input"
          />
          {filters.search && (
            <button className="abr-filters__clear" onClick={() => handleChange('search', '')}>
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>
      </div>

      <div className="abr-filters__row">
        <div className="abr-filters__group">
          <select
            className="abr-filters__select"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tous les statuts</option>
            {Object.values(BOOKING_STATUSES).map((s) => (
              <option key={s} value={s}>{BOOKING_STATUS_LABELS[s]}</option>
            ))}
          </select>
          <select
            className="abr-filters__select"
            value={filters.channel}
            onChange={(e) => handleChange('channel', e.target.value)}
          >
            <option value="">Tous les canaux</option>
            {Object.values(BOOKING_CHANNELS).map((c) => (
              <option key={c} value={c}>{BOOKING_CHANNEL_LABELS[c]}</option>
            ))}
          </select>
          <select
            className="abr-filters__select"
            value={filters.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
          >
            <option value="">Tous les paiements</option>
            {Object.values(PAYMENT_METHODS).map((m) => (
              <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
            ))}
          </select>
        </div>

        <div className="abr-filters__group">
          <label className="abr-filters__label">Du</label>
          <input
            type="date"
            className="abr-filters__date"
            value={filters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
          />
          <label className="abr-filters__label">Au</label>
          <input
            type="date"
            className="abr-filters__date"
            value={filters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
          />
        </div>

        <div className="abr-filters__actions">
          <button
            className={clsx('abr-filters__toggle', { 'abr-filters__toggle--active': showAdvanced })}
            onClick={onToggleAdvanced}
            type="button"
          >
            <i className="bi bi-sliders2" />
            <span>Avancé</span>
            <i className={clsx('bi', showAdvanced ? 'bi-chevron-up' : 'bi-chevron-down')} />
          </button>

          {activeCount > 0 && (
            <button className="abr-filters__reset" onClick={onReset} type="button">
              <i className="bi bi-arrow-counterclockwise" />
              <span>Réinitialiser</span>
              <span className="abr-filters__badge">{activeCount}</span>
            </button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="abr-filters__expanded">
          <div className="abr-filters__group">
            <label className="abr-filters__label">Trajet</label>
            <input
              type="text"
              placeholder="Ex: Douala → Yaoundé"
              className="abr-filters__input"
              value={filters.trip}
              onChange={(e) => handleChange('trip', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
