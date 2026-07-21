import { memo } from 'react';

const FaqSearch = memo(({ value, onChange }) => (
  <div className="btc-faq-search">
    <i className="bi bi-search btc-faq-search-icon" />
    <input
      type="text"
      className="btc-faq-search-input"
      placeholder="Rechercher une question..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Rechercher dans la FAQ"
    />
    {value && (
      <button
        className="btc-faq-search-clear"
        onClick={() => onChange('')}
        aria-label="Effacer la recherche"
      >
        <i className="bi bi-x-lg" />
      </button>
    )}
  </div>
));

FaqSearch.displayName = 'FaqSearch';
export default FaqSearch;
