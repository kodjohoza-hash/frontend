import { useState } from 'react';

const TkSearch = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`tk-search ${focused ? 'tk-search--focus' : ''}`}>
      <i className="bi bi-search tk-search__icon" />
      <input
        type="text"
        className="tk-search__input"
        placeholder="Rechercher par billet, réservation, compagnie, ville..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button type="button" className="tk-search__clear" onClick={() => onChange('')}>
          <i className="bi bi-x-lg" />
        </button>
      )}
    </div>
  );
};

export default TkSearch;
