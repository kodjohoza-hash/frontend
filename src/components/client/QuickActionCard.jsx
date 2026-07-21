import { Link } from 'react-router-dom';
import clsx from 'clsx';

const colorMap = {
  primary: { bg: 'var(--color-primary-50)', icon: 'var(--color-primary)', hover: 'var(--color-primary-100)' },
  accent: { bg: 'var(--color-accent-50)', icon: 'var(--color-accent)', hover: 'var(--color-accent-100)' },
  success: { bg: 'var(--color-success-50)', icon: 'var(--color-success)', hover: 'var(--color-success-100)' },
  info: { bg: 'var(--color-info-50)', icon: 'var(--color-info)', hover: 'var(--color-info-100)' },
  warning: { bg: 'var(--color-warning-50)', icon: 'var(--color-warning)', hover: 'var(--color-warning-100)' },
};

const QuickActionCard = ({ label, description, icon, color = 'primary', path, className = '' }) => {
  const palette = colorMap[color] || colorMap.primary;

  return (
    <Link
      to={path}
      className={clsx('btc-quick-action-card d-flex align-items-center gap-3 p-3 text-decoration-none h-100', className)}
      style={{
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
        transition: 'all var(--duration-normal) var(--ease-default)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = palette.icon;
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        className="btc-quick-action-icon flex-shrink-0 d-flex align-items-center justify-content-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: palette.bg,
          color: palette.icon,
          fontSize: '1.15rem',
        }}
      >
        <i className={clsx('bi', icon)} />
      </div>
      <div className="min-width-0">
        <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
          {label}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          {description}
        </div>
      </div>
    </Link>
  );
};

export default QuickActionCard;
