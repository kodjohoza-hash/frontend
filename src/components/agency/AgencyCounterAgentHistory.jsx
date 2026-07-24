import React from 'react';

const typeConfig = {
  connexion: { icon: 'bi-box-arrow-in-right', color: '#3b82f6', label: 'Connexion' },
  deconnexion: { icon: 'bi-box-arrow-left', color: '#6b7280', label: 'Déconnexion' },
  vente: { icon: 'bi-ticket-perforated', color: '#10b981', label: 'Vente' },
  reservation: { icon: 'bi-bookmark-plus', color: '#8b5cf6', label: 'Réservation' },
  paiement: { icon: 'bi-cash-stack', color: '#FF6B35', label: 'Paiement' },
  annulation: { icon: 'bi-x-circle', color: '#ef4444', label: 'Annulation' },
};

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AgencyCounterAgentHistory({ history = [] }) {
  if (!history.length) return (
    <div className="add-history">
      <h4><i className="bi bi-clock-history" /> Historique des actions</h4>
      <p className="add-history__empty">Aucune action enregistrée.</p>
    </div>
  );

  return (
    <div className="add-history">
      <h4><i className="bi bi-clock-history" /> Historique des actions</h4>
      <div className="add-history__timeline">
        {history.map((item, i) => {
          const cfg = typeConfig[item.type] || typeConfig.connexion;
          return (
            <div key={i} className="add-history__item">
              <div className="add-history__marker" style={{ background: cfg.color }} />
              <div className="add-history__content">
                <div className="add-history__header">
                  <span className="add-history__badge" style={{ background: cfg.color + '20', color: cfg.color }}>
                    <i className={`bi ${cfg.icon}`} /> {cfg.label}
                  </span>
                  <span className="add-history__time">{formatTime(item.date)} · {formatDate(item.date)}</span>
                </div>
                <p className="add-history__detail">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
