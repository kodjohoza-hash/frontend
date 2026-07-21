import clsx from 'clsx';

const colorMap = {
  primary: {
    bg: 'var(--color-primary-50)',
    iconBg: 'var(--color-primary)',
    iconColor: 'var(--color-white)',
    accent: 'var(--color-primary)',
  },
  accent: {
    bg: 'var(--color-accent-50)',
    iconBg: 'var(--color-accent)',
    iconColor: 'var(--color-white)',
    accent: 'var(--color-accent)',
  },
  success: {
    bg: 'var(--color-success-50)',
    iconBg: 'var(--color-success)',
    iconColor: 'var(--color-white)',
    accent: 'var(--color-success)',
  },
  info: {
    bg: 'var(--color-info-50)',
    iconBg: 'var(--color-info)',
    iconColor: 'var(--color-white)',
    accent: 'var(--color-info)',
  },
  warning: {
    bg: 'var(--color-warning-50)',
    iconBg: 'var(--color-warning)',
    iconColor: 'var(--color-white)',
    accent: 'var(--color-warning)',
  },
};

const StatsCard = ({ label, value, suffix, icon, color = 'primary', change, changeType, className = '' }) => {
  const palette = colorMap[color] || colorMap.primary;

  return (
    <div
      className={clsx('btc-stats-card card border-0 h-100', className)}
      style={{
        background: palette.bg,
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div
            className="btc-stats-card-icon d-flex align-items-center justify-content-center"
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: palette.iconBg,
              color: palette.iconColor,
              fontSize: '1.25rem',
            }}
          >
            <i className={clsx('bi', icon)} />
          </div>
          {change && (
            <span
              className="d-inline-flex align-items-center gap-1 fw-semibold"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: changeType === 'up' ? 'var(--color-success)' : 'var(--color-danger)',
              }}
            >
              <i className={clsx('bi', changeType === 'up' ? 'bi-arrow-up' : 'bi-arrow-down')} style={{ fontSize: '0.7em' }} />
              {change}
            </span>
          )}
        </div>
        <div className="btc-stats-card-value fw-bold" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--text-primary)' }}>
          {value}{suffix && <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>{suffix}</span>}
        </div>
        <div className="btc-stats-card-label mt-1" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
