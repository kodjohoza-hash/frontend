import clsx from 'clsx';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ReservationTimeline = ({ timeline }) => {
  return (
    <div className="rv-timeline">
      {timeline.map((step, i) => (
        <div
          key={i}
          className={clsx('rv-timeline__step', step.done && 'rv-timeline__step--done')}
        >
          <div className="rv-timeline__marker">
            <div className={clsx('rv-timeline__dot', step.done && 'rv-timeline__dot--done')}>
              {step.done && <i className="bi bi-check-lg" />}
            </div>
            {i < timeline.length - 1 && (
              <div className={clsx('rv-timeline__line', step.done && 'rv-timeline__line--done')} />
            )}
          </div>
          <div className="rv-timeline__content">
            <span className="rv-timeline__label">{step.label}</span>
            {step.date && (
              <span className="rv-timeline__date">{formatDate(step.date)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationTimeline;
