import clsx from 'clsx';

const getRankClass = (i) => {
  if (i === 0) return 'aa-top-table__rank--gold';
  if (i === 1) return 'aa-top-table__rank--silver';
  if (i === 2) return 'aa-top-table__rank--bronze';
  return '';
};

const AgencyTopBranches = ({ data }) => {
  return (
    <div className="aa-top-table">
      <div className="aa-top-table__header">
        <h3 className="aa-top-table__title">
          <i className="bi bi-trophy" />
          Top points de vente
        </h3>
      </div>
      <div className="aa-top-table__body">
        {data.map((branch, i) => (
          <div key={branch.id} className="aa-top-table__row">
            <span className={clsx('aa-top-table__rank', getRankClass(i))}>
              {i + 1}
            </span>
            <div className="aa-top-table__info">
              <span className="aa-top-table__name">{branch.name}</span>
              <span className="aa-top-table__value">{branch.revenue.toLocaleString()} XAF</span>
            </div>
            <div className="aa-top-table__bar-wrap">
              <div className="aa-top-table__bar" style={{ width: `${branch.percentage}%` }} />
              <span className="aa-top-table__pct">{branch.percentage}%</span>
            </div>
            <span className="aa-top-table__agents">
              <i className="bi bi-people" />
              {branch.agents}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencyTopBranches;
