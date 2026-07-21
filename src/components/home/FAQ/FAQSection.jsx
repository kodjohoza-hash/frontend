import { useState, useCallback, useMemo } from 'react';
import { useInView } from '@hooks/useLandingPage';
import { useNavigate } from 'react-router-dom';
import { FAQ_ITEMS } from '@data/faq';
import FaqItem from './FaqItem';
import FaqSearch from './FaqSearch';
import FaqCategories from './FaqCategories';

const FaqSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const toggle = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const filteredItems = useMemo(() => {
    let items = FAQ_ITEMS;

    if (activeCategory !== 'all') {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return items;
  }, [search, activeCategory]);

  return (
    <section id="faq" className="btc-faq" ref={ref}>
      <div className="btc-faq-deco" aria-hidden="true">
        <div className="btc-faq-deco-orb btc-faq-deco-orb--1" />
        <div className="btc-faq-deco-orb btc-faq-deco-orb--2" />
      </div>

      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-question-circle" /> FAQ
          </span>
          <h2 className="btc-section-title">
            Questions <span className="text-accent">fréquentes</span>
          </h2>
          <p className="btc-section-subtitle">
            Retrouvez rapidement les réponses aux questions les plus courantes concernant la réservation, le paiement et le voyage avec BUS TIX CONNECT.
          </p>
        </div>

        <div className={`btc-faq-controls ${isInView ? 'is-visible' : ''}`}>
          <FaqSearch value={search} onChange={setSearch} />
          <FaqCategories active={activeCategory} onChange={setActiveCategory} />
        </div>

        <div className="btc-faq-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, i) => (
              <div
                key={item.id}
                className="btc-faq-item-wrap"
                style={{ transitionDelay: `${i * 0.04}s` }}
              >
                <FaqItem
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                  index={i}
                />
              </div>
            ))
          ) : (
            <div className="btc-faq-empty">
              <i className="bi bi-search" />
              <p>Aucune question trouvée pour votre recherche.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('all'); }}>
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>

        <div className={`btc-faq-cta ${isInView ? 'is-visible' : ''}`}>
          <div className="btc-faq-cta-card">
            <div className="btc-faq-cta-icon">
              <i className="bi bi-headset" />
            </div>
            <h3 className="btc-faq-cta-title">Vous ne trouvez pas votre réponse ?</h3>
            <p className="btc-faq-cta-text">
              Notre équipe est disponible pour vous accompagner.
            </p>
            <button className="btc-faq-cta-btn" onClick={() => window.open('mailto:support@bustixconnect.com', '_blank')}>
              <i className="bi bi-chat-dots" /> Contacter le support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
