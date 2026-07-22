import { memo } from 'react';

const CnStepper = memo(({ steps }) => (
  <nav aria-label="Étapes de réservation" className="cn-stepper">
    <ol className="cn-stepper__list">
      {steps.map((step, i) => {
        const isDone = step.done;
        const isActive = step.active;
        const isLast = i === steps.length - 1;
        return (
          <li key={step.key} className="cn-stepper__item">
            <div className="cn-stepper__node-wrap">
              <span className={`cn-stepper__node ${isDone ? 'cn-stepper__node--done' : ''} ${isActive ? 'cn-stepper__node--active' : ''}`}>
                {isDone ? <i className="bi bi-check-lg" /> : <i className={`bi ${step.icon}`} />}
              </span>
              <span className={`cn-stepper__label ${isDone ? 'cn-stepper__label--done' : ''} ${isActive ? 'cn-stepper__label--active' : ''}`}>
                {step.label}
              </span>
            </div>
            {!isLast && <span className={`cn-stepper__line ${isDone ? 'cn-stepper__line--done' : ''}`} />}
          </li>
        );
      })}
    </ol>
  </nav>
));
CnStepper.displayName = 'CnStepper';
export default CnStepper;
