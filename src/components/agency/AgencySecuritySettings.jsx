import { useState } from 'react';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const DEVICE_ICONS = {
  desktop: 'bi-laptop',
  mobile: 'bi-phone',
  laptop: 'bi-laptop',
};

export default function AgencySecuritySettings({ data, onSave }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(data.twoFactorEnabled);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    onSave({ twoFactorEnabled });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
  };

  const handleDisconnectAll = () => {
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h2 className="aset-section__title">
            <i className="bi bi-shield-check" /> Sécurité
          </h2>
          <p className="aset-section__subtitle">Gérez la sécurité de votre compte</p>
        </div>
      </div>

      <div className="aset-security-section">
        <div className="aset-security-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <h4 style={{ marginBottom: 16 }}>Modifier le mot de passe</h4>
          <div className="aset-form__row">
            <div className="aset-form__group">
              <label className="aset-form__label">Mot de passe actuel</label>
              <input
                type="password"
                className="aset-form__input"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="aset-form__group">
              <label className="aset-form__label">Nouveau mot de passe</label>
              <input
                type="password"
                className="aset-form__input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Confirmer le mot de passe</label>
            <input
              type="password"
              className="aset-form__input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className="aset-btn aset-btn--primary aset-btn--sm"
            style={{ alignSelf: 'flex-start', marginTop: 8 }}
            onClick={handleUpdatePassword}
          >
            Mettre à jour
          </button>
        </div>

        <div className="aset-security-card">
          <div className="aset-security-card__info">
            <h4>Double authentification</h4>
            <p>Ajoutez une couche de sécurité supplémentaire</p>
          </div>
          <label className="aset-toggle">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled((prev) => !prev)}
            />
            <div className="aset-toggle__track">
              <div className="aset-toggle__thumb" />
            </div>
          </label>
        </div>

        <div>
          <h4 style={{ marginBottom: 12 }}>Sessions actives</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.sessions.map((session) => (
              <div key={session.id} className="aset-session-item">
                <div className="aset-session-item__icon">
                  <i className="bi bi-laptop" />
                </div>
                <div className="aset-session-item__info">
                  <div className="aset-session-item__device">{session.device}</div>
                  <div className="aset-session-item__meta">
                    <span>IP: {session.ip}</span>
                    <span>Dernière activité: {formatDate(session.lastActive)}</span>
                    {session.current && (
                      <span className="aset-session-item__badge">Actuelle</span>
                    )}
                  </div>
                </div>
                {!session.current && (
                  <button className="aset-btn aset-btn--ghost aset-btn--sm">
                    <i className="bi bi-x" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: 12 }}>Historique des connexions</h4>
          <table className="aset-login-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Adresse IP</th>
                <th>Appareil</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {data.loginHistory.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.ip}</td>
                  <td>{item.device}</td>
                  <td>
                    <span style={{ color: item.success ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                      {item.success ? 'Succès' : 'Échec'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 style={{ marginBottom: 12 }}>Appareils connectés</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.devices.map((device) => (
              <div key={device.id} className="aset-session-item">
                <div className="aset-session-item__icon">
                  <i className={`bi ${DEVICE_ICONS[device.type] || 'bi-laptop'}`} />
                </div>
                <div className="aset-session-item__info">
                  <div className="aset-session-item__device">{device.name}</div>
                  <div className="aset-session-item__meta">
                    <span>{device.os}</span>
                    <span>Dernier accès: {formatDate(device.lastAccess)}</span>
                    {device.trusted && (
                      <span className="aset-session-item__badge">Appareil de confiance</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="aset-security-card" style={{ borderColor: '#fecaca' }}>
          <div className="aset-security-card__info">
            <h4 style={{ color: '#dc2626' }}>Déconnecter tous les appareils</h4>
            <p>Ceci déconnectera toutes les sessions actives sauf celle-ci</p>
          </div>
          <button
            className="aset-btn aset-btn--danger aset-btn--sm"
            onClick={handleDisconnectAll}
          >
            Se déconnecter de tous les appareils
          </button>
        </div>
      </div>

      <div className="aset-btn-group">
        <button className="aset-btn aset-btn--primary" onClick={handleSave}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}
