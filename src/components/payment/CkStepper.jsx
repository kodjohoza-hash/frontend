import { memo } from 'react';

const CkStepper = memo(({ steps, currentStep }) => {
  const activeIdx = steps.findIndex((s) => s.active);
  const idx = currentStep !== undefined ? currentStep : activeIdx;

  return (
    <nav aria-label="Étapes de réservation" className="ck-stepper">
      <ol className="ck-stepper__list">
        {steps.map((step, i) => {
          const isDone = step.done || i < idx;
          const isActive = step.active || i === idx;
          const isLast = i === steps.length - 1;

          return (
            <li key={step.key} className="ck-stepper__item">
              <div className="ck-stepper__node-wrap">
                <span
                  className={`ck-stepper__node ${isDone ? 'ck-stepper__node--done' : ''} ${isActive ? 'ck-stepper__node--active' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? <i className="bi bi-check-lg" /> : <i className={`bi ${step.icon}`} />}
                </span>
                <span className={`ck-stepper__label ${isDone ? 'ck-stepper__label--done' : ''} ${isActive ? 'ck-stepper__label--active' : ''}`}>
                  {step.label}
                </span>
              </div>
              {!isLast && <span className={`ck-stepper__line ${isDone ? 'ck-stepper__line--done' : ''}`} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

CkStepper.displayName = 'CkStepper';
export default CkStepper;
