import clsx from 'clsx';
import {
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from '@data/paymentData';

export default function AgencyPaymentFilters({ filters, onFilterChange, onReset, onToggleAdvanced, showAdvanced }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="ap-filters">
      <div className="ap-filters__row">
        <div className="ap-filters__search">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Rechercher par référence, client, téléphone..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="ap-filters__input"
          />
          {filters.search && (
            <button className="ap-filters__clear" onClick={() => handleChange('search', '')}>
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>
      </div>

      <div className="ap-filters__row">
        <div className="ap-filters__group">
          <select
            className="ap-filters__select"
            value={filters.method}
            onChange={(e) => handleChange('method', e.target.value)}
          >
            <option value="">Tous les modes</option>
            {Object.values(PAYMENT_METHODS).map((m) => (
              <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
            ))}
          </select>
          <select
            className="ap-filters__select"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tous les statuts</option>
            {Object.values(PAYMENT_STATUSES).map((s) => (
              <option key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div className="ap-filters__group">
          <label className="ap-filters__label">Du</label>
          <input
            type="date"
            className="ap-filters__date"
            value={filters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
          />
          <label className="ap-filters__label">Au</label>
          <input
            type="date"
            className="ap-filters__date"
            value={filters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
          />
        </div>

        <div className="ap-filters__actions">
          <button
            className={clsx('ap-filters__toggle', { 'ap-filters__toggle--active': showAdvanced })}
            onClick={onToggleAdvanced}
            type="button"
          >
            <i className="bi bi-sliders2" />
            <span>Avancé</span>
            <i className={clsx('bi', showAdvanced ? 'bi-chevron-up' : 'bi-chevron-down')} />
          </button>

          {activeCount > 0 && (
            <button className="ap-filters__reset" onClick={onReset} type="button">
              <i className="bi bi-arrow-counterclockwise" />
              <span>Réinitialiser</span>
              <span className="ap-filters__badge">{activeCount}</span>
            </button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="ap-filters__expanded">
          <div className="ap-filters__group">
            <label className="ap-filters__label">Référence</label>
            <input
              type="text"
              placeholder="Ex: PAY-2026-0001"
              className="ap-filters__input"
              value={filters.reference}
              onChange={(e) => handleChange('reference', e.target.value)}
            />
          </div>
          <div className="ap-filters__group">
            <label className="ap-filters__label">Client</label>
            <input
              type="text"
              placeholder="Nom du client"
              className="ap-filters__input"
              value={filters.client}
              onChange={(e) => handleChange('client', e.target.value)}
            />
          </div>
          <div className="ap-filters__group">
            <label className="ap-filters__label">Réservation</label>
            <input
              type="text"
              placeholder="Ex: BK-2026-0001"
              className="ap-filters__input"
              value={filters.bookingId}
              onChange={(e) => handleChange('bookingId', e.target.value)}
            />
          </div>
          <div className="ap-filters__group">
            <label className="ap-filters__label">Point de vente</label>
            <input
              type="text"
              placeholder="Nom du point de vente"
              className="ap-filters__input"
              value={filters.outlet}
              onChange={(e) => handleChange('outlet', e.target.value)}
            />
          </div>
          <div className="ap-filters__group">
            <label className="ap-filters__label">Agent</label>
            <input
              type="text"
              placeholder="Nom de l'agent"
              className="ap-filters__input"
              value={filters.agent}
              onChange={(e) => handleChange('agent', e.target.value)}
            />
          </div>
          <div className="ap-filters__group">
            <label className="ap-filters__label">Montant min</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="ap-filters__input"
              value={filters.amountMin}
              onChange={(e) => handleChange('amountMin', e.target.value)}
            />
          </div>
          <div className="ap-filters__group">
            <label className="ap-filters__label">Montant max</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="ap-filters__input"
              value={filters.amountMax}
              onChange={(e) => handleChange('amountMax', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
