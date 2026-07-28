import { useState } from 'react';

export default function AgencyIntegrationSettings({ data, onSave }) {
  const [integrations, setIntegrations] = useState(() =>
    data.map((int) => ({ ...int }))
  );

  const toggleConnection = (id) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    );
  };

  const handleSave = () => {
    onSave(integrations);
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h2 className="aset-section__title">
            <i className="bi bi-plug" /> API & Intégrations
          </h2>
          <p className="aset-section__subtitle">Connectez vos services externes</p>
        </div>
      </div>

      <div
        className="aset-integrations-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {integrations.map((int) => (
          <div key={int.id} className="aset-integration">
            <div className="aset-integration__icon">
              <i className={`bi ${int.icon}`} />
            </div>
            <div className="aset-integration__info">
              <div className="aset-integration__name">{int.name}</div>
              <div className="aset-integration__desc">{int.description}</div>
            </div>
            <div>
              {int.comingSoon ? (
                <span className="aset-integration__status aset-integration__status--coming">
                  <i className="bi bi-clock" /> Bientôt
                </span>
              ) : int.connected ? (
                <span className="aset-integration__status aset-integration__status--connected">
                  <i className="bi bi-check-circle" /> Connecté
                </span>
              ) : (
                <span className="aset-integration__status aset-integration__status--disconnected">
                  <i className="bi bi-plug" /> Déconnecté
                </span>
              )}
            </div>
            {!int.comingSoon && (
              <button
                className="aset-btn aset-btn--outline aset-btn--sm"
                onClick={() => toggleConnection(int.id)}
              >
                {int.connected ? 'Déconnecter' : 'Connecter'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="aset-btn-group">
        <button className="aset-btn aset-btn--primary" onClick={handleSave}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}
