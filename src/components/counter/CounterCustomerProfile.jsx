import { useState } from 'react';
import clsx from 'clsx';
import CounterCustomerTimeline from './CounterCustomerTimeline';
import CounterCustomerNotes from './CounterCustomerNotes';
import { formatCurrency, formatDate } from '@data/counterCustomerData';

const STATUS_CONFIG = {
  nouveau: { color: '#10B981', label: 'Nouveau' },
  actif: { color: '#3B82F6', label: 'Actif' },
  vip: { color: '#8B5CF6', label: 'VIP' },
  inactif: { color: '#6B7280', label: 'Inactif' },
  suspendu: { color: '#EF4444', label: 'Suspendu' },
};

const TABS = [
  { key: 'info', label: 'Informations', icon: 'bi-person-badge' },
  { key: 'reservations', label: 'Réservations', icon: 'bi-calendar-check' },
  { key: 'billets', label: 'Billets', icon: 'bi-ticket-perforated' },
  { key: 'paiements', label: 'Paiements', icon: 'bi-credit-card' },
  { key: 'historique', label: 'Historique', icon: 'bi-clock-history' },
  { key: 'notes', label: 'Notes', icon: 'bi-sticky' },
];

const CounterCustomerProfile = ({ customer, onClose, onAction, tabs: externalTabs }) => {
  const [activeTab, setActiveTab] = useState(externalTabs || 'info');

  if (!customer) {
    return (
      <div className="acc-profile-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="acc-profile-modal">
          <div className="acc-profile-empty">
            <i className="bi bi-exclamation-circle" />
            <p>Aucun client sélectionné.</p>
          </div>
        </div>
      </div>
    );
  }

  const st = STATUS_CONFIG[customer.status] || STATUS_CONFIG.actif;
  const initials = (customer.nom || '')
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const tabs = TABS;

  const renderInfoTab = () => (
    <div className="acc-profile-info-grid">
      <div className="acc-profile-info-section">
        <h4 className="acc-profile-section-title">
          <i className="bi bi-person-vcard" /> Informations personnelles
        </h4>
        <div className="acc-profile-info-fields">
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Nom complet</span>
            <span className="acc-profile-field-value">{customer.nom}</span>
          </div>
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Téléphone</span>
            <span className="acc-profile-field-value">
              <a href={`tel:${customer.telephone}`}>{customer.telephone}</a>
            </span>
          </div>
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Email</span>
            <span className="acc-profile-field-value">
              <a href={`mailto:${customer.email}`}>{customer.email}</a>
            </span>
          </div>
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Ville</span>
            <span className="acc-profile-field-value">{customer.ville}</span>
          </div>
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Date d'inscription</span>
            <span className="acc-profile-field-value">{formatDate(customer.dateInscription)}</span>
          </div>
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Code client</span>
            <span className="acc-profile-field-value acc-code">{customer.codeClient || '—'}</span>
          </div>
        </div>
      </div>

      <div className="acc-profile-info-section">
        <h4 className="acc-profile-section-title">
          <i className="bi bi-star" /> Préférences
        </h4>
        <div className="acc-profile-info-fields">
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Siège préféré</span>
            <span className="acc-profile-field-value">{customer.siegePrefere || 'Non défini'}</span>
          </div>
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Compagnie préférée</span>
            <span className="acc-profile-field-value">{customer.compagniePreferee || 'Non définie'}</span>
          </div>
          <div className="acc-profile-field">
            <span className="acc-profile-field-label">Notifications</span>
            <span className="acc-profile-field-value">
              {customer.notifications !== false ? (
                <span style={{ color: '#10B981' }}><i className="bi bi-check-circle-fill" /> Activées</span>
              ) : (
                <span style={{ color: '#9CA3AF' }}><i className="bi bi-x-circle-fill" /> Désactivées</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="acc-profile-info-section">
        <h4 className="acc-profile-section-title">
          <i className="bi bi-tags" /> Tags
        </h4>
        <div className="acc-profile-tags">
          {(customer.tags && customer.tags.length > 0) ? (
            customer.tags.map((tag, i) => (
              <span key={i} className="acc-profile-tag">{tag}</span>
            ))
          ) : (
            <span className="acc-profile-na">Aucun tag</span>
          )}
        </div>
      </div>

      <div className="acc-profile-info-section">
        <h4 className="acc-profile-section-title">
          <i className="bi bi-file-earmark-text" /> Documents
        </h4>
        <div className="acc-profile-docs">
          {(customer.documents && customer.documents.length > 0) ? (
            customer.documents.map((doc, i) => (
              <div key={i} className="acc-profile-doc">
                <i className={clsx('bi', doc.type === 'cin' ? 'bi-card-text' : 'bi-file-pdf')} />
                <span>{doc.nom}</span>
              </div>
            ))
          ) : (
            <span className="acc-profile-na">Aucun document</span>
          )}
        </div>
      </div>

      <div className="acc-profile-info-section">
        <h4 className="acc-profile-section-title">
          <i className="bi bi-sticky" /> Notes internes
        </h4>
        <div className="acc-profile-notes-preview">
          {(customer.notes && customer.notes.length > 0) ? (
            customer.notes.slice(0, 2).map((note, i) => (
              <div key={i} className="acc-profile-note-preview">
                <div className="acc-profile-note-text">{note.text}</div>
                <div className="acc-profile-note-meta">{note.author} · {formatDate(note.date)}</div>
              </div>
            ))
          ) : (
            <span className="acc-profile-na">Aucune note interne</span>
          )}
          {customer.notes && customer.notes.length > 2 && (
            <button className="acc-profile-notes-all" onClick={() => setActiveTab('notes')}>
              Voir toutes les notes ({customer.notes.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return renderInfoTab();
      case 'reservations':
        return (
          <div className="acc-profile-tab-content">
            {customer.reservations && customer.reservations.length > 0 ? (
              <table className="acc-profile-subtable">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Trajet</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.reservations.map((r) => (
                    <tr key={r.id}>
                      <td className="acc-profile-subtable-ref">{r.reference}</td>
                      <td>{r.trajet}</td>
                      <td>{formatDate(r.date)}</td>
                      <td className="acc-profile-subtable-amount">{formatCurrency(r.montant)}</td>
                      <td>
                        <span className="acc-status-badge acc-status-sm"
                          style={{ background: '#3B82F615', color: '#3B82F6', borderColor: '#3B82F630' }}
                        >
                          {r.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="acc-profile-empty-tab">
                <i className="bi bi-calendar-x" />
                <span>Aucune réservation</span>
              </div>
            )}
          </div>
        );
      case 'billets':
        return (
          <div className="acc-profile-tab-content">
            {customer.billets && customer.billets.length > 0 ? (
              <table className="acc-profile-subtable">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Trajet</th>
                    <th>Siège</th>
                    <th>Date</th>
                    <th>Prix</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.billets.map((b) => (
                    <tr key={b.id}>
                      <td className="acc-profile-subtable-ref">{b.reference}</td>
                      <td>{b.trajet}</td>
                      <td>{b.siege}</td>
                      <td>{formatDate(b.date)}</td>
                      <td className="acc-profile-subtable-amount">{formatCurrency(b.prix)}</td>
                      <td>
                        <span className="acc-status-badge acc-status-sm"
                          style={{ background: '#8B5CF615', color: '#8B5CF6', borderColor: '#8B5CF630' }}
                        >
                          {b.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="acc-profile-empty-tab">
                <i className="bi bi-ticket" />
                <span>Aucun billet</span>
              </div>
            )}
          </div>
        );
      case 'paiements':
        return (
          <div className="acc-profile-tab-content">
            {customer.paiements && customer.paiements.length > 0 ? (
              <table className="acc-profile-subtable">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Montant</th>
                    <th>Mode</th>
                    <th>Date</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.paiements.map((p) => (
                    <tr key={p.id}>
                      <td className="acc-profile-subtable-ref">{p.reference}</td>
                      <td className="acc-profile-subtable-amount">{formatCurrency(p.montant)}</td>
                      <td>{p.mode}</td>
                      <td>{formatDate(p.date)}</td>
                      <td>
                        <span className="acc-status-badge acc-status-sm"
                          style={{
                            background: p.statut === 'payé' ? '#10B98115' : '#F59E0B15',
                            color: p.statut === 'payé' ? '#10B981' : '#F59E0B',
                            borderColor: p.statut === 'payé' ? '#10B98130' : '#F59E0B30',
                          }}
                        >
                          {p.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="acc-profile-empty-tab">
                <i className="bi bi-credit-card" />
                <span>Aucun paiement</span>
              </div>
            )}
          </div>
        );
      case 'historique':
        return (
          <div className="acc-profile-tab-content">
            <CounterCustomerTimeline events={customer.evenements || customer.historique || []} />
          </div>
        );
      case 'notes':
        return (
          <div className="acc-profile-tab-content">
            <CounterCustomerNotes customer={customer} onAddNote={onAction} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="acc-profile-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="acc-profile-modal">
        <div className="acc-profile-header">
          <button className="acc-profile-close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="acc-profile-hero">
          <div className="acc-profile-photo">
            {customer.photo ? (
              <img src={customer.photo} alt={customer.nom} />
            ) : (
              <span>{initials}</span>
            )}
            <span className="acc-profile-online" style={{ background: customer.online ? '#10B981' : '#9CA3AF' }} />
          </div>
          <div className="acc-profile-hero-info">
            <h2 className="acc-profile-name">{customer.nom}</h2>
            <span
              className="acc-status-badge"
              style={{ background: `${st.color}15`, color: st.color, borderColor: `${st.color}30` }}
            >
              {st.label}
            </span>
            <div className="acc-profile-contact">
              <span><i className="bi bi-telephone" /> {customer.telephone}</span>
              <span><i className="bi bi-envelope" /> {customer.email}</span>
              <span><i className="bi bi-geo-alt" /> {customer.ville}</span>
            </div>
          </div>
          <div className="acc-profile-actions">
            <button className="acc-btn acc-btn-primary" onClick={() => onAction?.('edit', customer)}>
              <i className="bi bi-pencil" /> Modifier
            </button>
            <button className="acc-btn acc-btn-accent" onClick={() => onAction?.('reservation', customer)}>
              <i className="bi bi-plus-circle" /> Nouvelle réservation
            </button>
            <button className="acc-btn acc-btn-accent" onClick={() => onAction?.('sale', customer)}>
              <i className="bi bi-cart-plus" /> Nouvelle vente
            </button>
          </div>
        </div>

        <div className="acc-profile-stats-row">
          <div className="acc-profile-stat">
            <i className="bi bi-bus-front" />
            <div className="acc-profile-stat-value">{customer.totalVoyages || 0}</div>
            <div className="acc-profile-stat-label">Voyages</div>
          </div>
          <div className="acc-profile-stat">
            <i className="bi bi-calendar-check" />
            <div className="acc-profile-stat-value">{customer.totalReservations || 0}</div>
            <div className="acc-profile-stat-label">Réservations</div>
          </div>
          <div className="acc-profile-stat">
            <i className="bi bi-ticket-perforated" />
            <div className="acc-profile-stat-value">{customer.totalBillets || 0}</div>
            <div className="acc-profile-stat-label">Billets</div>
          </div>
          <div className="acc-profile-stat">
            <i className="bi bi-cash-stack" />
            <div className="acc-profile-stat-value">{formatCurrency(customer.totalDepense || 0)}</div>
            <div className="acc-profile-stat-label">Dépensé</div>
          </div>
        </div>

        <div className="acc-profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={clsx('acc-profile-tab', { active: activeTab === tab.key })}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={clsx('bi', tab.icon)} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="acc-profile-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CounterCustomerProfile;
