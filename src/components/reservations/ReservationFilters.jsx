import clsx from 'clsx';

const tabs = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending', label: 'En attente' },
  { id: 'confirmed', label: 'Confirmées' },
  { id: 'completed', label: 'Terminées' },
  { id: 'cancelled', label: 'Annulées' },
];

const ReservationFilters = ({ active, onFilterChange, companies, selectedCompany, onCompanyChange }) => {
  return (
    <div className="rv-filters">
      <div className="rv-filters__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={clsx('rv-filters__tab', active === tab.id && 'rv-filters__tab--active')}
            onClick={() => onFilterChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="rv-filters__extra">
        <select
          className="rv-filters__select"
          value={selectedCompany}
          onChange={(e) => onCompanyChange(e.target.value)}
        >
          <option value="">Toutes les compagnies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ReservationFilters;
