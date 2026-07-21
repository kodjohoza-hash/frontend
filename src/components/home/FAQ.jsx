import { useState } from 'react';
import clsx from 'clsx';
import { FAQ_ITEMS } from '@data/landingPage';

/**
 * FaqItem — Single accordion item
 */
const FaqItem = ({ item, isOpen, onToggle }) => {
  return (
    <div className={clsx('faq-item', isOpen && 'is-open')}>
      <button
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
      >
        <span>{item.question}</span>
        <i className={clsx('bi', 'bi-chevron-down', 'faq-question-icon')} />
      </button>
      {isOpen && (
        <div
          id={`faq-answer-${item.id}`}
          className="faq-answer"
          role="region"
        >
          {item.answer}
        </div>
      )}
    </div>
  );
};

/**
 * FAQ — Frequently asked questions accordion
 */
const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Section Header */}
            <div className="section-header">
              <span className="section-badge">
                <i className="bi bi-question-circle" />
                FAQ
              </span>
              <h2 className="section-title">Questions fréquentes</h2>
              <p className="section-subtitle">
                Retrouvez les réponses aux questions les plus posées par nos voyageurs.
              </p>
            </div>

            {/* FAQ Items */}
            {FAQ_ITEMS.map((item) => (
              <FaqItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
