import { memo, useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

const FaqItem = memo(({ item, isOpen, onToggle, index }) => {
  const answerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (answerRef.current) {
      setHeight(answerRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div className={clsx('btc-faq-item', { 'is-open': isOpen })}>
      <button
        className="btc-faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        tabIndex={0}
      >
        <div className="btc-faq-question-left">
          <span className="btc-faq-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="btc-faq-text">{item.question}</span>
        </div>
        <div className="btc-faq-question-right">
          <i className={clsx('bi bi-plus-lg btc-faq-icon', { 'btc-faq-icon--open': isOpen })} />
        </div>
      </button>
      <div
        id={`faq-answer-${item.id}`}
        className="btc-faq-answer-wrap"
        style={{ maxHeight: isOpen ? `${height}px` : '0px' }}
        role="region"
        aria-hidden={!isOpen}
      >
        <div className="btc-faq-answer" ref={answerRef}>
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
});

FaqItem.displayName = 'FaqItem';
export default FaqItem;
