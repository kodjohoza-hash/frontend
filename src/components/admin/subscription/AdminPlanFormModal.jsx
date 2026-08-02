import React, { useState } from 'react';
import { featureCategories } from '../../../data/adminSubscriptionData';

/**
 * Formulaire de création / édition d'un plan SaaS.
 * Sauvegarde via le store subscriptions (API réelle si token, sinon local).
 */
export default function AdminPlanFormModal({ isOpen, onClose, initial, onSave, saving }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name || '',
    code: initial?.code || '',
    description: initial?.description || '',
    price: initial?.price ?? '',
    annualPrice: initial?.annualPrice ?? '',
    duree_jours: initial?.duree_jours || 30,
    maxBuses: initial?.maxBuses ?? '',
    maxAgents: initial?.maxAgents ?? '',
    maxBranches: initial?.maxBranches ?? '',
    maxTrips: initial?.maxTrips ?? '',
    status: initial?.status || 'active',
    ordre: initial?.sortOrder ?? 0,
    features: initial?.features || [],
  }));

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleFeature = (fid) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(fid) ? f.features.filter((x) => x !== fid) : [...f.features, fid],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: Number(form.price) || 0,
      annualPrice: form.annualPrice === '' ? null : Number(form.annualPrice),
      duree_jours: Number(form.duree_jours) || 30,
      maxBuses: form.maxBuses === '' ? null : Number(form.maxBuses),
      maxAgents: form.maxAgents === '' ? null : Number(form.maxAgents),
      maxBranches: form.maxBranches === '' ? null : Number(form.maxBranches),
      maxTrips: form.maxTrips === '' ? null : Number(form.maxTrips),
      ordre: Number(form.ordre) || 0,
    });
  };

  const label = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: 4 };
  const input = {
    width: '100%', padding: '0.55rem 0.7rem', borderRadius: 8, border: '1px solid #E2E8F0',
    fontSize: '0.85rem', color: '#0F172A', background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
  };
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' };

  return (
    <div className="adms-modal-overlay" onClick={onClose}>
      <div className="adms-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <h3>{initial ? `Modifier « ${initial.name} »` : 'Nouveau plan'}</h3>
        <p style={{ marginBottom: '1.25rem' }}>Les changements sont enregistrés sur l'API réelle si vous êtes connecté.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
          <div style={grid}>
            <div><label style={label}>Nom du plan *</label><input style={input} value={form.name} onChange={set('name')} required /></div>
            <div><label style={label}>Code (ex. STANDARD) *</label><input style={input} value={form.code} onChange={set('code')} required maxLength={20} /></div>
          </div>
          <div><label style={label}>Description</label><textarea style={{ ...input, resize: 'vertical', minHeight: 52 }} value={form.description} onChange={set('description')} /></div>
          <div style={grid}>
            <div><label style={label}>Prix mensuel (FCFA)</label><input style={input} type="number" min={0} value={form.price} onChange={set('price')} /></div>
            <div><label style={label}>Prix annuel (FCFA, optionnel)</label><input style={input} type="number" min={0} value={form.annualPrice} onChange={set('annualPrice')} /></div>
            <div>
              <label style={label}>Durée du cycle (jours)</label>
              <select style={input} value={form.duree_jours} onChange={set('duree_jours')}>
                <option value={30}>30 (mensuel)</option>
                <option value={90}>90 (trimestriel)</option>
                <option value={180}>180 (semestriel)</option>
                <option value={365}>365 (annuel)</option>
              </select>
            </div>
            <div>
              <label style={label}>Statut</label>
              <select style={input} value={form.status} onChange={set('status')}>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div><label style={label}>Max bus</label><input style={input} type="number" min={0} value={form.maxBuses} onChange={set('maxBuses')} /></div>
            <div><label style={label}>Max agences</label><input style={input} type="number" min={0} value={form.maxBranches} onChange={set('maxBranches')} /></div>
            <div><label style={label}>Max agents</label><input style={input} type="number" min={0} value={form.maxAgents} onChange={set('maxAgents')} /></div>
            <div><label style={label}>Ordre d'affichage</label><input style={input} type="number" min={0} value={form.ordre} onChange={set('ordre')} /></div>
          </div>
          <div>
            <label style={label}>Fonctionnalités incluses</label>
            <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: 8, padding: '0.6rem', background: '#F8FAFC' }}>
              {featureCategories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 3 }}>{cat.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {cat.features.map((f) => (
                      <label key={f.id} style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4, background: form.features.includes(f.id) ? 'rgba(139,92,246,0.1)' : '#fff', border: '1px solid #E2E8F0', borderRadius: 6, padding: '0.2rem 0.45rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.features.includes(f.id)} onChange={() => toggleFeature(f.id)} />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="adms-modal-actions">
            <button type="button" className="adms-btn--cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="adms-btn--primary" disabled={saving}>
              {saving ? 'Enregistrement…' : initial ? 'Enregistrer' : 'Créer le plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
