import clsx from 'clsx';

const steps = [
  { id: 1, label: 'Recherche', icon: 'bi-search' },
  { id: 2, label: 'Sièges', icon: 'bi-door-open' },
  { id: 3, label: 'Passagers', icon: 'bi-people-fill' },
  { id: 4, label: 'Paiement', icon: 'bi-credit-card' },
  { id: 5, label: 'Confirmation', icon: 'bi-check-circle' },
];

const PiStepper = ({ currentStep = 3 }) => (
  <div className="pi-stepper">
    {steps.map((step, idx) => (
      <div
        key={step.id}
        className={clsx(
          'pi-stepper__step',
          step.id < currentStep && 'pi-stepper__step--done',
          step.id === currentStep && 'pi-stepper__step--active',
          step.id > currentStep && 'pi-stepper__step--pending',
        )}
      >
        <div className="pi-stepper__node">
          {step.id < currentStep ? (
            <i className="bi bi-check-lg" />
          ) : (
            <i className={clsx('bi', step.icon)} />
          )}
        </div>
        <span className="pi-stepper__label">{step.label}</span>
        {idx < steps.length - 1 && (
          <div className={clsx('pi-stepper__line', step.id < currentStep && 'pi-stepper__line--done')} />
        )}
      </div>
    ))}
  </div>
);

export default PiStepper;
