import { useState } from 'react';
import clsx from 'clsx';

const ReservationSearch = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={clsx('rv-search', focused && 'rv-search--focus')}>
      <i className="bi bi-search rv-search__icon" />
      <input
        type="text"
        className="rv-search__input"
        placeholder="Rechercher par référence, compagnie, ville..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button
          type="button"
          className="rv-search__clear"
          onClick={() => onChange('')}
          aria-label="Effacer"
        >
          <i className="bi bi-x" />
        </button>
      )}
    </div>
  );
};

export default ReservationSearch;
