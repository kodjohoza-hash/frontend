import { useState, useRef } from 'react';

const SupportSearch = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className={`sp-search ${focused ? 'sp-search--focus' : ''}`}>
      <i className="bi bi-search sp-search__icon" />
      <input
        ref={inputRef}
        type="text"
        className="sp-search__input"
        placeholder="Rechercher dans les FAQs, catégories, ressources..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button
          type="button"
          className="sp-search__clear"
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          aria-label="Effacer"
        >
          <i className="bi bi-x-lg" />
        </button>
      )}
    </div>
  );
};

export default SupportSearch;
