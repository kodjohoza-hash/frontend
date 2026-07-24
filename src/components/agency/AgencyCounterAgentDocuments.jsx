import React from 'react';

const docList = [
  { key: 'permis', label: 'Permis de conduire', icon: 'bi-credit-card', required: true },
  { key: 'cni', label: 'Carte nationale d\'identité', icon: 'bi-person-badge', required: true },
  { key: 'contrat', label: 'Contrat de travail', icon: 'bi-file-earmark-text', required: true },
  { key: 'visite_medicale', label: 'Visite médicale', icon: 'bi-heart-pulse', required: false },
  { key: 'certificat_form', label: 'Certificat de formation', icon: 'bi-mortarboard', required: false },
  { key: 'photo_identite', label: 'Photo d\'identité', icon: 'bi-camera', required: false },
];

export default function AgencyCounterAgentDocuments() {
  return (
    <div className="add-docs">
      <h4><i className="bi bi-folder2-open" /> Documents</h4>
      <div className="add-docs__grid">
        {docList.map((doc) => (
          <div key={doc.key} className="add-docs__item">
            <div className="add-docs__icon"><i className={`bi ${doc.icon}`} /></div>
            <div className="add-docs__info">
              <span className="add-docs__label">{doc.label}</span>
              {doc.required && <span className="add-docs__required">Requis</span>}
            </div>
            <button className="add-docs__upload">
              <i className="bi bi-upload" /> Télécharger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
