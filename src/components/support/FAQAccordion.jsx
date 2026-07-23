import { useState } from 'react';
import clsx from 'clsx';
import { faqItems } from '@data/supportData';

const FAQAccordion = ({ search }) => {
  const [openId, setOpenId] = useState(null);

  const filtered = faqItems.filter((faq) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="sp-faq" id="sp-faq">
      <h3 className="sp-section-title">
        <i className="bi bi-question-circle" />
        Questions fréquentes
      </h3>

      {filtered.length === 0 ? (
        <div className="sp-faq__empty">
          <i className="bi bi-search" />
          <p>Aucune question ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="sp-faq__list">
          {filtered.map((faq) => (
            <div key={faq.id} className={clsx('sp-faq__item', openId === faq.id && 'sp-faq__item--open')}>
              <button
                type="button"
                className="sp-faq__question"
                onClick={() => toggle(faq.id)}
                aria-expanded={openId === faq.id}
              >
                <span className="sp-faq__question-text">{faq.question}</span>
                <i className={clsx('bi', openId === faq.id ? 'bi-chevron-up' : 'bi-chevron-down', 'sp-faq__chevron')} />
              </button>
              <div className={clsx('sp-faq__answer', openId === faq.id && 'sp-faq__answer--open')}>
                <p className="sp-faq__answer-text">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQAccordion;
