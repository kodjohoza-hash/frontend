import { useState, useRef } from 'react';
import clsx from 'clsx';

const NotificationsSearch = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className={clsx('nf-search', focused && 'nf-search--focus')}>
      <i className="bi bi-search nf-search__icon" />
      <input
        ref={inputRef}
        type="text"
        className="nf-search__input"
        placeholder="Rechercher par titre, contenu, compagnie, réservation..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button
          type="button"
          className="nf-search__clear"
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          aria-label="Effacer la recherche"
        >
          <i className="bi bi-x-lg" />
        </button>
      )}
    </div>
  );
};

export default NotificationsSearch;
