import { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { FAQ_ITEMS } from '@data/landingPage';
import { useInView } from '@hooks/useLandingPage';

const FaqItem = ({ item, isOpen, onToggle, index }) => {
  const answerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (answerRef.current) setHeight(answerRef.current.scrollHeight);
  }, [isOpen]);

  return (
    <div className={clsx('btc-faq-item', isOpen && 'is-open')}>
      <button className="btc-faq-question" onClick={onToggle} aria-expanded={isOpen} aria-controls={`faq-a-${item.id}`}>
        <div className="btc-faq-question-left">
          <span className="btc-faq-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="btc-faq-text">{item.question}</span>
        </div>
        <div className="btc-faq-question-right">
          {item.category && <span className="btc-faq-tag">{item.category}</span>}
          <i className="bi bi-chevron-down btc-faq-chevron" />
        </div>
      </button>
      <div id={`faq-a-${item.id}`} className="btc-faq-answer-wrap" style={{ maxHeight: isOpen ? `${height}px` : '0px' }} role="region">
        <div className="btc-faq-answer" ref={answerRef}>{item.answer}</div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [openId, setOpenId] = useState(null);
  const toggle = useCallback((id) => setOpenId((p) => p === id ? null : id), []);

  return (
    <section id="faq" className="btc-faq" ref={ref}>
      <div className="btc-faq-deco" aria-hidden="true">
        <div className="btc-faq-deco-orb btc-faq-deco-orb--1" />
        <div className="btc-faq-deco-orb btc-faq-deco-orb--2" />
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
              <span className="btc-section-badge">
                <i className="bi bi-question-circle" /> FAQ
              </span>
              <h2 className="btc-section-title">Questions fréquentes</h2>
              <p className="btc-section-subtitle">
                Retrouvez les réponses aux questions les plus posées.
              </p>
            </div>

            <div className="btc-faq-list">
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem key={item.id} item={item} isOpen={openId === item.id} onToggle={() => toggle(item.id)} index={i} />
              ))}
            </div>

            <div className="btc-faq-contact">
              <p>Vous n'avez pas trouvé votre réponse ?</p>
              <a href="#" className="btc-faq-contact-link">
                <i className="bi bi-headset" /> Contactez notre support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
