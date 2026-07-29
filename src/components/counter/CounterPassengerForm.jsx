import { useState } from 'react';
import clsx from 'clsx';
import { mockClients, idTypes } from '@data/counterSaleData';

const CounterPassengerForm = ({ passenger, onComplete, onBack }) => {
  const [mode, setMode] = useState(passenger.isExisting ? 'existing' : 'new');
  const [form, setForm] = useState(passenger);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(passenger.existingClient);
  const [errors, setErrors] = useState({});

  const filteredClients = searchQuery
    ? mockClients.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const validate = () => {
    const errs = {};
    if (mode === 'new') {
      if (!form.firstName.trim()) errs.firstName = 'Requis';
      if (!form.lastName.trim()) errs.lastName = 'Requis';
      if (!form.phone.trim()) errs.phone = 'Requis';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (mode === 'existing' && selectedClient) {
      onComplete({ isExisting: true, existingClient: selectedClient, ...form });
    } else if (mode === 'new' && validate()) {
      onComplete({ isExisting: false, existingClient: null, ...form });
    }
  };

  return (
    <div>
      <div className="acs-step__header">
        <h2 className="acs-step__title">Informations du passager</h2>
        <p className="acs-step__desc">Saisissez les coordonnées du voyageur</p>
      </div>

      <div className="acs-passenger">
        <div className="acs-passenger__tabs">
          <button type="button" className={clsx('acs-passenger__tab', mode === 'existing' && 'acs-passenger__tab--active')} onClick={() => setMode('existing')}>
            <i className="bi bi-search" /> Client existant
          </button>
          <button type="button" className={clsx('acs-passenger__tab', mode === 'new' && 'acs-passenger__tab--active')} onClick={() => setMode('new')}>
            <i className="bi bi-person-plus" /> Nouveau client
          </button>
        </div>

        {mode === 'existing' && (
          <div>
            <div className="acs-passenger__client-search">
              <div className="acs-field" style={{ flex: 1 }}>
                <input className="acs-field__input" placeholder="Rechercher par nom, téléphone ou email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            {filteredClients.map((client) => (
              <div key={client.id} className={clsx('acs-passenger__client-item', selectedClient?.id === client.id && 'acs-passenger__client-item--selected')} onClick={() => setSelectedClient(client)}>
                <div className="acs-passenger__client-avatar">{client.firstName[0]}{client.lastName[0]}</div>
                <div className="acs-passenger__client-info">
                  <div className="acs-passenger__client-name">{client.firstName} {client.lastName}</div>
                  <div className="acs-passenger__client-detail">{client.phone} · {client.email}</div>
                </div>
                {selectedClient?.id !== client.id && (
                  <button type="button" className="acs-passenger__client-select" onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }}>
                    Sélectionner
                  </button>
                )}
                {selectedClient?.id === client.id && (
                  <i className="bi bi-check-circle-fill" style={{ color: 'var(--act-success)', fontSize: '1.2rem' }} />
                )}
              </div>
            ))}
            {searchQuery && filteredClients.length === 0 && (
              <div className="acs-empty" style={{ padding: '20px' }}>
                <p className="acs-empty__desc">Aucun client trouvé</p>
              </div>
            )}
          </div>
        )}

        {mode === 'new' && (
          <div className="acs-passenger__form">
            <div className="acs-field">
              <label className="acs-field__label">Prénom *</label>
              <input className="acs-field__input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Prénom" />
              {errors.firstName && <small style={{ color: 'var(--act-danger)' }}>{errors.firstName}</small>}
            </div>
            <div className="acs-field">
              <label className="acs-field__label">Nom *</label>
              <input className="acs-field__input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Nom" />
              {errors.lastName && <small style={{ color: 'var(--act-danger)' }}>{errors.lastName}</small>}
            </div>
            <div className="acs-field">
              <label className="acs-field__label">Téléphone *</label>
              <input className="acs-field__input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+237 6XX XXX XXX" />
              {errors.phone && <small style={{ color: 'var(--act-danger)' }}>{errors.phone}</small>}
            </div>
            <div className="acs-field">
              <label className="acs-field__label">Email</label>
              <input className="acs-field__input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemple.com" />
            </div>
            <div className="acs-field">
              <label className="acs-field__label">Pièce d'identité</label>
              <select className="acs-field__select" value={form.idType} onChange={(e) => setForm({ ...form, idType: e.target.value })}>
                {idTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="acs-field">
              <label className="acs-field__label">Numéro pièce</label>
              <input className="acs-field__input" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} placeholder="Numéro" disabled={form.idType === 'none'} />
            </div>
            <div className="acs-field acs-field--full">
              <label className="acs-field__label">Observations</label>
              <input className="acs-field__input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes optionnelles..." />
            </div>
          </div>
        )}

        <div className="acs-step__nav">
          <button type="button" className="acs-btn acs-btn--ghost" onClick={onBack}>
            <i className="bi bi-arrow-left" /> Retour
          </button>
          <button type="button" className="acs-btn acs-btn--primary" onClick={handleSubmit}>
            Continuer <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterPassengerForm;
