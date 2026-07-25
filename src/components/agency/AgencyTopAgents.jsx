import clsx from 'clsx';

const getRankClass = (i) => {
  if (i === 0) return 'aa-top-table__rank--gold';
  if (i === 1) return 'aa-top-table__rank--silver';
  if (i === 2) return 'aa-top-table__rank--bronze';
  return '';
};

const AgencyTopAgents = ({ data }) => {
  return (
    <div className="aa-top-table">
      <div className="aa-top-table__header">
        <h3 className="aa-top-table__title">
          <i className="bi bi-trophy" />
          Top agents
        </h3>
      </div>
      <div className="aa-top-table__body">
        {data.map((agent, i) => (
          <div key={agent.id} className="aa-top-table__row">
            <span className={clsx('aa-top-table__rank', getRankClass(i))}>
              {i + 1}
            </span>
            <div className="aa-top-table__info">
              <span className="aa-top-table__name">{agent.name}</span>
              <span className="aa-top-table__value">{agent.branch}</span>
            </div>
            <div className="aa-top-table__bar-wrap">
              <div className="aa-top-table__bar" style={{ width: `${(agent.reservations / data[0].reservations) * 100}%` }} />
              <span className="aa-top-table__pct">{agent.reservations}</span>
            </div>
            <span className="aa-top-table__rating">
              <i className="bi bi-star-fill" />
              {agent.rating}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencyTopAgents;
