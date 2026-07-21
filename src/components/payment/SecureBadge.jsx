const SecureBadge = () => {
  const badges = [
    { icon: 'bi-shield-lock-fill', label: 'Paiement securise' },
    { icon: 'bi-lock-fill', label: 'SSL 256-bit' },
    { icon: 'bi-shield-check', label: 'Transactions chiffrees' },
    { icon: 'bi-eye-slash-fill', label: 'Donnees protegees' },
  ];

  return (
    <div className="btc-secure-badges d-flex flex-wrap gap-3 justify-content-center py-3" role="region" label="Badges de securite">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="d-flex align-items-center gap-1"
          style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}
        >
          <i className={badge.icon} style={{ color: 'var(--color-success)', fontSize: '0.7rem' }} />
          {badge.label}
        </div>
      ))}
    </div>
  );
};

export default SecureBadge;
