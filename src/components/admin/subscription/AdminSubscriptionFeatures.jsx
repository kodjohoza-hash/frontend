import React from 'react';
import { featureCategories } from '../../../data/adminSubscriptionData';

export default function AdminSubscriptionFeatures({ planFeatures, editable, onToggle }) {
  if (!featureCategories) return null;
  return (
    <div className="adms-features-matrix">
      {featureCategories.map(cat => {
        const allIncluded = cat.features.every(f => planFeatures?.includes(f.id));
        const someIncluded = cat.features.some(f => planFeatures?.includes(f.id));
        return (
          <div className="adms-feature-category" key={cat.id}>
            <h4>{cat.label}</h4>
            {cat.features.map(f => {
              const included = planFeatures?.includes(f.id);
              return (
                <div
                  key={f.id}
                  className={`adms-feature-item ${included ? 'adms-feature-item--included' : 'adms-feature-item--excluded'}`}
                  onClick={() => editable && onToggle?.(f.id)}
                  style={editable ? { cursor: 'pointer' } : {}}
                >
                  {editable ? (
                    <div className={`adms-feature-toggle ${included ? 'adms-feature-toggle--on' : ''}`}>
                      {included && <i className="fa-solid fa-check" style={{ fontSize: '0.55rem' }} />}
                    </div>
                  ) : (
                    <i className={`fa-solid ${included ? 'fa-check' : 'fa-xmark'}`} />
                  )}
                  {f.label}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
