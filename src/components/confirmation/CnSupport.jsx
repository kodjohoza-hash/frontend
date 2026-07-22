import { memo } from 'react';

const CnSupport = memo(({ contacts }) => (
  <div className="cn-card">
    <h3 className="cn-card__title">
      <i className="bi bi-headset" />
      Besoin d'aide ?
    </h3>
    <div className="cn-support">
      {contacts.map((c, i) => (
        <div key={i} className="cn-support__item" style={{ '--sc': c.color }}>
          <div className="cn-support__icon">
            <i className={`bi ${c.icon}`} />
          </div>
          <div className="cn-support__body">
            <span className="cn-support__label">{c.label}</span>
            <span className="cn-support__value">{c.value}</span>
            <span className="cn-support__detail">{c.detail}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
));
CnSupport.displayName = 'CnSupport';
export default CnSupport;
