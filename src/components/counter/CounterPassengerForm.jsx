import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import counterClientService, { PIECES } from '@services/counter.client.service';

const MIN_QUERY = 2;

const CounterPassengerForm = ({ passenger, onComplete, onBack }) => {
  const [mode, setMode] = useState(passenger.isExisting ? 'existing' : 'new');
  const [form, setForm] = useState(passenger);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedClient, setSelectedClient] = useState(passenger.existingClient || null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);
  const searchSeq = useRef(0);

  const runSearch = useCallback(async (q) => {
    const seq = ++searchSeq.current;
    setSearching(true);
    setFormError('');
    try {
      const data = await counterClientService.searchClients({ recherche: q, limite: 20 });
      if (seq === searchSeq.current) setResults(data.items || []);
    } catch (err) {
      if (seq === searchSeq.current) {
        setResults([]);
        setFormError(err.message || 'Recherche impossible.');
      }
    } finally {
      if (seq === searchSeq.current) setSearching(false);
    }
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < MIN_QUERY) {
      return undefined;
    }
    const timer = setTimeout(() => runSearch(q), 350);
    return () => clearTimeout(timer);
  }, [searchQuery, runSearch]);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Requis';
    if (!form.lastName.trim()) errs.lastName = 'Requis';
    if (!form.phone.trim()) errs.phone = 'Requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateNew = async () => {
    if (!validate() || creating) return;
    setCreating(true);
    setFormError('');
    try {
      const client = await counterClientService.createClient({
        prenom: form.firstName.trim(),
        nom: form.lastName.trim(),
        telephone: form.phone.trim(),
        email: form.email?.trim() || null,
        adresse: form.adresse?.trim() || null,
        typePiece: form.typePiece || 'aucune',
        numeroPiece: form.typePiece && form.typePiece !== 'aucune' ? (form.numeroPiece?.trim() || null) : null,
      });
      onComplete({ isExisting: false, clientId: client.id, existingClient: client, ...form });
    } catch (err) {
      setFormError(err.message || 'La création du client a échoué.');
    } finally {
      setCreating(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'existing') {
      if (!selectedClient) return;
      onComplete({ isExisting: true, clientId: selectedClient.id, existingClient: selectedClient, ...form });
      return;
    }
    handleCreateNew();
  };

  const canContinue = mode === 'existing' ? !!selectedClient : !creating;
  const minMet = searchQuery.trim().length >= MIN_QUERY;

  return (
    <div>
      <div className="acs-step__header">
        <h2 className="acs-step__title">Informations du passager</h2>
        <p className="acs-step__desc">Recherchez un client existant ou créez un dossier au guichet</p>
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

        {formError && (
          <div className="acs-passenger__error" style={{ color: 'var(--act-danger)', fontSize: '0.85rem', marginBottom: 12 }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: 6 }} />
            {formError}
          </div>
        )}

        {mode === 'existing' && (
          <div>
            <div className="acs-passenger__client-search">
              <div className="acs-field" style={{ flex: 1 }}>
                <input
                  className="acs-field__input"
                  placeholder="Rechercher par nom, téléphone ou email (2 caractères min.)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {searching && (
              <div className="acs-empty" style={{ padding: '20px' }}>
                <i className="bi bi-arrow-repeat" style={{ fontSize: 20, animation: 'btcSpin 1s linear infinite', color: 'var(--act-text-muted)' }} />
                <p className="acs-empty__desc">Recherche en cours…</p>
              </div>
            )}

            {!searching && minMet && results.length === 0 && !formError && (
              <div className="acs-empty" style={{ padding: '20px' }}>
                <p className="acs-empty__desc">Aucun client trouvé — basculez sur « Nouveau client » pour le créer.</p>
              </div>
            )}

            {minMet && results.map((client) => (
              <div key={client.id} className={clsx('acs-passenger__client-item', selectedClient?.id === client.id && 'acs-passenger__client-item--selected')} onClick={() => setSelectedClient(client)}>
                <div className="acs-passenger__client-avatar">{client.firstName[0]}{client.lastName[0]}</div>
                <div className="acs-passenger__client-info">
                  <div className="acs-passenger__client-name">{client.firstName} {client.lastName}</div>
                  <div className="acs-passenger__client-detail">{client.phone} · {client.email || '—'}</div>
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
              <select className="acs-field__select" value={form.typePiece} onChange={(e) => setForm({ ...form, typePiece: e.target.value })}>
                {PIECES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="acs-field">
              <label className="acs-field__label">Numéro pièce</label>
              <input className="acs-field__input" value={form.numeroPiece} onChange={(e) => setForm({ ...form, numeroPiece: e.target.value })} placeholder="Numéro" disabled={!form.typePiece || form.typePiece === 'aucune'} />
            </div>
            <div className="acs-field acs-field--full">
              <label className="acs-field__label">Adresse</label>
              <input className="acs-field__input" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Adresse (optionnel)" />
            </div>
          </div>
        )}

        <div className="acs-step__nav">
          <button type="button" className="acs-btn acs-btn--ghost" onClick={onBack}>
            <i className="bi bi-arrow-left" /> Retour
          </button>
          <button type="button" className="acs-btn acs-btn--primary" disabled={!canContinue || creating} onClick={handleSubmit}>
            {creating ? (
              <>
                <i className="bi bi-arrow-repeat" style={{ animation: 'btcSpin 1s linear infinite' }} /> Création du client…
              </>
            ) : (
              <>
                Continuer <i className="bi bi-arrow-right" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterPassengerForm;
