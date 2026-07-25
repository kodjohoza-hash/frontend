import clsx from 'clsx';

const AgencyBookingTimeline = ({ events }) => (
  <div className="abr-timeline">
    {events.map((evt, i) => (
      <div key={evt.id} className={clsx('abr-timeline__item', `abr-timeline__item--${evt.color}`)}>
        <div className="abr-timeline__marker">
          <i className={`bi ${evt.icon}`} />
        </div>
        <div className="abr-timeline__content">
          <span className="abr-timeline__label">{evt.label}</span>
          <span className="abr-timeline__time">{evt.time}</span>
        </div>
        {i < events.length - 1 && <div className="abr-timeline__line" />}
      </div>
    ))}
  </div>
);

export default AgencyBookingTimeline;
