import React from 'react';

const statusIcons = {
  pending: 'fa-clock',
  under_review: 'fa-magnifying-glass',
  more_info: 'fa-circle-exclamation',
  approved: 'fa-check',
  refused: 'fa-xmark',
  suspended: 'fa-pause',
  flagged: 'fa-flag',
};

export default function AdminApprovalWorkflow({ currentStatus, workflowSteps }) {
  if (!workflowSteps || workflowSteps.length === 0) return null;
  return (
    <div className="adma-workflow">
      {workflowSteps.map((step, i) => {
        const isDone = step.status === 'done';
        const isActive = step.status === 'active';
        const icon = step.icon || statusIcons[step.id] || 'fa-circle';
        return (
          <React.Fragment key={step.id || i}>
            {i > 0 && <div className={`adma-workflow-connector ${isDone || isActive ? 'adma-workflow-connector--done' : ''}`} />}
            <div className={`adma-workflow-step ${isActive ? 'adma-workflow-step--active' : ''} ${isDone ? 'adma-workflow-step--done' : ''}`}>
              <div className="adma-workflow-step-circle" style={{ background: step.color || '#9CA3AF' }}>
                <i className={`fa-solid ${icon}`} style={{ fontSize: '0.75rem' }} />
              </div>
              <span className="adma-workflow-step-label">{step.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
