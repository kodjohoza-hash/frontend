const SupportCard = () => (
  <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="card-body p-4">
      <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
        <i className="bi bi-headset me-2" style={{ color: 'var(--color-accent)' }} />
        Besoin d'aide ?
      </h6>
      <div className="row g-2">
        {[
          { icon: 'bi-telephone-fill', label: 'Support', value: '+237 699 000 000', desc: 'Lun-Sam: 6h - 22h', color: 'var(--color-success)' },
          { icon: 'bi-envelope-fill', label: 'Email', value: 'support@bustixconnect.com', desc: 'Reponse sous 24h', color: 'var(--color-primary)' },
          { icon: 'bi-whatsapp', label: 'WhatsApp', value: '+237 699 000 000', desc: 'Reponse rapide', color: 'var(--color-success)' },
        ].map((item) => (
          <div key={item.label} className="col-12 col-sm-4">
            <div className="d-flex align-items-start gap-2 p-2" style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-gray-50)' }}>
              <i className={item.icon} style={{ fontSize: 'var(--font-size-base)', color: item.color, marginTop: 2 }} />
              <div>
                <div className="fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-secondary)' }}>{item.value}</div>
                <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SupportCard;
