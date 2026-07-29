import clsx from 'clsx';

const ALERT_TYPES = {
  used: { title: 'Billet déjà utilisé', icon: 'bi-clock-history', type: 'warning' },
  expired: { title: 'Billet expiré', icon: 'bi-hourglass-split', type: 'error' },
  cancelled: { title: 'Billet annulé', icon: 'bi-x-circle-fill', type: 'error' },
  refunded: { title: 'Billet remboursé', icon: 'bi-arrow-return-left', type: 'info' },
  unpaid: { title: 'Paiement non effectué', icon: 'bi-credit-card', type: 'warning' },
  unknown: { title: 'QR Code invalide', icon: 'bi-question-circle', type: 'error' },
  fraud: { title: 'Tentative de fraude', icon: 'bi-shield-exclamation', type: 'error' },
};

const CounterScannerAlerts = ({ alerts = [], onDismiss }) => {
  if (alerts.length === 0) return null;

  return (
    <div>
      {alerts.map((alert, i) => {
        const config = ALERT_TYPES[alert.type] || ALERT_TYPES.unknown;
        return (
          <div key={i} className={clsx('acv-alert', `acv-alert-${config.type}`)}>
            <div className="acv-alert-icon">
              <i className={clsx('bi', config.icon)} />
            </div>
            <div className="acv-alert-content">
              <div className="acv-alert-title">{config.title}</div>
              <div className="acv-alert-text">{alert.message}</div>
            </div>
            {onDismiss && (
              <button className="acv-alert-close" onClick={() => onDismiss(i)}>
                <i className="bi bi-x" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CounterScannerAlerts;
