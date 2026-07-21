import { memo } from 'react';
import clsx from 'clsx';
import { FAQ_CATEGORIES } from '@data/faq';

const FaqCategories = memo(({ active, onChange }) => (
  <div className="btc-faq-categories" role="tablist" aria-label="Catégories de questions">
    {FAQ_CATEGORIES.map((cat) => (
      <button
        key={cat.id}
        className={clsx('btc-faq-chip', { 'is-active': active === cat.id })}
        onClick={() => onChange(cat.id)}
        role="tab"
        aria-selected={active === cat.id}
        tabIndex={0}
      >
        <i className={`bi ${cat.icon}`} />
        <span>{cat.label}</span>
      </button>
    ))}
  </div>
));

FaqCategories.displayName = 'FaqCategories';
export default FaqCategories;
