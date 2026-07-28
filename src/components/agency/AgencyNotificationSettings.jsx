import { useState } from 'react';

const CHANNEL_ICONS = {
  email: 'bi-envelope',
  sms: 'bi-chat-dots',
  push: 'bi-bell',
  whatsapp: 'bi-whatsapp',
  internal: 'bi-megaphone',
};

const CHANNEL_NAMES = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
  whatsapp: 'WhatsApp',
  internal: 'Notifications internes',
};

export default function AgencyNotificationSettings({ data, onSave }) {
  const [channels, setChannels] = useState(() => {
    const initial = {};
    Object.entries(data.channels).forEach(([id, ch]) => {
      initial[id] = { ...ch, events: [...ch.events] };
    });
    return initial;
  });

  const { events } = data;

  const toggleChannel = (id) => {
    setChannels((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled },
    }));
  };

  const toggleEvent = (channelId, eventId) => {
    setChannels((prev) => {
      const ch = prev[channelId];
      const has = ch.events.includes(eventId);
      return {
        ...prev,
        [channelId]: {
          ...ch,
          events: has ? ch.events.filter((e) => e !== eventId) : [...ch.events, eventId],
        },
      };
    });
  };

  const handleSave = () => {
    onSave({ channels });
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h2 className="aset-section__title">
            <i className="bi bi-bell" /> Notifications
          </h2>
          <p className="aset-section__subtitle">Configurez les notifications</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(channels).map(([channelId, channel]) => (
          <div
            key={channelId}
            className={`aset-notif-channel ${!channel.enabled ? 'aset-notif-channel--disabled' : ''}`}
          >
            <div className="aset-notif-channel__header">
              <div className="aset-notif-channel__info">
                <div className="aset-notif-channel__icon">
                  <i className={`bi ${CHANNEL_ICONS[channelId]}`} />
                </div>
                <div>
                  <div className="aset-notif-channel__name">{CHANNEL_NAMES[channelId]}</div>
                </div>
              </div>
              <label className="aset-toggle">
                <input
                  type="checkbox"
                  checked={channel.enabled}
                  onChange={() => toggleChannel(channelId)}
                />
                <div className="aset-toggle__track">
                  <div className="aset-toggle__thumb" />
                </div>
              </label>
            </div>
            {channel.enabled && (
              <div className="aset-notif-channel__events">
                {events.map((event) => {
                  const active = channel.events.includes(event.id);
                  return (
                    <button
                      key={event.id}
                      type="button"
                      className={`aset-notif-channel__event ${active ? 'aset-notif-channel__event--active' : ''}`}
                      onClick={() => toggleEvent(channelId, event.id)}
                    >
                      {event.label}
                    </button>
                  );
                })}
              </div>
            )}
            {channelId === 'whatsapp' && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#d97706',
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <i className="bi bi-info-circle" /> Bientôt disponible
              </div>
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
