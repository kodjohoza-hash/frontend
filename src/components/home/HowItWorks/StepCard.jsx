import { memo } from 'react';
import clsx from 'clsx';

/**
 * StepCard — Single step in the timeline
 * Desktop: horizontal with connector line
 * Mobile: vertical with dot connector
 * Memoized for performance
 */
const StepCard = memo(({ step, index, total }) => {
  const isLast = index === total - 1;

  return (
    <div className={clsx('timeline-step', `reveal reveal-delay-${(index % 5) + 1}`)}>
      {/* Step number badge */}
      <div className="timeline-step-number">
        <span className="timeline-step-number-text">{step.number}</span>
      </div>

      {/* Connector line (desktop only, not on last) */}
      {!isLast && <div className="timeline-step-connector" />}

      {/* Icon circle */}
      <div className="timeline-step-icon">
        <i className={`bi ${step.icon}`} />
      </div>

      {/* Content */}
      <h4 className="timeline-step-title">{step.title}</h4>
      <p className="timeline-step-description">{step.description}</p>
    </div>
  );
});

StepCard.displayName = 'StepCard';

export default StepCard;
