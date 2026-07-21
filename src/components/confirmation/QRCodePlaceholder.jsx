const QRCodePlaceholder = ({ value, size = 120 }) => (
  <div
    className="btc-qr-placeholder d-inline-flex align-items-center justify-content-center"
    style={{ width: size, height: size, borderRadius: 'var(--radius-md)', background: 'var(--color-white)', border: '2px solid var(--color-gray-200)' }}
    role="img"
    aria-label="QR Code - a implementer"
  >
    <div className="text-center">
      <div className="btc-qr-pattern mb-1" style={{ width: size * 0.6, height: size * 0.6, margin: '0 auto' }}>
        <svg viewBox="0 0 64 64" width={size * 0.6} height={size * 0.6}>
          {/* Top-left finder */}
          <rect x="2" y="2" width="18" height="18" fill="var(--color-primary)" rx="2" />
          <rect x="5" y="5" width="12" height="12" fill="var(--color-white)" rx="1" />
          <rect x="8" y="8" width="6" height="6" fill="var(--color-primary)" rx="1" />
          {/* Top-right finder */}
          <rect x="44" y="2" width="18" height="18" fill="var(--color-primary)" rx="2" />
          <rect x="47" y="5" width="12" height="12" fill="var(--color-white)" rx="1" />
          <rect x="50" y="8" width="6" height="6" fill="var(--color-primary)" rx="1" />
          {/* Bottom-left finder */}
          <rect x="2" y="44" width="18" height="18" fill="var(--color-primary)" rx="2" />
          <rect x="5" y="47" width="12" height="12" fill="var(--color-white)" rx="1" />
          <rect x="8" y="50" width="6" height="6" fill="var(--color-primary)" rx="1" />
          {/* Data dots */}
          {[24,28,32,36,40].map((x) => [24,28,32,36,40].map((y) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill={(x+y) % 6 === 0 ? 'var(--color-primary)' : 'none'} rx="0.5" />
          )))}
          {/* Center */}
          <rect x="28" y="28" width="8" height="8" fill="var(--color-primary)" rx="1" />
        </svg>
      </div>
      <div style={{ fontSize: '0.45rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>QR CODE</div>
    </div>
  </div>
);

export default QRCodePlaceholder;
