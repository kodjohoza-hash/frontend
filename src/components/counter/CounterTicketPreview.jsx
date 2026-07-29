import AppLogo from '@components/common/AppLogo';
import { companies } from '@data/counterSaleData';

const barcodeBars = [4, 2, 3, 5, 2, 4, 3, 2, 5, 3, 2, 4, 2, 3, 4, 2, 5, 3, 2, 4];

const CounterTicketPreview = ({ ticket }) => {
  if (!ticket) return null;
  const { ref, passenger, trip, seats, date } = ticket;
  const company = companies.find((c) => trip.company.startsWith(c.name.split(' ')[0])) || companies[0];

  return (
    <div className="acs-ticket" style={{ marginTop: 20 }}>
      <div className="acs-ticket__header">
        <div className="acs-ticket__header-brand">
          <AppLogo size={28} variant="icon-only" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>BUS TIX CONNECT</div>
            <div className="acs-ticket__header-title">Billet de voyage</div>
          </div>
        </div>
        <div className="acs-ticket__header-ref">
          {ref}
          <span>Référence</span>
        </div>
      </div>

      <div className="acs-ticket__body">
        <div className="acs-ticket__passenger">
          <div className="acs-ticket__passenger-avatar">{passenger.firstName?.[0]}{passenger.lastName?.[0]}</div>
          <div className="acs-ticket__passenger-info">
            <div className="acs-ticket__passenger-name">{passenger.firstName} {passenger.lastName}</div>
            <div className="acs-ticket__passenger-id">{passenger.phone || ''} {passenger.email ? `· ${passenger.email}` : ''}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--act-text-muted)' }}>Compagnie</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--act-text)' }}>{trip.company}</div>
          </div>
        </div>

        <div className="acs-ticket__journey">
          <div className="acs-ticket__journey-point">
            <div className="acs-ticket__journey-city">{trip.from}</div>
            <div className="acs-ticket__journey-time">{trip.departure}</div>
          </div>
          <div className="acs-ticket__journey-line">
            <div className="acs-ticket__journey-duration">{trip.duration}</div>
            <div className="acs-ticket__journey-arrow" />
          </div>
          <div className="acs-ticket__journey-point">
            <div className="acs-ticket__journey-city">{trip.to}</div>
            <div className="acs-ticket__journey-time">{trip.arrival}</div>
          </div>
        </div>

        <div className="acs-ticket__details">
          <div className="acs-ticket__detail">
            <div className="acs-ticket__detail-label">Bus</div>
            <div className="acs-ticket__detail-value">{trip.bus}</div>
          </div>
          <div className="acs-ticket__detail">
            <div className="acs-ticket__detail-label">Siège{seats?.length > 1 ? 's' : ''}</div>
            <div className="acs-ticket__detail-value">{seats?.length > 0 ? seats.join(', ') : '—'}</div>
          </div>
          <div className="acs-ticket__detail">
            <div className="acs-ticket__detail-label">Date</div>
            <div className="acs-ticket__detail-value">{new Date(date).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        <div className="acs-ticket__barcode">
          <div className="acs-ticket__barcode-visual">
            {barcodeBars.map((h, i) => (
              <div key={i} className="acs-ticket__barcode-bar" style={{ height: `${h * 6}px` }} />
            ))}
          </div>
          <div className="acs-ticket__barcode-code">{ref} · {trip.from.substring(0, 3).toUpperCase()}{trip.to.substring(0, 3).toUpperCase()}</div>
        </div>
      </div>

      <div className="acs-ticket__footer">
        <i className="bi bi-shield-check" /> Ce billet est muni d'un code de vérification unique
      </div>
    </div>
  );
};

export default CounterTicketPreview;
