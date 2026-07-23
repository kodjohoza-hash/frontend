import { categories } from '@data/supportData';

const SupportCategories = ({ onCategoryClick }) => {
  return (
    <div className="sp-categories" id="sp-categories">
      <h3 className="sp-section-title">
        <i className="bi bi-grid-3x3-gap" />
        Parcourir par catégorie
      </h3>
      <div className="sp-categories__grid">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            type="button"
            className={`sp-category sp-category--${cat.color}`}
            style={{ animationDelay: `${i * 0.06}s` }}
            onClick={() => onCategoryClick(cat.id)}
          >
            <div className={`sp-category__icon sp-category__icon--${cat.color}`}>
              <i className={`bi ${cat.icon}`} />
            </div>
            <div className="sp-category__info">
              <span className="sp-category__label">{cat.label}</span>
              <span className="sp-category__desc">{cat.desc}</span>
            </div>
            <i className="bi bi-chevron-right sp-category__arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SupportCategories;
