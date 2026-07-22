import { memo } from 'react';

const CnAdvice = memo(({ items }) => (
  <div className="cn-card">
    <h3 className="cn-card__title">
      <i className="bi bi-lightbulb-fill" />
      Avant votre voyage
    </h3>
    <div className="cn-advice">
      {items.map((item, i) => (
        <div key={i} className="cn-advice__item">
          <div className="cn-advice__icon">
            <i className={`bi ${item.icon}`} />
          </div>
          <div className="cn-advice__body">
            <span className="cn-advice__title">{item.title}</span>
            <span className="cn-advice__desc">{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
));
CnAdvice.displayName = 'CnAdvice';
export default CnAdvice;
