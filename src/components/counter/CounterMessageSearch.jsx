import { useRef } from 'react';
import clsx from 'clsx';

const CounterMessageSearch = ({ search, onSearchChange, placeholder }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    onSearchChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div className={clsx('acm-search', search && 'acm-search--has-value')}>
      <i className="bi bi-search acm-search__icon" />
      <input
        ref={inputRef}
        type="text"
        className="acm-search__input"
        value={search || ''}
        onChange={(e) => onSearchChange?.(e.target.value)}
        placeholder={placeholder || 'Rechercher...'}
      />
      {search && (
        <button type="button" className="acm-search__clear" onClick={handleClear} aria-label="Effacer">
          <i className="bi bi-x-lg" />
        </button>
      )}
    </div>
  );
};

export default CounterMessageSearch;
