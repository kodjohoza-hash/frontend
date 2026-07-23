import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const SupportHero = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const el = document.getElementById('sp-faq');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sp-hero">
      <div className="sp-hero__visual">
        <div className="sp-hero__icon-main">
          <i className="bi bi-headset" />
        </div>
        <div className="sp-hero__floats">
          <div className="sp-hero__float sp-hero__float--1"><i className="bi bi-chat-dots" /></div>
          <div className="sp-hero__float sp-hero__float--2"><i className="bi bi-question-circle" /></div>
          <div className="sp-hero__float sp-hero__float--3"><i className="bi bi-life-preserver" /></div>
        </div>
      </div>

      <h2 className="sp-hero__title">Comment pouvons-nous vous aider ?</h2>
      <p className="sp-hero__subtitle">Recherchez dans notre base de connaissances ou contactez-nous directement.</p>

      <form className="sp-hero__search" onSubmit={handleSearch}>
        <div className={`sp-hero__search-box ${focused ? 'sp-hero__search-box--focus' : ''}`}>
          <i className="bi bi-search sp-hero__search-icon" />
          <input
            type="text"
            className="sp-hero__search-input"
            placeholder="Rechercher une réponse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <button type="submit" className="sp-hero__search-btn">
            Rechercher
          </button>
        </div>
      </form>

      <div className="sp-hero__quick-links">
        <span className="sp-hero__quick-label">Populaires :</span>
        {['Réservation', 'Remboursement', 'Billet', 'Mot de passe'].map((tag) => (
          <button key={tag} type="button" className="sp-hero__tag" onClick={() => { setSearch(tag); handleSearch(new Event('submit')); }}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SupportHero;
