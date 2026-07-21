import React from 'react';

const BusServicesCard = React.memo(function BusServicesCard({ services = [], servicesConfig = {} }) {
  const containerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  };

  const titleStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: '12px',
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '8px 10px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #F1F5F9',
    transition: 'all 0.2s ease',
  };

  const iconBoxStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#EFF6FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3B82F6',
    fontSize: '13px',
    flexShrink: 0,
  };

  const textContainerStyle = {
    flex: 1,
    minWidth: 0,
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: '1px',
  };

  const descStyle = {
    fontSize: '10px',
    color: '#94A3B8',
    lineHeight: 1.3,
  };

  if (services.length === 0) return null;

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <i className="bi bi-gear-wide-connected" style={{ fontSize: '12px', color: '#64748B' }} />
        Services à bord
      </div>
      <div style={gridStyle}>
        {services.map((serviceId) => {
          const svc = servicesConfig[serviceId];
          if (!svc) return null;
          return (
            <div key={serviceId} style={itemStyle}>
              <div style={iconBoxStyle}>
                <i className={`bi ${svc.icon}`} />
              </div>
              <div style={textContainerStyle}>
                <div style={labelStyle}>{svc.label}</div>
                <div style={descStyle}>{svc.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default BusServicesCard;
