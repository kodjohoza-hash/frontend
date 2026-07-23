import { useRef } from 'react';

const POPULAR_TAGS = ['Réservation', 'Remboursement', 'Billet', 'Mot de passe'];

const SupportHero = ({ search, onSearch }) => {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const el = document.getElementById('sp-faq');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTag = (tag) => {
    onSearch(tag);
    setTimeout(() => {
      const el = document.getElementById('sp-faq');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="sp-hero">
      <div className="sp-hero__left">
        <div className="sp-hero__icon">
          <i className="bi bi-headset" />
        </div>
        <h2 className="sp-hero__title">Comment pouvons-nous vous aider ?</h2>
        <p className="sp-hero__desc">
          Parcourez notre base de connaissances ou contactez directement notre équipe support.
        </p>
      </div>

      <div className="sp-hero__right">
        <form className="sp-hero__form" onSubmit={handleSubmit}>
          <div className="sp-hero__search">
            <i className="bi bi-search" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher une réponse..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
            <button type="submit">Rechercher</button>
          </div>
        </form>

        <div className="sp-hero__tags">
          <span className="sp-hero__tags-label">Populaires :</span>
          {POPULAR_TAGS.map((tag) => (
            <button key={tag} type="button" className="sp-hero__tag" onClick={() => handleTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportHero;
