import { memo } from 'react';

const StepCard = memo(({ step, index }) => {
  return (
    <div className="btc-how-card">
      <div className="btc-how-card-number">{step.number}</div>
      <div className="btc-how-card-icon">
        <i className={`bi ${step.icon}`} />
      </div>
      <h3 className="btc-how-card-title">{step.title}</h3>
      <p className="btc-how-card-desc">{step.description}</p>
    </div>
  );
});

StepCard.displayName = 'StepCard';
export default StepCard;
