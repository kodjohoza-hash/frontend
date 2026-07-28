import clsx from 'clsx';

const AgencyClientTimeline = ({ events }) => (
  <div className="ac-timeline">
    {events.map((evt, i) => (
      <div key={evt.id} className={clsx('ac-timeline__item', `ac-timeline__item--${evt.color}`)}>
        <div className="ac-timeline__marker">
          <i className={`bi ${evt.icon}`} />
        </div>
        <div className="ac-timeline__content">
          <span className="ac-timeline__label">{evt.label}</span>
          <span className="ac-timeline__time">{evt.time}</span>
        </div>
        {i < events.length - 1 && <div className="ac-timeline__line" />}
      </div>
    ))}
  </div>
);

export default AgencyClientTimeline;
