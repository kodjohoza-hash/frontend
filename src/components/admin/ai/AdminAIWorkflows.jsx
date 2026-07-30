import React from 'react';
import { workflows, aiStatuses } from '../../../data/adminAIData';

const AdminAIWorkflows = () => {
  if (workflows.length === 0) {
    return (
      <div className="adai-empty-state">
        <i className="fa-solid fa-diagram-project"></i>
        <h3>Aucun workflow</h3>
        <p>Créez votre premier workflow pour automatiser vos processus.</p>
        <button className="adai-btn-primary" style={{ margin: '16px auto 0' }}><i className="fa-solid fa-plus"></i> Créer un workflow</button>
      </div>
    );
  }
  return (
    <div>
      <div className="adai-section-header">
        <div className="adai-section-title"><i className="fa-solid fa-diagram-project" style={{ color: '#10B981' }}></i> Workflows <span className="adai-tab-badge">{workflows.length}</span></div>
        <div className="adai-section-actions">
          <button className="adai-btn-sm success"><i className="fa-solid fa-plus"></i> Nouveau workflow</button>
          <button className="adai-btn-sm primary"><i className="fa-solid fa-file-export"></i> Exporter</button>
        </div>
      </div>
      <div className="adai-workflow-list">
        {workflows.map(wf => {
          const st = aiStatuses.find(s => s.id === wf.status);
          return (
            <div key={wf.id} className="adai-wf-item">
              <div className="adai-wf-header">
                <div>
                  <div className="adai-wf-name">
                    <i className="fa-solid fa-diagram-project" style={{ color: '#10B981', fontSize: 14 }}></i>
                    {wf.name}
                    <span className="adai-badge-sm" style={{ background: st?.bg, color: st?.color }}>
                      <i className="fa-solid fa-circle" style={{ fontSize: 7 }}></i> {st?.label || wf.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="adai-btn-sm primary"><i className="fa-regular fa-eye"></i></button>
                  <button className="adai-btn-sm ghost"><i className="fa-regular fa-pen-to-square"></i></button>
                  <button className="adai-btn-sm danger"><i className="fa-regular fa-trash-can"></i></button>
                </div>
              </div>
              <div className="adai-wf-description">{wf.description}</div>
              <div className="adai-wf-flow">
                <span className="adai-wf-node"><i className="fa-solid fa-bolt" style={{ color: '#F59E0B' }}></i> {wf.trigger}</span>
                <span className="adai-wf-arrow"><i className="fa-solid fa-arrow-right"></i></span>
                {wf.conditions.map((c, i) => (
                  <React.Fragment key={i}>
                    <span className="adai-wf-node"><i className="fa-solid fa-check" style={{ color: '#3B82F6' }}></i> {c}</span>
                    <span className="adai-wf-arrow"><i className="fa-solid fa-arrow-right"></i></span>
                  </React.Fragment>
                ))}
                {wf.actions.map((a, i) => (
                  <React.Fragment key={i}>
                    <span className="adai-wf-node"><i className="fa-solid fa-play" style={{ color: '#10B981' }}></i> {a}</span>
                    {i < wf.actions.length - 1 && <span className="adai-wf-arrow"><i className="fa-solid fa-arrow-right"></i></span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="adai-wf-meta">
                <span><i className="fa-regular fa-clock"></i> Dernière exécution: {wf.lastRun}</span>
                <span><i className="fa-solid fa-bolt"></i> {wf.runs.toLocaleString()} exécutions</span>
                <span><i className="fa-solid fa-code-branch"></i> {wf.version}</span>
                <span><i className="fa-regular fa-user"></i> {wf.creator?.split(' ')[1] || wf.creator}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminAIWorkflows;
