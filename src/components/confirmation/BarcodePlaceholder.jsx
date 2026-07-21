const BarcodePlaceholder = ({ value = 'BTC-GL-00147', height = 48 }) => (
  <div className="btc-barcode-placeholder" role="img" aria-label="Code-barres - a implementer">
    <svg
      viewBox="0 0 200 50"
      width="100%"
      height={height}
      style={{ display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Generate barcode-like pattern */}
      {Array.from({ length: 50 }, (_, i) => {
        const x = i * 4;
        const w = [1, 2, 1, 3, 1, 2, 1, 1][i % 8];
        const isBar = i % 2 === 0;
        return isBar ? (
          <rect key={i} x={x} y={2} width={w} height={height - 10} fill="var(--color-gray-800)" />
        ) : null;
      })}
      {/* Value text */}
      <text x="100" y={height - 2} textAnchor="middle" fill="var(--color-gray-600)" fontSize="6" fontFamily="monospace" letterSpacing="0.1em">
        {value}
      </text>
    </svg>
  </div>
);

export default BarcodePlaceholder;
