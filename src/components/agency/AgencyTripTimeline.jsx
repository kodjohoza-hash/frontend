const timelineEvents = {
  programmee: [
    { time: 'T+0', label: 'Voyage créé', icon: 'bi-plus-circle-fill', color: 'primary' },
  ],
  embarquement: [
    { time: 'T-3h', label: 'Voyage créé', icon: 'bi-plus-circle-fill', color: 'primary' },
    { time: 'T-30min', label: 'Embarquement ouvert', icon: 'bi-people-fill', color: 'info' },
  ],
  en_cours: [
    { time: 'T-3h', label: 'Voyage créé', icon: 'bi-plus-circle-fill', color: 'primary' },
    { time: 'T-30min', label: 'Embarquement terminé', icon: 'bi-people-fill', color: 'info' },
    { time: 'Départ', label: 'Bus en route', icon: 'bi-play-circle-fill', color: 'accent' },
  ],
  terminee: [
    { time: 'T-3h', label: 'Voyage créé', icon: 'bi-plus-circle-fill', color: 'primary' },
    { time: 'T-30min', label: 'Embarquement terminé', icon: 'bi-people-fill', color: 'info' },
    { time: 'Départ', label: 'Bus en route', icon: 'bi-play-circle-fill', color: 'accent' },
    { time: 'Arrivée', label: 'Voyage terminé', icon: 'bi-check-circle-fill', color: 'success' },
  ],
  annulee: [
    { time: 'T-3h', label: 'Voyage créé', icon: 'bi-plus-circle-fill', color: 'primary' },
    { time: '--', label: 'Voyage annulé', icon: 'bi-x-circle-fill', color: 'danger' },
  ],
  complete: [
    { time: 'T-3h', label: 'Voyage créé', icon: 'bi-plus-circle-fill', color: 'primary' },
    { time: 'T-30min', label: 'Embarquement terminé', icon: 'bi-people-fill', color: 'info' },
    { time: 'Départ', label: 'Bus en route', icon: 'bi-play-circle-fill', color: 'accent' },
    { time: 'Arrivée', label: 'Voyage terminé', icon: 'bi-check-circle-fill', color: 'success' },
    { time: 'Post', label: 'Toutes les places vendues', icon: 'bi-shield-check', color: 'muted' },
  ],
};

export default function AgencyTripTimeline({ status }) {
  const events = timelineEvents[status] || timelineEvents.programmee;

  return (
    <div className="at-timeline">
      {events.map((evt, i) => (
        <div key={i} className={`at-timeline__item at-timeline__item--${evt.color}`}>
          <div className="at-timeline__marker">
            <i className={`bi ${evt.icon}`} />
          </div>
          <div className="at-timeline__content">
            <span className="at-timeline__time">{evt.time}</span>
            <span className="at-timeline__label">{evt.label}</span>
          </div>
          {i < events.length - 1 && <div className="at-timeline__line" />}
        </div>
      ))}
    </div>
  );
}
