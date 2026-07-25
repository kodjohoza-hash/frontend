import { useMemo } from 'react';

const AgencyInsights = ({ insights }) => {
  return (
    <div className="aa-insights-grid">
      {insights.map((item) => (
        <div key={item.id} className="aa-insight">
          <div className="aa-insight__icon" style={{ backgroundColor: item.color }}>
            <i className={`bi ${item.icon}`} />
          </div>
          <div className="aa-insight__content">
            <div
              className="aa-insight__text"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
            {item.meta && <span className="aa-insight__meta">{item.meta}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgencyInsights;
